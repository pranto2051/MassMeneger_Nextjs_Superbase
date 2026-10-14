export type MessRole = 'owner' | 'manager' | 'member';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'total' | 'other';
export type MealInputMode = 'detailed' | 'direct_total';
export type PeriodStatus = 'open' | 'review' | 'closed' | 'locked';
export type ExpenseCategory = 'market' | 'utilities' | 'rent' | 'internet' | 'cleaning' | 'repair' | 'other';
export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'bank' | 'other';
export type ThemeMode = 'dark' | 'light' | 'system';
export type Language = 'bn' | 'en';

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  role: MessRole;
}

export interface Mess {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  currencyCode: string;
  timezone: string;
  breakfastMealValue: number;
  enableBreakfast: boolean;
  enableLunch: boolean;
  enableDinner: boolean;
  mealInputMode: MealInputMode;
  defaultMarketDays?: number;
  createdAt: string;
}

export interface Member {
  id: string;
  messId: string;
  userId?: string;
  memberCode?: string;
  name: string;
  nickname?: string;
  roomNo?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  joiningDate: string;
  leavingDate?: string;
  isActive: boolean;
  role: MessRole;
  profileNote?: string;
}

export interface MealEntry {
  id: string;
  messId: string;
  memberId: string;
  mealDate: string; // YYYY-MM-DD
  mealType: MealType;
  mealCount: number; // 0, 0.5, 1, 2, 3 etc.
  note?: string;
  updatedAt?: string;
}

export interface MarketAssignment {
  id: string;
  messId: string;
  memberId: string;
  assignmentDate: string; // YYYY-MM-DD
  endDate?: string;
  daysCount?: number;
  slotLabel: string;
  sortOrder: number;
  status: 'assigned' | 'completed' | 'swapped' | 'cancelled';
  note?: string;
}

export interface Deposit {
  id: string;
  messId: string;
  memberId: string;
  amount: number;
  depositDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  referenceNote?: string;
  createdAt?: string;
}

export interface Expense {
  id: string;
  messId: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  expenseDate: string; // YYYY-MM-DD
  paidByMemberId?: string;
  includeInMealRate: boolean;
  receiptPath?: string;
  note?: string;
  createdAt?: string;
}

export interface MonthlyPeriod {
  id: string;
  messId: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
  status: PeriodStatus;
  totalMeals?: number;
  eligibleExpenses?: number;
  mealRate?: number;
  notes?: string;
  closedAt?: string;
  closedBy?: string;
}

export interface MemberMonthlyStatement {
  memberId: string;
  memberName: string;
  roomNo?: string;
  mobile?: string;
  totalMeals: number;
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  mealCost: number;
  totalDeposits: number;
  individualExpenses: number;
  netBalance: number; // positive = surplus (mess owes member), negative = due (member owes mess)
}

export interface CalculationResult {
  totalMeals: number;
  eligibleMealExpenses: number;
  fixedSharedExpenses: number;
  totalExpenses: number;
  totalDeposits: number;
  mealRate: number;
  statements: MemberMonthlyStatement[];
}

export type MainTabType = 'home' | 'meals' | 'market' | 'accounts' | 'profile';
