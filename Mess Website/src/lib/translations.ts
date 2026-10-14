export type Language = 'bn' | 'en';

export interface MonthOption {
  value: string; // YYYY-MM
  labelBn: string;
  labelEn: string;
  status: 'open' | 'closed' | 'locked';
}

export const availableMonthsList: MonthOption[] = [
  { value: '2026-10', labelBn: 'অক্টোবর ২০২৬ (চলতি মাস)', labelEn: 'October 2026 (Current)', status: 'open' },
  { value: '2026-09', labelBn: 'সেপ্টেম্বর ২০২৬ (আগের মাস)', labelEn: 'September 2026 (Previous)', status: 'locked' },
  { value: '2026-08', labelBn: 'আগস্ট ২০২৬ (আগের মাস)', labelEn: 'August 2026 (Previous)', status: 'locked' },
  { value: '2026-07', labelBn: 'জুলাই ২০২৬', labelEn: 'July 2026', status: 'closed' },
  { value: '2026-06', labelBn: 'জুন ২০২৬', labelEn: 'June 2026', status: 'closed' },
  { value: '2026-05', labelBn: 'মে ২০২৬', labelEn: 'May 2026', status: 'closed' },
];

export const getMonthLabel = (monthVal: string, lang: Language): string => {
  const found = availableMonthsList.find((m) => m.value === monthVal);
  if (found) {
    return lang === 'bn' ? found.labelBn.split(' (')[0] : found.labelEn.split(' (')[0];
  }
  // Fallback parsing YYYY-MM
  const [y, m] = monthVal.split('-');
  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const idx = parseInt(m, 10) - 1;
  if (idx >= 0 && idx < 12) {
    return lang === 'bn' ? `${monthNamesBn[idx]} ${y}` : `${monthNamesEn[idx]} ${y}`;
  }
  return monthVal;
};

