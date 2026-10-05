# link-shortener-demo

Live: **https://link-shortener-demo.vercel.app**

A deliberately tiny app, used as evidence for a specific question: can 3
Claude agents build independent features **in parallel**, with zero file
conflicts, and ship something real? Yes — this is the result.

## Use cases

| route | what it does | who owns it |
| --- | --- | --- |
| `/` | Paste a URL, get a short link back | core |
| `/api/shorten` (POST) | `{ url }` → `{ code, shortUrl }`. Stateless: the code is a reversible base64url encoding of the URL itself — **no database** | core |
| `/s/[code]` (GET) | Decodes the code, 302-redirects to the original URL | core |
| `/stats?url=...` | Domain, protocol, original vs. encoded length, one clearly-labeled demo stat | stats |
| `/qr?url=...` | Renders a QR code (PNG data URL) for a URL, with a download link | qr |

## Architecture

Three features, three independent Claude agents, dispatched in parallel —
**not** through Gas Town (its dispatch layer hit a real infra bug partway
through this project — a brand-new rig's database refused to open even for
inspection). Routed around it with plain git worktrees instead:

- One orchestrator pass wrote the shared scaffold **once**, up front —
  `app/layout.tsx`, `package.json`, deps, nav — specifically so the three
  agents never had to touch a shared file or coordinate with each other.
- Each agent got its own git worktree, its own branch, and an explicit file
  list it was told not to cross.
- Each had to pass `tsc --noEmit`, lint, and `next build` before committing.
- Each opened its own PR. The orchestrator reviewed and merged all three —
  no agent merged its own work.

Full write-up, including the guardrails and the timestamp evidence that they
really ran in parallel: see the PR descriptions on
[#1](https://github.com/Dunstonhary/link-shortener-demo/pull/1),
[#2](https://github.com/Dunstonhary/link-shortener-demo/pull/2),
[#3](https://github.com/Dunstonhary/link-shortener-demo/pull/3) (merged,
read-only now, but each still holds its original spec and build notes).

## Proposing a change

**Open a GitHub Issue first**, then a PR against it. That's the whole
process — no separate tracker, no wiki, nothing to set up.

```bash
gh issue create --repo Dunstonhary/link-shortener-demo \
  --title "short description" \
  --body "what should change, and why"
```

If the change is scoped to one route (`/`, `/stats`, or `/qr`), say so in the
issue — that's what lets it be handed to one agent in isolation the same way
the original three features were, instead of needing a human to touch
multiple files by hand.

## Local dev

```bash
npm install
npm run dev
```

Node's bundled `tsc`/`eslint`/`next build` are the only gates; there is no CI
workflow configured yet.
