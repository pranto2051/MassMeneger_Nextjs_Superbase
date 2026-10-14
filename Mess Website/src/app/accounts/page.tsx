'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Receipt,
  PlusCircle,
  Trash2,
  Calendar,
  CreditCard,
  DollarSign,
  Tag,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import { useUIFeedback } from '@/context/UIFeedbackContext';
import { PaymentMethod, ExpenseCategory } from '@/types';

export default function AccountsPage() {
  const { members, deposits, expenses, addDeposit, deleteDeposit, addExpense, deleteExpense, calculations } = useMess();
  const { showToast, confirm } = useUIFeedback();

  const [activeTab, setActiveTab] = useState<'deposits' | 'expenses'>('expenses');

  // Modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Deposit Form
  const [depMemberId, setDepMemberId] = useState(members[0]?.id || '');
  const [depAmount, setDepAmount] = useState('');
  const [depDate, setDepDate] = useState(new Date().toISOString().split('T')[0]);
  const [depMethod, setDepMethod] = useState<PaymentMethod>('cash');
  const [depNote, setDepNote] = useState('');

  // Expense Form
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('market');
  const [expPayerId, setExpPayerId] = useState(members[0]?.id || '');
  const [includeInMealRate, setIncludeInMealRate] = useState(true);
  const [expNote, setExpNote] = useState('');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depAmount);
    if (!amt || amt <= 0) {
      showToast('সঠিক জমার পরিমাণ উল্লেখ করুন!', 'warning');
      return;
    }
    const member = members.find((m) => m.id === depMemberId);
    addDeposit({
      memberId: depMemberId,
      amount: amt,
      depositDate: depDate,
      paymentMethod: depMethod,
      referenceNote: depNote,
    });
    setDepAmount('');
    setDepNote('');
    setIsDepositModalOpen(false);
    showToast(`${member?.name || 'সদস্য'}-এর ৳${amt.toLocaleString()} টাকা জমা সফলভাবে রেকর্ড করা হয়েছে!`, 'success');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expAmount);
    if (!amt || amt <= 0) {
      showToast('সঠিক খরচের পরিমাণ উল্লেখ করুন!', 'warning');
      return;
    }
    addExpense({
      title: expTitle,
      amount: amt,
      expenseDate: expDate,
      category: expCategory,
      paidByMemberId: expPayerId || undefined,
      includeInMealRate,
      note: expNote,
    });
    setExpTitle('');
    setExpAmount('');
    setExpNote('');
    setIsExpenseModalOpen(false);
    showToast(`"${expTitle}" বাবদ ৳${amt.toLocaleString()} খরচ সফলভাবে যুক্ত হয়েছে!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: 1.3 }}>
            <Wallet size={24} color="var(--primary)" />
            <span>জমা ও খরচের হিসাব (Accounts)</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            সদস্যদের নগদ বা মোবাইল ব্যাংকিং জমা এবং বাজারের মেমো ও অন্যান্য ইউটিলিটি ভাউচার পরিচালনা
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="mobile-full-width">
          <button onClick={() => setIsDepositModalOpen(true)} className="btn btn-secondary btn-sm mobile-full-width">
            <PlusCircle size={15} color="#10b981" />
            <span>টাকা জমা রেকর্ড</span>
          </button>
          <button onClick={() => setIsExpenseModalOpen(true)} className="btn btn-primary btn-sm mobile-full-width">
            <PlusCircle size={15} />
            <span>নতুন খরচ যোগ</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: '0.85rem',
        }}
      >
        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>মোট সংগৃহীত জমা</div>
          <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>
            ৳{calculations.totalDeposits.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{deposits.length} টি জমার ভাউচার</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>মিল সম্পর্কিত খরচ (বাজার)</div>
          <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>
            ৳{calculations.eligibleMealExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>মিল রেটের অন্তর্ভুক্ত মোট টাকা</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ফিক্সড / অন্যান্য খরচ</div>
          <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)', fontWeight: 800, color: '#f59e0b', margin: '0.25rem 0' }}>
            ৳{calculations.fixedSharedExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ওয়াইফাই, খালা বিল (আলাদা)</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>সর্বমোট খরচ</div>
          <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)', fontWeight: 800, color: '#ef4444', margin: '0.25rem 0' }}>
            ৳{calculations.totalExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{expenses.length} টি খরচের এন্ট্রি</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('expenses')}
          className="btn btn-sm"
          style={{
            background: activeTab === 'expenses' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'expenses' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
          }}
        >
          <Receipt size={15} />
          <span>খরচের তালিকা ({expenses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('deposits')}
          className="btn btn-sm"
          style={{
            background: activeTab === 'deposits' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'deposits' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
          }}
        >
          <Wallet size={15} />
          <span>জমার তালিকা ({deposits.length})</span>
        </button>
      </div>

      {/* Tab 1: Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="glass-table-wrapper">
          <table className="glass-table" style={{ minWidth: '700px' }}>
            <thead>
              <tr>
                <th>তারিখ</th>
                <th>খরচের বিবরণ ও ক্যাটেগরি</th>
                <th>টাকা পরিশোধকারী</th>
                <th>মিল রেটে অন্তর্ভুক্ত?</th>
                <th>পরিমাণ (৳)</th>
                <th>মন্তব্য</th>
                <th style={{ textAlign: 'right' }}>মুছুন</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => {
                const payer = members.find((m) => m.id === exp.paidByMemberId);
                return (
                  <tr key={exp.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{exp.expenseDate}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{exp.title}</div>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{payer?.name || 'মেস ফান্ড / ম্যানেজার'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className={`badge ${exp.includeInMealRate ? 'badge-success' : 'badge-warning'}`}>
                        {exp.includeInMealRate ? 'মিল খরচে যুক্ত' : 'আলাদা ফিক্সড'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                      ৳{Number(exp.amount).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.note || '-'}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={async () => {
                          const ok = await confirm({
                            title: 'খরচ রেকর্ড মুছে ফেলা',
                            message: `আপনি কি নিশ্চিত যে "${exp.title}" বাবদ ৳${Number(exp.amount).toLocaleString()} টাকার খরচের এন্ট্রিটি মুছে ফেলতে চান?`,
                            confirmText: 'হ্যাঁ, মুছে ফেলুন',
                            cancelText: 'বাতিল',
                            type: 'danger',
                          });
                          if (ok) {
                            deleteExpense(exp.id);
                            showToast(`"${exp.title}" খরচের এন্ট্রি সফলভাবে মুছে ফেলা হয়েছে!`, 'success');
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                        title="এই খরচটি মুছে ফেলুন"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Deposits Table */}
      {activeTab === 'deposits' && (
        <div className="glass-table-wrapper">
          <table className="glass-table" style={{ minWidth: '650px' }}>
            <thead>
              <tr>
                <th>জমার তারিখ</th>
                <th>সদস্যের নাম</th>
                <th>পেমেন্ট মেথড</th>
                <th>রেফারেন্স / ট্রানজেকশন নোট</th>
                <th>জমার পরিমাণ (৳)</th>
                <th style={{ textAlign: 'right' }}>মুছুন</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((dep) => {
                const member = members.find((m) => m.id === dep.memberId);
                return (
                  <tr key={dep.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{dep.depositDate}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{member?.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>রুম {member?.roomNo}</div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>
                        {dep.paymentMethod}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {dep.referenceNote || '-'}
                    </td>
                    <td style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                      +৳{Number(dep.amount).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={async () => {
                          const ok = await confirm({
                            title: 'জমা রেকর্ড মুছে ফেলা',
                            message: `আপনি কি নিশ্চিত যে ${member?.name || 'সদস্য'}-এর ৳${Number(dep.amount).toLocaleString()} টাকার জমার এন্ট্রিটি মুছে ফেলতে চান?`,
                            confirmText: 'হ্যাঁ, মুছে ফেলুন',
                            cancelText: 'বাতিল',
                            type: 'danger',
                          });
                          if (ok) {
                            deleteDeposit(dep.id);
                            showToast(`${member?.name || 'সদস্য'}-এর ৳${Number(dep.amount).toLocaleString()} টাকার জমা সফলভাবে মুছে ফেলা হয়েছে!`, 'success');
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                        title="এই জমাটি মুছে ফেলুন"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Deposit Modal (Mobile Friendly) */}
      {isDepositModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.75rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--surface-solid)',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              মেম্বারের টাকা জমা রেকর্ড করুন
            </h3>

            <form onSubmit={handleDepositSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>সদস্য নির্বাচন করুন *</label>
                <select className="form-select" value={depMemberId} onChange={(e) => setDepMemberId(e.target.value)}>
                  {members.filter((m) => m.isActive).map((m) => (
                    <option key={m.id} value={m.id}>{m.name} (রুম {m.roomNo})</option>
                  ))}
                </select>
              </div>

              <div className="responsive-two-col">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>জমার পরিমাণ (টাকা) *</label>
                  <input
                    type="number"
                    required
                    placeholder="যেমন: ৩০০০"
                    className="form-input"
                    value={depAmount}
                    onChange={(e) => setDepAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>পেমেন্ট মাধ্যম</label>
                  <select className="form-select" value={depMethod} onChange={(e) => setDepMethod(e.target.value as PaymentMethod)}>
                    <option value="cash">নগদ ক্যাশ (Cash)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="bank">ব্যাংক ট্রান্সফার</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>জমার তারিখ</label>
                <input type="date" className="form-input" value={depDate} onChange={(e) => setDepDate(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>রেফারেন্স / ট্রানজেকশন আইডি</label>
                <input
                  type="text"
                  placeholder="যেমন: TrxID: 9X82KD71L বা ক্যাশ রিসিভ"
                  className="form-input"
                  value={depNote}
                  onChange={(e) => setDepNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setIsDepositModalOpen(false)} className="btn btn-secondary">বাতিল</button>
                <button type="submit" className="btn btn-primary">জমা সংরক্ষণ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal (Mobile Friendly) */}
      {isExpenseModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.75rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--surface-solid)',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              নতুন খরচের ভাউচার যোগ করুন
            </h3>

            <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>খরচের শিরোনাম / বিবরণ *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রুই মাছ ও ব্রয়লার মুরগি কেনা"
                  className="form-input"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                />
              </div>

              <div className="responsive-two-col">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>টাকার পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="যেমন: ৩৫০০"
                    className="form-input"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>ক্যাটেগরি</label>
                  <select className="form-select" value={expCategory} onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}>
                    <option value="market">বাজার (Market)</option>
                    <option value="utilities">বিদ্যুৎ / গ্যাস / পানি</option>
                    <option value="internet">ওয়াইফাই ইন্টারনেট</option>
                    <option value="cleaning">খালা বিল ও পরিষ্কার</option>
                    <option value="rent">মেস ভাড়া</option>
                    <option value="repair">মেরামত ও অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div className="responsive-two-col">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>খরচের তারিখ</label>
                  <input type="date" className="form-input" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>টাকা পরিশোধকারী</label>
                  <select className="form-select" value={expPayerId} onChange={(e) => setExpPayerId(e.target.value)}>
                    <option value="">মেস ফান্ড / ক্যাশ</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Include in Meal Rate Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <input
                  type="checkbox"
                  id="mealRateCheck"
                  checked={includeInMealRate}
                  onChange={(e) => setIncludeInMealRate(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', flexShrink: 0 }}
                />
                <label htmlFor="mealRateCheck" style={{ fontSize: '0.825rem', color: 'var(--text-primary)', cursor: 'pointer', lineHeight: 1.4 }}>
                  <strong>এই খরচটি মিল রেটের অন্তর্ভুক্ত হবে</strong>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    (টিক চিহ্ন দেওয়া থাকলে খরচটি মোট মিল দিয়ে ভাগ হয়ে মিল রেট তৈরি করবে। ফিক্সড খরচ যেমন ওয়াইফাই বা খালার বিলে টিক তুলে দিন)
                  </div>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>মেমো / ভাউচার নোট</label>
                <input
                  type="text"
                  placeholder="দোকানের নাম বা মেমো নম্বর"
                  className="form-input"
                  value={expNote}
                  onChange={(e) => setExpNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="btn btn-secondary">বাতিল</button>
                <button type="submit" className="btn btn-primary">খরচ সংরক্ষণ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
