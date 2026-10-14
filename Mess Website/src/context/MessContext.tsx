'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ThemeMode,
  AccentPreset,
  DensityMode,
  Mess,
  Member,
  MealEntry,
  MarketAssignment,
  Deposit,
  Expense,
  MonthlyPeriod,
} from '@/types';
import {
  initialMess,
  initialMembers,
  generateSampleMealEntries,
  initialMarketAssignments,
  initialDeposits,
  initialExpenses,
  initialPeriod,
} from '@/lib/mock-data';
import { calculateMonthlySettlement, CalculationResult } from '@/lib/calculations';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Language, MonthOption, availableMonthsList, translations, getMonthLabel } from '@/lib/translations';

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
  // Language & Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Selected Month & Periods
  selectedMonth: string; // e.g. '2026-10'
  setSelectedMonth: (m: string) => void;
  availableMonths: MonthOption[];
  currentMonthLabel: string;

  // Theme & Appearance
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  accent: AccentPreset;
  setAccent: (a: AccentPreset) => void;
  density: DensityMode;
  setDensity: (d: DensityMode) => void;

  // Supabase Connection Status
  isLiveSupabase: boolean;

  // Entities & Data
  mess: Mess;
  updateMess: (updated: Partial<Mess>) => void;

  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'messId'>) => void;
  updateMember: (id: string, updated: Partial<Member>) => void;
  toggleMemberActive: (id: string) => void;

  meals: MealEntry[];
  setMealCount: (memberId: string, mealDate: string, mealType: MealEntry['mealType'], count: number) => void;
  bulkUpdateDateMeals: (dateStr: string, entries: { memberId: string; breakfast: number; lunch: number; dinner: number }[]) => void;
  bulkUpdateDirectMeals: (dateStr: string, entries: { memberId: string; totalMeal: number }[]) => void;

  // Market Scheduling
  marketAssignments: MarketAssignment[];
  addMarketAssignment: (assignment: Omit<MarketAssignment, 'id' | 'messId'>) => void;
  updateMarketAssignment: (id: string, updated: Partial<MarketAssignment>, autoShiftSubsequent?: boolean) => void;
  deleteMarketAssignment: (id: string) => void;
  moveMarketAssignment: (id: string, direction: 'up' | 'down') => void;
  updateMarketStatus: (id: string, status: MarketAssignment['status']) => void;
  swapAssignments: (id1: string, id2: string) => void;
  autoGenerateMarketSchedule: (params: { startDate: string; daysPerMember: number; selectedMemberIds?: string[] }) => void;

  deposits: Deposit[];
  addDeposit: (deposit: Omit<Deposit, 'id' | 'messId' | 'createdAt'>) => void;
  deleteDeposit: (id: string) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'messId' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;

  period: MonthlyPeriod;
  lockPeriod: () => void;
  unlockPeriod: () => void;

  // Calculations
  calculations: CalculationResult;
}

const MessContext = createContext<MessContextType | undefined>(undefined);

