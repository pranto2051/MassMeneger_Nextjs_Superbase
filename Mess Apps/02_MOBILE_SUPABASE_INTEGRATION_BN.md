# 02 — Mobile Supabase Integration & Offline Guide (Mess Apps)

## 1. Supabase ক্লায়েন্ট ইনিশিয়ালাইজেশন
React Native-এ সেশন পারসিস্ট করার জন্য `expo-secure-store` ব্যবহার করতে হবে:

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 2. অফলাইন ও দুর্বল নেটওয়ার্ক হ্যান্ডলিং (Offline Resilience)
মোবাইলে দুর্বল নেটওয়ার্ক বা ইন্টারনেট বিচ্ছিন্নতা সাধারণ ঘটনা। তাই:
1. **ক্যাশ-ফার্স্ট কোয়েরি**: TanStack Query (React Query) ব্যবহার করে শেষবার ফেচ করা ডেটা মেমরিতে রাখুন যাতে নেটওয়ার্ক না থাকলেও ইউজার নিজের ব্যালেন্স বা শিডিউল দেখতে পায়।
2. **আইডেমপোটেন্সি (Idempotency)**: নেট স্লো থাকলে ইউজার পরপর একাধিকবার "Save" চাপতে পারে। ডুপ্লিকেট সাবমিশন এড়াতে বাটন ডিজেবল ও ইউনিক রিকোয়েস্ট আইডি ব্যবহার করুন।
3. **ক্যামেরা রিসিট অপ্টিমাইজেশন**: মেমোর ছবি আপলোড করার আগে `expo-image-manipulator` দিয়ে সাইজ কম্প্রেস (অনধিক 500KB) করে Supabase Storage-এ আপলোড করুন।
