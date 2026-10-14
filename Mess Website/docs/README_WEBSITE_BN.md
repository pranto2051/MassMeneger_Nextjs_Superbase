# Mess Website — Next.js Web Application & Admin Documentation
**ভার্সন:** 1.0 • **তারিখ:** 2026-10-14 • **টেকনোলজি:** Next.js (App Router), TypeScript, Tailwind CSS / Vanilla CSS, Supabase PostgreSQL & Auth

---

## 📌 ওয়েবসাইটের মূল ভূমিকা ও দায়িত্ব
Mess Website হলো পুরো মেস ম্যানেজমেন্ট সিস্টেমের **সেন্ট্রাল কন্ট্রোল হাব (Central Control & Admin Hub)**। এটি মেসের ম্যানেজার ও মেম্বারদের জন্য একটি পূর্ণাঙ্গ ওয়েব পোর্টাল প্রদান করে, যার মাধ্যমে:
1. **মেসের মূল সেটআপ ও ডাটাবেজ পরিচালনা**: Supabase প্রজেক্ট ও স্কিমা ইনিশিয়ালাইজেশন।
2. **ম্যানেজার ড্যাশবোর্ড**: বাল্ক মিল এন্ট্রি (একসাথে সবার মিল তোলা), বাজার শিডিউল নির্ধারণ ও রিঅর্ডার।
3. **হিসাব-নিকাশ ও ব্যালেন্স**: মেম্বারদের ডিপোজিট, বাজারের ভাউচার এন্ট্রি, ফিক্সড ও ভেরিয়েবল খরচ ব্যবস্থাপনা।
4. **মান্থলি সেটলমেন্ট ক্লোজিং**: মাসের মিল রেট ক্যালকুলেশন, মেম্বারদের ফাইনাল ব্যালেন্স শিট প্রস্তুত এবং অডিট লক।
5. **রিপোর্ট এক্সপোর্ট**: মেসের পূর্ণাঙ্গ রিপোর্ট এবং ব্যক্তিগত মেম্বার স্টেটমেন্ট PDF ও PNG ফরম্যাটে ডাউনলোড।

---

## 📂 ফাইল নির্দেশিকা (Mess Website ফোল্ডার)
- [`supabase_schema.sql`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Website/supabase_schema.sql) — Supabase SQL Editor-এ রান করার পূর্ণাঙ্গ ডাটাবেজ স্কিমা।
- [`01_WEB_ARCHITECTURE_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Website/01_WEB_ARCHITECTURE_BN.md) — Next.js App Router আর্কিটেকচার, রাউট স্ট্রাকচার ও ডেটা ফ্লো।
- [`02_DATABASE_AND_BACKEND_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Website/02_DATABASE_AND_BACKEND_BN.md) — টেবিল ম্যাপিং, গাণিতিক সূত্র, RPC ও সার্ভার অ্যাকশন নির্দেশিকা।
- [`03_WEB_SECURITY_RLS_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Website/03_WEB_SECURITY_RLS_BN.md) — RLS পলিসি, কুকি সেশন, রোল বেসড অ্যাক্সেস ও অডিট লগিং।
- [`04_WEB_UI_UX_LIQUID_GLASS_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Website/04_WEB_UI_UX_LIQUID_GLASS_BN.md) — ডেসকটপ ও ট্যাবলেটের লিকুইড গ্লাস UI, ডেটা গ্রিড ও থিম প্রিসেট।
- [`05_WEB_ROADMAP_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Website/05_WEB_ROADMAP_BN.md) — ওয়েবসাইট ডেভেলপমেন্ট চেকলিস্ট ও রোডম্যাপ।
- [`06_WEB_TEST_PLAN_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Website/06_WEB_TEST_PLAN_BN.md) — হিসাবের নির্ভুলতা, প্রিন্টিং ও ব্রাউজার টেস্ট প্ল্যান।

---

## 🚀 দ্রুত শুরু (Quick Start)
1. Supabase ড্যাশবোর্ডে গিয়ে প্রজেক্ট তৈরি করুন।
2. SQL Editor-এ গিয়ে `supabase_schema.sql`-এর কোড পেস্ট করে রান করুন।
3. Next.js প্রজেক্টে `.env.local` কনফিগার করুন:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # সার্ভার অ্যাকশনে শুধুমাত্র বিশ্বস্ত কাজের জন্য
```
4. `npm run dev` চালু করে ব্রাউজারে `http://localhost:3000` খুলুন।
