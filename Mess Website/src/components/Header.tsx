'use client';

import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Palette,
  Maximize2,
  Minimize2,
  Database,
  Calendar,
  Flame,
  Check,
  Languages,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import { AccentPreset } from '@/types';
import { Language } from '@/lib/translations';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const accentColors: { key: AccentPreset; name: string; hex: string }[] = [
  { key: 'blue', name: 'Blue (ডিফল্ট)', hex: '#2563eb' },
  { key: 'red', name: 'Red', hex: '#e11d48' },
  { key: 'green', name: 'Green', hex: '#059669' },
  { key: 'purple', name: 'Purple', hex: '#7c3aed' },
  { key: 'yellow', name: 'Yellow', hex: '#d97706' },
  { key: 'teal', name: 'Teal', hex: '#0d9488' },
  { key: 'rose', name: 'Rose', hex: '#f43f5e' },
  { key: 'orange', name: 'Orange', hex: '#ea580c' },
];

export default function Header({ onToggleSidebar }: HeaderProps) {
  const {
    theme,
    setTheme,
    accent,
    setAccent,
    density,
    setDensity,
    calculations,
    isLiveSupabase,
    language,
    setLanguage,
    t,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    currentMonthLabel,
  } = useMess();

  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <header
      className="no-print header-responsive"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Left: Mobile Menu, Interactive Month Switcher & Live Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm mobile-menu-btn"
          style={{ padding: '0.45rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}
          title={language === 'bn' ? 'মেনু খুলুন' : 'Open Menu'}
        >
          <Menu size={20} />
        </button>

        {/* Interactive Month Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.775rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
            title={language === 'bn' ? 'মাস পরিবর্তন করে পূর্বের হিসেব দেখুন' : 'Change month to view past records'}
          >
            <Calendar size={13} color="var(--primary)" />
            <span>{currentMonthLabel}</span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {showMonthDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '260px',
                background: 'var(--surface-solid)',
                border: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem',
                zIndex: 70,
                animation: 'modalSlideUp 0.15s ease-out',
              }}
            >
              <div
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  padding: '0.25rem 0.5rem 0.45rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '0.35rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{language === 'bn' ? 'হিসাবের মাস নির্বাচন করুন' : 'Select Accounting Month'}</span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  {availableMonths.length} Months
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {availableMonths.map((m) => {
                  const isSelected = selectedMonth === m.value;
                  const label = language === 'bn' ? m.labelBn : m.labelEn;
                  return (
                    <button
                      key={m.value}
                      onClick={() => {
                        setSelectedMonth(m.value);
                        setShowMonthDropdown(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                        background: isSelected ? 'var(--primary-light)' : 'transparent',
                        color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 800 : 500,
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--surface-elevated)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{label}</span>
                      {isSelected && <Check size={13} color="var(--primary)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Meal Rate Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            border: '1px solid var(--border-glass)',
            fontSize: '0.775rem',
            fontWeight: 700,
            color: 'var(--primary)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Flame size={14} />
          <span>
            {language === 'bn' ? 'রেট' : 'Rate'}: ৳{calculations.mealRate.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Right: Language Switcher, Theme, Accent, Density & Connection Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
        {/* Language Switcher Button (বাংলা / English) */}
        <button
          onClick={toggleLanguage}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '0.75rem',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--primary-glow)',
            color: 'var(--text-primary)',
            transition: 'all 0.2s ease',
          }}
          title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
        >
          <Globe size={14} color="var(--primary)" />
          <span style={{ color: language === 'bn' ? 'var(--primary)' : 'var(--text-muted)' }}>বাং</span>
          <span style={{ color: 'var(--border-subtle)' }}>/</span>
          <span style={{ color: language === 'en' ? 'var(--primary)' : 'var(--text-muted)' }}>EN</span>
        </button>

        {/* Backend State Indicator */}
        <div
          className="hide-on-mobile"
          title={isLiveSupabase ? 'Supabase ক্লাউড কানেক্টেড' : 'লোকাল মেমরি ও ব্রাউজার স্টোরেজে চলমান'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: isLiveSupabase ? 'var(--success-bg)' : 'var(--warning-bg)',
            color: isLiveSupabase ? 'var(--success)' : 'var(--warning)',
            fontSize: '0.7rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <Database size={11} />
          <span>{isLiveSupabase ? 'Supabase' : 'Local'}</span>
        </div>

        {/* Density Toggle (Desktop/Tablet only) */}
        <button
          onClick={() => setDensity(density === 'comfortable' ? 'compact' : 'comfortable')}
          className="btn btn-secondary btn-sm hide-on-mobile"
          title={`বর্তমান ডেনসিটি: ${density === 'comfortable' ? 'স্বাচ্ছন্দ্যময়' : 'কমপ্যাক্ট'}`}
          style={{ padding: '0.45rem' }}
        >
          {density === 'comfortable' ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>

        {/* Accent Color Palette Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAccentPicker(!showAccentPicker)}
            className="btn btn-secondary btn-sm"
            title="৮টি অ্যাকসেন্ট কালার প্রিসেট"
            style={{ padding: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <Palette size={15} color="var(--primary)" />
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'inline-block',
              }}
            />
          </button>

          {showAccentPicker && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '200px',
                background: 'var(--surface-solid)',
                border: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem',
                zIndex: 60,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                {language === 'bn' ? 'অ্যাকসেন্ট কালার নির্বাচন' : 'Select Accent Color'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                {accentColors.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      setAccent(c.key);
                      setShowAccentPicker(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      border: accent === c.key ? `2px solid ${c.hex}` : '1px solid var(--border-subtle)',
                      background: 'var(--surface-glass)',
                      cursor: 'pointer',
                      fontSize: '0.725rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.hex, flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.name.split(' ')[0]}
                    </span>
                    {accent === c.key && <Check size={11} color={c.hex} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Day / Night Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}
          className="btn btn-secondary btn-sm"
          title={theme === 'night' ? 'Day মোডে পরিবর্তন করুন' : 'Night মোডে পরিবর্তন করুন'}
          style={{ padding: '0.45rem', display: 'flex', alignItems: 'center' }}
        >
          {theme === 'night' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
        </button>
      </div>

      <style jsx>{`
        .header-responsive {
          height: 64px;
          padding: 0 1rem;
        }
        @media (min-width: 1024px) {
          .header-responsive {
            height: 70px;
            padding: 0 1.5rem;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
