import { Member, MealEntry, MarketAssignment, Deposit, Expense, MonthlyPeriod, Mess } from '@/types';

export const initialMess: Mess = {
  id: 'mess-001',
  name: 'শান্তিনীড় মেস (Shantinir Mess)',
  address: 'বাড়ি নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা',
  phone: '01711223344',
  currencyCode: 'BDT',
  timezone: 'Asia/Dhaka',
  breakfastMealValue: 0.5,
  enableBreakfast: true,
  enableLunch: true,
  enableDinner: true,
  mealInputMode: 'detailed',
  defaultMarketDays: 3,
  createdAt: '2026-01-01T00:00:00Z',
};

export const initialMembers: Member[] = [
  {
    id: 'mem-1',
    messId: 'mess-001',
    name: 'তানভীর আহমেদ প্রanto',
    nickname: 'প্রanto',
    roomNo: '301',
    mobile: '01712345678',
    whatsapp: '01712345678',
    email: 'pranto@example.com',
    joiningDate: '2026-01-01',
    isActive: true,
    role: 'owner',
    profileNote: 'মেস ম্যানেজার ও কোষাধ্যক্ষ',
  },
  {
    id: 'mem-2',
    messId: 'mess-001',
    name: 'রাফসান জামিল',
    nickname: 'রাফসান',
    roomNo: '301',
    mobile: '01812345679',
    whatsapp: '01812345679',
    email: 'rafsan@example.com',
    joiningDate: '2026-01-05',
    isActive: true,
    role: 'manager',
    profileNote: 'সহকারী ম্যানেজার',
  },
  {
    id: 'mem-3',
    messId: 'mess-001',
    name: 'সাকিব আল হাসান',
    nickname: 'সাকিব',
    roomNo: '302',
    mobile: '01912345680',
    whatsapp: '01912345680',
    joiningDate: '2026-01-10',
    isActive: true,
    role: 'member',
  },
  {
    id: 'mem-4',
    messId: 'mess-001',
    name: 'মেহেদী হাসান শুভ',
    nickname: 'শুভ',
    roomNo: '302',
    mobile: '01612345681',
    whatsapp: '01612345681',
    joiningDate: '2026-01-15',
    isActive: true,
    role: 'member',
  },
  {
    id: 'mem-5',
    messId: 'mess-001',
    name: 'আরিফুল ইসলাম',
    nickname: 'আরিফ',
    roomNo: '303',
    mobile: '01512345682',
    whatsapp: '01512345682',
    joiningDate: '2026-02-01',
    isActive: true,
    role: 'member',
  },
  {
    id: 'mem-6',
    messId: 'mess-001',
    name: 'হাসিবুর রহমান',
    nickname: 'হাসিব',
    roomNo: '303',
    mobile: '01312345683',
    whatsapp: '01312345683',
    joiningDate: '2026-02-05',
    isActive: true,
    role: 'member',
  },
];

// Helper to generate current month dates
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
const pad = (n: number) => String(n).padStart(2, '0');

export const generateSampleMealEntries = (): MealEntry[] => {
  const entries: MealEntry[] = [];
  
  // Current month (October 2026): 10 days
  for (let day = 1; day <= 10; day++) {
    const dateStr = `2026-10-${pad(day)}`;
    initialMembers.forEach((m) => {
      entries.push({
        id: `meal-${m.id}-${dateStr}-bf`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'breakfast',
        mealCount: 0.5,
      });
      entries.push({
        id: `meal-${m.id}-${dateStr}-lu`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'lunch',
        mealCount: 1,
      });
      entries.push({
        id: `meal-${m.id}-${dateStr}-di`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'dinner',
        mealCount: 1,
      });
    });
  }

  // Previous month 1 (September 2026): 12 days
  for (let day = 1; day <= 12; day++) {
    const dateStr = `2026-09-${pad(day)}`;
    initialMembers.forEach((m, idx) => {
      entries.push({
        id: `meal-${m.id}-${dateStr}-bf`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'breakfast',
        mealCount: idx % 2 === 0 ? 0.5 : 1,
      });
      entries.push({
        id: `meal-${m.id}-${dateStr}-lu`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'lunch',
        mealCount: 1,
      });
      entries.push({
        id: `meal-${m.id}-${dateStr}-di`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'dinner',
        mealCount: 1,
      });
    });
  }

  // Previous month 2 (August 2026): 11 days
  for (let day = 1; day <= 11; day++) {
    const dateStr = `2026-08-${pad(day)}`;
    initialMembers.forEach((m) => {
      entries.push({
        id: `meal-${m.id}-${dateStr}-lu`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'lunch',
        mealCount: 1,
      });
      entries.push({
        id: `meal-${m.id}-${dateStr}-di`,
        messId: 'mess-001',
        memberId: m.id,
        mealDate: dateStr,
        mealType: 'dinner',
        mealCount: 1,
      });
    });
  }

  return entries;
};

