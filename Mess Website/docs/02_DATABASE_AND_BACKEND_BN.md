# 02 — Database & Backend Integration Guide (Mess Website)

## 1. ডাটাবেজ টেবিল ম্যাপিং
ওয়েবসাইটের ব্যাকএন্ড সরাসরি Supabase PostgreSQL ডাটাবেজের নিচের টেবিলগুলোর সাথে যুক্ত থাকবে:

| টেবিল নাম | প্রাথমিক ব্যবহার | গুরুত্বপূর্ণ ফিল্ড ও কনস্ট্রেইন্ট |
|---|---|---|
| `profiles` | ইউজার প্রোফাইল ও থিম সেটিংস | `preferred_theme`, `preferred_accent` |
| `messes` | মেসের সেটিংস | `currency_code` (BDT), `breakfast_meal_value` (default 0.50) |
| `mess_memberships` | পারমিশন ও রোল ম্যাপিং | `role`: 'owner', 'manager', 'member' |
| `members` | মেসের ডিরেক্টরি | `mobile`, `whatsapp` (`text` টাইপ যেন `017...` অক্ষত থাকে) |
| `monthly_periods` | মাসের লক ও হিসাব স্ট্যাটাস | `status`: 'open', 'review', 'closed', 'locked' |
| `meal_entries` | মিলের হিসাব | `meal_count` (`numeric(6,2)`), `unique(member_id, meal_date, meal_type)` |
| `market_assignments`| বাজার বণ্টন | `assignment_date`, `status` ('assigned', 'completed', 'swapped') |
| `deposits` | মেম্বারদের জমার ভাউচার | `payment_method` ('cash', 'bkash', 'nagad', 'bank') |
| `expenses` | বাজারের খরচ ও অন্যান্য বিল | `include_in_meal_rate` (true/false) |
| `audit_logs` | সকল পরিবর্তনের হিস্ট্রি | `actor_user_id`, `action`, `summary` (JSONB) |

---

## 2. মূল গাণিতিক হিসাবের সূত্র (Settlement Formula)
ওয়েবসাইট ব্যাকএন্ডে বা ক্যালকুলেশন মডিউলে নিচের নিয়ম হুবহু অনুসরণ করতে হবে:

1. **মোট মিল সংখ্যা ($M_{total}$)**:
   $$M_{total} = \sum (\text{সকল মেম্বারের মোট মিল})$$
2. **মিল সম্পর্কিত মোট খরচ ($E_{meal}$)**:
   $$E_{meal} = \sum (\text{যেসব খরচে } include\_in\_meal\_rate = true)$$
3. **মিল রেট ($R$)**:
   $$R = \frac{E_{meal}}{M_{total}} \quad (\text{যদি } M_{total} > 0 \text{ হয়, অন্যথায় } 0)$$
4. **মেম্বারের মিল বাবদ খরচ ($C_i$)**:
   $$C_i = M_i \times R$$
5. **মেম্বারের ফাইনাল ব্যালেন্স ($B_i$)**:
   $$B_i = \text{Deposits}_i - C_i - \text{Individual Charges}_i$$
   - $B_i > 0$ হলে: মেম্বার মেসে টাকা পাবে (Credit / Advance)।
   - $B_i < 0$ হলে: মেম্বারের কাছে মেস টাকা পাবে (Due / বকেয়া)।

---

## 3. Server Actions ও API নিয়ম
- ক্লায়েন্ট সাইড থেকে পাঠানো কোনো মোট টাকার হিসাব অন্ধভাবে বিশ্বাস করা যাবে না।
- ডেটা ইনসার্ট বা আপডেটের আগে Zod স্কিমা দিয়ে ইনপুট ভ্যালিডেশন বাধ্যতামূলক।
- মান্থলি ক্লোজিংয়ের জন্য Supabase RPC (PostgreSQL Transaction) ব্যবহার করতে হবে যাতে একই সাথে পিরিয়ড লক এবং অডিট হিস্ট্রি রেকর্ড হয়।
