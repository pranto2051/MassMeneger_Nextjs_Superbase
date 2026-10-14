import { supabase, isSupabaseConfigured } from './supabase';
import {
  Mess,
  Member,
  MealEntry,
  MarketAssignment,
  Deposit,
  Expense,
  MonthlyPeriod,
  MessRole,
  MealType,
  PaymentMethod,
  ExpenseCategory,
  PeriodStatus,
  MealInputMode,
} from '../types';

export const DEFAULT_MESS_ID = '00000000-0000-0000-0000-000000000001';

// Ensure user is signed in to satisfy RLS policies
export async function ensureAuth() {
  if (!supabase) return null;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      return sessionData.session;
    }
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'pranto@example.com',
      password: 'Password123!',
    });
    return authData?.session || null;
  } catch {
    return null;
  }
}

export async function fetchRemoteState(): Promise<{
  mess: Mess | null;
  members: Member[];
  meals: MealEntry[];
  marketAssignments: MarketAssignment[];
  deposits: Deposit[];
  expenses: Expense[];
  period: MonthlyPeriod | null;
} | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    await ensureAuth();

    // 1. Fetch Mess
    const { data: messes } = await supabase.from('messes').select('*').limit(1);
    let mess: Mess | null = null;
    if (messes && messes.length > 0) {
      const raw = messes[0];
      mess = {
        id: raw.id,
        name: raw.name,
        address: raw.address || undefined,
        phone: raw.phone || undefined,
        currencyCode: raw.currency_code || 'BDT',
        timezone: raw.timezone || 'Asia/Dhaka',
        breakfastMealValue: Number(raw.breakfast_meal_value) || 0.5,
        enableBreakfast: Boolean(raw.enable_breakfast),
        enableLunch: Boolean(raw.enable_lunch),
        enableDinner: Boolean(raw.enable_dinner),
        mealInputMode: (raw.meal_input_mode as MealInputMode) || 'detailed',
        defaultMarketDays: raw.default_market_days || 3,
        createdAt: raw.created_at,
      };
    }

    // 2. Fetch Members
    const { data: rawMembers } = await supabase.from('members').select('*');
    const members: Member[] = (rawMembers || []).map((m: any) => ({
      id: m.id,
      messId: m.mess_id,
      userId: m.user_id || undefined,
      memberCode: m.member_code || undefined,
      name: m.name,
      nickname: m.nickname || undefined,
      roomNo: m.room_no || undefined,
      mobile: m.mobile || undefined,
      whatsapp: m.whatsapp || undefined,
      email: m.email || undefined,
      joiningDate: m.joining_date,
      leavingDate: m.leaving_date || undefined,
      isActive: Boolean(m.is_active),
      role: (m.nickname === 'প্রanto' || m.nickname === 'pranto'
        ? 'owner'
        : m.nickname === 'রাফসান'
        ? 'manager'
        : 'member') as MessRole,
      profileNote: m.profile_note || undefined,
    }));

    // 3. Fetch Meal Entries
    const { data: rawMeals } = await supabase.from('meal_entries').select('*');
    const meals: MealEntry[] = (rawMeals || []).map((e: any) => ({
      id: e.id,
      messId: e.mess_id,
      memberId: e.member_id,
      mealDate: e.meal_date,
      mealType: (e.meal_type as MealType) || 'total',
      mealCount: Number(e.meal_count) || 0,
      note: e.note || undefined,
      updatedAt: e.updated_at,
    }));

    // 4. Fetch Market Assignments
    const { data: rawAssignments } = await supabase
      .from('market_assignments')
      .select('*')
      .order('sort_order', { ascending: true });
    const marketAssignments: MarketAssignment[] = (rawAssignments || []).map((a: any) => ({
      id: a.id,
      messId: a.mess_id,
      memberId: a.member_id,
      assignmentDate: a.assignment_date,
      endDate: a.end_date || undefined,
      daysCount: a.days_count || 3,
      slotLabel: a.slot_label || 'বাজার দায়িত্ব',
      sortOrder: a.sort_order || 1,
      status: a.status || 'assigned',
      note: a.note || undefined,
    }));

    // 5. Fetch Deposits
    const { data: rawDeposits } = await supabase
      .from('deposits')
      .select('*')
      .order('deposit_date', { ascending: false });
    const deposits: Deposit[] = (rawDeposits || []).map((d: any) => ({
      id: d.id,
      messId: d.mess_id,
      memberId: d.member_id,
      amount: Number(d.amount) || 0,
      depositDate: d.deposit_date,
      paymentMethod: (d.payment_method === 'mobile_banking' ? 'bkash' : d.payment_method) as PaymentMethod,
      referenceNote: d.reference_note || undefined,
      createdAt: d.created_at,
    }));

    // 6. Fetch Expenses
    const { data: rawExpenses } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });
    const expenses: Expense[] = (rawExpenses || []).map((exp: any) => ({
      id: exp.id,
      messId: exp.mess_id,
      category: (exp.category as ExpenseCategory) || 'market',
      title: exp.title,
      amount: Number(exp.amount) || 0,
      expenseDate: exp.expense_date,
      paidByMemberId: exp.paid_by_member_id || undefined,
      includeInMealRate: Boolean(exp.include_in_meal_rate),
      receiptPath: exp.receipt_path || undefined,
      note: exp.note || undefined,
      createdAt: exp.created_at,
    }));

    // 7. Fetch Monthly Period
    const { data: rawPeriods } = await supabase.from('monthly_periods').select('*').limit(1);
    let period: MonthlyPeriod | null = null;
    if (rawPeriods && rawPeriods.length > 0) {
      const p = rawPeriods[0];
      period = {
        id: p.id,
        messId: p.mess_id,
        periodStart: p.period_start,
        periodEnd: p.period_end,
        status: (p.status as PeriodStatus) || 'open',
        totalMeals: p.total_meals ? Number(p.total_meals) : undefined,
        eligibleExpenses: p.eligible_expenses ? Number(p.eligible_expenses) : undefined,
        mealRate: p.meal_rate ? Number(p.meal_rate) : undefined,
        notes: p.notes || undefined,
      };
    }

    return {
      mess,
      members,
      meals,
      marketAssignments,
      deposits,
      expenses,
      period,
    };
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

