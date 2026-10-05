# add-ci — proposal

**Issue:** #4
**Status:** draft

## Intent

Add a single GitHub Actions workflow that automatically typechecks, lints,
and builds the app on every push to `main` and on every pull request —
replacing the current situation where these checks only ever happen
because an agent or human ran them locally before opening a PR.

## Why

All three shipped features (PRs #1-#3) were verified locally (`tsc
--noEmit`, `eslint .`, `next build`) by the agent that built them, but
nothing re-checks a PR automatically before merge. There's no backstop if
a future change is verified incompletely, verified against a stale
checkout, or not verified at all. Issue #4 asks for that backstop.

## Scope

- One new file: `.github/workflows/ci.yml`.
- Triggers: `push` to `main`, and `pull_request` (any branch targeting
  `main`).
- Steps: install dependencies, then run, in order:
  1. `npx tsc --noEmit`
  2. `npx eslint .`
  3. `npx next build`
- A single job is sufficient; the three checks are fast and this repo has
  no matrix/multi-version needs.

### Known environment wrinkle to carry into the workflow

PR #3's build notes record that plain `next build` (Turbopack, the Next 16
default) panicked in that agent's worktree with `Symlink [project]/
node_modules is invalid, it points out of the filesystem root` — caused by
a symlinked `node_modules` pointing outside the git worktree root. That
was a worktree-local issue (the demo repo's actual CI runner clones
normally, with no symlinked `node_modules`), so it's not expected to
reproduce in Actions. The agent implementing this workflow should run
plain `npx next build` first; only fall back to `npx next build --webpack`
if the same panic actually reproduces in CI, and note in the workflow
(a comment) why, if so.

## Out of scope

- No deploy step — this workflow only verifies, it does not publish or
  deploy anything.
- No test runner — the repo has no test suite today; adding one is a
  separate change.
- No caching/matrix tuning, no branch protection rule configuration (that
  requires repo admin UI access, not a workflow file).
- No changes to application code, `package.json` scripts, lint config, or
  TypeScript config — this change is CI wiring only.
