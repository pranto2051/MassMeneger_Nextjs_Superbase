# Mess Apps — React Native & Expo Mobile Application Documentation
**ভার্সন:** 1.0 • **তারিখ:** 2026-10-14 • **টেকনোলজি:** Expo (React Native), TypeScript, Supabase JS Client, Expo SecureStore

---

## 📱 মোবাইল অ্যাপসের মূল ভূমিকা ও লক্ষ্য
Mess Apps মূলত মেসের **সাধারণ সদস্য (Members)** এবং **চলতি পথে থাকা ম্যানেজারদের (On-the-go Managers)** জন্য তৈরি।
1. **মেম্বারদের স্বাচ্ছন্দ্য**: নিজের আজকের ও চলতি মাসের মিল স্ট্যাটাস দেখা, মিল বন্ধ/চালু করার রিকোয়েস্ট বা এন্ট্রি করা।
2. **ব্যক্তিগত পাসবুক / ব্যালেন্স**: নিজের জমা, মিল খরচ, বর্তমান ক্রেডিট বা বকেয়া রিয়েলটাইমে দেখা।
3. **বাজারের শিডিউল ও ইনস্ট্যান্ট ভাউচার আপলোড**: কার কবে বাজার তা দেখা এবং বাজারে গিয়ে মোবাইলের ক্যামেরা দিয়ে মেমোর ছবি তুলে খরচের হিসাব এন্ট্রি করা।
4. **মেস কমিউনিকেশন**: ডিরেক্টরি থেকে এক ক্লিকে সহ-মেম্বারকে কল বা হোয়াটসঅ্যাপ মেসেজ পাঠানো।
5. **পুশ নোটিফিকেশন**: আগামীকালের মিল কনফার্মেশন ও বাজারের রিমাইন্ডার পাওয়া।

---

## 📂 ফাইল নির্দেশিকা (Mess Apps ফোল্ডার)
- [`01_MOBILE_ARCHITECTURE_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Apps/01_MOBILE_ARCHITECTURE_BN.md) — Expo আর্কিটেকচার, বটম ট্যাব নেভিগেশন ও স্ক্রিন ফ্লো।
- [`02_MOBILE_SUPABASE_INTEGRATION_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Apps/02_MOBILE_SUPABASE_INTEGRATION_BN.md) — React Native-এ Supabase কানেকশন, SecureStore ও অফলাইন সাপোর্ট।
- [`03_MOBILE_SECURITY_AND_ENV_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Apps/03_MOBILE_SECURITY_AND_ENV_BN.md) — এনভায়রনমেন্ট ভ্যারিয়েবল (Anon Key Only), বায়োমেট্রিক ও প্রাইভেসী।
- [`04_MOBILE_UI_UX_GUIDE_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Apps/04_MOBILE_UI_UX_GUIDE_BN.md) — মোবাইল লিকুইড গ্লাস UI, বটম শীট, টাচ টার্গেট ও হ্যাপটিক ফিডব্যাক।
- [`05_MOBILE_ROADMAP_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Apps/05_MOBILE_ROADMAP_BN.md) — মোবাইল অ্যাপ ডেভেলপমেন্ট চেকলিস্ট ও EAS বিল্ড।
- [`06_MOBILE_TEST_PLAN_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Apps/06_MOBILE_TEST_PLAN_BN.md) — অ্যান্ড্রয়েড ও আইওএস টেস্ট প্ল্যান, নেটওয়ার্ক রিট্রাই ও পারফরম্যান্স।
- [`DATABASE_CONTRACT_BN.md`](file:///Users/pranto/Desktop/Mass%20Manager/Mess_Management_Documentation/Mess%20Apps/DATABASE_CONTRACT_BN.md) — অ্যাপের জন্য প্রয়োজনীয় ডাটাবেজ মডেল, টেবিল ফিল্ড ও টাইপ ডেফিনেশন।

---

## 🚀 দ্রুত শুরু (Quick Start)
1. Expo প্রজেক্ট ইনিশিয়ালাইজ করুন:
```bash
npx create-expo-app@latest MessApp -t blank-typescript
```
2. প্রয়োজনীয় প্যাকেজ ইনস্টল করুন:
```bash
npx expo install @supabase/supabase-js expo-secure-store expo-image-picker
```
3. `.env` ফাইলে শুধুমাত্র পাবলিক কী কনফিগার করুন:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
⚠️ **সতর্কতা:** মোবাইল অ্যাপে কখনো `SERVICE_ROLE_KEY` ব্যবহার করবেন না।
