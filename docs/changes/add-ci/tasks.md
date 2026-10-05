# add-ci — tasks

- [ ] Create `.github/workflows/ci.yml` with `push` (branch: `main`) and
      `pull_request` triggers
- [ ] Workflow checks out the repo and sets up Node (match the engine
      implied by `package.json`'s deps, e.g. Node 20+) with npm caching
- [ ] Install dependencies (`npm ci`)
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npx eslint .`
- [ ] Run `npx next build` — if this panics in CI the way it did in PR
      #3's worktree (`Symlink [project]/node_modules is invalid`), switch
      this step to `npx next build --webpack` and leave a comment in the
      workflow explaining why
- [ ] Confirm the workflow fails the check when any of the three steps
      fails (e.g. temporarily break one locally, run the equivalent
      command, confirm non-zero exit)
- [ ] Gates pass: `tsc --noEmit`, `eslint .`, `next build` (or
      `next build --webpack`, per above) all green on the branch that adds
      the workflow
- [ ] PR opened, reviewed, merged
- [ ] `docs/specs/` — no existing spec file covers CI; if a `ci.md` spec
      is warranted once this ships, add one describing the workflow's
      triggers and steps as current truth
- [ ] This folder moved to `docs/changes/archive/add-ci/`
