// Dev-only HTTP bridge: exposes MT5 broker candles + tick to the browser.
//
// The web watch chart is a static export and can only fetch() HTTP, but MT5
// data only reaches us over ZeroMQ (tcp://127.0.0.1:5555 — the same endpoint
// the MCP server uses). This tiny process bridges the two: it opens its OWN ZMQ
// Request socket (ZMQ REP fair-queues across peers, so it coexists with the MCP
// server's socket) and serves two CORS-enabled GET routes — for LOCAL DEV ONLY.
//
//   GET /ohlcv?tf=M5&count=120  -> { symbol, timeframe, candles: Candle[] }
//   GET /tick                   -> { symbol, bid, ask, spread }
//   GET /health                 -> { ok, endpoint }
//
// NEVER expose this publicly: no auth, CORS is wide open, and it can read the
// live broker connection. Bind to loopback only.

import { createServer, type ServerResponse } from "node:http";
import * as zmq from "zeromq";

const PORT = Number(process.env.MT5_BRIDGE_PORT ?? 5556);
const ZMQ_ENDPOINT = process.env.MT5_ZMQ_ENDPOINT ?? "tcp://127.0.0.1:5555";

const sock = new zmq.Request();
sock.connect(ZMQ_ENDPOINT);

// ZMQ Request is strict lockstep (one send -> one receive). Serialize EA calls
// so overlapping HTTP requests can't interleave on the single socket.
let chain: Promise<unknown> = Promise.resolve();
function callEA(name: string, args: Record<string, unknown> = {}): Promise<any> {
  const run = async () => {
    await sock.send(JSON.stringify({ name, arguments: args }));
    const [res] = await sock.receive();
    return JSON.parse(res.toString());
  };
  const result = chain.then(run, run);
  chain = result.catch(() => {}); // keep the chain alive even if a call rejects
  return result;
}

interface RawCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// MT5 candle times look like "2026.06.22 14:30:00" (broker server time). Treat
// as UTC to match the desk's UTC convention; convert to epoch seconds.
function toEpochSec(mt5Time: string): number {
  const [date, time = "00:00:00"] = mt5Time.split(" ");
  return Math.floor(Date.parse(`${date.replace(/\./g, "-")}T${time}Z`) / 1000);
}

const TF = new Set(["M1", "M5", "M15", "H1", "H4", "D1", "W1"]);

function json(res: ServerResponse, code: number, body: unknown): void {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (url.pathname === "/ohlcv") {
      const tf = (url.searchParams.get("tf") ?? "M5").toUpperCase();
      const count = Math.min(Number(url.searchParams.get("count") ?? 120) || 120, 500);
      if (!TF.has(tf)) return json(res, 400, { error: `bad tf: ${tf}` });
      const d = await callEA("get_ohlcv", { symbol: "XAUUSD", timeframe: tf, count });
      const raw = (d?.candles ?? []) as RawCandle[];
      const candles = raw
        .map((c) => ({
          time: toEpochSec(c.time),
          open: +c.open,
          high: +c.high,
          low: +c.low,
          close: +c.close,
        }))
        .filter((c) => Number.isFinite(c.time) && Number.isFinite(c.close))
        .sort((a, b) => a.time - b.time);
      return json(res, 200, { symbol: d?.symbol ?? "XAUUSD", timeframe: tf, candles });
    }

    if (url.pathname === "/tick") {
      const d = await callEA("get_current_tick", {});
      return json(res, 200, {
        symbol: d?.symbol ?? "XAUUSD",
        bid: +d?.bid,
        ask: +d?.ask,
        spread: +d?.spread,
      });
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      return json(res, 200, { ok: true, endpoint: ZMQ_ENDPOINT });
    }

    return json(res, 404, { error: "not found" });
  } catch (e) {
    return json(res, 502, { error: e instanceof Error ? e.message : "bridge error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.error(`MT5 dev bridge listening: http://127.0.0.1:${PORT} -> ${ZMQ_ENDPOINT}`);
});