export const initialMarketAssignments: MarketAssignment[] = [
  {
    id: 'mkt-1',
    messId: 'mess-001',
    memberId: 'mem-1',
    assignmentDate: `2026-10-01`,
    endDate: `2026-10-03`,
    daysCount: 3,
    slotLabel: 'সকালের বড় বাজার ও তরকারি',
    sortOrder: 1,
    status: 'completed',
    note: 'মাছ ও তরকারি কেনা হয়েছে',
  },
  {
    id: 'mkt-2',
    messId: 'mess-001',
    memberId: 'mem-2',
    assignmentDate: `2026-10-04`,
    endDate: `2026-10-06`,
    daysCount: 3,
    slotLabel: 'মুদি বাজার ও মসলা',
    sortOrder: 2,
    status: 'completed',
    note: 'চাল, ডাল, তেল ও মসলা',
  },
  {
    id: 'mkt-3',
    messId: 'mess-001',
    memberId: 'mem-3',
    assignmentDate: `2026-10-07`,
    endDate: `2026-10-09`,
    daysCount: 3,
    slotLabel: 'মাংস ও সবজি বাজার',
    sortOrder: 3,
    status: 'completed',
  },
  {
    id: 'mkt-4',
    messId: 'mess-001',
    memberId: 'mem-4',
    assignmentDate: `2026-10-10`,
    endDate: `2026-10-12`,
    daysCount: 3,
    slotLabel: 'সাপ্তাহিক বাজার',
    sortOrder: 4,
    status: 'assigned',
    note: 'কারওয়ান বাজার থেকে কেনাকাটা',
  },
  {
    id: 'mkt-5',
    messId: 'mess-001',
    memberId: 'mem-5',
    assignmentDate: `2026-10-13`,
    endDate: `2026-10-15`,
    daysCount: 3,
    slotLabel: 'সবজি ও ডিম',
    sortOrder: 5,
    status: 'assigned',
  },
  {
    id: 'mkt-6',
    messId: 'mess-001',
    memberId: 'mem-6',
    assignmentDate: `2026-10-16`,
    endDate: `2026-10-18`,
    daysCount: 3,
    slotLabel: 'মাছ বাজার ও মুরগি',
    sortOrder: 6,
    status: 'assigned',
  },
];

