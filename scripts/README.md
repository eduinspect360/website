# Quality gates

## `contrast-nav-gate.cjs` — G1 rendered contrast + G2 navigation reachability

Standing policy: this gate must pass before any change reaches `main`. A NEW failure is a build failure.

- **G1 — Rendered contrast.** For every text element, computes contrast against its *actual computed
  parent background* in the rendered DOM (incl. gradient colour stops), not tokens in isolation.
  Thresholds: 4.5:1 (normal), 3:1 (large text ≥24px, or ≥18.66px bold).
  **Exemption:** `.navbar-name` (the EDUINSPECT360 wordmark) is a logotype and is exempt under
  WCAG 2.1 SC 1.4.3. The gate reports it as EXEMPT and does not fail on it. Do not "fix" it by
  darkening the brand green.
- **G2 — Navigation reachability.** Loads every page, enumerates every internal link, resolves each
  (must be 200), and asserts every page has a route back to the site (navbar or a link to a primary page).

The script `process.exit(1)`s on any non-exempt G1 failure, any page with no route back, or any broken link.

### Run locally
```
python3 -m http.server 8899 &
BASE=http://localhost:8899 node scripts/contrast-nav-gate.cjs
```
Requires Playwright Chromium (`npm i -D playwright && npx playwright install chromium`).

### Enforcement
- **CI (authoritative):** `.github/workflows/contrast-nav-gate.yml` runs on push + PR to `main` and fails the build.
- **Local pre-push (fast feedback):** activate once with `git config core.hooksPath .githooks`.
