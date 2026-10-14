'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Utensils,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Layers,
  Hash,
  Settings,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import { useUIFeedback } from '@/context/UIFeedbackContext';
import { MealInputMode } from '@/types';

export default function MealsPage() {
  const {
    mess,
    updateMess,
    members,
    meals,
    bulkUpdateDateMeals,
    bulkUpdateDirectMeals,
    period,
  } = useMess();

  const { showToast } = useUIFeedback();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active input mode (defaults to mess.mealInputMode, can be toggled on the fly)
  const [activeMode, setActiveMode] = useState<MealInputMode>(mess.mealInputMode || 'detailed');

  // Sync with mess settings if they change
  useEffect(() => {
    if (mess.mealInputMode) {
      setActiveMode(mess.mealInputMode);
    }
  }, [mess.mealInputMode]);

  // Settings from mess
  const enableBf = mess.enableBreakfast ?? true;
  const enableLu = mess.enableLunch ?? true;
  const enableDi = mess.enableDinner ?? true;

  // Local state for Detailed Mode
  const [gridData, setGridData] = useState<
    { memberId: string; breakfast: number; lunch: number; dinner: number }[]
  >([]);

  // Local state for Direct Total Mode
  const [directData, setDirectData] = useState<
    { memberId: string; totalMeal: number }[]
  >([]);

  // Load meals for selectedDate
  useEffect(() => {
    const active = members.filter((m) => m.isActive);

    // Populate Detailed State
    const initialDetailed = active.map((m) => {
      const bf = meals.find(
        (e) => e.memberId === m.id && e.mealDate === selectedDate && e.mealType === 'breakfast'
      );
      const lu = meals.find(
        (e) => e.memberId === m.id && e.mealDate === selectedDate && e.mealType === 'lunch'
      );
      const di = meals.find(
        (e) => e.memberId === m.id && e.mealDate === selectedDate && e.mealType === 'dinner'
      );

      return {
        memberId: m.id,
        breakfast: bf ? Number(bf.mealCount) : (enableBf ? 0.5 : 0),
        lunch: lu ? Number(lu.mealCount) : (enableLu ? 1 : 0),
        dinner: di ? Number(di.mealCount) : (enableDi ? 1 : 0),
      };
    });
    setGridData(initialDetailed);

    // Populate Direct Total State
    const initialDirect = active.map((m) => {
      // Check if a direct 'total' entry exists
      const directEntry = meals.find(
        (e) => e.memberId === m.id && e.mealDate === selectedDate && e.mealType === 'total'
      );
      if (directEntry) {
        return { memberId: m.id, totalMeal: Number(directEntry.mealCount) };
      }

      // Or sum up detailed entries for this day
      const dayMeals = meals.filter(
        (e) => e.memberId === m.id && e.mealDate === selectedDate
      );
      const sum = dayMeals.reduce((acc, cur) => acc + (Number(cur.mealCount) || 0), 0);
      return { memberId: m.id, totalMeal: sum > 0 ? sum : 2 };
    });
    setDirectData(initialDirect);
  }, [selectedDate, members, meals, enableBf, enableLu, enableDi]);

  // Detailed Handlers
  const handleDetailedChange = (
    memberId: string,
    field: 'breakfast' | 'lunch' | 'dinner',
    delta: number
  ) => {
    setGridData((prev) =>
      prev.map((item) => {
        if (item.memberId !== memberId) return item;
        const current = item[field];
        let next = current + delta;
        if (next < 0) next = 0;
        if (next > 5) next = 5;
        return { ...item, [field]: Number(next.toFixed(1)) };
      })
    );
  };

  const handleDetailedSetExact = (
    memberId: string,
    field: 'breakfast' | 'lunch' | 'dinner',
    val: number
  ) => {
    setGridData((prev) =>
      prev.map((item) => (item.memberId === memberId ? { ...item, [field]: val } : item))
    );
  };

  // Direct Total Handlers
  const handleDirectChange = (memberId: string, delta: number) => {
    setDirectData((prev) =>
      prev.map((item) => {
        if (item.memberId !== memberId) return item;
        let next = item.totalMeal + delta;
        if (next < 0) next = 0;
        if (next > 10) next = 10;
        return { ...item, totalMeal: Number(next.toFixed(1)) };
      })
    );
  };

  const handleDirectSetExact = (memberId: string, val: number) => {
    setDirectData((prev) =>
      prev.map((item) => (item.memberId === memberId ? { ...item, totalMeal: val } : item))
    );
  };

  const handleDirectInputChange = (memberId: string, valStr: string) => {
    const parsed = parseFloat(valStr);
    const val = isNaN(parsed) ? 0 : parsed;
    setDirectData((prev) =>
      prev.map((item) => (item.memberId === memberId ? { ...item, totalMeal: val } : item))
    );
  };

  // Autofill helpers
  const autofillAllRegular = () => {
    if (activeMode === 'direct_total') {
      setDirectData((prev) => prev.map((item) => ({ ...item, totalMeal: 2 })));
    } else {
      setGridData((prev) =>
        prev.map((item) => ({
          ...item,
          breakfast: enableBf ? 0.5 : 0,
          lunch: enableLu ? 1 : 0,
          dinner: enableDi ? 1 : 0,
        }))
      );
    }
  };

  const autofillAllZero = () => {
    if (activeMode === 'direct_total') {
      setDirectData((prev) => prev.map((item) => ({ ...item, totalMeal: 0 })));
    } else {
      setGridData((prev) =>
        prev.map((item) => ({
          ...item,
          breakfast: 0,
          lunch: 0,
          dinner: 0,
        }))
      );
    }
  };

  // Save handler
  const handleSave = () => {
    if (period.status === 'locked') {
      showToast('মাসিক হিসাব লক করা আছে! আনলক না করা পর্যন্ত মিল পরিবর্তন করা যাবে না।', 'error');
      return;
    }

    if (activeMode === 'direct_total') {
      bulkUpdateDirectMeals(selectedDate, directData);
    } else {
      bulkUpdateDateMeals(selectedDate, gridData);
    }

    setSavedSuccess(true);
    showToast(`${selectedDate} তারিখের মিলের হিসাব সফলভাবে সংরক্ষণ করা হয়েছে!`, 'success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Daily Total Computation
  const dailyTotal =
    activeMode === 'direct_total'
      ? directData.reduce((acc, cur) => acc + (cur.totalMeal || 0), 0)
      : gridData.reduce(
          (acc, cur) =>
            acc +
            (enableBf ? cur.breakfast : 0) +
            (enableLu ? cur.lunch : 0) +
            (enableDi ? cur.dinner : 0),
          0
        );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: 1.3 }}>
            <Utensils size={24} color="var(--primary)" />
            <span>বাল্ক মিল এন্ট্রি গ্রিড (Bulk Meal Entry)</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            নির্দিষ্ট তারিখ নির্বাচন করে মেসের সকল সদস্যের মিল এক ক্লিকে এন্ট্রি করুন।
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={period.status === 'locked'}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
        >
          {savedSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
          <span>{savedSuccess ? 'সংরক্ষিত হয়েছে!' : 'মিল সংরক্ষণ করুন'}</span>
        </button>
      </div>

      {/* Input Mode Switcher & Settings Quick Link */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.85rem 1.15rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            মিল এন্ট্রি মোড:
          </span>

          <div style={{ display: 'inline-flex', padding: '0.2rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setActiveMode('detailed')}
              className="btn btn-sm"
              style={{
                background: activeMode === 'detailed' ? 'var(--primary)' : 'transparent',
                color: activeMode === 'detailed' ? '#ffffff' : 'var(--text-secondary)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.775rem',
              }}
            >
              <Layers size={13} />
              <span>বেলা ভিত্তিক (Detailed)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('direct_total')}
              className="btn btn-sm"
              style={{
                background: activeMode === 'direct_total' ? 'var(--primary)' : 'transparent',
                color: activeMode === 'direct_total' ? '#ffffff' : 'var(--text-secondary)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.775rem',
              }}
            >
              <Hash size={13} />
              <span>ডিরেক্ট মিল ইনপুট (Total Input)</span>
            </button>
          </div>
        </div>

        {/* Enabled Slots Indicator or Settings link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {activeMode === 'detailed' ? (
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>চালু বেলা:</span>
              {enableBf && <span className="badge badge-primary">সকাল</span>}
              {enableLu && <span className="badge badge-primary">দুপুর</span>}
              {enableDi && <span className="badge badge-primary">রাত</span>}
              {!enableBf && !enableLu && !enableDi && <span className="badge badge-danger">সব বন্ধ</span>}
            </div>
          ) : (
            <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
              ডিরেক্ট মোট মিল মোড সক্রিয়
            </span>
          )}

          <Link href="/settings" className="btn btn-secondary btn-sm" title="সেটিংস পরিবর্তন করুন" style={{ padding: '0.35rem 0.55rem' }}>
            <Settings size={13} />
          </Link>
        </div>
      </div>

      {/* Date Bar & Quick Autofills */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.85rem 1.15rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={16} color="var(--primary)" />
            <span>তারিখ:</span>
          </label>
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.9rem' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button onClick={autofillAllRegular} className="btn btn-secondary btn-sm">
            <Sparkles size={13} color="var(--primary)" />
            <span>{activeMode === 'direct_total' ? 'সবার ২ মিল দিন' : 'সবার রেগুলার মিল দিন'}</span>
          </button>
          <button onClick={autofillAllZero} className="btn btn-secondary btn-sm">
            <RotateCcw size={13} />
            <span>সবার মিল অফ (০)</span>
          </button>
        </div>
      </div>

      {/* Daily Summary Banner */}
      <div
        style={{
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.4rem',
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          তারিখ: <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{selectedDate}</span>
          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({activeMode === 'direct_total' ? 'ডিরেক্ট মিল ইনপুট মোড' : 'বেলা ভিত্তিক মোড'})
          </span>
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          দিনের মোট মিল: <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 800 }}>{dailyTotal.toFixed(1)} টি</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. DIRECT TOTAL INPUT MODE (ডিরেক্ট মিল ইনপুট মোড)               */}
      {/* ============================================================== */}
      {activeMode === 'direct_total' && (
        <div className="glass-table-wrapper">
          <table className="glass-table" style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                <th>সদস্যের নাম ও রুম</th>
                <th style={{ textAlign: 'center' }}>মোট মিল ইনপুট (Direct Total Input)</th>
                <th style={{ textAlign: 'center' }}>কুইক টগল</th>
                <th style={{ textAlign: 'right' }}>দিনের মোট মিল</th>
              </tr>
            </thead>
            <tbody>
              {directData.map((item) => {
                const member = members.find((m) => m.id === item.memberId);
                if (!member) return null;

                return (
                  <tr key={item.memberId}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        রুম {member.roomNo || 'N/A'} • {member.mobile}
                      </div>
                    </td>

                    {/* Direct Numeric Input with Step Buttons */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleDirectChange(item.memberId, -0.5)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontWeight: 800 }}
                        >
                          -
                        </button>

                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          value={item.totalMeal}
                          onChange={(e) => handleDirectInputChange(item.memberId, e.target.value)}
                          className="form-input"
                          style={{
                            width: '75px',
                            textAlign: 'center',
                            fontWeight: 800,
                            fontSize: '1rem',
                            color: item.totalMeal > 0 ? 'var(--primary)' : 'var(--text-muted)',
                            padding: '0.35rem',
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleDirectChange(item.memberId, 0.5)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontWeight: 800 }}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Quick Preset Buttons */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                        <button
                          type="button"
                          onClick={() => handleDirectSetExact(item.memberId, 0)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                        >
                          ০ (অফ)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectSetExact(item.memberId, 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                        >
                          ১ টি
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectSetExact(item.memberId, 2)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                        >
                          ২ টি
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectSetExact(item.memberId, 3)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                        >
                          ৩ টি
                        </button>
                      </div>
                    </td>

                    {/* Total Value Badge */}
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: 'var(--radius-full)',
                          background: item.totalMeal > 0 ? 'var(--primary-light)' : 'var(--surface-elevated)',
                          color: item.totalMeal > 0 ? 'var(--primary)' : 'var(--text-muted)',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                        }}
                      >
                        {item.totalMeal.toFixed(1)} মিল
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DETAILED SLOTS MODE (বেলা ভিত্তিক মিল মোড)                   */}
      {/* ============================================================== */}
      {activeMode === 'detailed' && (
        <>
          {/* 📱 MOBILE VIEW: Tactile Card-Based Meal Entry (Visible on < 768px) */}
          <div className="mobile-meal-cards">
            {gridData.map((item) => {
              const member = members.find((m) => m.id === item.memberId);
              if (!member) return null;
              const rowTotal =
                (enableBf ? item.breakfast : 0) +
                (enableLu ? item.lunch : 0) +
                (enableDi ? item.dinner : 0);

              return (
                <div
                  key={item.memberId}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    borderLeft: '4px solid var(--primary)',
                    padding: '0.85rem',
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        রুম {member.roomNo || 'N/A'}
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        background: rowTotal > 0 ? 'var(--primary-light)' : 'var(--surface-elevated)',
                        color: rowTotal > 0 ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      মোট: {rowTotal.toFixed(1)}
                    </span>
                  </div>

                  {/* Breakfast Slot (Only if enabled in settings) */}
                  {enableBf && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--surface-elevated)',
                        padding: '0.45rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Coffee size={14} color="#f59e0b" />
                        <span>সকাল (BF):</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleDetailedChange(item.memberId, 'breakfast', -0.5)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 800, color: item.breakfast > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {item.breakfast}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDetailedChange(item.memberId, 'breakfast', 0.5)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDetailedSetExact(item.memberId, 'breakfast', item.breakfast > 0 ? 0 : 0.5)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                        >
                          {item.breakfast > 0 ? 'অফ' : '০.৫'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lunch Slot (Only if enabled in settings) */}
                  {enableLu && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--surface-elevated)',
                        padding: '0.45rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Sun size={14} color="#f59e0b" />
                        <span>দুপুর (Lunch):</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleDetailedChange(item.memberId, 'lunch', -1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 800, color: item.lunch > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {item.lunch}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDetailedChange(item.memberId, 'lunch', 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDetailedSetExact(item.memberId, 'lunch', item.lunch > 0 ? 0 : 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                        >
                          {item.lunch > 0 ? 'অফ' : '১ টি'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dinner Slot (Only if enabled in settings) */}
                  {enableDi && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--surface-elevated)',
                        padding: '0.45rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Moon size={14} color="#6366f1" />
                        <span>রাত (Dinner):</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleDetailedChange(item.memberId, 'dinner', -1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 800, color: item.dinner > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {item.dinner}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDetailedChange(item.memberId, 'dinner', 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDetailedSetExact(item.memberId, 'dinner', item.dinner > 0 ? 0 : 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                        >
                          {item.dinner > 0 ? 'অফ' : '১ টি'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 💻 DESKTOP & TABLET VIEW: Wide Grid Table with Dynamic Slot Columns */}
          <div className="desktop-meal-table glass-table-wrapper">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>মেম্বারের নাম ও রুম</th>
                  {enableBf && <th style={{ textAlign: 'center' }}>সকালের নাশতা (Breakfast)</th>}
                  {enableLu && <th style={{ textAlign: 'center' }}>দুপুরের খাবার (Lunch)</th>}
                  {enableDi && <th style={{ textAlign: 'center' }}>রাতের খাবার (Dinner)</th>}
                  <th style={{ textAlign: 'center' }}>দিনের মোট মিল</th>
                </tr>
              </thead>
              <tbody>
                {gridData.map((item) => {
                  const member = members.find((m) => m.id === item.memberId);
                  if (!member) return null;
                  const rowTotal =
                    (enableBf ? item.breakfast : 0) +
                    (enableLu ? item.lunch : 0) +
                    (enableDi ? item.dinner : 0);

                  return (
                    <tr key={item.memberId}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>রুম {member.roomNo || 'N/A'}</div>
                      </td>

                      {/* Breakfast (Only if enabled) */}
                      {enableBf && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => handleDetailedChange(item.memberId, 'breakfast', -0.5)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                            >
                              -
                            </button>
                            <span style={{ minWidth: '36px', fontWeight: 800, color: item.breakfast > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                              {item.breakfast}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDetailedChange(item.memberId, 'breakfast', 0.5)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDetailedSetExact(item.memberId, 'breakfast', item.breakfast > 0 ? 0 : 0.5)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                            >
                              {item.breakfast > 0 ? 'অফ' : '০.৫'}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* Lunch (Only if enabled) */}
                      {enableLu && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => handleDetailedChange(item.memberId, 'lunch', -1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                            >
                              -
                            </button>
                            <span style={{ minWidth: '36px', fontWeight: 800, color: item.lunch > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                              {item.lunch}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDetailedChange(item.memberId, 'lunch', 1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDetailedSetExact(item.memberId, 'lunch', item.lunch > 0 ? 0 : 1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                            >
                              {item.lunch > 0 ? 'অফ' : '১ টি'}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* Dinner (Only if enabled) */}
                      {enableDi && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => handleDetailedChange(item.memberId, 'dinner', -1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                            >
                              -
                            </button>
                            <span style={{ minWidth: '36px', fontWeight: 800, color: item.dinner > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                              {item.dinner}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDetailedChange(item.memberId, 'dinner', 1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.55rem', fontWeight: 800 }}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDetailedSetExact(item.memberId, 'dinner', item.dinner > 0 ? 0 : 1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                            >
                              {item.dinner > 0 ? 'অফ' : '১ টি'}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* Total for Member */}
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            background: rowTotal > 0 ? 'var(--primary-light)' : 'var(--surface-elevated)',
                            color: rowTotal > 0 ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {rowTotal.toFixed(1)} মিল
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style jsx>{`
        .mobile-meal-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .desktop-meal-table {
          display: none;
        }

        @media (min-width: 768px) {
          .mobile-meal-cards {
            display: none !important;
          }
          .desktop-meal-table {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
