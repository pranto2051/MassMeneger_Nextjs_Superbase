# 06 — Test Plan & Acceptance Criteria

## 1. Database tests
- [ ] `mobile='01712345678'` remains exactly `01712345678` after insert/select.
- [ ] Duplicate membership for same user and mess is rejected.
- [ ] Negative meal count and negative deposit/expense are rejected unless explicit adjustment design permits them.
- [ ] Invalid meal type and invalid foreign key are rejected.
- [ ] A member in Mess A cannot read or mutate Mess B rows.
- [ ] A member cannot grant themselves manager/owner role.
- [ ] Deactivated member is excluded from new schedule assignments.
- [ ] Foreign keys preserve historical records; destructive member deletion is restricted.
- [ ] Meal count sum for date/month matches known fixtures.

## 2. Accounting fixture
Use a disposable test mess:
- Eligible meal expenses: ৳18,000.00
- Total meals: 600
- Expected rate: ৳30.00
- Member A meals: 45 → charge ৳1,350.00
- Member A deposits: ৳2,000.00
- If no other charges/credits, net credit = ৳650.00 under the documented convention.
Also test total meals = 0; rate must be `null`/pending and no divide-by-zero occurs. Test rounding at two decimals and confirm the policy for fractional meal counts.

## 3. Meal entry tests
- [ ] Create, edit, and correct entry.
- [ ] Count accepts supported increments (e.g. 0, 0.5, 1, 1.5) only.
- [ ] Duplicate entry behavior is predictable.
- [ ] Concurrent saves do not duplicate records.
- [ ] Closed period rejects edits.
- [ ] Audit history records actor and change.
- [ ] Timezone boundaries use `Asia/Dhaka`.

## 4. Market schedule tests
- [ ] Assign, reorder, swap, cancel and reassign.
- [ ] First assigned person can be anyone; no hidden fixed rotation.
- [ ] Same-day conflicting assignment behavior follows policy.
- [ ] Schedule edit does not create expense or meal entries.
- [ ] Members see only the appropriate mess schedule.

## 5. Reports
- [ ] Whole mess report filters by month/date range.
- [ ] Individual member report includes correct member and period.
- [ ] PDF text, Bengali characters, currency and page breaks render correctly.
- [ ] PNG is crisp at chosen scale and long reports have a deliberate strategy (multiple pages or split images).
- [ ] Report totals match the same source query as dashboard totals.
- [ ] A user cannot export another mess's report by changing URL/query IDs.
- [ ] Export excludes private notes and hidden fields.
- [ ] Empty month displays an explanatory empty state, not a broken file.

## 6. UI & mobile
- [ ] Day/Night and each accent preset work on every core page.
- [ ] Text contrast, keyboard focus and form errors are clear.
- [ ] Reduced motion is respected.
- [ ] Glass effects do not make tables unreadable.
- [ ] Android small screen and iOS safe-area checks pass.
- [ ] Network timeout and retry do not duplicate a deposit or expense.
- [ ] Session expiry sends user through a safe re-auth flow.

## 7. Release gate
Do not launch with real financial data until RLS tests, accounting reconciliation, export authorization, backup/restore, and manager account recovery all pass.
