# 01 — System Architecture

## 1. লক্ষ্য
একটি multi-member mess-এর সদস্য, মিল, বাজারের দায়িত্ব, আয়-ব্যয়, মাসিক settlement এবং downloadable reports এক জায়গায় পরিচালনা করা। ভবিষ্যতে সদস্য সংখ্যা বাড়লেও pagination, indexing, permission boundaries ও month-based queries যেন কার্যকর থাকে।

## 2. High-level architecture
```text
Next.js Web (App Router) ─┐
                          ├── Supabase Auth
Expo React Native App ────┤
                          └── Supabase PostgreSQL
                                ├── RLS + constraints
                                ├── SQL functions/views (where appropriate)
                                └── Storage (optional member avatars/report files)
```
Both clients authenticate independently and access the same database. Shared TypeScript packages should hold validation schemas, domain types, theme tokens and pure calculations. Never trust client-supplied totals or role claims.

## 3. Application modules
1. Authentication & onboarding
   - Sign in/out, password reset, session refresh.
   - A new user joins a mess only by manager invitation or approved membership flow.
2. Mess setup
   - Mess name, address, currency (BDT), timezone (`Asia/Dhaka`), month start/end rules, breakfast/fractional meal settings.
3. Member directory
   - Name, nickname, room, mobile, WhatsApp, email (optional), active/inactive status, joined/left date.
   - Phone numbers stored as `text`, never numeric, so leading zero and `+880` survive.
   - Visibility controls: show only the contact data members actually need; do not expose private notes to all members.
4. Meals
   - Date, member, meal type, quantity (0, 0.5, 1, etc.), note, created/updated by.
   - Corrections must be auditable. Prevent accidental duplicate entries for same member/date/type unless explicitly allowing revisions.
5. Market schedule
   - Date or date range, assigned member, sequence/order, note, status.
   - Manager can drag/reorder or manually assign; schedule is editable and supports swaps.
   - A member assigned “later in the month” may be assigned first; schedule must not depend on a fixed rotation algorithm.
6. Accounts
   - Deposits/credits, shared expenses, market receipts, categories, payer, date, amount, receipt attachment (optional).
   - Record expense allocation policy explicitly: all expenses meal-related, fixed shared expenses, member-specific expense, or excluded from meal-rate calculation.
7. Monthly close & settlement
   - Calculate total meals, eligible expense pool, meal rate, member charge, payments, adjustments and closing balance.
   - Preview → manager approval → lock period. Corrections after lock require manager unlock and audit log.
8. Reports
   - Whole mess/month summary; individual member statement; market/expense report; deposits and outstanding balances.
   - Filters: mess, month/date range, member, category, status.
   - Export PDF and PNG; include generated timestamp, period, mess name, currency and page numbers where supported.
9. Settings and audit
   - Theme, locale, notification preference, mess settings, audit log.
10. Optional notifications
   - Market reminder, meal entry reminder, monthly settlement reminder. Use a notification provider only after the core app is stable.

## 4. Core entities
`messes` → one mess. `mess_memberships` connects authenticated users to a mess with a role. `members` stores the mess directory and may optionally link to an app user. Meal, market, deposit and expense rows belong to a mess. Every tenant-owned table must include `mess_id` and enforce membership-based RLS.

## 5. Roles
- `owner`: mess owner, can manage all settings and transfer ownership through a deliberate flow.
- `manager`: manage members, meals, schedules, accounts, reports and monthly close.
- `member`: view permitted directory, view own financial statement, optionally enter own meals, view schedule.
- Optional `viewer`: read-only limited access.
The starter SQL implements `owner`, `manager`, `member`; expand deliberately if required.

## 6. API/data access rules
- Use Supabase Auth session and RLS as the security boundary.
- Web server actions/route handlers validate input with Zod or equivalent.
- Use server-side transactions/RPC for operations that must be atomic (monthly close, multi-row adjustments).
- Do not accept a `mess_id` from the browser as proof of access; RLS must validate it.
- Do not compute final financial balances from values sent by the client.
- Use pagination and date filters; avoid downloading all members' history to the browser.
- Add idempotency or unique constraints to avoid double submission on poor mobile networks.

## 7. Suggested routes
```text
/                         landing or redirect
/login
/forgot-password
/onboarding
/app                       dashboard
/app/members
/app/members/[memberId]
/app/meals
/app/market-schedule
/app/accounts/deposits
/app/accounts/expenses
/app/settlement/[yyyy-mm]
/app/reports
/app/settings
/app/audit-log             owner/manager only
```
Mobile tabs: Home, Meals, Market, Accounts, Profile. Use stacks for member details and reports.

## 8. Data flow example: record a meal
1. Client selects date/member/type/count.
2. Validate date, count range, membership and month state on server/database.
3. Insert or update `meal_entries` with `created_by`/`updated_by`.
4. Database RLS checks user’s mess role.
5. Dashboard query refreshes monthly aggregates.
6. Audit event is recorded for changes.
7. If month is locked, reject edit unless an authorized manager reopens it.

## 9. Calculation definitions
Store amounts as `numeric(12,2)` (BDT) and counts as `numeric(6,2)`. Avoid floating-point money arithmetic in JavaScript; use integer poisha or decimal-safe arithmetic. SQL numeric is exact.

Let:
- `M_i` = member i's monthly meal count
- `M_total` = sum of all member meal counts
- `E_meal` = sum of expenses included in the meal rate
- `R` = meal rate = `E_meal / M_total`, only when `M_total > 0`
- `C_i` = meal charge = `M_i × R`
- `D_i` = member deposits/credits
- `S_i` = member-specific charges/adjustments, as signed amounts under a documented convention
Then the settlement must define one consistent ledger formula. Suggested: `net_credit_i = deposits_i + credits_i - meal_charge_i - allocated_shared_charges_i`. Positive means credit; negative means due. Shared costs included in `E_meal` must not be charged again as a separate allocation, or the member will be double-charged.

Do not silently assume every expense contributes to meal rate. Add a manager-controlled expense classification and document it in UI.

## 10. Scaling and reliability
- Index `(mess_id, date)`, `(mess_id, member_id, date)`, and foreign keys.
- Use monthly aggregate queries/views rather than loading all records.
- Soft-deactivate members instead of deleting members who have historical financial data.
- Back up database, test restore, and maintain SQL migrations in version control.
- Add error monitoring and structured server logs without logging passwords or sensitive contact data.
