import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import {
  Mess,
  Member,
  MealEntry,
  MarketAssignment,
  Deposit,
  Expense,
  MonthlyPeriod,
  MemberMonthlyStatement,
  CalculationResult,
  Language,
  ThemeMode,
  MealType,
} from '../types';
import {
  initialMess,
  initialMembers,
  generateSampleMealEntries,
  initialMarketAssignments,
  initialDeposits,
  initialExpenses,
  initialPeriod,
} from '../lib/mock-data';
import { calculateMonthlySettlement } from '../lib/calculations';
import { translations, availableMonthsList, getMonthLabel, MonthOption } from '../lib/translations';
import { darkTheme, lightTheme, ThemeColors } from '../theme/colors';
import {
  fetchRemoteState,
  syncMealEntryToSupabase,
  syncDepositToSupabase,
  deleteDepositFromSupabase,
  syncExpenseToSupabase,
  deleteExpenseFromSupabase,
  syncMessToSupabase,
  syncMarketStatusToSupabase,
  syncPeriodToSupabase,
  syncMemberToSupabase,
  syncUpdateMemberToSupabase,
  syncNewMarketAssignmentToSupabase,
  syncSwapAssignmentsToSupabase,
} from '../lib/db-sync';

function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDaysToDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setDate(dateObj.getDate() + days);
  return formatYMD(dateObj);
}

interface MessContextType {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: MonthOption[];
  currentMonthLabel: string;

  // Theme & Appearance
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ThemeColors;

  // Active User / Identity
  activeMemberId: string;
  setActiveMemberId: (id: string) => void;
  activeMember: Member;
  activeMemberStatement: MemberMonthlyStatement | null;

  // Entities & Settings
  mess: Mess;
  updateMess: (updates: Partial<Mess>) => void;
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'messId'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  toggleMemberActive: (id: string) => void;

  // Meals
  meals: MealEntry[];
  filteredMeals: MealEntry[];
  setMealCount: (memberId: string, mealDate: string, mealType: MealType, count: number) => void;
  bulkUpdateDateMeals: (
    dateStr: string,
    entries: { memberId: string; breakfast: number; lunch: number; dinner: number }[]
  ) => void;
  bulkUpdateDirectMeals: (
    dateStr: string,
    entries: { memberId: string; totalMeal: number }[]
  ) => void;
  setAllMembersMealForDate: (dateStr: string, count: number, mealType?: MealType) => void;

  // Market
  marketAssignments: MarketAssignment[];
  filteredMarketAssignments: MarketAssignment[];
  todayMarketAssignment: MarketAssignment | null;
  tomorrowMarketAssignment: MarketAssignment | null;
  addMarketAssignment: (assignment: Omit<MarketAssignment, 'id' | 'messId'>) => void;
  updateMarketStatus: (id: string, status: MarketAssignment['status']) => void;
  swapAssignments: (id1: string, id2: string) => void;
  autoGenerateMarketSchedule: (params: { startDate: string; daysPerMember: number; selectedMemberIds?: string[] }) => void;

  // Accounts
  deposits: Deposit[];
  filteredDeposits: Deposit[];
  addDeposit: (deposit: Omit<Deposit, 'id' | 'messId' | 'createdAt'>) => void;
  deleteDeposit: (id: string) => void;

  expenses: Expense[];
  filteredExpenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'messId' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;

  // Settlement & Statements
  settlement: CalculationResult;
  period: MonthlyPeriod;
  lockPeriod: () => void;
  unlockPeriod: () => void;

  // Device APIs
  triggerHaptic: () => void;
}

