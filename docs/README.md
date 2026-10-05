# docs/

Spec-driven delivery, adapted from Kiro and OpenSpec's pattern, scaled down
for a repo this size. Two folders, two jobs:

- **`specs/`** — current truth. One file per capability (`shortener.md`,
  `stats.md`, `qr.md`). What the system actually does, right now. Updated
  when a change merges, never drafted from scratch mid-change.
- **`changes/<slug>/`** — proposed or in-flight work. Each change gets its
  own folder with up to three files:
  - `proposal.md` — **intent**: why this change, what it does, what it
    explicitly does not do. Written *before* code, from the GitHub Issue.
  - `design.md` — **how**, only when the change is non-trivial enough to
    need it (a new route, a new dependency, a schema change). Skip it for
    small fixes.
  - `tasks.md` — a checklist an agent (or a human) works through and ticks
    off. Scoped tight enough that one agent can own it in isolation, the
    same way the original three features were split.

## The flow

1. Something needs to change → a GitHub Issue (see the repo README).
2. An agent drafts `docs/changes/<slug>/proposal.md` from that issue —
   this is the "document the intent" step, done *before* any code is
   written, so the build agent has a spec to work from instead of
   re-deriving intent from a one-line issue title.
3. Build happens (same guardrails as always: isolated worktree, owned
   files only, gates before commit, PR, human/orchestrator merges).
4. On merge: the change's intent gets folded into the relevant
   `specs/*.md` file as the new current truth, and the change folder
   moves to `docs/changes/archive/<slug>/` — kept for history, no longer
   "in flight."

## Why this shape

`specs/` answers "what does this do, today" — the question a new
contributor (or agent) asks before touching anything. `changes/` answers
"what's being proposed and why" — the question that should be answered
*before* code exists, not reconstructed from a diff afterward. Keeping
them separate means `specs/` never accumulates stale "why we did this"
narrative, and `changes/` never has to pretend to be current once it's
merged — it gets archived instead.