export const initialDeposits: Deposit[] = [
  // October 2026 Deposits
  {
    id: 'dep-1',
    messId: 'mess-001',
    memberId: 'mem-1',
    amount: 3000,
    depositDate: `2026-10-01`,
    paymentMethod: 'cash',
    referenceNote: 'মাসের প্রাথমিক অগ্রিম জমা',
  },
  {
    id: 'dep-2',
    messId: 'mess-001',
    memberId: 'mem-2',
    amount: 3000,
    depositDate: `2026-10-01`,
    paymentMethod: 'bkash',
    referenceNote: 'বিকাশ TrxID: 9X82KD71L',
  },
  {
    id: 'dep-3',
    messId: 'mess-001',
    memberId: 'mem-3',
    amount: 2500,
    depositDate: `2026-10-02`,
    paymentMethod: 'nagad',
    referenceNote: 'নগদ ক্যাশ ইন',
  },
  {
    id: 'dep-4',
    messId: 'mess-001',
    memberId: 'mem-4',
    amount: 3000,
    depositDate: `2026-10-02`,
    paymentMethod: 'bank',
    referenceNote: 'City Bank Transfer',
  },
  {
    id: 'dep-5',
    messId: 'mess-001',
    memberId: 'mem-5',
    amount: 2000,
    depositDate: `2026-10-03`,
    paymentMethod: 'cash',
  },
  {
    id: 'dep-6',
    messId: 'mess-001',
    memberId: 'mem-6',
    amount: 3000,
    depositDate: `2026-10-03`,
    paymentMethod: 'bkash',
  },

  // September 2026 Deposits
  {
    id: 'dep-sep-1',
    messId: 'mess-001',
    memberId: 'mem-1',
    amount: 3200,
    depositDate: `2026-09-01`,
    paymentMethod: 'cash',
    referenceNote: 'সেপ্টেম্বর অগ্রিম জমা',
  },
  {
    id: 'dep-sep-2',
    messId: 'mess-001',
    memberId: 'mem-2',
    amount: 3000,
    depositDate: `2026-09-01`,
    paymentMethod: 'bkash',
  },
  {
    id: 'dep-sep-3',
    messId: 'mess-001',
    memberId: 'mem-3',
    amount: 3000,
    depositDate: `2026-09-02`,
    paymentMethod: 'nagad',
  },
  {
    id: 'dep-sep-4',
    messId: 'mess-001',
    memberId: 'mem-4',
    amount: 2800,
    depositDate: `2026-09-02`,
    paymentMethod: 'bank',
  },
  {
    id: 'dep-sep-5',
    messId: 'mess-001',
    memberId: 'mem-5',
    amount: 2500,
    depositDate: `2026-09-03`,
    paymentMethod: 'cash',
  },
  {
    id: 'dep-sep-6',
    messId: 'mess-001',
    memberId: 'mem-6',
    amount: 3000,
    depositDate: `2026-09-03`,
    paymentMethod: 'bkash',
  },

  // August 2026 Deposits
  {
    id: 'dep-aug-1',
    messId: 'mess-001',
    memberId: 'mem-1',
    amount: 2800,
    depositDate: `2026-08-01`,
    paymentMethod: 'cash',
  },
  {
    id: 'dep-aug-2',
    messId: 'mess-001',
    memberId: 'mem-2',
    amount: 2800,
    depositDate: `2026-08-01`,
    paymentMethod: 'bkash',
  },
  {
    id: 'dep-aug-3',
    messId: 'mess-001',
    memberId: 'mem-3',
    amount: 2800,
    depositDate: `2026-08-02`,
    paymentMethod: 'nagad',
  },
  {
    id: 'dep-aug-4',
    messId: 'mess-001',
    memberId: 'mem-4',
    amount: 2800,
    depositDate: `2026-08-02`,
    paymentMethod: 'bank',
  },
  {
    id: 'dep-aug-5',
    messId: 'mess-001',
    memberId: 'mem-5',
    amount: 2500,
    depositDate: `2026-08-03`,
    paymentMethod: 'cash',
  },
  {
    id: 'dep-aug-6',
    messId: 'mess-001',
    memberId: 'mem-6',
    amount: 2800,
    depositDate: `2026-08-03`,
    paymentMethod: 'bkash',
  },
];