// Mutations to Supabase
export async function syncMealEntryToSupabase(
  messId: string,
  memberId: string,
  mealDate: string,
  mealType: MealType,
  mealCount: number
) {
  if (!supabase) return;
  try {
    await supabase.from('meal_entries').upsert(
      {
        mess_id: messId,
        member_id: memberId,
        meal_date: mealDate,
        meal_type: mealType,
        meal_count: mealCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'member_id,meal_date,meal_type' }
    );
  } catch (err) {
    console.warn('Error syncing meal to Supabase:', err);
  }
}

export async function syncDepositToSupabase(deposit: Deposit) {
  if (!supabase) return;
  try {
    const dbMethod =
      deposit.paymentMethod === 'bkash' || deposit.paymentMethod === 'nagad'
        ? 'mobile_banking'
        : deposit.paymentMethod;

    await supabase.from('deposits').insert({
      mess_id: deposit.messId,
      member_id: deposit.memberId,
      amount: deposit.amount,
      deposit_date: deposit.depositDate,
      payment_method: dbMethod,
      reference_note: deposit.referenceNote || null,
    });
  } catch (err) {
    console.warn('Error syncing deposit to Supabase:', err);
  }
}

export async function deleteDepositFromSupabase(id: string) {
  if (!supabase) return;
  try {
    await supabase.from('deposits').delete().eq('id', id);
  } catch (err) {
    console.warn('Error deleting deposit from Supabase:', err);
  }
}

export async function syncExpenseToSupabase(expense: Expense) {
  if (!supabase) return;
  try {
    await supabase.from('expenses').insert({
      mess_id: expense.messId,
      category: expense.category,
      title: expense.title,
      amount: expense.amount,
      expense_date: expense.expenseDate,
      paid_by_member_id: expense.paidByMemberId || null,
      include_in_meal_rate: expense.includeInMealRate,
      receipt_path: expense.receiptPath || null,
      note: expense.note || null,
    });
  } catch (err) {
    console.warn('Error syncing expense to Supabase:', err);
  }
}

export async function deleteExpenseFromSupabase(id: string) {
  if (!supabase) return;
  try {
    await supabase.from('expenses').delete().eq('id', id);
  } catch (err) {
    console.warn('Error deleting expense from Supabase:', err);
  }
}

