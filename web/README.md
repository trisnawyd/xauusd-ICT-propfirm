# XAU/USD ICT Desk — Web

Static site that renders the trading vault (`../Context`, `../Analysis`, `../Trade Log`)
as a browsable dashboard. Built with Next.js (App Router) + Tailwind v4 + shadcn/ui.
All markdown is read at **build time** (SSG) — there are no runtime file reads.

## Pages
- `/` — Context dashboard: HTF bias speedometer, redacted account, current structure
- `/htf`, `/htf/[date]` — HTF bias snapshots
- `/ltf`, `/ltf/[date]/[slug]` — LTF trade plans (entry/SL/TP/grade cards)
- `/news`, `/news/[...slug]` — economic event analyses
- `/trade-log`, `/trade-log/[date]` — per-day trade logs

## Develop
```bash
pnpm install
pnpm dev      # http://localhost:3000  (reads ../ vault)
pnpm build    # static export of all pages
```

## Live watch chart feed
The LTF watch board (`components/watch-board.tsx`) shows live price vs. a plan's
levels. Feed priority is resolved per poll:

1. **MT5 dev bridge** — real broker candles + tick, already on the broker price
   scale (no spot→broker offset). **Local dev only.**
2. **Twelve Data** — spot candles (`NEXT_PUBLIC_TWELVEDATA_KEY`), the prod feed.
3. **gold-api** — keyless spot marker, final fallback.

To use MT5 candles in dev (requires the MT5 terminal + MT5Bridge EA running):
```bash
cd ../mt5-mcp-server && npm run bridge   # serves http://localhost:5556
# then in web/.env.local, set:
#   NEXT_PUBLIC_MT5_BRIDGE_URL=http://localhost:5556
```
If the bridge is down, the chart degrades to Twelve Data, then gold-api. Leave
`NEXT_PUBLIC_MT5_BRIDGE_URL` **unset** for production (Vercel has no broker).

## Redaction
`lib/redact.ts` masks account financials (balance/equity/margin ≥ $1,000) and MT5
ticket numbers before rendering, while keeping prices, pips, R:R, and grades.
**This protects only the rendered site** — raw markdown remains in git history on a
public repo. For full privacy, use a private repo + Vercel password protection.

## Deploy to Vercel
The app reads markdown from the parent repo, so Vercel must include those files:

1. Import the GitHub repo into Vercel.
2. **Settings → General → Root Directory** = `web`.
3. Enable **"Include files outside of the Root Directory in the Build Step"**.
4. Framework preset: Next.js (auto). Build: `pnpm build`. Install: `pnpm install`.

Vercel's Git integration rebuilds automatically on every push to the connected
branch — that is the entire "auto-update" mechanism. No GitHub Actions needed.

## Adding a new analysis
Save the markdown in the vault as usual, commit, and `git push`. Vercel rebuilds and
the new page appears. Frontmatter parsing is defensive (`lib/content.ts → safeMatter`)
so inconsistent/older file schemas still render.
