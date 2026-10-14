'use client';

import React from 'react';
import {
  User,
  ShoppingBag,
  CreditCard,
  Utensils,
  ArrowUpRight,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { Member, MemberMonthlyStatement, Expense } from '@/types';
import { Language } from '@/lib/translations';

interface MemberGridCardProps {
  member: Member;
  statement: MemberMonthlyStatement;
  mealRate: number;
  expenses: Expense[];
  onOpenDetails: () => void;
  language?: Language;
}

export default function MemberGridCard({
  member,
  statement,
  mealRate,
  expenses,
  onOpenDetails,
  language = 'bn',
}: MemberGridCardProps) {
  // Compute total market shopping done by this member
  const memberMarketExpenses = expenses.filter(
    (e) => e.paidByMemberId === member.id && e.category === 'market'
  );
  const totalMarketPaid = memberMarketExpenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );

  const isSurplus = statement.netBalance >= 0;

  const roleLabel = () => {
    if (member.role === 'owner') return language === 'bn' ? 'মালিক' : 'Owner';
    if (member.role === 'manager') return language === 'bn' ? 'ম্যানেজার' : 'Manager';
    return language === 'bn' ? 'সদস্য' : 'Member';
  };

  return (
    <div
      onClick={onOpenDetails}
      className="glass-card"
      style={{
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: 'var(--surface-solid)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Top accent glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: isSurplus ? '#10b981' : '#ef4444',
        }}
      />

      {/* Card Header: Avatar, Name, Room, Role */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: isSurplus ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: isSurplus ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                flexShrink: 0,
              }}
            >
              {member.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.25 }}>
                {member.name}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <span>{language === 'bn' ? `রুম ${member.roomNo || '-'}` : `Room ${member.roomNo || '-'}`}</span>
                <span>•</span>
                <span>{member.mobile || (language === 'bn' ? 'ফোন নেই' : 'No Phone')}</span>
              </div>
            </div>
          </div>

          <span
            className="badge"
            style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              backgroundColor: member.role === 'manager' || member.role === 'owner' ? 'var(--warning-bg)' : 'var(--primary-light)',
              color: member.role === 'manager' || member.role === 'owner' ? 'var(--warning)' : 'var(--primary)',
              flexShrink: 0,
            }}
          >
            {roleLabel()}
          </span>
        </div>

        {/* Balance Hero Box */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isSurplus ? 'var(--success-bg)' : 'var(--danger-bg)',
            border: `1px solid ${isSurplus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: isSurplus ? '#065f46' : '#991b1b',
                display: 'block',
              }}
            >
              {isSurplus
                ? (language === 'bn' ? 'উদ্বৃত্ত ব্যালেন্স (মেস ফেরত দেবে)' : 'Surplus (Payable by Mess)')
                : (language === 'bn' ? 'বকেয়া ব্যালেন্স (মেসের পাওনা)' : 'Due (Payable by Member)')}
            </span>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: isSurplus ? 'var(--success)' : 'var(--danger)',
                lineHeight: 1.2,
                marginTop: '0.15rem',
              }}
            >
              {isSurplus ? `+৳${statement.netBalance.toLocaleString()}` : `-৳${Math.abs(statement.netBalance).toLocaleString()}`}
            </div>
          </div>

          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: isSurplus ? '#10b981' : '#ef4444',
              color: '#ffffff',
              fontSize: '0.725rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {isSurplus ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            <span>
              {isSurplus
                ? (language === 'bn' ? 'পাবে' : 'Surplus')
                : (language === 'bn' ? 'বাকি' : 'Due')}
            </span>
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.65rem',
            marginBottom: '1rem',
          }}
        >
          {/* Total Meals */}
          <div
            style={{
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Utensils size={11} color="var(--primary)" />
              <span>{language === 'bn' ? 'মোট মিল' : 'Total Meals'}</span>
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {statement.totalMeals} {language === 'bn' ? 'টি' : 'Meals'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {language === 'bn' ? 'খরচ' : 'Cost'}: ৳{statement.mealCost.toLocaleString()}
            </div>
          </div>

          {/* Total Deposits */}
          <div
            style={{
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CreditCard size={11} color="#10b981" />
              <span>{language === 'bn' ? 'মোট জমা' : 'Total Deposits'}</span>
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', marginTop: '0.15rem' }}>
              ৳{statement.totalDeposits.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {language === 'bn' ? 'ফিক্সড' : 'Fixed'}: ৳{statement.individualExpenses.toLocaleString()}
            </div>
          </div>

          {/* Market Expense (বাজার খরচ) */}
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '0.65rem 0.75rem',
              backgroundColor: totalMarketPaid > 0 ? 'var(--primary-light)' : 'var(--surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${totalMarketPaid > 0 ? 'var(--primary)' : 'var(--border-subtle)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: totalMarketPaid > 0 ? 'var(--primary)' : 'var(--surface-solid)',
                  color: totalMarketPaid > 0 ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={12} />
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: totalMarketPaid > 0 ? 'var(--primary)' : 'var(--text-secondary)' }}>
                  {language === 'bn' ? 'সে বাজার করছে কত:' : 'Market Paid by Member:'}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
                  {totalMarketPaid > 0
                    ? (language === 'bn' ? `${memberMarketExpenses.length} টি বাজার করেছেন` : `${memberMarketExpenses.length} shopping trips`)
                    : (language === 'bn' ? 'কোনো বাজার করেননি' : 'No market trips')}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 900, color: totalMarketPaid > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
              ৳{totalMarketPaid.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div
        style={{
          borderTop: '1px dashed var(--border-subtle)',
          paddingTop: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <FileText size={12} />
          <span>{language === 'bn' ? 'ক্লিক করে রিপোর্ট দেখুন' : 'Click to view report'}</span>
        </span>

        <button
          className="btn btn-sm"
          style={{
            fontSize: '0.75rem',
            padding: '0.35rem 0.65rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            border: 'none',
          }}
        >
          <span>{language === 'bn' ? 'পূর্ণাঙ্গ ভাউচার' : 'Full Voucher'}</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}
