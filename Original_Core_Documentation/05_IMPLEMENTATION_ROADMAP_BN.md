# 05 — Implementation Roadmap & Completion Tracking

## Status legend
- `NOT STARTED` — code not yet implemented.
- `IN PROGRESS` — implementation started; not accepted.
- `TESTING` — feature implemented but tests incomplete.
- `DONE` — acceptance criteria pass in the target environment.
At package creation, no app code or live Supabase project was supplied, so application features are **NOT STARTED / NOT VERIFIED**. The SQL file is a starter schema and must be run/tested before marking database setup complete.

## Phase 0 — Project setup
- [ ] Create Git repository and branch strategy.
- [ ] Create Supabase project and configure Auth.
- [ ] Add environment variables to local/dev/production environments.
- [ ] Create Next.js TypeScript app with App Router.
- [ ] Add lint, typecheck, formatting and test scripts.
- [ ] Create Expo React Native app.
- [ ] Create shared packages for types, validation and theme tokens.
**Exit criteria:** clean install, build, lint and typecheck pass.

## Phase 1 — Database & security
- [ ] Run `supabase_schema.sql` in a disposable/dev project.
- [ ] Verify all tables, indexes, constraints and policies.
- [ ] Create migration baseline in version control.
- [ ] Implement controlled mess creation and first owner membership.
- [ ] Test RLS with at least two messes and three roles.
- [ ] Verify phone fields preserve `017...` exactly.
**Exit criteria:** cross-mess reads/writes are denied; role escalation is impossible.

## Phase 2 — Auth & member directory
- [ ] Login/logout/password reset.
- [ ] Session-aware protected routes.
- [ ] Create mess and invite/add member flow.
- [ ] Member CRUD with deactivate rather than destructive delete.
- [ ] Search, pagination and contact links.
- [ ] Member visibility/privacy rules.
**Exit criteria:** manager can maintain growing member list; member cannot access manager-only controls.

## Phase 3 — Meal tracking
- [ ] Date picker and month selector.
- [ ] Meal types and fractional counts.
- [ ] Bulk entry for multiple members.
- [ ] Duplicate and invalid count prevention.
- [ ] Edit history/audit.
- [ ] Locked-month edit rejection.
**Exit criteria:** test totals match hand-calculated expected values.

## Phase 4 — Market schedule
- [ ] Assign member to date/slot.
- [ ] Edit, reorder, swap, cancel and reassign duty.
- [ ] Calendar/list views.
- [ ] Prevent conflicting assignments if policy requires.
- [ ] Show upcoming duties to members.
**Exit criteria:** changing a schedule does not change financial records by itself.

## Phase 5 — Accounts & settlement
- [ ] Deposits and expenses.
- [ ] Expense category and meal-rate inclusion flag.
- [ ] Receipt attachment and validation (optional).
- [ ] Monthly rate calculation with zero-meal guard.
- [ ] Member statement and balance convention.
- [ ] Adjustments/reversals.
- [ ] Monthly preview, approval, close and controlled reopen.
**Exit criteria:** no double counting; reconcile sample month by hand and with SQL.

## Phase 6 — Reports
- [ ] Whole mess report by month/date range.
- [ ] Individual member report.
- [ ] Expense/deposit/market reports.
- [ ] PDF export.
- [ ] PNG/image export.
- [ ] Long report pagination and Bengali font rendering.
- [ ] Export permission checks.
**Exit criteria:** exported totals match on-screen totals; no report can cross mess boundaries.

## Phase 7 — UI polish & themes
- [ ] Design tokens and glass primitives.
- [ ] Day/Night + accent presets.
- [ ] Responsive layouts.
- [ ] Accessibility, contrast and reduced motion.
- [ ] Loading/empty/error states.
**Exit criteria:** all core flows usable on small mobile viewport and desktop.

## Phase 8 — React Native
- [ ] Auth/session persistence using secure storage.
- [ ] Shared database access rules and validation.
- [ ] Home, meals, market, accounts, profile.
- [ ] Offline-friendly drafts/idempotent retries where needed.
- [ ] Theme parity with web.
- [ ] PDF share/open and image save/share tested on iOS and Android.
**Exit criteria:** same user sees consistent data across web and mobile.

## Phase 9 — Production release
- [ ] Staging environment and test data.
- [ ] Backup and restore rehearsal.
- [ ] Error monitoring and audit review.
- [ ] Performance test with realistic member/meal volumes.
- [ ] Privacy notice and data retention policy.
- [ ] Admin account recovery plan.
- [ ] Deploy web and publish mobile builds.
**Exit criteria:** release checklist signed off and rollback plan available.

## Completion dashboard (initial)
| Area | Initial status | What is needed to mark DONE |
|---|---|---|
| Requirements/architecture | DOCUMENTED | Confirm policies and expense allocation rules |
| Starter SQL | PROVIDED, NOT VERIFIED | Run in dev Supabase; test schema and RLS |
| Web UI | NOT STARTED | Build and acceptance tests |
| Auth/onboarding | NOT STARTED | Implement and test role setup |
| Members | NOT STARTED | CRUD + privacy + leading-zero test |
| Meal tracking | NOT STARTED | CRUD, aggregates, corrections |
| Market schedule | NOT STARTED | Editable schedule and conflict rules |
| Accounts/settlement | NOT STARTED | Define accounting policy; reconcile |
| PDF/PNG reports | NOT STARTED | Implement, test Bengali fonts and permissions |
| Theme system | SPECIFIED, NOT IMPLEMENTED | Implement presets and contrast tests |
| React Native app | NOT STARTED | Expo app and platform testing |
| Deployment/backups | NOT STARTED | Configure and rehearse |

Do not mark a feature complete because a screen exists. A feature is DONE only when authorization, validation, failure states, responsive behavior and relevant tests pass.