const MessContext = createContext<MessContextType | undefined>(undefined);

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [activeMemberId, setActiveMemberId] = useState<string>('mem-1');

  const [mess, setMess] = useState<Mess>(initialMess);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [meals, setMeals] = useState<MealEntry[]>(generateSampleMealEntries());
  const [marketAssignments, setMarketAssignments] = useState<MarketAssignment[]>(initialMarketAssignments);
  const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [period, setPeriod] = useState<MonthlyPeriod>(initialPeriod);

  // Fetch live state from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadRemote() {
      const remote = await fetchRemoteState();
      if (isMounted && remote) {
        if (remote.mess) setMess(remote.mess);
        if (remote.members && remote.members.length > 0) {
          setMembers(remote.members);
          setActiveMemberId(remote.members[0].id);
        }
        if (remote.meals && remote.meals.length > 0) setMeals(remote.meals);
        if (remote.marketAssignments && remote.marketAssignments.length > 0) {
          setMarketAssignments(remote.marketAssignments);
        }
        if (remote.deposits && remote.deposits.length > 0) setDeposits(remote.deposits);
        if (remote.expenses && remote.expenses.length > 0) setExpenses(remote.expenses);
        if (remote.period) setPeriod(remote.period);
      }
    }
    loadRemote();
    return () => {
      isMounted = false;
    };
  }, []);

  // Active Theme Colors
  const colors = useMemo(() => {
    return themeMode === 'light' ? lightTheme : darkTheme;
  }, [themeMode]);

  // Haptic Feedback Helper
  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback on web or unsupported platforms
    }
  };

  // Translation Function
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en || key;
    }
    return key;
  };

  const currentMonthLabel = getMonthLabel(selectedMonth, language);

  // Filter entities by selected month (YYYY-MM)
  const filteredMeals = useMemo(() => {
    return meals.filter((e) => e.mealDate.startsWith(selectedMonth));
  }, [meals, selectedMonth]);

  const filteredMarketAssignments = useMemo(() => {
    return marketAssignments.filter((a) => a.assignmentDate.startsWith(selectedMonth));
  }, [marketAssignments, selectedMonth]);

  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => d.depositDate.startsWith(selectedMonth));
  }, [deposits, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => e.expenseDate.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Today and Tomorrow's Market Duty
  const todayStr = '2026-10-15';
  const tomorrowStr = '2026-10-16';

  const todayMarketAssignment = useMemo(() => {
    return (
      marketAssignments.find((a) => {
        if (a.assignmentDate === todayStr) return true;
        if (a.endDate && a.assignmentDate <= todayStr && a.endDate >= todayStr) return true;
        return false;
      }) || null
    );
  }, [marketAssignments]);

  const tomorrowMarketAssignment = useMemo(() => {
    return (
      marketAssignments.find((a) => {
        if (a.assignmentDate === tomorrowStr) return true;
        if (a.endDate && a.assignmentDate <= tomorrowStr && a.endDate >= tomorrowStr) return true;
        return false;
      }) || null
    );
  }, [marketAssignments]);

  // Dynamic settlement calculation for the selected month
  const settlement = useMemo(() => {
    return calculateMonthlySettlement(members, filteredMeals, filteredDeposits, filteredExpenses);
  }, [members, filteredMeals, filteredDeposits, filteredExpenses]);

  // Active Member & Statement
  const activeMember = useMemo(() => {
    return members.find((m) => m.id === activeMemberId) || members[0];
  }, [members, activeMemberId]);

  const activeMemberStatement = useMemo(() => {
    return settlement.statements.find((s) => s.memberId === activeMember.id) || null;
  }, [settlement, activeMember]);

  // Mess updates
  const updateMess = (updates: Partial<Mess>) => {
    const updatedMess = { ...mess, ...updates };
    setMess(updatedMess);
    syncMessToSupabase(updatedMess);
  };

  // Member CRUD
  const addMember = (newM: Omit<Member, 'id' | 'messId'>) => {
    const id = `mem-${Date.now()}`;
    const created: Member = {
      id,
      messId: mess.id,
      ...newM,
    };
    setMembers((prev) => [...prev, created]);
    triggerHaptic();
    syncMemberToSupabase(created).then((newId) => {
      if (newId) {
        setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, id: newId } : m)));
      }
    });
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    syncUpdateMemberToSupabase(id, updates);
    triggerHaptic();
  };

  const toggleMemberActive = (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const newStatus = !target.isActive;
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: newStatus } : m))
    );
    syncUpdateMemberToSupabase(id, { isActive: newStatus });
    triggerHaptic();
  };

  // Meals Management
  const setMealCount = (
    memberId: string,
    mealDate: string,
    mealType: MealType,
    count: number
  ) => {
    triggerHaptic();
    syncMealEntryToSupabase(mess.id, memberId, mealDate, mealType, count);
    setMeals((prev) => {
      const idx = prev.findIndex(
        (e) => e.memberId === memberId && e.mealDate === mealDate && e.mealType === mealType
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], mealCount: count, updatedAt: new Date().toISOString() };
        return copy;
      }
      return [
        ...prev,
        {
          id: `meal-${memberId}-${mealDate}-${mealType}-${Date.now()}`,
          messId: mess.id,
          memberId,
          mealDate,
          mealType,
          mealCount: count,
          updatedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const bulkUpdateDateMeals = (
    dateStr: string,
    entries: { memberId: string; breakfast: number; lunch: number; dinner: number }[]
  ) => {
    triggerHaptic();
    entries.forEach((item) => {
      syncMealEntryToSupabase(mess.id, item.memberId, dateStr, 'breakfast', item.breakfast);
      syncMealEntryToSupabase(mess.id, item.memberId, dateStr, 'lunch', item.lunch);
      syncMealEntryToSupabase(mess.id, item.memberId, dateStr, 'dinner', item.dinner);
    });
    setMeals((prev) => {
      let filtered = prev.filter((e) => e.mealDate !== dateStr);
      const newEntries: MealEntry[] = [];
      entries.forEach((item) => {
        newEntries.push({
          id: `meal-${item.memberId}-${dateStr}-bf-${Date.now()}`,
          messId: mess.id,
          memberId: item.memberId,
          mealDate: dateStr,
          mealType: 'breakfast',
          mealCount: item.breakfast,
        });
        newEntries.push({
          id: `meal-${item.memberId}-${dateStr}-lu-${Date.now()}`,
          messId: mess.id,
          memberId: item.memberId,
          mealDate: dateStr,
          mealType: 'lunch',
          mealCount: item.lunch,
        });
        newEntries.push({
          id: `meal-${item.memberId}-${dateStr}-di-${Date.now()}`,
          messId: mess.id,
          memberId: item.memberId,
          mealDate: dateStr,
          mealType: 'dinner',
          mealCount: item.dinner,
        });
      });
      return [...filtered, ...newEntries];
    });
  };

  const bulkUpdateDirectMeals = (
    dateStr: string,
    entries: { memberId: string; totalMeal: number }[]
  ) => {
    triggerHaptic();
    entries.forEach((item) => {
      syncMealEntryToSupabase(mess.id, item.memberId, dateStr, 'total', item.totalMeal);
    });
    setMeals((prev) => {
      let filtered = prev.filter((e) => e.mealDate !== dateStr);
      const newEntries: MealEntry[] = entries.map((item) => ({
        id: `meal-${item.memberId}-${dateStr}-total-${Date.now()}`,
        messId: mess.id,
        memberId: item.memberId,
        mealDate: dateStr,
        mealType: 'total',
        mealCount: item.totalMeal,
      }));
      return [...filtered, ...newEntries];
    });
  };

  const setAllMembersMealForDate = (dateStr: string, count: number, mealType: MealType = 'total') => {
    triggerHaptic();
    const activeMems = members.filter((m) => m.isActive);
    if (mess.mealInputMode === 'direct_total' || mealType === 'total') {
      const entries = activeMems.map((m) => ({ memberId: m.id, totalMeal: count }));
      bulkUpdateDirectMeals(dateStr, entries);
    } else {
      const entries = activeMems.map((m) => ({
        memberId: m.id,
        breakfast: mess.enableBreakfast ? (count > 0 ? mess.breakfastMealValue : 0) : 0,
        lunch: mess.enableLunch ? count : 0,
        dinner: mess.enableDinner ? count : 0,
      }));
      bulkUpdateDateMeals(dateStr, entries);
    }
  };

  // Market Scheduling
  const addMarketAssignment = (assignment: Omit<MarketAssignment, 'id' | 'messId'>) => {
    const id = `mkt-${Date.now()}`;
    const newAssignment: MarketAssignment = {
      id,
      messId: mess.id,
      ...assignment,
    };
    setMarketAssignments((prev) => [...prev, newAssignment]);
    triggerHaptic();
    syncNewMarketAssignmentToSupabase(newAssignment).then((newId) => {
      if (newId) {
        setMarketAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, id: newId } : a)));
      }
    });
  };

  const updateMarketStatus = (id: string, status: MarketAssignment['status']) => {
    syncMarketStatusToSupabase(id, status);
    setMarketAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    triggerHaptic();
  };

  const swapAssignments = (id1: string, id2: string) => {
    triggerHaptic();
    setMarketAssignments((prev) => {
      const a1 = prev.find((a) => a.id === id1);
      const a2 = prev.find((a) => a.id === id2);
      if (!a1 || !a2) return prev;

      syncSwapAssignmentsToSupabase(id1, id2, a1.memberId, a2.memberId);

      return prev.map((item) => {
        if (item.id === id1) {
          return { ...item, memberId: a2.memberId, status: 'swapped' };
        }
        if (item.id === id2) {
          return { ...item, memberId: a1.memberId, status: 'swapped' };
        }
        return item;
      });
    });
  };

  const autoGenerateMarketSchedule = ({
    startDate,
    daysPerMember,
    selectedMemberIds,
  }: {
    startDate: string;
    daysPerMember: number;
    selectedMemberIds?: string[];
  }) => {
    triggerHaptic();
    const pool =
      selectedMemberIds && selectedMemberIds.length > 0
        ? members.filter((m) => selectedMemberIds.includes(m.id))
        : members.filter((m) => m.isActive);

    if (pool.length === 0) return;

    let currentDate = startDate;
    const generated: MarketAssignment[] = [];

    pool.forEach((member, idx) => {
      const endDate = addDaysToDate(currentDate, daysPerMember - 1);
      const assignmentItem: MarketAssignment = {
        id: `auto-mkt-${Date.now()}-${idx}`,
        messId: mess.id,
        memberId: member.id,
        assignmentDate: currentDate,
        endDate,
        daysCount: daysPerMember,
        slotLabel: `বাজার স্লট ${idx + 1} (${member.name})`,
        sortOrder: idx + 1,
        status: 'assigned',
        note: `${daysPerMember} দিনের রোস্টার দায়িত্ব`,
      };
      generated.push(assignmentItem);
      syncNewMarketAssignmentToSupabase(assignmentItem);
      currentDate = addDaysToDate(endDate, 1);
    });

    setMarketAssignments((prev) => {
      const remaining = prev.filter((a) => !a.assignmentDate.startsWith(startDate.slice(0, 7)));
      return [...remaining, ...generated];
    });
  };

  // Deposits & Expenses
  const addDeposit = (deposit: Omit<Deposit, 'id' | 'messId' | 'createdAt'>) => {
    const id = `dep-${Date.now()}`;
    const newDep: Deposit = {
      id,
      messId: mess.id,
      createdAt: new Date().toISOString(),
      ...deposit,
    };
    syncDepositToSupabase(newDep);
    setDeposits((prev) => [newDep, ...prev]);
    triggerHaptic();
  };

  const deleteDeposit = (id: string) => {
    deleteDepositFromSupabase(id);
    setDeposits((prev) => prev.filter((d) => d.id !== id));
    triggerHaptic();
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'messId' | 'createdAt'>) => {
    const id = `exp-${Date.now()}`;
    const newExp: Expense = {
      id,
      messId: mess.id,
      createdAt: new Date().toISOString(),
      ...expense,
    };
    syncExpenseToSupabase(newExp);
    setExpenses((prev) => [newExp, ...prev]);
    triggerHaptic();
  };

  const deleteExpense = (id: string) => {
    deleteExpenseFromSupabase(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    triggerHaptic();
  };

  const lockPeriod = () => {
    const updatedPeriod: MonthlyPeriod = {
      ...period,
      status: 'locked',
      closedAt: new Date().toISOString(),
      closedBy: activeMember.name,
      totalMeals: settlement.totalMeals,
      eligibleExpenses: settlement.eligibleMealExpenses,
      mealRate: settlement.mealRate,
    };
    syncPeriodToSupabase(updatedPeriod);
    setPeriod(updatedPeriod);
    triggerHaptic();
  };

  const unlockPeriod = () => {
    const updatedPeriod: MonthlyPeriod = {
      ...period,
      status: 'open',
      closedAt: undefined,
      closedBy: undefined,
    };
    syncPeriodToSupabase(updatedPeriod);
    setPeriod(updatedPeriod);
    triggerHaptic();
  };

  return (
    <MessContext.Provider
      value={{
        language,
        setLanguage,
        t,
        selectedMonth,
        setSelectedMonth,
        availableMonths: availableMonthsList,
        currentMonthLabel,

        themeMode,
        setThemeMode,
        colors,

        activeMemberId,
        setActiveMemberId,
        activeMember,
        activeMemberStatement,

        mess,
        updateMess,
        members,
        addMember,
        updateMember,
        toggleMemberActive,

        meals,
        filteredMeals,
        setMealCount,
        bulkUpdateDateMeals,
        bulkUpdateDirectMeals,
        setAllMembersMealForDate,

        marketAssignments,
        filteredMarketAssignments,
        todayMarketAssignment,
        tomorrowMarketAssignment,
        addMarketAssignment,
        updateMarketStatus,
        swapAssignments,
        autoGenerateMarketSchedule,

        deposits,
        filteredDeposits,
        addDeposit,
        deleteDeposit,

        expenses,
        filteredExpenses,
        addExpense,
        deleteExpense,

        settlement,
        period,
        lockPeriod,
        unlockPeriod,

        triggerHaptic,
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};