export const translations: Record<string, { bn: string; en: string }> = {
  // Brand & Navigation
  appName: { bn: 'মেস ম্যানেজার', en: 'Mess Manager' },
  dashboard: { bn: 'ড্যাশবোর্ড', en: 'Dashboard' },
  members: { bn: 'মেম্বার ডিরেক্টরি', en: 'Members Directory' },
  meals: { bn: 'বাল্ক মিল এন্ট্রি', en: 'Bulk Meals' },
  market: { bn: 'বাজার শিডিউলার', en: 'Market Schedule' },
  accounts: { bn: 'জমা ও খরচ (Accounts)', en: 'Accounts & Deposits' },
  settlement: { bn: 'মান্থলি সেটলমেন্ট', en: 'Monthly Settlement' },
  reports: { bn: 'রিপোর্ট ও প্রিন্ট', en: 'Reports & Print' },
  settings: { bn: 'মেস সেটিংস', en: 'Mess Settings' },

  // Header & Controls
  rate: { bn: 'রেট', en: 'Rate' },
  language: { bn: 'ভাষা', en: 'Language' },
  currentMonth: { bn: 'চলতি মাস', en: 'Current Month' },
  changeMonth: { bn: 'মাস পরিবর্তন', en: 'Change Month' },
  localMode: { bn: 'Local', en: 'Local' },
  cloudMode: { bn: 'Supabase', en: 'Supabase' },
  dayMode: { bn: 'ডে মোড', en: 'Day Mode' },
  nightMode: { bn: 'নাইট মোড', en: 'Night Mode' },
  comfortable: { bn: 'স্বাচ্ছন্দ্যময়', en: 'Comfortable' },
  compact: { bn: 'কমপ্যাক্ট', en: 'Compact' },

  // Reports Page
  officialReports: { bn: 'অফিসিয়াল রিপোর্ট ও প্রিন্ট (Reports)', en: 'Official Reports & Print' },
  reportsSubtitle: {
    bn: 'A4 ফরম্যাটে মেসের মাসিক পূর্ণাঙ্গ শিট, নতুন গ্রিড মোডে প্রত্যেক সদস্যের কার্ড ও একক হিসেব ডাউনলোড করুন।',
    en: 'Download or print A4 format mess monthly audit sheet, member cards in grid mode, and individual slips.',
  },
  wholeMessReport: { bn: 'মেসের রিপোর্ট', en: 'Mess Report' },
  memberStatement: { bn: 'সদস্যের স্টেটমেন্ট', en: 'Member Statement' },
  tableView: { bn: 'টেবিল ভিউ', en: 'Table View' },
  gridMode: { bn: 'গ্রিড মোড', en: 'Grid Mode' },
  printButton: { bn: 'PDF / প্রিন্ট করুন', en: 'PDF / Print' },
  gridActiveBadge: { bn: 'গ্রিড মোড সক্রিয়', en: 'Grid Mode Active' },
  gridHint: {
    bn: '💡 যেকোনো মেম্বার কার্ডে ক্লিক করুন — তার পূর্ণাঙ্গ হিসাব, বাজার খরচ, পিডিএফ অথবা ছবি আকারে ডাউনলোড করুন।',
    en: '💡 Click any member card to view detailed breakdown, market shopping expenses, and download PDF or image.',
  },
  totalMembersCount: { bn: 'জন সদস্য', en: 'Members' },

  // Stats
  totalMeals: { bn: 'মোট খাওয়া মিল', en: 'Total Meals' },
  marketExpensesMealRate: { bn: 'বাজার খরচ (মিল রেটে)', en: 'Market Expenses (Meal Rate)' },
  finalMealRate: { bn: 'চূড়ান্ত মিল রেট', en: 'Final Meal Rate' },
  totalCollectedDeposits: { bn: 'মোট সংগৃহীত জমা', en: 'Total Collected Deposits' },

  // Table Headers
  serial: { bn: 'ক্রমিক', en: 'SL' },
  memberName: { bn: 'সদস্যের নাম', en: 'Member Name' },
  room: { bn: 'রুম', en: 'Room' },
  mealRate: { bn: 'মিল রেট', en: 'Meal Rate' },
  mealCost: { bn: 'মিলের খরচ (৳)', en: 'Meal Cost (৳)' },
  fixedCost: { bn: 'ফিক্সড খরচ (৳)', en: 'Fixed Cost (৳)' },
  totalDeposits: { bn: 'মোট জমা (৳)', en: 'Total Deposits (৳)' },
  finalBalance: { bn: 'ফাইনাল ব্যালেন্স (৳)', en: 'Final Balance (৳)' },
  action: { bn: 'অ্যাকশন', en: 'Action' },
  viewSlip: { bn: 'রিপোর্ট স্লিপ', en: 'View Slip' },

  // Settlement Statuses
  surplusMessWillPay: { bn: 'মেস ফেরত দেবে', en: 'Payable by Mess' },
  dueMemberWillPay: { bn: 'মেসে জমা দেবে', en: 'Due from Member' },
  receivable: { bn: 'পাবে', en: 'Receivable' },
  due: { bn: 'বকেয়া', en: 'Due' },

  // Card & Modal Details
  marketDoneByMember: { bn: 'সে বাজার করছে কত', en: 'Market Paid by Member' },
  timesMarket: { bn: 'টি বাজার করেছেন', en: 'Shopping Trips' },
  noMarketThisMonth: { bn: 'কোনো বাজার করেননি', en: 'No market trips' },
  clickToViewReport: { bn: 'ক্লিক করে রিপোর্ট দেখুন', en: 'Click to view report' },
  fullVoucher: { bn: 'পূর্ণাঙ্গ ভাউচার', en: 'Full Voucher' },
  downloadImageBtn: { bn: 'ছবি ডাউনলোড (PNG)', en: 'Download Image (PNG)' },
  downloadPdfBtn: { bn: 'PDF ডাউনলোড', en: 'Download PDF' },
  printSlipBtn: { bn: 'প্রিন্ট', en: 'Print' },
  auditSlipTitle: { bn: 'সদস্যের একক মাসিক হিসাব বিবরণী ও অডিট স্লিপ', en: 'Member Monthly Audit & Settlement Slip' },
  accountMonth: { bn: 'হিসাবের মাস', en: 'Account Month' },
  generatedOn: { bn: 'জেনারেট', en: 'Generated' },
  roleManager: { bn: 'ম্যানেজার', en: 'Manager' },
  roleOwner: { bn: 'মালিক', en: 'Owner' },
  roleMember: { bn: 'সদস্য', en: 'Member' },
  statusActive: { bn: 'সক্রিয়', en: 'Active' },
  formulaLedger: { bn: 'স্বচ্ছ গাণিতিক হিসাব বিবরণী (Math Formula & Ledger)', en: 'Transparent Mathematical Ledger' },
  formulaNote: { bn: 'ব্যালেন্স = জমা - (মিল খরচ + ফিক্সড খরচ)', en: 'Balance = Deposit - (Meal Cost + Fixed Cost)' },
  totalDepositsPlus: { bn: '১. সদস্য কর্তৃক মেস ফান্ডে মোট জমা টাকা (+)', en: '1. Total deposits contributed to mess fund (+)' },
  mealCostMinus: { bn: '২. খাওয়া মিল বাবদ খাবার খরচ (-)', en: '2. Meal cost for consumed meals (-)' },
  fixedCostMinus: { bn: '৩. মাথাপিছু শেয়ার্ড / ফিক্সড খরচ (-)', en: '3. Shared fixed charges (utilities/cook) (-)' },
  marketCreditNote: { bn: '* তথ্যসূত্র: সদস্য নিজ হাতে মেসের বাজার করেছেন (বাজার বিল মেস ফান্ড থেকে সমন্বয় করা হয়েছে)', en: '* Note: Member personally shopped for mess (market bill reconciled from mess fund)' },
  finalNetBalance: { bn: 'ফাইনাল নিট ব্যালেন্স', en: 'Final Net Balance' },
  marketListTitle: { bn: 'সদস্য কর্তৃক কৃত বাজার ও খরচের তালিকা', en: 'Market & Expenses Paid by Member' },
  depositHistoryTitle: { bn: 'টাকা জমা দেওয়ার হিস্ট্রি (Deposit Records)', en: 'Deposit Records History' },
  managerSign: { bn: 'মেস ম্যানেজারের স্বাক্ষর', en: 'Mess Manager Signature' },
  memberSign: { bn: 'সদস্যের স্বাক্ষর ও তারিখ', en: 'Member Signature & Date' },
  verifiedAuditStamp: { bn: 'অফিসিয়ালি নিরীক্ষিত ও চূড়ান্ত হিসাব', en: 'Officially Audited & Verified' },
};