export const initialExpenses: Expense[] = [
  // October 2026 Expenses
  {
    id: 'exp-1',
    messId: 'mess-001',
    category: 'market',
    title: 'রুই মাছ, মুরগি ও সবজি বাজার',
    amount: 3450,
    expenseDate: `2026-10-02`,
    paidByMemberId: 'mem-1',
    includeInMealRate: true,
    note: 'কারওয়ান বাজার মেমো নং ৮২',
  },
  {
    id: 'exp-2',
    messId: 'mess-001',
    category: 'market',
    title: 'মিনিকেট চাল ৫০ কেজি বস্তা ও সয়াবিন তেল ৫ লিটার',
    amount: 4300,
    expenseDate: `2026-10-05`,
    paidByMemberId: 'mem-2',
    includeInMealRate: true,
    note: 'ভাই ভাই স্টোর',
  },
  {
    id: 'exp-3',
    messId: 'mess-001',
    category: 'market',
    title: 'গরুর মাংস ৩ কেজি ও মসলা সামগ্রী',
    amount: 2850,
    expenseDate: `2026-10-08`,
    paidByMemberId: 'mem-3',
    includeInMealRate: true,
  },
  {
    id: 'exp-4',
    messId: 'mess-001',
    category: 'internet',
    title: 'ওয়াইফাই ব্রডব্যান্ড ইন্টারনেট বিল (অক্টোবর)',
    amount: 1200,
    expenseDate: `2026-10-05`,
    paidByMemberId: 'mem-1',
    includeInMealRate: false,
    note: 'AmberIT বিল',
  },
  {
    id: 'exp-5',
    messId: 'mess-001',
    category: 'cleaning',
    title: 'খালা বিল (রান্না ও পরিষ্কার-পরিচ্ছন্নতা)',
    amount: 3000,
    expenseDate: `2026-10-07`,
    paidByMemberId: 'mem-1',
    includeInMealRate: false,
    note: 'সবার মাঝে সমান বণ্টন হবে',
  },

  // September 2026 Expenses
  {
    id: 'exp-sep-1',
    messId: 'mess-001',
    category: 'market',
    title: 'মাসিক চাল ও তেল মুদি সামগ্রী',
    amount: 4500,
    expenseDate: `2026-09-03`,
    paidByMemberId: 'mem-1',
    includeInMealRate: true,
  },
  {
    id: 'exp-sep-2',
    messId: 'mess-001',
    category: 'market',
    title: 'মাছ, মাংস ও ডিমের পাইকারি বাজার',
    amount: 4800,
    expenseDate: `2026-09-08`,
    paidByMemberId: 'mem-4',
    includeInMealRate: true,
  },
  {
    id: 'exp-sep-3',
    messId: 'mess-001',
    category: 'market',
    title: 'শাকসবজি ও প্রয়োজনীয় মসলাপাতি',
    amount: 2200,
    expenseDate: `2026-09-12`,
    paidByMemberId: 'mem-5',
    includeInMealRate: true,
  },
  {
    id: 'exp-sep-4',
    messId: 'mess-001',
    category: 'internet',
    title: 'ওয়াইফাই ইন্টারনেট বিল (সেপ্টেম্বর)',
    amount: 1200,
    expenseDate: `2026-09-05`,
    paidByMemberId: 'mem-1',
    includeInMealRate: false,
  },
  {
    id: 'exp-sep-5',
    messId: 'mess-001',
    category: 'cleaning',
    title: 'খালা বিল (সেপ্টেম্বর)',
    amount: 3000,
    expenseDate: `2026-09-06`,
    paidByMemberId: 'mem-1',
    includeInMealRate: false,
  },

  // August 2026 Expenses
  {
    id: 'exp-aug-1',
    messId: 'mess-001',
    category: 'market',
    title: 'চাল ও ডাল সামগ্রী বাজার',
    amount: 4200,
    expenseDate: `2026-08-04`,
    paidByMemberId: 'mem-2',
    includeInMealRate: true,
  },
  {
    id: 'exp-aug-2',
    messId: 'mess-001',
    category: 'market',
    title: 'মাংস, ডিম ও মাছ বাজার',
    amount: 5100,
    expenseDate: `2026-08-09`,
    paidByMemberId: 'mem-3',
    includeInMealRate: true,
  },
  {
    id: 'exp-aug-3',
    messId: 'mess-001',
    category: 'internet',
    title: 'ইন্টারনেট বিল (আগস্ট)',
    amount: 1200,
    expenseDate: `2026-08-05`,
    paidByMemberId: 'mem-1',
    includeInMealRate: false,
  },
  {
    id: 'exp-aug-4',
    messId: 'mess-001',
    category: 'cleaning',
    title: 'খালা বিল (আগস্ট)',
    amount: 3000,
    expenseDate: `2026-08-06`,
    paidByMemberId: 'mem-1',
    includeInMealRate: false,
  },
];

export const initialPeriod: MonthlyPeriod = {
  id: 'period-2026-10',
  messId: 'mess-001',
  periodStart: `2026-10-01`,
  periodEnd: `2026-10-31`,
  status: 'open',
  notes: 'অক্টোবর ২০২৬ চলতি হিসাব মাস',
};

