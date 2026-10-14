'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Flame,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  Calendar,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import { useUIFeedback } from '@/context/UIFeedbackContext';
import MemberGridCard from '@/components/MemberGridCard';
import MemberAuditSlipModal from '@/components/MemberAuditSlipModal';

export default function SettlementPage() {
  const {
    mess,
    period,
    lockPeriod,
    unlockPeriod,
    calculations,
    members,
    deposits,
    expenses,
    language,
    t,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    currentMonthLabel,
  } = useMess();

  const { showToast, confirm } = useUIFeedback();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [auditMemberId, setAuditMemberId] = useState<string | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handleLock = async () => {
    const ok = await confirm({
      title: language === 'bn' ? 'হিসাব চূড়ান্তভাবে লক করা' : 'Lock Account Period',
      message: language === 'bn'
        ? `আপনি কি নিশ্চিত যে ${currentMonthLabel} হিসাব চূড়ান্তভাবে লক করতে চান? লক করার পর সাধারণ মিল বা খরচ পরিবর্তন করা যাবে না।`
        : `Are you sure you want to finalize and lock the accounts for ${currentMonthLabel}?`,
      confirmText: language === 'bn' ? 'হ্যাঁ, লক করুন' : 'Yes, Lock Period',
      cancelText: language === 'bn' ? 'বাতিল' : 'Cancel',
      type: 'warning',
    });
    if (ok) {
      lockPeriod();
      showToast(
        language === 'bn'
          ? `${currentMonthLabel} হিসাব সফলভাবে লক করা হয়েছে!`
          : `Accounts for ${currentMonthLabel} successfully locked!`,
        'success'
      );
    }
  };

  const handleUnlock = async () => {
    const ok = await confirm({
      title: language === 'bn' ? 'হিসাব আনলক করা' : 'Unlock Account Period',
      message: language === 'bn'
        ? 'আপনি কি এই মাসের হিসাব পুনরায় আনলক করতে চান? আনলক করলে নতুন মিল বা লেনদেন এন্ট্রি করা যাবে।'
        : 'Do you want to unlock this account period for further edits?',
      confirmText: language === 'bn' ? 'হ্যাঁ, আনলক করুন' : 'Yes, Unlock',
      cancelText: language === 'bn' ? 'বাতিল' : 'Cancel',
      type: 'info',
    });
    if (ok) {
      unlockPeriod();
      showToast(
        language === 'bn'
          ? 'হিসাব সফলভাবে আনলক করা হয়েছে!'
          : 'Account period successfully unlocked!',
        'success'
      );
    }
  };

  const handleOpenMemberAudit = (memberId: string) => {
    setAuditMemberId(memberId);
    setIsAuditModalOpen(true);
  };

  const modalMember = members.find((m) => m.id === auditMemberId) || members[0];
  const modalStatement = calculations.statements.find((s) => s.memberId === modalMember?.id) || calculations.statements[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: 1.3 }}>
            <Calculator size={24} color="var(--primary)" />
            <span>{t('settlement')} ({currentMonthLabel})</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {language === 'bn'
              ? 'মাসের মোট মিল ও খরচের নির্ভুল মিল রেট গণনা, ব্যক্তিগত ব্যালেন্স শিট প্রস্তুত এবং অডিট লক উইজার্ড'
              : 'Accurate monthly meal rate settlement, personal ledger calculation and audit locking wizard'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }} className="mobile-full-width">
          {/* Month selector dropdown */}
          <select
            className="form-select mobile-full-width"
            style={{
              width: 'auto',
              padding: '0.4rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary)',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--primary-glow)',
            }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value}>
                📅 {language === 'bn' ? m.labelBn : m.labelEn}
              </option>
            ))}
          </select>

          <Link href="/reports" className="btn btn-secondary btn-sm mobile-full-width">
            <FileSpreadsheet size={15} />
            <span>{t('officialReports')}</span>
          </Link>

          {period.status === 'locked' ? (
            <button onClick={handleUnlock} className="btn btn-secondary btn-sm mobile-full-width" style={{ color: 'var(--warning)' }}>
              <Unlock size={15} />
              <span>{language === 'bn' ? 'হিসাব আনলক করুন' : 'Unlock Account'}</span>
            </button>
          ) : (
            <button onClick={handleLock} className="btn btn-primary btn-sm mobile-full-width" style={{ background: '#10b981' }}>
              <Lock size={15} />
              <span>{language === 'bn' ? 'হিসাব চূড়ান্ত ও লক করুন' : 'Finalize & Lock'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Lock Status Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.15rem 1.25rem',
          borderLeft: `5px solid ${period.status === 'locked' ? '#ef4444' : '#10b981'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: period.status === 'locked' ? 'var(--danger-bg)' : 'var(--success-bg)',
              color: period.status === 'locked' ? 'var(--danger)' : 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {period.status === 'locked' ? <Lock size={22} /> : <ShieldCheck size={22} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {period.status === 'locked'
                ? (language === 'bn' ? `🔒 ${currentMonthLabel} হিসাব চূড়ান্তভাবে অডিট ও লক করা হয়েছে` : `🔒 ${currentMonthLabel} account is officially audited & locked`)
                : (language === 'bn' ? `🟢 ${currentMonthLabel} হিসাব বর্তমানে ওপেন ও পরিবর্তনযোগ্য` : `🟢 ${currentMonthLabel} account is currently open & editable`)}
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
              {period.status === 'locked'
                ? (language === 'bn' ? `ক্লোজ করেছেন: ${period.closedBy || 'ম্যানেজার'} • সময়: ${period.closedAt || 'অদ্যাবধি'}` : `Closed by: ${period.closedBy || 'Manager'} • Date: ${period.closedAt || 'Recorded'}`)
                : (language === 'bn' ? 'সকল সদস্যের মিল ও বাজার খরচ যাচাই শেষ হলে ওপরের লক বাটনে চাপ দিয়ে মাস সমাপ্ত করুন।' : 'Review all meals & expenses and finalize the month when ready.')}
            </div>
          </div>
        </div>

        <span className={`badge ${period.status === 'locked' ? 'badge-danger' : 'badge-success'}`} style={{ padding: '0.35rem 0.75rem', flexShrink: 0 }}>
          {language === 'bn' ? 'স্ট্যাটাস' : 'Status'}: {period.status.toUpperCase()}
        </span>
      </div>

      {/* Settlement Calculation Math Breakdown */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
          <Flame size={17} color="var(--primary)" />
          <span>{language === 'bn' ? 'মিল রেট ও খরচের গাণিতিক হিসাব (Mathematical Breakdown)' : 'Meal Rate & Cost Breakdown'}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.85rem' }}>
          <div className="glass-card">
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {language === 'bn' ? 'বাজারের মোট খরচ (E_meal)' : 'Total Market Cost (E_meal)'}
            </span>
            <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
              ৳{calculations.eligibleMealExpenses.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {language === 'bn' ? 'মিল রেটে বরাদ্দযোগ্য খরচ' : 'Eligible for meal rate'}
            </div>
          </div>

          <div className="glass-card">
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {language === 'bn' ? 'সবার মোট খাওয়া মিল (M_total)' : 'Total Mess Meals (M_total)'}
            </span>
            <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>
              {calculations.totalMeals} {language === 'bn' ? 'টি মিল' : 'Meals'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {language === 'bn' ? 'সকল সদস্যের সমন্বিত মিল' : 'All members combined'}
            </div>
          </div>

          <div className="glass-card" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 800 }}>
              {language === 'bn' ? 'ফাইনাল মিল রেট (R = E / M)' : 'Final Meal Rate (R = E / M)'}
            </span>
            <div style={{ fontSize: 'clamp(1.35rem, 4vw, 1.6rem)', fontWeight: 900, color: 'var(--primary)', margin: '0.25rem 0' }}>
              ৳{calculations.mealRate.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>
              {language === 'bn' ? 'প্রতি মিল বাবদ খাবার খরচ' : 'Food cost per meal'}
            </div>
          </div>

          <div className="glass-card">
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {language === 'bn' ? 'ফিক্সড খরচ (মাথাপিছু ভাগ)' : 'Fixed Cost (Per Capita)'}
            </span>
            <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)', fontWeight: 800, color: '#f59e0b', margin: '0.25rem 0' }}>
              ৳{(calculations.fixedSharedExpenses / (members.filter(m => m.isActive).length || 1)).toFixed(2)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {language === 'bn' ? 'ওয়াইফাই ও বুয়া বিল ইত্যাদি' : 'Wifi, Cook & Maid bill'}
            </div>
          </div>
        </div>
      </div>

      {/* Final Settlement Ledger & Grid Mode Container */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {language === 'bn' ? 'সদস্যভিত্তিক চূড়ান্ত লেনদেন ও সেটলমেন্ট শিট' : 'Member Settlement Ledger'}
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
              {language === 'bn'
                ? 'প্রত্যেক সদস্যের জমার টাকা থেকে মিল খরচ ও ফিক্সড শেয়ার সমন্বয় করে প্রাপ্ত চূড়ান্ত ব্যালেন্স:'
                : 'Final member balance reconciled from total deposits, meal costs and fixed shares:'}
            </p>
          </div>

          {/* Table / Grid Mode Toggle */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--surface-elevated)',
              padding: '0.2rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              <TableIcon size={14} />
              <span>{t('tableView')}</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              <LayoutGrid size={14} />
              <span>{t('gridMode')}</span>
            </button>
          </div>
        </div>

        {/* View A: Table View */}
        {viewMode === 'table' ? (
          <div className="glass-table-wrapper">
            <table className="glass-table" style={{ minWidth: '720px' }}>
              <thead>
                <tr>
                  <th>{t('memberName')}</th>
                  <th>{t('room')}</th>
                  <th>{t('totalMeals')}</th>
                  <th>{t('mealRate')}</th>
                  <th>{t('mealCost')}</th>
                  <th>{t('fixedCost')}</th>
                  <th>{t('totalDeposits')}</th>
                  <th>{t('finalBalance')}</th>
                  <th>{language === 'bn' ? 'সিদ্ধান্ত' : 'Status'}</th>
                  <th style={{ textAlign: 'right' }}>{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {calculations.statements.map((s) => (
                  <tr
                    key={s.memberId}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenMemberAudit(s.memberId)}
                    title="Click to view full statement slip"
                  >
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{s.memberName}</td>
                    <td>{s.roomNo || '-'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{s.totalMeals}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>৳{calculations.mealRate.toFixed(2)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>৳{s.mealCost.toLocaleString()}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>৳{s.individualExpenses.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>৳{s.totalDeposits.toLocaleString()}</td>
                    <td style={{ fontWeight: 900, fontSize: '0.95rem', color: s.netBalance >= 0 ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                      {s.netBalance >= 0 ? `+৳${s.netBalance.toLocaleString()}` : `-৳${Math.abs(s.netBalance).toLocaleString()}`}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {s.netBalance >= 0 ? (
                        <span className="badge badge-success">{t('surplusMessWillPay')}</span>
                      ) : (
                        <span className="badge badge-danger">{t('dueMemberWillPay')}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMemberAudit(s.memberId);
                        }}
                        className="btn btn-sm"
                        style={{
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.725rem',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Eye size={12} />
                        <span>{t('viewSlip')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* View B: Grid Mode */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1rem',
            }}
          >
            {calculations.statements.map((s) => {
              const mem = members.find((m) => m.id === s.memberId);
              if (!mem) return null;
              return (
                <MemberGridCard
                  key={s.memberId}
                  member={mem}
                  statement={s}
                  mealRate={calculations.mealRate}
                  expenses={expenses.filter(e => !e.expenseDate || e.expenseDate.startsWith(selectedMonth))}
                  onOpenDetails={() => handleOpenMemberAudit(mem.id)}
                  language={language}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Member Audit Slip & Download Modal */}
      {isAuditModalOpen && modalMember && modalStatement && (
        <MemberAuditSlipModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          member={modalMember}
          statement={modalStatement}
          mess={mess}
          mealRate={calculations.mealRate}
          deposits={deposits.filter(d => !d.depositDate || d.depositDate.startsWith(selectedMonth))}
          expenses={expenses.filter(e => !e.expenseDate || e.expenseDate.startsWith(selectedMonth))}
          monthName={currentMonthLabel}
          language={language}
        />
      )}
    </div>
  );
}