export async function syncMessToSupabase(mess: Mess) {
  if (!supabase) return;
  try {
    await supabase.from('messes').update({
      name: mess.name,
      meal_input_mode: mess.mealInputMode,
      enable_breakfast: mess.enableBreakfast,
      enable_lunch: mess.enableLunch,
      enable_dinner: mess.enableDinner,
      breakfast_meal_value: mess.breakfastMealValue,
      updated_at: new Date().toISOString(),
    }).eq('id', mess.id);
  } catch (err) {
    console.warn('Error syncing mess to Supabase:', err);
  }
}

export async function syncMarketStatusToSupabase(id: string, status: string) {
  if (!supabase) return;
  try {
    await supabase.from('market_assignments').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Error syncing market status to Supabase:', err);
  }
}

export async function syncPeriodToSupabase(period: MonthlyPeriod) {
  if (!supabase) return;
  try {
    await supabase.from('monthly_periods').update({
      status: period.status,
      total_meals: period.totalMeals || null,
      eligible_expenses: period.eligibleExpenses || null,
      meal_rate: period.mealRate || null,
    }).eq('id', period.id);
  } catch (err) {
    console.warn('Error syncing period to Supabase:', err);
  }
}

export async function syncMemberToSupabase(member: Member): Promise<string | null> {
  if (!supabase) return null;
  try {
    const payload: any = {
      mess_id: member.messId,
      name: member.name,
      nickname: member.nickname || null,
      room_no: member.roomNo || null,
      mobile: member.mobile || null,
      whatsapp: member.whatsapp || null,
      email: member.email || null,
      joining_date: member.joiningDate || new Date().toISOString().split('T')[0],
      is_active: member.isActive,
      profile_note: member.profileNote || null,
    };
    if (member.id && !member.id.startsWith('mem-')) {
      payload.id = member.id;
    }
    const { data, error } = await supabase.from('members').insert(payload).select('id').single();
    if (error) {
      console.warn('Error inserting member to Supabase:', error);
      return null;
    }
    return data?.id || null;
  } catch (err) {
    console.warn('Exception syncing member to Supabase:', err);
    return null;
  }
}

export async function syncUpdateMemberToSupabase(id: string, updates: Partial<Member>) {
  if (!supabase) return;
  try {
    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.nickname !== undefined) payload.nickname = updates.nickname;
    if (updates.roomNo !== undefined) payload.room_no = updates.roomNo;
    if (updates.mobile !== undefined) payload.mobile = updates.mobile;
    if (updates.whatsapp !== undefined) payload.whatsapp = updates.whatsapp;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;
    if (updates.profileNote !== undefined) payload.profile_note = updates.profileNote;

    await supabase.from('members').update(payload).eq('id', id);
  } catch (err) {
    console.warn('Error updating member in Supabase:', err);
  }
}

export async function syncNewMarketAssignmentToSupabase(assignment: MarketAssignment): Promise<string | null> {
  if (!supabase) return null;
  try {
    const payload: any = {
      mess_id: assignment.messId,
      member_id: assignment.memberId,
      assignment_date: assignment.assignmentDate,
      end_date: assignment.endDate || null,
      days_count: assignment.daysCount || 3,
      slot_label: assignment.slotLabel || 'বাজার দায়িত্ব',
      sort_order: assignment.sortOrder || 1,
      status: assignment.status || 'assigned',
      note: assignment.note || null,
    };
    if (assignment.id && !assignment.id.startsWith('mkt-') && !assignment.id.startsWith('auto-mkt-')) {
      payload.id = assignment.id;
    }
    const { data, error } = await supabase.from('market_assignments').insert(payload).select('id').single();
    if (error) {
      console.warn('Error inserting market assignment to Supabase:', error);
      return null;
    }
    return data?.id || null;
  } catch (err) {
    console.warn('Exception syncing market assignment to Supabase:', err);
    return null;
  }
}

export async function syncSwapAssignmentsToSupabase(
  id1: string,
  id2: string,
  memberId1: string,
  memberId2: string
) {
  if (!supabase) return;
  try {
    await supabase.from('market_assignments').update({ member_id: memberId2, status: 'swapped' }).eq('id', id1);
    await supabase.from('market_assignments').update({ member_id: memberId1, status: 'swapped' }).eq('id', id2);
  } catch (err) {
    console.warn('Error swapping market assignments in Supabase:', err);
  }
}

