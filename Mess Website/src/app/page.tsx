'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Utensils,
  Flame,
  Wallet,
  Receipt,
  ShoppingCart,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';

export default function DashboardPage() {
  const { mess, members, marketAssignments, expenses, calculations, period } = useMess();

  const activeMembersCount = members.filter((m) => m.isActive).length;
  const netSurplus = calculations.totalDeposits - calculations.totalExpenses;

  // Next upcoming market
  const upcomingMarket = marketAssignments.find((a) => a.status === 'assigned');
  const upcomingMember = upcomingMarket
    ? members.find((m) => m.id === upcomingMarket.memberId)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, var(--surface-glass) 0%, var(--primary-light) 100%)',
        }}
      >
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {mess.name} — কেন্দ্রীয় ড্যাশবোর্ড
          </div>
          <h2 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.65rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem', lineHeight: 1.3 }}>
            সুপ্রভাত, ম্যানেজার তানভীর প্রanto 👋
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
            অক্টোবর ২০২৬ হিসাবের বর্তমান সারসংক্ষেপ এবং মেসের সার্বিক আর্থিক চিত্র নিচে দেওয়া হলো।
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="mobile-full-width">
          <Link href="/meals" className="btn btn-primary btn-sm mobile-full-width">
            <Utensils size={15} />
            <span>বাল্ক মিল এন্ট্রি</span>
          </Link>
          <Link href="/accounts" className="btn btn-secondary btn-sm mobile-full-width">
            <PlusCircle size={15} />
            <span>খরচ / জমা রেকর্ড</span>
          </Link>
          <Link href="/reports" className="btn btn-secondary btn-sm mobile-full-width">
            <FileText size={15} />
            <span>রিপোর্ট ডাউনলোড</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: '0.85rem',
        }}
      >
        {/* Metric 1: Live Meal Rate */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>বর্তমান মিল রেট</span>
            <div style={{ padding: '0.35rem', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
              <Flame size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0', lineHeight: 1.2 }}>
            ৳{calculations.mealRate.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            প্রতি মিল খরচ (বাজার অনুপাত)
          </div>
        </div>

        {/* Metric 2: Total Meals */}
        <div className="glass-card" style={{ borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>মোট খাওয়া মিল</span>
            <div style={{ padding: '0.35rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', flexShrink: 0 }}>
              <Utensils size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0', lineHeight: 1.2 }}>
            {calculations.totalMeals} টি
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            {activeMembersCount} জন সক্রিয় সদস্যের মিল
          </div>
        </div>

        {/* Metric 3: Total Meal Expenses */}
        <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>বাজারের খরচ</span>
            <div style={{ padding: '0.35rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', flexShrink: 0 }}>
              <ShoppingCart size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0', lineHeight: 1.2 }}>
            ৳{calculations.eligibleMealExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            মিল রেটে হিসাবভুক্ত মোট খরচ
          </div>
        </div>

        {/* Metric 4: Total Deposits */}
        <div className="glass-card" style={{ borderLeft: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>মোট মেম্বার জমা</span>
            <div style={{ padding: '0.35rem', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', flexShrink: 0 }}>
              <Wallet size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0', lineHeight: 1.2 }}>
            ৳{calculations.totalDeposits.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            সকল সদস্যের সংগৃহীত ডিপোজিট
          </div>
        </div>

        {/* Metric 5: Net Mess Balance */}
        <div className="glass-card" style={{ borderLeft: `4px solid ${netSurplus >= 0 ? '#10b981' : '#ef4444'}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>মেসের নেট ক্যাশ</span>
            <div style={{ padding: '0.35rem', borderRadius: '8px', background: netSurplus >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)', color: netSurplus >= 0 ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
              {netSurplus >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 800, color: netSurplus >= 0 ? 'var(--success)' : 'var(--danger)', margin: '0.35rem 0', lineHeight: 1.2 }}>
            ৳{Math.abs(netSurplus).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            {netSurplus >= 0 ? 'ম্যানেজারের হাতে জমা ক্যাশ' : 'ঘাটতি (সদস্যদের বকেয়া)'}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Market & Monthly Closing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
        {/* Next Market Duty Banner */}
        <div className="glass-panel" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <ShoppingCart size={17} color="var(--primary)" />
              <span>আসন্ন বাজারের দায়িত্ব</span>
            </h3>
            <Link href="/market" style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              সম্পূর্ণ শিডিউল →
            </Link>
          </div>

          {upcomingMarket && upcomingMember ? (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {upcomingMember.roomNo}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {upcomingMember.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    {upcomingMarket.assignmentDate} • {upcomingMarket.slotLabel}
                  </div>
                </div>
              </div>
              <span className="badge badge-warning" style={{ flexShrink: 0 }}>অ্যাসাইনড</span>
            </div>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              চলতি মাসে কোনো পেন্ডিং বাজার শিডিউল নেই।
            </div>
          )}
        </div>

        {/* Period Lock Warning */}
        <div className="glass-panel" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <AlertCircle size={17} color="var(--warning)" />
              <span>মাসিক ক্লোজিং স্ট্যাটাস</span>
            </h3>
            <Link href="/settlement" style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              সেটলমেন্ট উইজার্ড →
            </Link>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: period.status === 'locked' ? 'var(--danger-bg)' : 'var(--success-bg)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: period.status === 'locked' ? 'var(--danger)' : 'var(--success)' }}>
              {period.status === 'locked' ? '🔒 হিসাব চূড়ান্ত ও লক করা হয়েছে' : '🟢 হিসাব চলমান (এন্ট্রি ও পরিবর্তন সম্ভব)'}
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              {period.status === 'locked'
                ? 'মাসের মিল ও খরচের অডিট বন্ধ রয়েছে। পরিবর্তন করতে চাইলে আনলক করতে হবে।'
                : 'সকল সদস্যের মিল ও খরচের ভাউচার এন্ট্রি শেষে মান্থলি ক্লোজ বাটনে চাপ দিন।'}
            </div>
          </div>
        </div>
      </div>

      {/* Member Live Financial Table with Guaranteed Horizontal Scroll */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              মেম্বারদের বর্তমান ব্যালেন্স শিট
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              খাওয়া মিলের মোট খরচ ও মোট জমার ভিত্তিতে লাইভ ব্যালেন্স
            </p>
          </div>
          <Link href="/reports" className="btn btn-secondary btn-sm">
            পূর্ণাঙ্গ স্টেটমেন্ট →
          </Link>
        </div>

        <div className="glass-table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>সদস্যের নাম</th>
                <th>রুম নং</th>
                <th>খাওয়া মিল</th>
                <th>মিল খরচ (৳)</th>
                <th>ফিক্সড খরচ (৳)</th>
                <th>মোট জমা (৳)</th>
                <th>বর্তমান ব্যালেন্স (৳)</th>
                <th>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {calculations.statements.map((s) => (
                <tr key={s.memberId}>
                  <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{s.memberName}</td>
                  <td>{s.roomNo || '-'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.totalMeals}</span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                      ({s.breakfastCount}/{s.lunchCount}/{s.dinnerCount})
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>৳{s.mealCost.toLocaleString()}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>৳{s.individualExpenses.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: '#10b981', whiteSpace: 'nowrap' }}>৳{s.totalDeposits.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: s.netBalance >= 0 ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                    {s.netBalance >= 0 ? `+৳${s.netBalance.toLocaleString()}` : `-৳${Math.abs(s.netBalance).toLocaleString()}`}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`badge ${s.netBalance >= 0 ? 'badge-success' : 'badge-danger'}`}>
                      {s.netBalance >= 0 ? 'পাওনাদার' : 'বকেয়া'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
