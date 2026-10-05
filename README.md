# link-shortener-demo

A deliberately tiny app, built as live evidence that Gas Town can dispatch
**independent agents in parallel** rather than one at a time.

Three features, three Gas Town polecats, dispatched simultaneously, each
owning its own route with zero shared files:

| route | owner | feature |
| --- | --- | --- |
| `/` + `/api/shorten` + `/s/[code]` | agent 1 | the shortener itself (stateless, reversible encoding — no database) |
| `/stats` | agent 2 | URL stats page |
| `/qr` | agent 3 | QR code page |

The scaffold (this file, `app/layout.tsx`, tooling config) was written once,
up front, by the orchestrator — specifically so the three agents never had to
coordinate a shared file. Everything else below is their work, visible as
three separate pull requests with overlapping timestamps.