export function MessProvider({ children }: { children: React.ReactNode }) {
  // Language state
  const [language, setLanguageState] = useState<Language>('bn');

  // Selected Month state (e.g. '2026-10')
  const [selectedMonth, setSelectedMonthState] = useState<string>('2026-10');

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>('night');
  const [accent, setAccentState] = useState<AccentPreset>('blue');
  const [density, setDensityState] = useState<DensityMode>('comfortable');

  // Core Data State
  const [mess, setMess] = useState<Mess>(initialMess);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [marketAssignments, setMarketAssignments] = useState<MarketAssignment[]>(initialMarketAssignments);
  const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [period, setPeriod] = useState<MonthlyPeriod>(initialPeriod);

  // Initialize from LocalStorage if available
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('mess_language') as Language;
      if (savedLang) setLanguageState(savedLang);

      const savedMonth = localStorage.getItem('mess_selected_month');
      if (savedMonth) setSelectedMonthState(savedMonth);

      const savedTheme = localStorage.getItem('mess_theme') as ThemeMode;
      if (savedTheme) setThemeState(savedTheme);

      const savedAccent = localStorage.getItem('mess_accent') as AccentPreset;
      if (savedAccent) setAccentState(savedAccent);

      const savedDensity = localStorage.getItem('mess_density') as DensityMode;
      if (savedDensity) setDensityState(savedDensity);

      const savedMembers = localStorage.getItem('mess_members');
      if (savedMembers) setMembers(JSON.parse(savedMembers));

      const savedMeals = localStorage.getItem('mess_meals');
      if (savedMeals) {
        setMeals(JSON.parse(savedMeals));
      } else {
        const generated = generateSampleMealEntries();
        setMeals(generated);
      }

      const savedMarket = localStorage.getItem('mess_market');
      if (savedMarket) setMarketAssignments(JSON.parse(savedMarket));

      const savedDeposits = localStorage.getItem('mess_deposits');
      if (savedDeposits) setDeposits(JSON.parse(savedDeposits));

      const savedExpenses = localStorage.getItem('mess_expenses');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

      const savedPeriod = localStorage.getItem('mess_period');
      if (savedPeriod) setPeriod(JSON.parse(savedPeriod));
    } catch {
      setMeals(generateSampleMealEntries());
    }
  }, []);

  // Sync DOM attributes with Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mess_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('mess_accent', accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    localStorage.setItem('mess_density', density);
  }, [density]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setAccent = (a: AccentPreset) => setAccentState(a);
  const setDensity = (d: DensityMode) => setDensityState(d);

  // Language handler
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mess_language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  // Selected Month handler
  const setSelectedMonth = (m: string) => {
    setSelectedMonthState(m);
    localStorage.setItem('mess_selected_month', m);

    // Sync period for selected month
    setPeriod((prev) => ({
      ...prev,
      id: `period-${m}`,
      periodStart: `${m}-01`,
      periodEnd: `${m}-31`,
      status: m === '2026-10' ? (prev.status || 'open') : 'locked',
      notes: `${getMonthLabel(m, language)} হিসাব মাস`,
    }));
  };

  const currentMonthLabel = getMonthLabel(selectedMonth, language);

  // Mess updater
  const updateMess = (updated: Partial<Mess>) => {
    setMess((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('mess_settings', JSON.stringify(next));
      return next;
    });
  };

  // Member CRUD
  const addMember = (m: Omit<Member, 'id' | 'messId'>) => {
    const newMember: Member = {
      ...m,
      id: `mem-${Date.now()}`,
      messId: mess.id,
    };
    const next = [...members, newMember];
    setMembers(next);
    localStorage.setItem('mess_members', JSON.stringify(next));
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    const next = members.map((m) => (m.id === id ? { ...m, ...updated } : m));
    setMembers(next);
    localStorage.setItem('mess_members', JSON.stringify(next));
  };

  const toggleMemberActive = (id: string) => {
    const next = members.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m));
    setMembers(next);
    localStorage.setItem('mess_members', JSON.stringify(next));
  };

  // Meal Management
  const setMealCount = (
    memberId: string,
    mealDate: string,
    mealType: MealEntry['mealType'],
    count: number
  ) => {
    if (period.status === 'locked') {
      alert(language === 'bn' 
        ? 'মাসিক হিসাবটি লক করা রয়েছে। মিল পরিবর্তনের জন্য ম্যানেজার হিসেবে আগে আনলক করুন।' 
        : 'This monthly account is locked. Please unlock as manager before editing meals.');
      return;
    }

    setMeals((prev) => {
      const existingIdx = prev.findIndex(
        (e) => e.memberId === memberId && e.mealDate === mealDate && e.mealType === mealType
      );
      let next: MealEntry[];
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = { ...next[existingIdx], mealCount: count };
      } else {
        const newEntry: MealEntry = {
          id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          messId: mess.id,
          memberId,
          mealDate,
          mealType,
          mealCount: count,
        };
        next = [...prev, newEntry];
      }
      localStorage.setItem('mess_meals', JSON.stringify(next));
      return next;
    });
  };

  const bulkUpdateDateMeals = (
    dateStr: string,
    entries: { memberId: string; breakfast: number; lunch: number; dinner: number }[]
  ) => {
    if (period.status === 'locked') {
      alert(language === 'bn' 
        ? 'হিসাবটি লক রয়েছে।' 
        : 'This account is locked.');
      return;
    }

    setMeals((prev) => {
      const filtered = prev.filter((e) => e.mealDate !== dateStr);
      const newEntries: MealEntry[] = [];
      entries.forEach((en) => {
        if (mess.enableBreakfast) {
          newEntries.push({
            id: `meal-${en.memberId}-${dateStr}-bf`,
            messId: mess.id,
            memberId: en.memberId,
            mealDate: dateStr,
            mealType: 'breakfast',
            mealCount: en.breakfast,
          });
        }
        if (mess.enableLunch) {
          newEntries.push({
            id: `meal-${en.memberId}-${dateStr}-lu`,
            messId: mess.id,
            memberId: en.memberId,
            mealDate: dateStr,
            mealType: 'lunch',
            mealCount: en.lunch,
          });
        }
        if (mess.enableDinner) {
          newEntries.push({
            id: `meal-${en.memberId}-${dateStr}-di`,
            messId: mess.id,
            memberId: en.memberId,
            mealDate: dateStr,
            mealType: 'dinner',
            mealCount: en.dinner,
          });
        }
      });
      const next = [...filtered, ...newEntries];
      localStorage.setItem('mess_meals', JSON.stringify(next));
      return next;
    });
  };

  const bulkUpdateDirectMeals = (
    dateStr: string,
    entries: { memberId: string; totalMeal: number }[]
  ) => {
    if (period.status === 'locked') {
      alert(language === 'bn' 
        ? 'হিসাবটি লক রয়েছে।' 
        : 'This account is locked.');
      return;
    }

    setMeals((prev) => {
      const filtered = prev.filter((e) => e.mealDate !== dateStr);
      const newEntries: MealEntry[] = entries.map((en) => ({
        id: `meal-${en.memberId}-${dateStr}-total`,
        messId: mess.id,
        memberId: en.memberId,
        mealDate: dateStr,
        mealType: 'total',
        mealCount: en.totalMeal,
      }));
      const next = [...filtered, ...newEntries];
      localStorage.setItem('mess_meals', JSON.stringify(next));
      return next;
    });
  };

  // Market Assignment Handlers
  const addMarketAssignment = (a: Omit<MarketAssignment, 'id' | 'messId'>) => {
    const days = a.daysCount || mess.defaultMarketDays || 3;
    const start = a.assignmentDate;
    const end = a.endDate || addDaysToDate(start, days - 1);

    const newAssignment: MarketAssignment = {
      ...a,
      id: `mkt-${Date.now()}`,
      messId: mess.id,
      assignmentDate: start,
      endDate: end,
      daysCount: days,
    };
    const next = [...marketAssignments, newAssignment];
    setMarketAssignments(next);
    localStorage.setItem('mess_market', JSON.stringify(next));
  };

  const updateMarketAssignment = (
    id: string,
    updated: Partial<MarketAssignment>,
    autoShiftSubsequent = false
  ) => {
    setMarketAssignments((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx === -1) return prev;

      const current = prev[idx];
      const merged: MarketAssignment = { ...current, ...updated };

      if (updated.assignmentDate || updated.daysCount) {
        const days = updated.daysCount ?? current.daysCount ?? (mess.defaultMarketDays || 3);
        const start = updated.assignmentDate ?? current.assignmentDate;
        merged.assignmentDate = start;
        merged.daysCount = days;
        merged.endDate = addDaysToDate(start, days - 1);
      }

      const next = [...prev];
      next[idx] = merged;

      // Auto-shift subsequent slots contiguous to this one
      if (autoShiftSubsequent && merged.endDate) {
        let cursorDate = addDaysToDate(merged.endDate, 1);
        for (let i = idx + 1; i < next.length; i++) {
          const slotDays = next[i].daysCount ?? (mess.defaultMarketDays || 3);
          next[i] = {
            ...next[i],
            assignmentDate: cursorDate,
            daysCount: slotDays,
            endDate: addDaysToDate(cursorDate, slotDays - 1),
          };
          cursorDate = addDaysToDate(next[i].endDate!, 1);
        }
      }

      localStorage.setItem('mess_market', JSON.stringify(next));
      return next;
    });
  };

  const deleteMarketAssignment = (id: string) => {
    setMarketAssignments((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem('mess_market', JSON.stringify(next));
      return next;
    });
  };

  const moveMarketAssignment = (id: string, direction: 'up' | 'down') => {
    setMarketAssignments((prev) => {
      const list = [...prev].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.assignmentDate.localeCompare(b.assignmentDate)
      );
      const index = list.findIndex((x) => x.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const currentItem = list[index];
      const targetItem = list[targetIndex];

      // Swapping member assignments shifts the member into the target date slot as described
      const updatedCurrent = {
        ...currentItem,
        memberId: targetItem.memberId,
        slotLabel: targetItem.slotLabel,
        note: targetItem.note,
      };
      const updatedTarget = {
        ...targetItem,
        memberId: currentItem.memberId,
        slotLabel: currentItem.slotLabel,
        note: currentItem.note,
      };

      list[index] = updatedCurrent;
      list[targetIndex] = updatedTarget;

      localStorage.setItem('mess_market', JSON.stringify(list));
      return list;
    });
  };

  const autoGenerateMarketSchedule = (params: {
    startDate: string;
    daysPerMember: number;
    selectedMemberIds?: string[];
  }) => {
    const { startDate, daysPerMember, selectedMemberIds } = params;
    const active = members.filter((m) => m.isActive && (!selectedMemberIds || selectedMemberIds.includes(m.id)));
    if (active.length === 0) return;

    const newAssignments: MarketAssignment[] = [];
    const days = Math.max(1, daysPerMember || mess.defaultMarketDays || 3);

    const [yStr, mStr] = startDate.split('-');
    const month = parseInt(mStr, 10);

    let cursorDateStr = startDate;
    let memberIndex = 0;
    let slotOrder = 1;

    while (true) {
      const [curY, curM, curD] = cursorDateStr.split('-').map(Number);
      if (curM !== month) {
        break;
      }

      const assignedMember = active[memberIndex % active.length];
      const endDateStr = addDaysToDate(cursorDateStr, days - 1);

      newAssignments.push({
        id: `mkt-auto-${Date.now()}-${slotOrder}`,
        messId: mess.id,
        memberId: assignedMember.id,
        assignmentDate: cursorDateStr,
        endDate: endDateStr,
        daysCount: days,
        slotLabel: `${days} দিনের বাজার পালা`,
        sortOrder: slotOrder,
        status: 'assigned',
        note: `${assignedMember.name} এর নির্ধারিত বাজার`,
      });

      slotOrder++;
      memberIndex++;
      cursorDateStr = addDaysToDate(endDateStr, 1);

      const [nextY, nextM, nextD] = cursorDateStr.split('-').map(Number);
      if (nextM !== month || slotOrder > 25) {
        break;
      }
    }

    setMarketAssignments(newAssignments);
    localStorage.setItem('mess_market', JSON.stringify(newAssignments));
  };

  const updateMarketStatus = (id: string, status: MarketAssignment['status']) => {
    const next = marketAssignments.map((a) => (a.id === id ? { ...a, status } : a));
    setMarketAssignments(next);
    localStorage.setItem('mess_market', JSON.stringify(next));
  };

  const swapAssignments = (id1: string, id2: string) => {
    const a1 = marketAssignments.find((a) => a.id === id1);
    const a2 = marketAssignments.find((a) => a.id === id2);
    if (!a1 || !a2) return;

    const next = marketAssignments.map((a) => {
      if (a.id === id1) return { ...a, memberId: a2.memberId, status: 'swapped' as const };
      if (a.id === id2) return { ...a, memberId: a1.memberId, status: 'swapped' as const };
      return a;
    });
    setMarketAssignments(next);
    localStorage.setItem('mess_market', JSON.stringify(next));
  };

  // Deposits
  const addDeposit = (d: Omit<Deposit, 'id' | 'messId' | 'createdAt'>) => {
    const newDep: Deposit = {
      ...d,
      id: `dep-${Date.now()}`,
      messId: mess.id,
      createdAt: new Date().toISOString(),
    };
    const next = [newDep, ...deposits];
    setDeposits(next);
    localStorage.setItem('mess_deposits', JSON.stringify(next));
  };

  const deleteDeposit = (id: string) => {
    const next = deposits.filter((d) => d.id !== id);
    setDeposits(next);
    localStorage.setItem('mess_deposits', JSON.stringify(next));
  };

  // Expenses
  const addExpense = (e: Omit<Expense, 'id' | 'messId' | 'createdAt'>) => {
    const newExp: Expense = {
      ...e,
      id: `exp-${Date.now()}`,
      messId: mess.id,
      createdAt: new Date().toISOString(),
    };
    const next = [newExp, ...expenses];
    setExpenses(next);
    localStorage.setItem('mess_expenses', JSON.stringify(next));
  };

  const deleteExpense = (id: string) => {
    const next = expenses.filter((e) => e.id !== id);
    setExpenses(next);
    localStorage.setItem('mess_expenses', JSON.stringify(next));
  };

  // Period Locks
  const lockPeriod = () => {
    const next: MonthlyPeriod = {
      ...period,
      status: 'locked',
      closedAt: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US'),
      closedBy: 'ম্যানেজার',
    };
    setPeriod(next);
    localStorage.setItem('mess_period', JSON.stringify(next));
  };

  const unlockPeriod = () => {
    const next: MonthlyPeriod = {
      ...period,
      status: 'open',
      closedAt: undefined,
      closedBy: undefined,
    };
    setPeriod(next);
    localStorage.setItem('mess_period', JSON.stringify(next));
  };

  // Derived Calculations dynamically filtered for selectedMonth
  const filteredMeals = meals.filter((e) => !e.mealDate || e.mealDate.startsWith(selectedMonth));
  const filteredDeposits = deposits.filter((d) => !d.depositDate || d.depositDate.startsWith(selectedMonth));
  const filteredExpenses = expenses.filter((e) => !e.expenseDate || e.expenseDate.startsWith(selectedMonth));

  const calculations = calculateMonthlySettlement(
    members,
    filteredMeals,
    filteredDeposits,
    filteredExpenses
  );

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
        theme,
        setTheme,
        accent,
        setAccent,
        density,
        setDensity,
        isLiveSupabase: isSupabaseConfigured,
        mess,
        updateMess,
        members,
        addMember,
        updateMember,
        toggleMemberActive,
        meals,
        setMealCount,
        bulkUpdateDateMeals,
        bulkUpdateDirectMeals,
        marketAssignments,
        addMarketAssignment,
        updateMarketAssignment,
        deleteMarketAssignment,
        moveMarketAssignment,
        updateMarketStatus,
        swapAssignments,
        autoGenerateMarketSchedule,
        deposits,
        addDeposit,
        deleteDeposit,
        expenses,
        addExpense,
        deleteExpense,
        period,
        lockPeriod,
        unlockPeriod,
        calculations,
      }}
    >
      {children}
    </MessContext.Provider>
  );
}

export function useMess() {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
}
