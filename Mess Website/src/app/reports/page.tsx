'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building,
  User,
  ShieldCheck,
  CheckCircle,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  FileText,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import MemberGridCard from '@/components/MemberGridCard';
import MemberAuditSlipModal from '@/components/MemberAuditSlipModal';

export default function ReportsPage() {
  const {
    mess,
    members,
    calculations,
    period,
    deposits,
    expenses,
    language,
    t,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    currentMonthLabel,
  } = useMess();

  const [reportType, setReportType] = useState<'whole_mess' | 'member_statement'>('whole_mess');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');

  // Modal State for Individual Member Detailed Audit Slip
  const [auditMemberId, setAuditMemberId] = useState<string | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const selectedMemberStatement = calculations.statements.find(
    (s) => s.memberId === selectedMemberId
  );
  const selectedMember = members.find((m) => m.id === selectedMemberId);
  const memberDeposits = deposits.filter((d) => d.memberId === selectedMemberId && (!d.depositDate || d.depositDate.startsWith(selectedMonth)));

  // Active member for modal
  const modalMember = members.find((m) => m.id === auditMemberId) || selectedMember || members[0];
  const modalStatement = calculations.statements.find((s) => s.memberId === modalMember?.id) || calculations.statements[0];

  const handleOpenMemberAudit = (memberId: string) => {
    setAuditMemberId(memberId);
    setIsAuditModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Action Bar (Hidden on Print) */}
      <div
        className="glass-panel no-print"
        style={{
          padding: '1.15rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.35rem)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: 1.3 }}>
            <FileSpreadsheet size={22} color="var(--primary)" />
            <span>{t('officialReports')}</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {t('reportsSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }} className="mobile-full-width">
          {/* Month Selector in Report Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="mobile-full-width">
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
          </div>

          {/* Report Type Selector */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }} className="mobile-full-width">
            <button
              onClick={() => setReportType('whole_mess')}
              className="btn btn-sm"
              style={{
                flex: '1 1 auto',
                background: reportType === 'whole_mess' ? 'var(--primary)' : 'var(--surface-elevated)',
                color: reportType === 'whole_mess' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
              }}
            >
              {t('wholeMessReport')}
            </button>
            <button
              onClick={() => setReportType('member_statement')}
              className="btn btn-sm"
              style={{
                flex: '1 1 auto',
                background: reportType === 'member_statement' ? 'var(--primary)' : 'var(--surface-elevated)',
                color: reportType === 'member_statement' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
              }}
            >
              {t('memberStatement')}
            </button>
          </div>

          {/* Table / Grid Mode Toggle (Available in Whole Mess view) */}
          {reportType === 'whole_mess' && (
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'var(--surface-elevated)',
                padding: '0.2rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
              className="mobile-full-width"
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
                  flex: '1 1 auto',
                  justifyContent: 'center',
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
                  flex: '1 1 auto',
                  justifyContent: 'center',
                }}
              >
                <LayoutGrid size={14} />
                <span>{t('gridMode')}</span>
              </button>
            </div>
          )}

          {reportType === 'member_statement' && (
            <select
              className="form-select mobile-full-width"
              style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.85rem' }}
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({language === 'bn' ? `রুম ${m.roomNo}` : `Room ${m.roomNo}`})
                </option>
              ))}
            </select>
          )}

          <button onClick={handlePrint} className="btn btn-primary btn-sm mobile-full-width">
            <Printer size={15} />
            <span>{t('printButton')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="glass-panel print-area"
        style={{
          padding: 'clamp(1rem, 4vw, 2.5rem)',
          background: 'var(--surface-solid)',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Report Official Header */}
        <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 'normal' }}>
              {mess.name}
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {language === 'bn' ? 'ঠিকানা:' : 'Address:'} {mess.address || 'ঢাকা, বাংলাদেশ'} • {language === 'bn' ? 'ফোন:' : 'Phone:'} {mess.phone || '-'}
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>
                {reportType === 'whole_mess'
                  ? viewMode === 'grid'
                    ? (language === 'bn' ? `মাসিক পূর্ণাঙ্গ অডিট ও ব্যালেন্স শিট — গ্রিড কার্ড মোড (${currentMonthLabel})` : `Monthly Audit & Balance Sheet — Grid Mode (${currentMonthLabel})`)
                    : (language === 'bn' ? `মাসিক পূর্ণাঙ্গ অডিট ও ব্যালেন্স শিট (${currentMonthLabel})` : `Monthly Full Audit & Balance Sheet (${currentMonthLabel})`)
                  : (language === 'bn' ? `সদস্যের একক মাসিক হিসাব বিবরণী — ${selectedMember?.name} (${currentMonthLabel})` : `Member Monthly Statement — ${selectedMember?.name} (${currentMonthLabel})`)}
              </span>
              {reportType === 'whole_mess' && viewMode === 'grid' && (
                <span className="badge badge-primary no-print" style={{ fontSize: '0.7rem' }}>
                  {t('gridActiveBadge')}
                </span>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('accountMonth')}:</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentMonthLabel}</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {t('generatedOn')}: {new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* View 1: Whole Mess Summary Report */}
        {reportType === 'whole_mess' && (
          <div>
            {/* Top Stat Boxes for Paper */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('totalMeals')}:</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>{calculations.totalMeals} {language === 'bn' ? 'টি' : 'Meals'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('marketExpensesMealRate')}:</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>৳{calculations.eligibleMealExpenses.toLocaleString()}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('finalMealRate')}:</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>৳{calculations.mealRate.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('totalCollectedDeposits')}:</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>৳{calculations.totalDeposits.toLocaleString()}</div>
              </div>
            </div>

            {/* Mode A: Table View */}
            {viewMode === 'table' && (
              <div className="glass-table-wrapper">
                <table className="glass-table" style={{ width: '100%', minWidth: '700px', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr>
                      <th>{t('serial')}</th>
                      <th>{t('memberName')}</th>
                      <th>{t('room')}</th>
                      <th>{t('totalMeals')}</th>
                      <th>{t('mealRate')}</th>
                      <th>{t('mealCost')}</th>
                      <th>{t('fixedCost')}</th>
                      <th>{t('totalDeposits')}</th>
                      <th>{t('finalBalance')}</th>
                      <th className="no-print" style={{ textAlign: 'right' }}>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.statements.map((s, index) => (
                      <tr
                        key={s.memberId}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpenMemberAudit(s.memberId)}
                        title="Click to view full statement slip"
                      >
                        <td>{index + 1}</td>
                        <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                          <span style={{ color: 'var(--text-primary)' }}>{s.memberName}</span>
                        </td>
                        <td>{s.roomNo || '-'}</td>
                        <td style={{ fontWeight: 700 }}>{s.totalMeals}</td>
                        <td>৳{calculations.mealRate.toFixed(2)}</td>
                        <td>৳{s.mealCost.toLocaleString()}</td>
                        <td>৳{s.individualExpenses.toLocaleString()}</td>
                        <td style={{ fontWeight: 700, color: '#10b981' }}>৳{s.totalDeposits.toLocaleString()}</td>
                        <td style={{ fontWeight: 800, color: s.netBalance >= 0 ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                          {s.netBalance >= 0 ? `+৳${s.netBalance.toLocaleString()}` : `-৳${Math.abs(s.netBalance).toLocaleString()}`}
                        </td>
                        <td className="no-print" style={{ textAlign: 'right' }}>
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
            )}

            {/* Mode B: Grid Mode (Individual Cards for Each Member) */}
            {viewMode === 'grid' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  className="no-print"
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {t('gridHint')}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    {calculations.statements.length} {t('totalMembersCount')}
                  </span>
                </div>

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
              </div>
            )}
          </div>
        )}

        {/* View 2: Individual Member Statement */}
        {reportType === 'member_statement' && selectedMemberStatement && selectedMember && (
          <div>
            <div
              style={{
                padding: '1rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                background: 'var(--surface-elevated)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.85rem', flex: 1 }}>
                <div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t('memberName')}:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedMemberStatement.memberName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{language === 'bn' ? 'রুম ও মোবাইল:' : 'Room & Phone:'}</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{language === 'bn' ? `রুম ${selectedMemberStatement.roomNo}` : `Room ${selectedMemberStatement.roomNo}`} • {selectedMemberStatement.mobile}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{language === 'bn' ? 'বর্তমান ব্যালেন্স:' : 'Current Balance:'}</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: selectedMemberStatement.netBalance >= 0 ? '#10b981' : '#ef4444' }}>
                    {selectedMemberStatement.netBalance >= 0
                      ? `+৳${selectedMemberStatement.netBalance.toLocaleString()} (${t('surplusMessWillPay')})`
                      : `-৳${Math.abs(selectedMemberStatement.netBalance).toLocaleString()} (${t('due')})`}
                  </div>
                </div>
              </div>

              {/* Direct Full Voucher Modal / Download trigger */}
              <div className="no-print">
                <button
                  onClick={() => handleOpenMemberAudit(selectedMember.id)}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontWeight: 700,
                  }}
                >
                  <FileText size={15} />
                  <span>{language === 'bn' ? 'পূর্ণাঙ্গ ভাউচার ও ছবি/PDF ডাউনলোড' : 'Full Voucher & PDF/Image'}</span>
                </button>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.65rem' }}>
              {t('depositHistoryTitle')}
            </h4>
            <div className="glass-table-wrapper">
              <table className="glass-table" style={{ width: '100%', minWidth: '550px', marginBottom: '1.5rem' }}>
                <thead>
                  <tr>
                    <th>{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                    <th>{language === 'bn' ? 'পেমেন্ট মেথড' : 'Method'}</th>
                    <th>{language === 'bn' ? 'রেফারেন্স / TrxID' : 'Reference / TrxID'}</th>
                    <th style={{ textAlign: 'right' }}>{language === 'bn' ? 'জমার পরিমাণ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {memberDeposits.length > 0 ? (
                    memberDeposits.map((d) => (
                      <tr key={d.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{d.depositDate}</td>
                        <td style={{ textTransform: 'uppercase' }}>{d.paymentMethod}</td>
                        <td>{d.referenceNote || '-'}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>+৳{Number(d.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                        {language === 'bn' ? 'এই মাসে কোনো জমার রেকর্ড পাওয়া যায়নি।' : 'No deposit records found for this month.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Signature Line for Official Transparency */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-subtle)', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ width: '160px', borderBottom: '1px solid var(--text-muted)', marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('managerSign')}</span>
          </div>

          <div>
            <div style={{ width: '160px', borderBottom: '1px solid var(--text-muted)', marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('memberSign')}</span>
          </div>
        </div>
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
