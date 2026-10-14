# Database Contract & API Reference for Mobile Developers (Mess Apps)

মোবাইল অ্যাপ সরাসরি Supabase JavaScript Client ব্যবহার করে PostgreSQL ডাটাবেজে অ্যাক্সেস করবে। নিচে অ্যাপের প্রয়োজনীয় টেবিল ও ফিল্ডগুলোর বিবরণ দেওয়া হলো:

---

## 1. মূল টেবিলসমূহ ও ফিল্ডস

### ০. `messes` (মেসের কনফিগারেশন)
- `id` (uuid, Primary Key)
- `name` (text, মেসের নাম)
- `breakfast_meal_value` (numeric, default 0.50)
- `enable_breakfast` (boolean, সকালের নাশতা সক্রিয় কি না)
- `enable_lunch` (boolean, দুপুরের খাবার সক্রিয় কি না)
- `enable_dinner` (boolean, রাতের খাবার সক্রিয় কি না)
- `meal_input_mode` (text: `'detailed'` অথবা `'direct_total'`)

### ১. `members` (মেম্বার প্রোফাইল ও ডিরেক্টরি)
- `id` (uuid, Primary Key)
- `mess_id` (uuid, Foreign Key -> messes)
- `user_id` (uuid, Foreign Key -> auth.users)
- `name` (text, নাম)
- `nickname` (text, ডাকনাম)
- `room_no` (text, রুম নম্বর)
- `mobile` (text, মোবাইল নম্বর, e.g. "01712345678")
- `whatsapp` (text, হোয়াটসঅ্যাপ নম্বর)
- `is_active` (boolean, সদস্য সক্রিয় আছে কি না)

### ২. `meal_entries` (মিল এন্ট্রি)
- `id` (uuid, Primary Key)
- `mess_id` (uuid)
- `member_id` (uuid)
- `meal_date` (date, YYYY-MM-DD)
- `meal_type` (enum: `'breakfast'`, `'lunch'`, `'dinner'`, `'total'`, `'other'`)
- `meal_count` (numeric, e.g. 0, 0.5, 1, 2, 3)
- `note` (text)

### ৩. `market_assignments` (বাজার শিডিউল)
- `id` (uuid, Primary Key)
- `mess_id` (uuid)
- `member_id` (uuid)
- `assignment_date` (date)
- `status` (text: `'assigned'`, `'completed'`, `'swapped'`, `'cancelled'`)
- `note` (text)

### ৪. `deposits` (মেম্বারদের টাকা জমা)
- `id` (uuid, Primary Key)
- `mess_id` (uuid)
- `member_id` (uuid)
- `amount` (numeric)
- `deposit_date` (date)
- `payment_method` (text: `'cash'`, `'bank'`, `'mobile_banking'`, `'other'`)

### ৫. `expenses` (বাজার ও অন্যান্য খরচ)
- `id` (uuid, Primary Key)
- `mess_id` (uuid)
- `category` (enum: `'market'`, `'utilities'`, `'rent'`, `'internet'`, `'cleaning'`, `'repair'`, `'other'`)
- `title` (text)
- `amount` (numeric)
- `expense_date` (date)
- `paid_by_member_id` (uuid)
- `include_in_meal_rate` (boolean)
- `receipt_path` (text, Supabase Storage-এর ছবির পাথ)

---

## 2. মোবাইল অ্যাপের কমন কোয়েরি উদাহরণ

### মেম্বারের আজকের মিল জানা:
```typescript
const { data, error } = await supabase
  .from('meal_entries')
  .select('*')
  .eq('member_id', currentMemberId)
  .eq('meal_date', new Date().toISOString().split('T')[0]);
```

### চলতি মাসের বাজার শিডিউল দেখা:
```typescript
const { data, error } = await supabase
  .from('market_assignments')
  .select(`
    id,
    assignment_date,
    status,
    members ( id, name, room_no, mobile )
  `)
  .eq('mess_id', currentMessId)
  .order('assignment_date', { ascending: true });
```
