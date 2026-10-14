import { Language } from '../types';

export interface MonthOption {
  value: string;
  labelBn: string;
  labelEn: string;
}

export const availableMonthsList: MonthOption[] = [
  { value: '2026-08', labelBn: 'আগস্ট ২০২৬', labelEn: 'August 2026' },
  { value: '2026-09', labelBn: 'সেপ্টেম্বর ২০২৬', labelEn: 'September 2026' },
  { value: '2026-10', labelBn: 'অক্টোবর ২০২৬', labelEn: 'October 2026' },
  { value: '2026-11', labelBn: 'নভেম্বর ২০২৬', labelEn: 'November 2026' },
  { value: '2026-12', labelBn: 'ডিসেম্বর ২০২৬', labelEn: 'December 2026' },
];

export const getMonthLabel = (monthVal: string, lang: Language): string => {
  const match = availableMonthsList.find((m) => m.value === monthVal);
  if (match) {
    return lang === 'bn' ? match.labelBn : match.labelEn;
  }
  return monthVal;
};

export const translations: Record<string, { bn: string; en: string }> = {
  // Navigation & Tabs
  appName: { bn: 'মেস অ্যাপস', en: 'Mess Apps' },
  home: { bn: 'হোম', en: 'Home' },
  meals: { bn: 'মিল', en: 'Meals' },
  market: { bn: 'বাজার', en: 'Market' },
  accounts: { bn: 'হিসাব', en: 'Accounts' },
  profile: { bn: 'প্রোফাইল', en: 'Profile' },
  
  // Quick Actions & Widgets
  quickActions: { bn: 'কুইক অ্যাকশন', en: 'Quick Actions' },
  updateMeal: { bn: 'মিল আপডেট', en: 'Update Meal' },
  recordExpense: { bn: 'বাজার খরচ', en: 'Add Expense' },
  recordDeposit: { bn: 'টাকা জমা', en: 'Add Deposit' },
  myAuditSlip: { bn: 'আমার অডিট স্লিপ', en: 'My Audit Slip' },
  swapMarket: { bn: 'বাজার অদল-বদল', en: 'Swap Duty' },
  
  // Dashboard & Passbook
  personalPassbook: { bn: 'ব্যক্তিগত পাসবুক ব্যালেন্স', en: 'Personal Passbook Balance' },
  surplusCredit: { bn: 'মেস আপনাকে ফেরত দেবে (সারপ্লাস)', en: 'Surplus (Mess owes you)' },
  dueOwed: { bn: 'আপনার মেসে বকেয়া রয়েছে (বকেয়া)', en: 'Due (You owe the mess)' },
  totalDeposits: { bn: 'মোট জমা', en: 'Total Deposited' },
  totalMealCost: { bn: 'খাবার বাবদ খরচ', en: 'Total Meal Cost' },
  fixedSharedCost: { bn: 'মাথাপিছু ফিক্সড খরচ', en: 'Shared Fixed Cost' },
  netBalance: { bn: 'নিট ব্যালেন্স', en: 'Net Balance' },
  
  // Meal Tracking
  mealTracking: { bn: 'মিল ট্র্যাকার ও এন্ট্রি', en: 'Meal Tracking & Entry' },
  todayMealStatus: { bn: 'আজকের মিল স্ট্যাটাস', en: 'Today\'s Meal Status' },
  tomorrowMealStatus: { bn: 'আগামীকালের মিল', en: 'Tomorrow\'s Meal' },
  mealInputMode: { bn: 'মিল ইনপুট পদ্ধতি', en: 'Meal Input Mode' },
  detailedMode: { bn: 'বেলা ভিত্তিক', en: 'Detailed (Shifts)' },
  directTotalMode: { bn: 'ডিরেক্ট টোটাল', en: 'Direct Total' },
  breakfast: { bn: 'সকালের নাশতা', en: 'Breakfast' },
  lunch: { bn: 'দুপুরের খাবার', en: 'Lunch' },
  dinner: { bn: 'রাতের খাবার', en: 'Dinner' },
  totalMealCount: { bn: 'মোট মিল', en: 'Total Meal' },
  quickChips: { bn: 'কুইক বাটন', en: 'Quick Chips' },
  chipOff: { bn: '০ (বন্ধ)', en: '0 (Off)' },
  chipOne: { bn: '১ টি', en: '1 Meal' },
  chipTwo: { bn: '২ টি', en: '2 Meals' },
  chipThree: { bn: '৩ টি', en: '3 Meals' },
  allMembersMeal: { bn: 'সকল মেম্বারের আজকের মিল', en: 'All Members Today Meals' },
  setAllToOne: { bn: 'সবার মিল ১ করুন', en: 'Set All to 1' },
  setAllToZero: { bn: 'সবার মিল ০ করুন', en: 'Set All to 0' },
  
  // Market Schedule
  marketScheduler: { bn: 'বাজার শিডিউলার', en: 'Market Scheduler' },
  todayMarketDuty: { bn: 'আজকের বাজারের দায়িত্ব', en: 'Today\'s Market Duty' },
  tomorrowMarketDuty: { bn: 'আগামীকালের বাজার', en: 'Tomorrow\'s Duty' },
  dutyPerson: { bn: 'দায়িত্বপ্রাপ্ত ব্যক্তি', en: 'Duty Person' },
  callNow: { bn: 'সরাসরি কল', en: 'Call Now' },
  whatsapp: { bn: 'হোয়াটসঅ্যাপ', en: 'WhatsApp' },
  statusAssigned: { bn: 'অ্যাসাইনড', en: 'Assigned' },
  statusCompleted: { bn: 'সম্পন্ন', en: 'Completed' },
  statusSwapped: { bn: 'সোয়াপড', en: 'Swapped' },
  statusCancelled: { bn: 'বাতিল', en: 'Cancelled' },
  autoGenerateSchedule: { bn: 'অটো শিডিউল তৈরি', en: 'Auto Generate' },
  scheduleList: { bn: 'চলতি মাসের বাজার শিডিউল', en: 'Market Schedule' },
  
  // Accounts & Settlement
  mealRate: { bn: 'চলতি মিল রেট', en: 'Current Meal Rate' },
  eligibleExpenses: { bn: 'মিল সংক্রান্ত খরচ (খাবার)', en: 'Meal Eligible Expenses' },
  fixedExpenses: { bn: 'ফিক্সড/শেয়ার্ড খরচ', en: 'Fixed / Overhead Expenses' },
  messCashReserve: { bn: 'মেস রিজার্ভ / নগদ উদ্বৃত্ত', en: 'Mess Reserve / Cash' },
  totalMealsConsumed: { bn: 'মোট খাওয়া মিল', en: 'Total Meals Consumed' },
  periodStatus: { bn: 'সেটলমেন্ট অডিট স্ট্যাটাস', en: 'Settlement Status' },
  lockPeriod: { bn: 'অডিট লক করুন', en: 'Lock Audit' },
  unlockPeriod: { bn: 'অডিট আনলক করুন', en: 'Unlock Audit' },
  
  // Sub-tabs in Accounts
  tabStatements: { bn: 'ব্যালেন্স শিট', en: 'Passbooks' },
  tabDeposits: { bn: 'জমা তালিকা', en: 'Deposits' },
  tabExpenses: { bn: 'বাজার ও অন্যান্য খরচ', en: 'Expenses' },
  addDeposit: { bn: '+ টাকা জমা এন্ট্রি', en: '+ Add Deposit' },
  addExpense: { bn: '+ খরচ ও মেমো এন্ট্রি', en: '+ Add Expense' },
  viewAuditSlip: { bn: 'অডিট স্লিপ দেখুন', en: 'View Slip' },
  
  // Audit Slip
  auditSlipHeader: { bn: 'সদস্যের ডিজিটাল পাসবুক ও অডিট স্লিপ', en: 'Digital Member Audit Slip' },
  verifiedAudit: { bn: 'অফিসিয়ালি ভেরিফাইড মেস স্টেটমেন্ট', en: 'Officially Audited Mess Statement' },
  shareSlip: { bn: 'স্টেটমেন্ট শেয়ার করুন', en: 'Share Statement' },
  close: { bn: 'বন্ধ করুন', en: 'Close' },
  
  // Profile & Members
  profileAndSettings: { bn: 'প্রোফাইল ও সেটিংস', en: 'Profile & Settings' },
  activeProfile: { bn: 'বর্তমান লগইন প্রোফাইল', en: 'Active Profile' },
  switchMember: { bn: 'ইউজার পরিবর্তন', en: 'Switch User' },
  memberDirectory: { bn: 'মেম্বার ডিরেক্টরি', en: 'Member Directory' },
  searchMember: { bn: 'নাম বা রুম দিয়ে খুঁজুন...', en: 'Search by name or room...' },
  addMember: { bn: '+ নতুন মেম্বার', en: '+ Add Member' },
  messSettings: { bn: 'মেস কনফিগারেশন', en: 'Mess Settings' },
  messName: { bn: 'মেসের নাম', en: 'Mess Name' },
  enableBreakfast: { bn: 'সকালের নাশতা সক্রিয়', en: 'Enable Breakfast' },
  enableLunch: { bn: 'দুপুরের খাবার সক্রিয়', en: 'Enable Lunch' },
  enableDinner: { bn: 'রাতের খাবার সক্রিয়', en: 'Enable Dinner' },
  breakfastWeight: { bn: 'নাশতার মিল পয়েন্ট (যেমন: ০.৫০)', en: 'Breakfast Value (e.g. 0.50)' },
  themeMode: { bn: 'অ্যাপ থিম', en: 'App Theme' },
  themeDark: { bn: 'ডার্ক গ্লাস (Dark)', en: 'Dark Glass' },
  themeLight: { bn: 'লাইট গ্লাস (Light)', en: 'Light Glass' },
  language: { bn: 'ভাষা (Language)', en: 'Language' },
  saveChanges: { bn: 'পরিবর্তন সেভ করুন', en: 'Save Changes' },
  
  // Modals & Forms
  save: { bn: 'সংরক্ষণ করুন', en: 'Save' },
  cancel: { bn: 'বাতিল', en: 'Cancel' },
  amount: { bn: 'টাকার পরিমাণ (৳)', en: 'Amount (৳)' },
  date: { bn: 'তারিখ', en: 'Date' },
  member: { bn: 'সদস্য', en: 'Member' },
  category: { bn: 'ক্যাটাগরি', en: 'Category' },
  paymentMethod: { bn: 'পেমেন্ট মাধ্যম', en: 'Payment Method' },
  includeInMealRate: { bn: 'এটি খাবারের খরচ (মিল রেটে যুক্ত হবে)', en: 'Include in Meal Rate (Food expense)' },
  attachReceipt: { bn: 'মেমো / ভাউচারের ছবি', en: 'Attach Receipt / Voucher' },
  takePhoto: { bn: 'ক্যামেরা দিয়ে ছবি তুলুন', en: 'Take Photo' },
  chooseGallery: { bn: 'গ্যালারি থেকে বেছে নিন', en: 'Choose from Gallery' },
  removePhoto: { bn: 'ছবি মুছুন', en: 'Remove Photo' },
  titleOrNote: { bn: 'বিবরণ / শিরোনাম', en: 'Description / Title' },
  roomNo: { bn: 'রুম নম্বর', en: 'Room No' },
  mobileNo: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' },
  whatsappNo: { bn: 'হোয়াটসঅ্যাপ নম্বর', en: 'WhatsApp Number' },
  role: { bn: 'রোল / পদবী', en: 'Role' },
  roleManager: { bn: 'ম্যানেজার', en: 'Manager' },
  roleOwner: { bn: 'মালিক', en: 'Owner' },
  roleMember: { bn: 'সাধারণ সদস্য', en: 'Member' },
  
  // Expense categories
  catMarket: { bn: 'দৈনিক বাজার', en: 'Market' },
  catUtilities: { bn: 'বিদ্যুৎ ও গ্যাস বিল', en: 'Utilities' },
  catRent: { bn: 'বাসা ভাড়া', en: 'House Rent' },
  catInternet: { bn: 'ইন্টারনেট ও ডিশ বিল', en: 'Internet & WiFi' },
  catCleaning: { bn: 'খালা / বুয়ার বিল', en: 'Cook / Maid' },
  catRepair: { bn: 'মেরামত ও রক্ষণাবেক্ষণ', en: 'Repairs' },
  catOther: { bn: 'অন্যান্য খরচ', en: 'Other' },
  
  // Payment methods
  methodCash: { bn: 'নগদ (Cash)', en: 'Cash' },
  methodBkash: { bn: 'বিকাশ (bKash)', en: 'bKash' },
  methodNagad: { bn: 'নগদ ওয়ালেট (Nagad)', en: 'Nagad' },
  methodBank: { bn: 'ব্যাংক ট্রান্সফার', en: 'Bank Transfer' },
};
