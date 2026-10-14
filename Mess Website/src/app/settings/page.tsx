'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building,
  DollarSign,
  Palette,
  Database,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import { useUIFeedback } from '@/context/UIFeedbackContext';
import { AccentPreset, ThemeMode, DensityMode, MealInputMode } from '@/types';

export default function SettingsPage() {
  const {
    mess,
    updateMess,
    theme,
    setTheme,
    accent,
    setAccent,
    density,
    setDensity,
    isLiveSupabase,
  } = useMess();

  const { showToast, confirm } = useUIFeedback();

  const [messName, setMessName] = useState(mess.name);
  const [address, setAddress] = useState(mess.address || '');
  const [phone, setPhone] = useState(mess.phone || '');
  const [breakfastVal, setBreakfastVal] = useState(mess.breakfastMealValue.toString());
  const [enableBreakfast, setEnableBreakfast] = useState(mess.enableBreakfast ?? true);
  const [enableLunch, setEnableLunch] = useState(mess.enableLunch ?? true);
  const [enableDinner, setEnableDinner] = useState(mess.enableDinner ?? true);
  const [mealInputMode, setMealInputMode] = useState<MealInputMode>(mess.mealInputMode ?? 'detailed');
  const [defaultMarketDays, setDefaultMarketDays] = useState(mess.defaultMarketDays?.toString() || '3');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enableBreakfast && !enableLunch && !enableDinner && mealInputMode === 'detailed') {
      showToast('কমপক্ষে একটি মিলের বেলা (সকাল, দুপুর বা রাত) সক্রিয় রাখতে হবে অথবা ডিরেক্ট মিল ইনপুট মোড নির্বাচন করুন!', 'warning');
      return;
    }

    updateMess({
      name: messName,
      address,
      phone,
      breakfastMealValue: parseFloat(breakfastVal) || 0.5,
      enableBreakfast,
      enableLunch,
      enableDinner,
      mealInputMode,
      defaultMarketDays: parseInt(defaultMarketDays, 10) || 3,
    });
    setIsSaved(true);
    showToast('মেস সেটিংস ও কনফিগারেশন সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetData = async () => {
    const ok = await confirm({
      title: 'ডেমো ডেটা রিসেট',
      message: 'আপনি কি নিশ্চিত যে লোকাল স্টোরেজের সমস্ত ডেটা রিসেট করে ডিফল্ট ডেমো ডেটায় ফিরে যেতে চান? আপনার বর্তমান সমস্ত কাস্টম ডেটা মুছে যাবে।',
      confirmText: 'হ্যাঁ, রিসেট করুন',
      cancelText: 'বাতিল',
      type: 'danger',
    });
    if (ok) {
      localStorage.clear();
      showToast('সমস্ত ডেটা রিসেট করা হয়েছে। রিলোড হচ্ছে...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: 1.3 }}>
          <Settings size={24} color="var(--primary)" />
          <span>মেস সেটিংস ও কনফিগারেশন (Settings)</span>
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          মেসের সাধারণ বিবরণ, মিল গণনার নিয়ম, থিম পারসোনালাইজেশন ও ক্লাউড ডাটাবেজ ইন্টিগ্রেশন
        </p>
      </div>

      {/* Mess Profile Form */}
      <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
          <Building size={17} color="var(--primary)" />
          <span>মেস প্রোফাইল ও মিল কনফিগারেশন</span>
        </h3>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              মেসের নাম *
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={messName}
              onChange={(e) => setMessName(e.target.value)}
            />
          </div>

          <div className="responsive-two-col">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                ঠিকানা
              </label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                যোগাযোগের ফোন নম্বর
              </label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* New Section: Meal Slots and Input Mode Settings */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                🍽️ মিল ইনপুট পদ্ধতি (Meal Input Mode)
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                ম্যানেজার কীভাবে মেম্বারদের মিল এন্ট্রি করতে চান তা নির্বাচন করুন:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginTop: '0.65rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: mealInputMode === 'detailed' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: mealInputMode === 'detailed' ? 'var(--primary-light)' : 'var(--surface-glass)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="mealMode"
                    value="detailed"
                    checked={mealInputMode === 'detailed'}
                    onChange={() => setMealInputMode('detailed')}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      বেলা ভিত্তিক এন্ট্রি (Detailed Slots)
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      সকাল, দুপুর ও রাতের মিল আলাদাভাবে কাউন্ট হবে
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: mealInputMode === 'direct_total' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: mealInputMode === 'direct_total' ? 'var(--primary-light)' : 'var(--surface-glass)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="mealMode"
                    value="direct_total"
                    checked={mealInputMode === 'direct_total'}
                    onChange={() => setMealInputMode('direct_total')}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ডিরেক্ট মিল ইনপুট (Direct Total Input)
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      সরাসরি এক সংখ্যায় ইউজারের মোট মিল ইনপুট দেওয়া যাবে
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Meal Slots Toggles (Only when detailed mode is selected) */}
            {mealInputMode === 'detailed' && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ⏰ কোন কোন বেলার খাবার এই মেসে চালু থাকবে?
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  যেসব বেলা চালু থাকবে শুধুমাত্র সেগুলোই মিল এন্ট্রি গ্রিড ও হিসেবে প্রদর্শিত হবে:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-glass)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={enableBreakfast}
                      onChange={(e) => setEnableBreakfast(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>সকালের নাশতা (Breakfast)</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-glass)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={enableLunch}
                      onChange={(e) => setEnableLunch(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>দুপুরের খাবার (Lunch)</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-glass)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={enableDinner}
                      onChange={(e) => setEnableDinner(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>রাতের খাবার (Dinner)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="responsive-two-col">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                সকালের নাশতার মান (Breakfast Value)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={breakfastVal}
                onChange={(e) => setBreakfastVal(e.target.value)}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>ডিফল্ট: ০.৫ মিল (দুপুর ও রাতের মিল ১.০)</span>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                মুদ্রা ও টাইমজোন
              </label>
              <input
                type="text"
                disabled
                className="form-input"
                value="BDT (৳) — Asia/Dhaka"
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          {/* Market Shift Default Duration Setting */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  🛒 বাজার শিডিউলের ডিফল্ট মেয়াদ (Default Market Duration per Member)
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  প্রতিজন সদস্য ডিফল্টভাবে কত দিন করে মেসের বাজার করবেন তা নির্বাচন করুন:
                </p>
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {[3, 4, 5, 7, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDefaultMarketDays(d.toString())}
                    className="btn btn-sm"
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: defaultMarketDays === d.toString() ? 'var(--primary)' : 'var(--surface-solid)',
                      color: defaultMarketDays === d.toString() ? '#ffffff' : 'var(--text-secondary)',
                      border: defaultMarketDays === d.toString() ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    {d} দিন
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="number"
                min="1"
                max="31"
                className="form-input"
                style={{ width: '130px' }}
                value={defaultMarketDays}
                onChange={(e) => setDefaultMarketDays(e.target.value)}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                দিন পর পর স্বয়ংক্রিয়ভাবে পরবর্তী মেম্বারের বাজার শিডিউল হবে
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
            <button type="submit" className="btn btn-primary mobile-full-width">
              {isSaved ? <CheckCircle size={15} /> : null}
              <span>{isSaved ? 'সংরক্ষিত হয়েছে!' : 'সেটিংস সেভ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
          <Database size={17} color="var(--primary)" />
          <span>Supabase ক্লাউড ডাটাবেজ ইন্টিগ্রেশন</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
          লাইভ Supabase প্রজেক্টের সাথে যুক্ত করার জন্য রুট ফোল্ডারে `.env.local` ফাইল তৈরি করুন:
        </p>

        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            overflowX: 'auto',
          }}
        >
          <div>NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co</div>
          <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY</div>
          <div>SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY</div>
        </div>

        <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className={`badge ${isLiveSupabase ? 'badge-success' : 'badge-warning'}`}>
            {isLiveSupabase ? 'সরাসরি Supabase কানেক্টেড' : 'লোকাল মেমরি ও ব্রাউজার স্টোরেজ মোড সক্রিয়'}
          </span>
        </div>
      </div>

      {/* Reset Data Danger Zone */}
      <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.25rem' }}>
          ডেটা রিসেট (Danger Zone)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
          আপনি যদি আপনার টেস্ট করা সমস্ত লোকাল ডেটা মুছে একদম নতুন ডেমো ডেটায় ফিরে যেতে চান, তবে নিচের বাটনে চাপ দিন।
        </p>

        <button onClick={handleResetData} className="btn btn-danger btn-sm mobile-full-width">
          <RotateCcw size={15} />
          <span>সকল লোকাল ডেটা রিসেট করুন</span>
        </button>
      </div>
    </div>
  );
}
