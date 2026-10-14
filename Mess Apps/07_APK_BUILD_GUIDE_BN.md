# অ্যান্ড্রয়েড এপিকে (APK) বিল্ড ও মোবাইল ইনস্টলেশন গাইড
## Mess App Android APK Build & Installation Guide

এই নথিতে কিভাবে মোবাইল অ্যাপসের একটি ইনস্টলযোগ্য অ্যান্ড্রয়েড **`.apk`** ফাইল তৈরি করবেন এবং সরাসরি মোবাইল ফোনে টেস্ট করবেন তার বিস্তারিত নির্দেশিকা দেওয়া হয়েছে।

---

## ১. মেথড ১: EAS ক্লাউড বিল্ডের মাধ্যমে ইনস্টলযোগ্য APK তৈরি (সর্বাধিক সহজ ও রিকমেন্ডেড)

Expo এর অফিশিয়াল ক্লাউড বিল্ড সার্ভিস **EAS (Expo Application Services)** ব্যবহার করে সরাসরি `.apk` ফাইল তৈরি করা যায়। এর জন্য কম্পিউটারে ভারী Android SDK বা Java ইনস্টল করার প্রয়োজন হয় না।

### স্টেপ ১: টার্মিনালে প্রবেশ করুন
```bash
cd "/Users/pranto/Desktop/Mass Manager/Mess_Management_Documentation/Mess Apps"
```

### স্টেপ ২: Expo অ্যাকাউন্টে লগইন করুন
যদি আপনার কোনো Expo অ্যাকাউন্ট না থাকে, [expo.dev/signup](https://expo.dev/signup) থেকে বিনামূল্যে ২ মিনিটে একটি অ্যাকাউন্ট খুলে নিতে পারেন।
```bash
npx eas-cli login
```
আপনার ইমেইল ও পাসওয়ার্ড প্রদান করুন।

### স্টেপ ৩: APK বিল্ড কমান্ড চালান
```bash
npx eas-cli build -p android --profile preview
```
- প্রোজেক্ট আইডি কনফিগারেশন চাইলে `Y` (Yes) চাপুন।
- EAS স্বয়ংক্রিয়ভাবে ক্লাউড সার্ভারে বিল্ড শুরু করবে।
- বিল্ড সম্পন্ন হলে টার্মিনালে একটি **সরাসরি ডাউনলোড লিঙ্ক** এবং একটি **QR Code** প্রদর্শিত হবে।
- আপনার অ্যান্ড্রয়েড ফোনের ক্যামেরা বা ব্রাউজার দিয়ে সেই লিঙ্কে গিয়ে `.apk` ফাইলটি ডাউনলোড করে ফোনে ইনস্টল করে নিন!

> [!TIP]
> `eas.json` এ ইতোমধ্যে `"buildType": "apk"` কনফিগার করা রয়েছে, যার ফলে এটি প্লে-স্টোর বান্ডেল (`.aab`) এর বদলে সরাসরি ইনস্টলযোগ্য `.apk` তৈরি করবে।

---

## ২. মেথড ২: Expo Go এর মাধ্যমে ইনস্ট্যান্ট টেস্ট (কোনো বিল্ড বা অপেক্ষার প্রয়োজন নেই)

বিল্ড প্রসেসের সময় অপেক্ষা না করে আপনার মোবাইলে এখনই তাৎক্ষণিক অ্যাপটি লাইভ চালাতে চাইলে:

1. আপনার অ্যান্ড্রয়েড মোবাইলের Google Play Store থেকে বিনামূল্যে **Expo Go** অ্যাপটি ইনস্টল করুন।
2. আপনার ম্যাক কম্পিউটারের টার্মিনালে কমান্ডটি দিন:
   ```bash
   cd "/Users/pranto/Desktop/Mass Manager/Mess_Management_Documentation/Mess Apps"
   npm run start
   ```
3. টার্মিনালে একটি বড় **QR কোড** আসবে।
4. মোবাইলের **Expo Go** অ্যাপটি খুলে "Scan QR code" এ ট্যাপ করে টার্মিনালের কিউআর কোডটি স্ক্যান করুন (কম্পিউটার ও মোবাইল একই ওয়াইফাই নেটওয়ার্কে থাকলে সবচেয়ে দ্রুত কাজ করে, অথবা `npx expo start --tunnel` দিলে যেকোনো ইন্টারনেট থেকে চলবে)।
5. সাথে সাথে আপনার ফোনে অ্যাপটি চালু হয়ে যাবে এবং Supabase ডাটাবেসের সাথে রিয়েল-টাইমে কানেক্ট হয়ে কাজ করবে!

---

## ৩. মেথড ৩: লোকাল মেশিনে গ্রেডল দিয়ে অফলাইন APK বিল্ড

যদি আপনি নিজের ম্যাক কম্পিউটারে অফলাইনে লোকাল APK বিল্ড করতে চান:

1. **JDK 17 ইনস্টল করুন:**
   [Adoptium Temurin 17 (macOS aarch64)](https://adoptium.net/temurin/releases/?version=17) থেকে `.pkg` ফাইল ডাউনলোড করে ইনস্টল করুন।
2. **Android SDK কনফিগার করুন:**
   Android Studio ইনস্টল করে Command-line Tools এবং Android 34 SDK নামিয়ে নিন।
   টার্মিনালে পাথ সেট করুন:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
3. **Gradle দিয়ে APK তৈরি করুন:**
   ```bash
   cd "/Users/pranto/Desktop/Mass Manager/Mess_Management_Documentation/Mess Apps/android"
   ./gradlew assembleRelease
   ```
4. তৈরি হওয়া APK ফাইলটি পাওয়া যাবে:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## ৪. লাইভ Supabase কানেকশন ও সিঙ্ক স্ট্যাটাস

অ্যাপটিতে আপনার লাইভ Supabase ডাটাবেস সম্পূর্ণভাবে সংযুক্ত করা হয়েছে:
- **API URL:** `https://guidcgsrlcbuklzqhdmj.supabase.co`
- **Publishable Key:** `sb_publishable_AeZ_SC2xRFuOqKmgcNYK_g_PBrwflpS`
- **স্বয়ংক্রিয় সিঙ্ক ব্যবস্থা:**
  - মিল সংখ্যা পরিবর্তন (Breakfast / Lunch / Dinner / Direct Total)
  - সদস্য তালিকা ও প্রোফাইল আপডেট
  - বাজার দায়িত্ব ও রোস্টার পরিবর্তন / সোয়াপ
  - মেস সেটিংস পরিবর্তন (মিল ইনপুট মোড, মিল ভ্যালু)
  - ডিপোজিট জমা ও খরচ যোগ
  - ভাউচার রসিদের ফটো ক্যাপচার
- সব কিছু সরাসরি আপনার Supabase ডাটাবেসে রিয়েল-টাইমে আপডেট হয়।
