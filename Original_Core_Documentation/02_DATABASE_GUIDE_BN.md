# 02 — Database & Supabase Setup Guide

## 1. Supabase SQL Editor-এ schema চালানো
1. Supabase Dashboard-এ project খুলুন।
2. SQL Editor → New query নির্বাচন করুন।
3. এই প্যাকেজের `supabase_schema.sql` ফাইল খুলুন।
4. পুরো SQL কপি করে editor-এ paste করুন এবং Run করুন।
5. Table Editor-এ `messes`, `mess_memberships`, `members`, `meal_entries`, `market_assignments`, `deposits`, `expenses`, `monthly_periods`, `audit_logs` তৈরি হয়েছে কি না দেখুন।
6. SQL চালানোর পর `auth.users`-এর জন্য registration/login flow তৈরি করুন। নতুন user-কে নিজে থেকে কোনো mess-এর manager বানাবেন না; owner/manager membership একটি controlled onboarding process-এ তৈরি হবে।

## 2. Table map
| Table | কাজ |
|---|---|
| `profiles` | Auth user-এর display profile |
| `messes` | মেসের মূল তথ্য, timezone ও currency |
| `mess_memberships` | কোন user কোন mess-এ, কোন role-এ |
| `members` | মেসের বাসিন্দা/সদস্য ও যোগাযোগ |
| `meal_entries` | তারিখভিত্তিক breakfast/lunch/dinner/other count |
| `market_assignments` | বাজার করার দায়িত্ব ও পরিবর্তনশীল schedule |
| `deposits` | সদস্যের জমা/পেমেন্ট |
| `expenses` | বাজার ও অন্যান্য খরচ, meal-rate inclusion flag |
| `monthly_periods` | মাসের হিসাব, draft/closed/locked status |
| `audit_logs` | গুরুত্বপূর্ণ পরিবর্তনের audit trail |

## 3. Important data choices
- `mobile` এবং `whatsapp` হলো `text`; কখনো integer/bigint নয়। এতে `017...`-এর leading zero হারাবে না।
- `amount` হলো `numeric(12,2)`, `meal_count` হলো `numeric(6,2)`।
- সব tenant data-তে `mess_id` আছে।
- `members.user_id` nullable; সদস্যের অ্যাকাউন্ট না থাকলেও directory record রাখা যায়।
- `is_active=false` করে সদস্যকে নিষ্ক্রিয় করুন; historical rows মুছবেন না।
- `expenses.include_in_meal_rate=true` হলে সেই expense meal rate-এর numerator-এ যাবে। এই flag-এর মানে ও shared-cost treatment UI-তে পরিষ্কার লিখুন।

## 4. Supabase keys
- Client/browser/mobile: project URL + publishable/anon key.
- Server-only: service-role/secret key, শুধু প্রয়োজনীয় trusted admin task-এ।
- Service role RLS bypass করতে পারে; সাধারণ CRUD-তে এটি ব্যবহার করা নিরাপত্তার ঝুঁকি।
- `.env.local` Git-এ commit করবেন না; `.gitignore`-এ রাখুন।

## 5. Monthly calculation
Example only:
- eligible meal expenses = ৳18,000
- total meal count = 600
- meal rate = ৳30
- Member A meal count = 45
- Member A meal charge = ৳1,350

সদস্যের balance বের করতে deposit, credits, member-specific charges, adjustments এবং meal charge-এর sign convention স্থির করতে হবে। Meal-rate-এর মধ্যে থাকা expense আবার সদস্যের উপর আলাদা করে allocation করলে double counting হবে।

## 6. Production notes
- Starter schema-তে RLS policies আছে, তবে production release-এর আগে manager/member role matrix দিয়ে প্রতিটি table পরীক্ষা করুন।
- SQL schema run করার পরে sample mess, owner membership ও demo rows manually/seed script দিয়ে তৈরি করুন।
- Monthly close-এর জন্য পরবর্তীতে atomic RPC function তৈরি করুন, যাতে একই সঙ্গে period lock, snapshot totals এবং audit event লেখা যায়।
- Migrations ব্যবহার করুন; production-এ schema পরিবর্তন কেবল Dashboard-এ অনিয়ন্ত্রিতভাবে না করে version-controlled migration দিয়ে করুন।
