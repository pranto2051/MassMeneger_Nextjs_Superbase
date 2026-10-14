export type MessRole = 'owner' | 'manager' | 'member';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'total' | 'other';
export type MealInputMode = 'detailed' | 'direct_total';
export type PeriodStatus = 'open' | 'review' | 'closed' | 'locked';
export type ExpenseCategory = 'market' | 'utilities' | 'rent' | 'internet' | 'cleaning' | 'repair' | 'other';
export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'bank' | 'other';
export type ThemeMode = 'day' | 'night' | 'system';
export type AccentPreset = 'blue' | 'red' | 'green' | 'purple' | 'yellow' | 'teal' | 'rose' | 'orange';
export type DensityMode = 'comfortable' | 'compact';

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  preferredTheme: ThemeMode;
  preferredAccent: AccentPreset;
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
  mealCount: number; // 0, 0.5, 1, 1.5, etc.
  note?: string;
  updatedAt?: string;
}

export interface MarketAssignment {
  id: string;
  messId: string;
  memberId: string;
  assignmentDate: string; // YYYY-MM-DD (start date)
  endDate?: string; // YYYY-MM-DD (end date)
  daysCount?: number; // e.g. 3, 4, 5, 10
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
  netBalance: number; // positive = credit/surplus (will receive), negative = due (owes)
}

export interface AuditLog {
  id: string;
  messId: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  summary: Record<string, any>;
  createdAt: string;
}
