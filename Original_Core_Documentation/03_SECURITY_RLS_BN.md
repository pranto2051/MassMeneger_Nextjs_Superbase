# 03 — Security, Privacy & Row Level Security

## 1. Security principles
1. Authentication identifies the user; authorization determines what they can do.
2. Every mess-owned row must be isolated by `mess_id`.
3. RLS is mandatory on all tenant tables.
4. Client-side route guards are UX only, not security.
5. Phone numbers are personal data. Show them only to authenticated members who are permitted to see the directory.
6. Private notes, payment proof, audit data and manager-only settings must not be exposed to all members.
7. Never store passwords, Supabase secret keys or service-role keys in database fields or frontend bundles.

## 2. Role matrix
| Action | Owner | Manager | Member |
|---|---:|---:|---:|
| View own mess dashboard | Yes | Yes | Limited |
| View member directory | Yes | Yes | Yes, permitted fields |
| Add/edit/deactivate members | Yes | Yes | No |
| Record/edit meal entries | Yes | Yes | Own entry only if feature enabled |
| Edit market schedule | Yes | Yes | No |
| Create deposits/expenses | Yes | Yes | No (request/proof workflow optional) |
| View own statement | Yes | Yes | Yes |
| View whole financial report | Yes | Yes | No by default |
| Close/unlock month | Yes | Yes, if authorized | No |
| Manage roles/settings | Yes | Limited settings | No |
| Read audit logs | Yes | Yes | No |

Adjust these policies to your actual rules. The starter policies intentionally give members limited access to their own financial rows, but table-level `SELECT` policies do not automatically hide individual columns. If members must not see other members’ deposits/expenses, use views/RPC or separate tables and grant only the intended columns/operations. Do not assume RLS alone masks columns.

## 3. RLS checklist
- [ ] Enable RLS on every tenant table.
- [ ] Verify membership by `auth.uid()` through `mess_memberships`.
- [ ] Test a user in Mess A cannot read/write Mess B.
- [ ] Test a member cannot insert a manager role or change their own role.
- [ ] Test user cannot forge `created_by`, `updated_by` or another member’s `user_id`.
- [ ] Test inactive/removed membership loses access immediately.
- [ ] Test closed month rejects edits.
- [ ] Test unauthenticated requests are denied.
- [ ] Test service-role use is limited to trusted server-only jobs.
- [ ] Keep audit logs append-only to ordinary users.

## 4. Contact privacy
Members may need to call each other, but expose only what is needed:
- Name, room, mobile and WhatsApp can be visible to authenticated members if the mess agrees.
- Email and private notes should be hidden unless necessary.
- Add a manager-controlled contact visibility setting if different messes have different privacy expectations.
- Offer `tel:` and `https://wa.me/` links only after normalizing phone numbers. Preserve stored display value; normalize separately for links.
- Obtain consent and define what happens when a member leaves.

## 5. Audit and financial integrity
Audit at least: member changes, meal corrections, expense/deposit create/edit/delete, schedule swaps, period close/unlock, role changes. Include actor, action, timestamp, entity type/id and a limited change summary. Never log secrets or unnecessary personal details.

Financial rows should generally be corrected with an adjustment/reversal instead of hard deletion. Closing a month should create a stable snapshot and prevent routine edits. Reopening requires manager authorization and audit logging.

## 6. Threats to test
- Insecure direct object reference: swapping UUIDs in URLs/API requests.
- Cross-mess data leakage.
- Role escalation via crafted JSON.
- Duplicate submission on flaky mobile network.
- Negative or extreme meal counts/amounts.
- Manipulated client totals.
- Export endpoint leaking a report for another mess.
- Public Storage bucket accidentally exposing receipts.
- XSS in notes/member names rendered into report HTML.
