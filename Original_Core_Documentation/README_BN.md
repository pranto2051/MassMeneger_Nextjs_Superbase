# Mess Management System — Documentation Pack
**Version:** 1.0 • **Date:** 2026-10-14 • **Status:** Architecture and starter database schema; application implementation not yet built/verified.

## এই প্যাকেজে কী আছে
- `01_ARCHITECTURE_BN.md` — পূর্ণ সিস্টেম আর্কিটেকচার ও ডেটা প্রবাহ
- `02_DATABASE_GUIDE_BN.md` — টেবিল, হিসাবের সূত্র, SQL চালানোর নির্দেশনা
- `03_SECURITY_RLS_BN.md` — Auth, role, RLS ও গোপনীয়তা
- `04_UI_UX_GUIDE_BN.md` — Liquid Glass, theme modes, responsive design
- `05_IMPLEMENTATION_ROADMAP_BN.md` — ধাপে ধাপে development checklist ও completion tracking
- `06_TEST_PLAN_BN.md` — হিসাব, নিরাপত্তা, রিপোর্ট ও অ্যাপ পরীক্ষার তালিকা
- `supabase_schema.sql` — Supabase SQL Editor-এ চালানোর starter schema

## দ্রুত শুরু
1. Supabase-এ নতুন project তৈরি করুন।
2. SQL Editor → New query খুলুন।
3. `supabase_schema.sql`-এর সম্পূর্ণ content paste করে Run করুন।
4. Authentication-এ Email/Password চালু করুন।
5. Next.js project তৈরি করে server-only environment variables সেট করুন।
6. আগে authentication, mess setup, members এবং roles শেষ করুন; তারপর meals, market, accounts ও reports তৈরি করুন।
7. `05_IMPLEMENTATION_ROADMAP_BN.md`-এর checklist অনুসরণ করে প্রতিটি feature test করুন।

## গুরুত্বপূর্ণ সীমা
এই প্যাকেজটি একটি বাস্তবায়নযোগ্য blueprint এবং starter SQL schema—এটি নিজে থেকে সম্পূর্ণ production-ready website/mobile app নয়। SQL schema-তে মূল tables, constraints, indexes, RLS policies ও কিছু helper functions রয়েছে; আপনার Supabase project-এ চালিয়ে smoke test, policy test এবং হিসাব যাচাই না করা পর্যন্ত production data ব্যবহার করবেন না। PDF/image export, UI, Next.js/Expo code, deployment ও automated tests এখনও implement করতে হবে।

## প্রস্তাবিত repository layout
```text
mess-management/
  apps/
    web/                 # Next.js App Router
    mobile/              # Expo + React Native
  packages/
    shared/              # TypeScript types, validation, constants
    business-rules/      # pure calculation functions
    ui-tokens/           # shared color/theme tokens
  supabase/
    migrations/
      001_initial_schema.sql
    seed.sql              # demo data only
  docs/
    README_BN.md
    01_ARCHITECTURE_BN.md
    02_DATABASE_GUIDE_BN.md
    03_SECURITY_RLS_BN.md
    04_UI_UX_GUIDE_BN.md
    05_IMPLEMENTATION_ROADMAP_BN.md
    06_TEST_PLAN_BN.md
```

## Environment variables
Web app `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```
`SUPABASE_SERVICE_ROLE_KEY` কখনো `NEXT_PUBLIC_` prefix দেবেন না, browser/mobile bundle-এ দেবেন না, Git-এ commit করবেন না। সাধারণ user request-এ server-side service-role ব্যবহার না করে authenticated Supabase client + RLS ব্যবহার করুন।

Mobile `.env`-এ কেবল project URL ও publishable/anon key থাকবে। Service role key কখনো mobile app-এ নয়।

## হিসাবের মৌলিক নিয়ম
- `meal_entries`-এ একজন সদস্যের নির্দিষ্ট দিনের breakfast/lunch/dinner/other count রাখা হবে; fractional meal যেমন 0.5 অনুমোদনযোগ্য।
- মাসিক meal count = নির্বাচিত মাসে সদস্যের সব meal entry-এর `meal_count` যোগফল।
- মাসের meal rate = (সেই মাসে meal-এ বরাদ্দযোগ্য মোট খরচ) ÷ (সবার মোট meal count)। মোট meal শূন্য হলে rate শূন্য/`null`; ভাগ-শূন্য নয়।
- সদস্যের meal charge = member meal count × monthly meal rate।
- সদস্যের net balance-এর sign convention নির্দিষ্ট রাখুন: `positive = সদস্যের পক্ষে ক্রেডিট/অতিরিক্ত জমা`, `negative = বকেয়া`; UI-তে পরিষ্কারভাবে দেখাতে হবে।
- বাজারের খরচ expense হিসেবে রেকর্ড হবে। market schedule কেবল দায়িত্ব পরিকল্পনা; সেটি নিজে থেকে খরচ/মিল তৈরি করবে না।
- পুরোনো মাসের হিসাব বন্ধ করার আগে manager review/lock workflow যোগ করুন।

## সুপারিশ
প্রথম release-এ হিসাবের সূত্র এবং auditability-কে visual effects-এর চেয়ে বেশি অগ্রাধিকার দিন। Liquid Glass-এর জন্য text contrast, reduced-motion, low-end Android performance এবং light theme readability নিশ্চিত করুন।
