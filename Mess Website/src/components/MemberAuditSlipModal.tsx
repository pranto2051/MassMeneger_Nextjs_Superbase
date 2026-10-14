'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  FileText,
  Printer,
  ShoppingBag,
  CreditCard,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Phone,
  Calendar,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Member, MemberMonthlyStatement, Mess, Deposit, Expense } from '@/types';
import { Language } from '@/lib/translations';
import { useUIFeedback } from '@/context/UIFeedbackContext';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface MemberAuditSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  statement: MemberMonthlyStatement;
  mess: Mess;
  mealRate: number;
  deposits: Deposit[];
  expenses: Expense[];
  monthName?: string;
  language?: Language;
}

export default function MemberAuditSlipModal({
  isOpen,
  onClose,
  member,
  statement,
  mess,
  mealRate,
  deposits,
  expenses,
  monthName = 'অক্টোবর ২০২৬',
  language = 'bn',
}: MemberAuditSlipModalProps) {
  const slipRef = useRef<HTMLDivElement>(null);
  const { showToast } = useUIFeedback();
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen) return null;

  // Filter expenses paid by this member
  const memberExpenses = expenses.filter((e) => e.paidByMemberId === member.id);
  const totalMarketPaid = memberExpenses
    .filter((e) => e.category === 'market')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalExpensesPaid = memberExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Filter deposits made by this member
  const memberDeposits = deposits.filter((d) => d.memberId === member.id);

  const isSurplus = statement.netBalance >= 0;

  // Download as Image (PNG)
  const handleDownloadImage = async () => {
    if (!slipRef.current) return;
    setIsExportingImage(true);
    try {
      const dataUrl = await toPng(slipRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `${member.name}-${language === 'bn' ? 'হিসাব-রিপোর্ট' : 'audit-report'}-${monthName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      showToast(
        language === 'bn'
          ? `${member.name}-এর হিসাব স্লিপ ছবি (PNG) সফলভাবে ডাউনলোড হয়েছে!`
          : `Statement slip for ${member.name} successfully downloaded as PNG!`,
        'success'
      );
    } catch (err) {
      console.error('Failed to export image:', err);
      showToast(
        language === 'bn' ? 'ছবি তৈরি করতে সমস্যা হয়েছে।' : 'Failed to generate image.',
        'error'
      );
    } finally {
      setIsExportingImage(false);
    }
  };

  // Download as PDF
  const handleDownloadPdf = async () => {
    if (!slipRef.current) return;
    setIsExportingPdf(true);
    try {
      const dataUrl = await toPng(slipRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${member.name}-${language === 'bn' ? 'অডিট-রিপোর্ট' : 'audit-report'}-${monthName.replace(/\s+/g, '_')}.pdf`);
      showToast(
        language === 'bn'
          ? `${member.name}-এর অডিট রিপোর্ট PDF সফলভাবে ডাউনলোড হয়েছে!`
          : `Full audit report for ${member.name} successfully downloaded as PDF!`,
        'success'
      );
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast(
        language === 'bn' ? 'PDF তৈরি করতে সমস্যা হয়েছে।' : 'Failed to generate PDF.',
        'error'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--surface-solid)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-glass)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.25s ease-out',
        }}
      >
        {/* Modal Header & Quick Actions Bar */}
        <div
          className="no-print"
          style={{
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} />
            </span>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                {member.name} — {language === 'bn' ? 'পূর্ণাঙ্গ স্টেটমেন্ট ও ভাউচার' : 'Full Statement & Voucher'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {language === 'bn' ? `রুম নং: ${member.roomNo || '-'}` : `Room: ${member.roomNo || '-'}`} • {language === 'bn' ? `মোবাইল: ${member.mobile || '-'}` : `Phone: ${member.mobile || '-'}`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="btn btn-sm"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.75rem',
              }}
              title={language === 'bn' ? 'ছবি (PNG) হিসেবে ডাউনলোড' : 'Download as PNG Image'}
            >
              {isExportingImage ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              <span>{isExportingImage ? (language === 'bn' ? 'ছবি হচ্ছে...' : 'Exporting...') : (language === 'bn' ? 'ছবি ডাউনলোড (PNG)' : 'Download Image')}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="btn btn-sm"
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.75rem',
              }}
              title={language === 'bn' ? 'A4 সাইজ PDF ডাউনলোড' : 'Download as A4 PDF'}
            >
              {isExportingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              <span>{isExportingPdf ? (language === 'bn' ? 'PDF হচ্ছে...' : 'Generating...') : (language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              style={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.75rem',
              }}
              title={language === 'bn' ? 'প্রিন্ট করুন' : 'Print Slip'}
            >
              <Printer size={14} />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1rem', backgroundColor: '#f1f5f9' }}>
          {/* Capture Slip */}
          <div
            ref={slipRef}
            id="member-official-slip"
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              fontFamily: "'Outfit', 'Hind Siliguri', sans-serif",
              maxWidth: '750px',
              margin: '0 auto',
            }}
          >
            {/* Header / Brand */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '2px solid #2563eb',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                    }}
                  >
                    শ
                  </div>
                  <div>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                      {mess.name}
                    </h1>
                    <p style={{ fontSize: '0.775rem', color: '#64748b', margin: 0 }}>
                      {language === 'bn' ? 'ঠিকানা:' : 'Address:'} {mess.address || 'ঢাকা, বাংলাদেশ'} • {language === 'bn' ? 'ফোন:' : 'Phone:'} {mess.phone || '-'}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    marginTop: '0.5rem',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {language === 'bn' ? 'সদস্যের একক মাসিক হিসাব বিবরণী ও অডিট স্লিপ' : 'Member Monthly Statement & Audit Voucher'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
                  {language === 'bn' ? 'হিসাবের মাস:' : 'Accounting Month:'}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {monthName}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {language === 'bn' ? 'জেনারেট:' : 'Generated:'} {new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Member Profile Quick Badge */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                  {language === 'bn' ? 'সদস্যের নাম:' : 'Member Name:'}
                </span>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{member.name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                  {language === 'bn' ? 'রুম ও ফোন:' : 'Room & Phone:'}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                  {language === 'bn' ? `রুম: ${member.roomNo || '-'}` : `Room: ${member.roomNo || '-'}`} • {member.mobile || '-'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                  {language === 'bn' ? 'মেসের পদবী / স্ট্যাটাস:' : 'Role & Status:'}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: member.role === 'manager' || member.role === 'owner' ? '#fef3c7' : '#e0f2fe',
                    color: member.role === 'manager' || member.role === 'owner' ? '#b45309' : '#0369a1',
                  }}
                >
                  {member.role === 'owner' ? (language === 'bn' ? 'মালিক' : 'Owner') : member.role === 'manager' ? (language === 'bn' ? 'ম্যানেজার' : 'Manager') : (language === 'bn' ? 'সদস্য' : 'Member')} ({language === 'bn' ? 'সক্রিয়' : 'Active'})
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                  {language === 'bn' ? 'যোগদানের তারিখ:' : 'Joining Date:'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#334155' }}>{member.joiningDate || '-'}</span>
              </div>
            </div>

            {/* Final Settlement Hero Banner */}
            <div
              style={{
                padding: '1.15rem',
                borderRadius: '12px',
                marginBottom: '1.35rem',
                backgroundColor: isSurplus ? '#ecfdf5' : '#fef2f2',
                border: `2px solid ${isSurplus ? '#10b981' : '#ef4444'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: isSurplus ? '#10b981' : '#ef4444',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isSurplus ? <ArrowDownCircle size={26} /> : <ArrowUpCircle size={26} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isSurplus ? '#065f46' : '#991b1b' }}>
                    {isSurplus
                      ? (language === 'bn' ? '🎉 চূড়ান্ত ব্যালেন্স (উদ্বৃত্ত জমা / মেস ফেরত দেবে):' : '🎉 Final Balance (Surplus / Payable by Mess):')
                      : (language === 'bn' ? '⚠️ চূড়ান্ত ব্যালেন্স (মেসের বকেয়া বাকি আছে):' : '⚠️ Final Balance (Due / Payable to Mess):')}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isSurplus ? '#047857' : '#b91c1c' }}>
                    {isSurplus
                      ? `+৳${statement.netBalance.toLocaleString()}`
                      : `-৳${Math.abs(statement.netBalance).toLocaleString()}`}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    backgroundColor: isSurplus ? '#10b981' : '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 800,
                  }}
                >
                  {isSurplus
                    ? (language === 'bn' ? 'মেস থেকে পাবে' : 'Payable by Mess')
                    : (language === 'bn' ? 'মেসে জমা দিতে হবে' : 'Due to Mess')}
                </span>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {isSurplus
                    ? (language === 'bn' ? 'ম্যানেজার এই টাকা সদস্যকে পরিশোধ করবেন' : 'Manager will disburse to member')
                    : (language === 'bn' ? 'সদস্য এই বকেয়া টাকা মেসে জমা দেবেন' : 'Member must pay this due to mess')}
                </div>
              </div>
            </div>

            {/* 6 Key Calculation Metric Boxes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.65rem',
                marginBottom: '1.35rem',
              }}
            >
              {/* Metric 1 */}
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                  {language === 'bn' ? 'মোট খাওয়া মিল:' : 'Total Meals:'}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>
                  {statement.totalMeals} {language === 'bn' ? 'টি' : 'Meals'}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                  {language === 'bn'
                    ? `সকাল: ${statement.breakfastCount} • দুপুর: ${statement.lunchCount} • রাত: ${statement.dinnerCount}`
                    : `B: ${statement.breakfastCount} • L: ${statement.lunchCount} • D: ${statement.dinnerCount}`}
                </div>
              </div>

              {/* Metric 2 */}
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                  {language === 'bn' ? 'চূড়ান্ত মিল রেট:' : 'Final Meal Rate:'}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  ৳{mealRate.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                  {language === 'bn' ? 'প্রতি মিলের গড় খরচ' : 'Average cost per meal'}
                </div>
              </div>

              {/* Metric 3 */}
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                  {language === 'bn' ? 'মিলের মোট খরচ:' : 'Total Meal Cost:'}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  ৳{statement.mealCost.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                  {statement.totalMeals} × ৳{mealRate.toFixed(2)}
                </div>
              </div>

              {/* Metric 4 */}
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                  {language === 'bn' ? 'ফিক্সড / শেয়ার্ড খরচ:' : 'Fixed / Utilities:'}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706' }}>
                  ৳{statement.individualExpenses.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                  {language === 'bn' ? 'খালা ও ওয়াইফাই বিল' : 'Cook, Wifi & cleaner'}
                </div>
              </div>

              {/* Metric 5 */}
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                  {language === 'bn' ? 'মোট জমার পরিমাণ:' : 'Total Deposits:'}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>
                  ৳{statement.totalDeposits.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                  {language === 'bn' ? 'অগ্রিম জমা দিয়েছেন' : 'Advance deposits'}
                </div>
              </div>

              {/* Metric 6: সে বাজার করেছে কত */}
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: totalMarketPaid > 0 ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${totalMarketPaid > 0 ? '#93c5fd' : '#e2e8f0'}`,
                  borderRadius: '10px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: totalMarketPaid > 0 ? '#1d4ed8' : '#64748b', fontWeight: 700 }}>
                  {language === 'bn' ? 'সে বাজার করেছে কত:' : 'Market Paid by Member:'}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: totalMarketPaid > 0 ? '#1d4ed8' : '#0f172a' }}>
                  ৳{totalMarketPaid.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.675rem', color: totalMarketPaid > 0 ? '#1e40af' : '#64748b' }}>
                  {totalMarketPaid > 0
                    ? (language === 'bn' ? `${memberExpenses.filter((e) => e.category === 'market').length} টি বাজার করেছেন` : `${memberExpenses.filter((e) => e.category === 'market').length} shopping trips`)
                    : (language === 'bn' ? 'এই মাসে বাজার করেননি' : 'No shopping this month')}
                </div>
              </div>
            </div>

            {/* Transparent Calculation Ledger */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.35rem' }}>
              <div
                style={{
                  backgroundColor: '#f1f5f9',
                  padding: '0.6rem 0.85rem',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{language === 'bn' ? 'স্বচ্ছ গাণিতিক হিসাব বিবরণী (Math Formula & Ledger)' : 'Mathematical Settlement Ledger'}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {language === 'bn' ? 'ব্যালেন্স = জমা - (মিল খরচ + ফিক্সড খরচ)' : 'Balance = Deposit - (Meal Cost + Fixed Cost)'}
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>
                      {language === 'bn' ? '১. সদস্য কর্তৃক মেস ফান্ডে মোট জমা টাকা (+)' : '1. Total deposits contributed to mess fund (+)'}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                      +৳{statement.totalDeposits.toLocaleString()}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>
                      {language === 'bn'
                        ? `২. খাওয়া মিল বাবদ খাবার খরচ (-) (${statement.totalMeals} মিল × ৳${mealRate.toFixed(2)})`
                        : `2. Meal cost for consumed meals (-) (${statement.totalMeals} meals × ৳${mealRate.toFixed(2)})`}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 600, color: '#ef4444' }}>
                      -৳{statement.mealCost.toLocaleString()}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>
                      {language === 'bn' ? '৩. মাথাপিছু শেয়ার্ড / ফিক্সড খরচ (-) (খালা ও ওয়াইফাই বিল ইত্যাদি)' : '3. Shared utilities / fixed charge (-)'}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 600, color: '#ef4444' }}>
                      -৳{statement.individualExpenses.toLocaleString()}
                    </td>
                  </tr>
                  {totalMarketPaid > 0 && (
                    <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f0fdf4' }}>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#166534', fontWeight: 600 }}>
                        {language === 'bn'
                          ? '* তথ্যসূত্র: সদস্য নিজ হাতে মেসের বাজার করেছেন (বাজার বিল মেস ফান্ড থেকে সমন্বয় করা হয়েছে)'
                          : '* Note: Member personally shopped for mess (market bill reconciled from mess fund)'}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#166534' }}>
                        ৳{totalMarketPaid.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr style={{ backgroundColor: isSurplus ? '#ecfdf5' : '#fef2f2', borderTop: '2px solid #cbd5e1' }}>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#0f172a' }}>
                      {language === 'bn'
                        ? `ফাইনাল নিট ব্যালেন্স (${isSurplus ? 'মেস থেকে সদস্য পাবেন' : 'মেসে সদস্য বকেয়া দেবেন'}):`
                        : `Final Net Balance (${isSurplus ? 'Payable by Mess' : 'Due from Member'}):`}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 0.85rem',
                        textAlign: 'right',
                        fontWeight: 900,
                        fontSize: '1.05rem',
                        color: isSurplus ? '#047857' : '#b91c1c',
                      }}
                    >
                      {isSurplus
                        ? `+৳${statement.netBalance.toLocaleString()}`
                        : `-৳${Math.abs(statement.netBalance).toLocaleString()}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Shopping / Market Expenses Breakdown */}
            {memberExpenses.length > 0 && (
              <div style={{ marginBottom: '1.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <ShoppingBag size={15} color="#2563eb" />
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    {language === 'bn' ? 'সদস্য কর্তৃক কৃত বাজার ও খরচের তালিকা' : 'Market & Shopping Expenses Paid by Member'}
                  </h4>
                </div>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.775rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '0.45rem 0.65rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                      <th style={{ padding: '0.45rem 0.65rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'বিবরণ' : 'Description'}</th>
                      <th style={{ padding: '0.45rem 0.65rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'ক্যাটেগরি' : 'Category'}</th>
                      <th style={{ padding: '0.45rem 0.65rem', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberExpenses.map((exp) => (
                      <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.45rem 0.65rem', color: '#64748b' }}>{exp.expenseDate}</td>
                        <td style={{ padding: '0.45rem 0.65rem', fontWeight: 600, color: '#0f172a' }}>
                          {exp.title} {exp.note && <span style={{ color: '#64748b', fontWeight: 400 }}>({exp.note})</span>}
                        </td>
                        <td style={{ padding: '0.45rem 0.65rem' }}>
                          <span
                            style={{
                              fontSize: '0.675rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              backgroundColor: exp.category === 'market' ? '#eff6ff' : '#f1f5f9',
                              color: exp.category === 'market' ? '#1d4ed8' : '#475569',
                            }}
                          >
                            {exp.category === 'market' ? (language === 'bn' ? 'বাজার' : 'Market') : exp.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.45rem 0.65rem', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                          ৳{Number(exp.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Deposit History */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <CreditCard size={15} color="#10b981" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  {language === 'bn' ? 'টাকা জমা দেওয়ার হিস্ট্রি (Deposit Records)' : 'Deposit Records History'}
                </h4>
              </div>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.775rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '0.45rem 0.65rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                    <th style={{ padding: '0.45rem 0.65rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'পদ্ধতি' : 'Method'}</th>
                    <th style={{ padding: '0.45rem 0.65rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'রেফারেন্স / নোট' : 'Reference / TrxID'}</th>
                    <th style={{ padding: '0.45rem 0.65rem', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>{language === 'bn' ? 'জমার পরিমাণ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {memberDeposits.length > 0 ? (
                    memberDeposits.map((dep) => (
                      <tr key={dep.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.45rem 0.65rem', color: '#64748b' }}>{dep.depositDate}</td>
                        <td style={{ padding: '0.45rem 0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                          {dep.paymentMethod}
                        </td>
                        <td style={{ padding: '0.45rem 0.65rem', color: '#475569' }}>
                          {dep.referenceNote || '-'}
                        </td>
                        <td style={{ padding: '0.45rem 0.65rem', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                          +৳{Number(dep.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>
                        {language === 'bn' ? 'এই মাসে কোনো জমার রেকর্ড পাওয়া যায়নি।' : 'No deposit records found for this month.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signatures & Verification Stamp */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px dashed #cbd5e1',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ width: '150px', borderBottom: '1px solid #94a3b8', marginBottom: '0.35rem' }} />
                <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
                  {language === 'bn' ? 'মেস ম্যানেজারের স্বাক্ষর' : 'Mess Manager Signature'}
                </span>
              </div>

              {/* Official Seal Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#475569',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                <ShieldCheck size={14} color="#10b981" />
                <span>{language === 'bn' ? 'অফিসিয়ালি নিরীক্ষিত ও চূড়ান্ত হিসাব' : 'Officially Audited & Verified'}</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ width: '150px', borderBottom: '1px solid #94a3b8', marginBottom: '0.35rem', marginLeft: 'auto' }} />
                <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
                  {language === 'bn' ? 'সদস্যের স্বাক্ষর ও তারিখ' : 'Member Signature & Date'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
