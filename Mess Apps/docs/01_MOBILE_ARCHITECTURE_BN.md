# 01 — Mobile Architecture & Screen Navigation (Mess Apps)

## 1. মোবাইল অ্যাপ আর্কিটেকচার
Mess Mobile App তৈরি হবে **Expo (React Native)** দিয়ে।

```text
[ iOS / Android Devices ]
           │
           ▼
 Expo Navigation (Bottom Tabs + Native Stack)
   ├── Secure Token Storage (Expo SecureStore)
   ├── Offline Cache & Query Layer (TanStack Query / Zustand)
   └── Native Device APIs (Camera, Haptics, Local Notifications)
           │
           ▼
   Supabase PostgreSQL Backend (via Authenticated Anon Client + RLS)
```

---

## 2. নেভিগেশন ও স্ক্রিন লেআউট (5-Tab Structure)

### ৫টি মূল বটম ট্যাব (Bottom Tabs):
1. **হোম (Home / Dashboard)**:
   - আজকের মিল স্ট্যাটাস (সকাল, দুপুর, রাত)।
   - আজকের ও আগামীকালের বাজার কার দায়িত্ব।
   - নিজের বর্তমান ব্যালেন্স কার্ড (অ্যাডভান্স/বকেয়া)।
   - কুইক অ্যাকশন বাটন (বাজার খরচ এন্ট্রি, মিল আপডেট)।
2. **মিল (Meals)**:
   - সাপ্তাহিক/মাসিক মিল ক্যালেন্ডার।
   - নিজের মিলের সংখ্যা বৃদ্ধি/হ্রাস বা অফ করার বাটন।
   - (ম্যানেজার হলে) মেসের সবার আজকের মিল চেকলিস্ট।
3. **বাজার (Market)**:
   - চলতি মাসের বাজার শিডিউল লিস্ট।
   - সোয়াপ রিকোয়েস্ট (অন্য মেম্বারের সাথে বাজার অদলবদল)।
   - বাজার খরচের মেমো আপলোড (ক্যামেরা/গ্যালারি দিয়ে ছবি তুলে)।
4. **হিসাব (Accounts / Passbook)**:
   - ব্যক্তিগত পাসবুক: জমার হিস্ট্রি ও খরচের ব্রেকডাউন।
   - মেসের সাধারণ খরচ ও মোট মিল রেটের বিবরণী।
5. **প্রোফাইল (Profile & Settings)**:
   - মেস ও রুম ইনফো।
   - মেম্বার ডিরেক্টরি (সরাসরি কল ও হোয়াটসঅ্যাপ বাটন সহ)।
   - অ্যাপ থিম (Light / Dark ও কালার অ্যাকসেন্ট)।
   - লগআউট।

### স্ট্যাক স্ক্রিনসমূহ (Native Stacks):
- `/auth/login`, `/auth/forgot-password`
- `/receipt-preview` (মেমোর ছবি বড় করে দেখা)
- `/member-profile/[id]`
- `/pdf-viewer` (মাসিক স্টেটমেন্ট ভিউ ও শেয়ার)
