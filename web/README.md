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
