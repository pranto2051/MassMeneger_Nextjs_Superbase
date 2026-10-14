'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Calendar,
  UserCheck,
  ArrowLeftRight,
  PlusCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Sparkles,
  CalendarDays,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import { useUIFeedback } from '@/context/UIFeedbackContext';
import { MarketAssignment } from '@/types';

// Helper to format date in YYYY-MM-DD to DD/MM/YYYY
function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// Helper to add days
function addDays(dateStr: string, days: number): string {
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
}

export default function MarketPage() {
  const {
    mess,
    members,
    marketAssignments,
    addMarketAssignment,
    updateMarketAssignment,
    deleteMarketAssignment,
    moveMarketAssignment,
    updateMarketStatus,
    swapAssignments,
    autoGenerateMarketSchedule,
    language,
  } = useMess();

  const { showToast, confirm } = useUIFeedback();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isAutoGenModalOpen, setIsAutoGenModalOpen] = useState(false);

  // Default duration from mess settings (default: 3 days)
  const defaultDays = mess.defaultMarketDays || 3;

  // Form State for Add Assignment
  const [addMemberId, setAddMemberId] = useState(members[0]?.id || '');
  const [addStartDate, setAddStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [addDaysCount, setAddDaysCount] = useState<number>(defaultDays);
  const [addSlotLabel, setAddSlotLabel] = useState('সাপ্তাহিক বাজার');
  const [addNote, setAddNote] = useState('');

  // Form State for Edit Assignment
  const [editingAssignment, setEditingAssignment] = useState<MarketAssignment | null>(null);
  const [editMemberId, setEditMemberId] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editDaysCount, setEditDaysCount] = useState<number>(3);
  const [editSlotLabel, setEditSlotLabel] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editStatus, setEditStatus] = useState<MarketAssignment['status']>('assigned');
  const [editAutoCascade, setEditAutoCascade] = useState(true);

  // Form State for Swap
  const [swapId1, setSwapId1] = useState(marketAssignments[0]?.id || '');
  const [swapId2, setSwapId2] = useState(marketAssignments[1]?.id || '');

  // Form State for Auto-Generate
  const [autoGenStartDate, setAutoGenStartDate] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`
  );
  const [autoGenDays, setAutoGenDays] = useState<number>(defaultDays);
  const [autoGenSelectedMembers, setAutoGenSelectedMembers] = useState<string[]>(
    members.filter((m) => m.isActive).map((m) => m.id)
  );

  // Sorted assignments
  const sortedAssignments = useMemo(() => {
    return [...marketAssignments].sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.assignmentDate.localeCompare(b.assignmentDate);
    });
  }, [marketAssignments]);

  // Open Edit Modal
  const openEditModal = (assignment: MarketAssignment) => {
    setEditingAssignment(assignment);
    setEditMemberId(assignment.memberId);
    setEditStartDate(assignment.assignmentDate);
    setEditDaysCount(assignment.daysCount || defaultDays);
    setEditSlotLabel(assignment.slotLabel);
    setEditNote(assignment.note || '');
    setEditStatus(assignment.status);
    setEditAutoCascade(true);
    setIsEditModalOpen(true);
  };

  // Open Add Modal with fresh default days
  const openAddModal = () => {
    setAddDaysCount(defaultDays);
    if (sortedAssignments.length > 0) {
      const last = sortedAssignments[sortedAssignments.length - 1];
      const nextStart = last.endDate ? addDays(last.endDate, 1) : addDays(last.assignmentDate, 3);
      setAddStartDate(nextStart);
    } else {
      setAddStartDate(new Date().toISOString().split('T')[0]);
    }
    setIsAddModalOpen(true);
  };

  // Handle Add Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMemberId || !addStartDate) return;

    const days = Math.max(1, Number(addDaysCount) || defaultDays);
    const end = addDays(addStartDate, days - 1);
    const member = members.find((m) => m.id === addMemberId);

    addMarketAssignment({
      memberId: addMemberId,
      assignmentDate: addStartDate,
      endDate: end,
      daysCount: days,
      slotLabel: addSlotLabel || `${days} দিনের বাজার পালা`,
      sortOrder: sortedAssignments.length + 1,
      status: 'assigned',
      note: addNote,
    });

    setIsAddModalOpen(false);
    setAddNote('');
    showToast(`${member?.name || 'সদস্য'}-এর নামে ${days} দিনের নতুন বাজার শিডিউল সফলভাবে বণ্টন করা হয়েছে!`, 'success');
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    const days = Math.max(1, Number(editDaysCount) || 1);
    const end = addDays(editStartDate, days - 1);

    updateMarketAssignment(
      editingAssignment.id,
      {
        memberId: editMemberId,
        assignmentDate: editStartDate,
        endDate: end,
        daysCount: days,
        slotLabel: editSlotLabel,
        note: editNote,
        status: editStatus,
      },
      editAutoCascade
    );

    setIsEditModalOpen(false);
    setEditingAssignment(null);
    showToast(`বাজার শিডিউল ও মেয়াদ সফলভাবে ${days} দিনে আপডেট করা হয়েছে!`, 'success');
  };

  // Handle Swap Submit
  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapId1 || !swapId2 || swapId1 === swapId2) {
      showToast('সোয়াপ করার জন্য দুটি ভিন্ন অ্যাসাইনমেন্ট নির্বাচন করুন!', 'warning');
      return;
    }
    swapAssignments(swapId1, swapId2);
    setIsSwapModalOpen(false);
    showToast('দুই সদস্যের বাজার দায়িত্ব সফলভাবে অদলবদল (Swap) করা হয়েছে!', 'success');
  };

  // Handle Auto-Generate Submit
  const handleAutoGenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (autoGenSelectedMembers.length === 0) {
      showToast('অনুগ্রহ করে অন্তত একজন সক্রিয় সদস্য নির্বাচন করুন!', 'warning');
      return;
    }

    const confirmed = await confirm({
      title: 'স্বয়ংক্রিয় বাজার শিডিউল তৈরি',
      message: `আপনি কি নিশ্চিত যে প্রতি সদস্যের ${autoGenDays} দিন মেয়াদে সম্পূর্ণ মাসের বাজার শিডিউল তৈরি করতে চান? নতুন তালিকাটি যোগ হবে।`,
      confirmText: 'হ্যাঁ, তৈরি করুন',
      cancelText: 'বাতিল',
      type: 'info',
    });

    if (!confirmed) return;

    autoGenerateMarketSchedule({
      startDate: autoGenStartDate,
      daysPerMember: autoGenDays,
      selectedMemberIds: autoGenSelectedMembers,
    });

    setIsAutoGenModalOpen(false);
    showToast(`প্রতি সদস্যের ${autoGenDays} দিন করে সম্পূর্ণ মাসের নতুন বাজার শিডিউল তৈরি হয়েছে!`, 'success');
  };

  // Preset days buttons
  const presetDays = [3, 4, 5, 7, 10];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Title and Quick Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              lineHeight: 1.3,
            }}
          >
            <ShoppingCart size={24} color="var(--primary)" />
            <span>বাজার শিডিউলার ও দায়িত্ব বণ্টন</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
            সদস্যদের ধারাবাহিক বাজার শিডিউল, মেয়াদ নির্ধারণ (ডিফল্ট ৩ দিন), এবং তীর চিহ্নে (⬆️ / ⬇️) পজিশন স্থানান্তর
          </p>

          {/* Default Config Banner / Pill */}
          <div
            style={{
              marginTop: '0.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Settings size={13} />
              ডিফল্ট মেয়াদ:
            </span>
            <span style={{ fontWeight: 800 }}>{defaultDays} দিন প্রতি সদস্য</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <Link
              href="/settings"
              style={{
                color: 'var(--primary)',
                textDecoration: 'underline',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              সেটিংস থেকে পরিবর্তন করুন
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="mobile-full-width">
          <button
            onClick={() => setIsAutoGenModalOpen(true)}
            className="btn btn-secondary btn-sm mobile-full-width"
            style={{
              borderColor: 'rgba(168, 85, 247, 0.4)',
              background: 'rgba(168, 85, 247, 0.12)',
              color: 'var(--text-primary)',
              fontWeight: 700,
            }}
          >
            <Sparkles size={15} color="#a855f7" />
            <span>⚡ অটো শিডিউল তৈরি</span>
          </button>

          <button
            onClick={() => setIsSwapModalOpen(true)}
            className="btn btn-secondary btn-sm mobile-full-width"
          >
            <ArrowLeftRight size={15} />
            <span>সোয়াপ (Swap)</span>
          </button>

          <button
            onClick={openAddModal}
            className="btn btn-primary btn-sm mobile-full-width"
          >
            <PlusCircle size={15} />
            <span>নতুন দায়িত্ব যোগ</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            মোট নির্ধারিত শিডিউল
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {sortedAssignments.length} টি পালা
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            সম্পন্ন হয়েছে
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
            {sortedAssignments.filter((a) => a.status === 'completed').length} টি
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            আসন্ন / চলমান দায়িত্ব
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
            {sortedAssignments.filter((a) => a.status === 'assigned').length} টি
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            শিডিউল মোড
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>
            প্রতি সদস্য {defaultDays} দিন (কাস্টমাইজযোগ্য)
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="glass-table-wrapper">
        <table className="glass-table" style={{ minWidth: '820px' }}>
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>ক্রম</th>
              <th style={{ width: '90px', textAlign: 'center' }}>পজিশন</th>
              <th>বাজারের সময়সীমা ও মেয়াদ</th>
              <th>দায়িত্বপ্রাপ্ত সদস্য</th>
              <th>বাজারের ধরণ (স্লট)</th>
              <th>নোট / কেনাকাটার স্থান</th>
              <th>স্ট্যাটাস</th>
              <th style={{ textAlign: 'right' }}>ব্যবস্থাপনা ও পরিবর্তন</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssignments.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  কোনো বাজার শিডিউল পাওয়া যায়নি। উপরে &quot;⚡ অটো শিডিউল তৈরি&quot; অথবা &quot;নতুন দায়িত্ব যোগ&quot; বাটনে ক্লিক করুন।
                </td>
              </tr>
            ) : (
              sortedAssignments.map((item, index) => {
                const member = members.find((m) => m.id === item.memberId);
                const isFirst = index === 0;
                const isLast = index === sortedAssignments.length - 1;
                const days = item.daysCount || defaultDays;

                return (
                  <tr key={item.id} style={{ transition: 'background-color 0.2s ease' }}>
                    {/* Order Number */}
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                      #{index + 1}
                    </td>

                    {/* Move Up / Move Down Arrow Buttons */}
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                        <button
                          onClick={() => {
                            moveMarketAssignment(item.id, 'up');
                            showToast('বাজার শিডিউল এক ধাপ উপরে স্থানান্তর করা হয়েছে!', 'success');
                          }}
                          disabled={isFirst}
                          title={isFirst ? 'সর্বোচ্চ পজিশনে রয়েছে' : 'উপরে স্থানান্তর করুন (Move Up)'}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.3rem 0.45rem',
                            opacity: isFirst ? 0.35 : 1,
                            cursor: isFirst ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <ArrowUp size={14} color={isFirst ? 'var(--text-muted)' : 'var(--primary)'} />
                        </button>

                        <button
                          onClick={() => {
                            moveMarketAssignment(item.id, 'down');
                            showToast('বাজার শিডিউল এক ধাপ নিচে স্থানান্তর করা হয়েছে!', 'success');
                          }}
                          disabled={isLast}
                          title={isLast ? 'সর্বনিম্ন পজিশনে রয়েছে' : 'নিচে স্থানান্তর করুন (Move Down)'}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.3rem 0.45rem',
                            opacity: isLast ? 0.35 : 1,
                            cursor: isLast ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <ArrowDown size={14} color={isLast ? 'var(--text-muted)' : 'var(--primary)'} />
                        </button>
                      </div>
                    </td>

                    {/* Date Range & Duration */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          <Calendar size={13} color="var(--primary)" />
                          <span>
                            {formatDisplayDate(item.assignmentDate)}
                            {item.endDate && item.endDate !== item.assignmentDate ? (
                              <> – {formatDisplayDate(item.endDate)}</>
                            ) : null}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              background: 'rgba(59, 130, 246, 0.12)',
                              color: 'var(--primary)',
                              display: 'inline-block',
                            }}
                          >
                            {days} দিনের শিডিউল
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Member Details */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {member?.name || 'অজ্ঞাত সদস্য'}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        রুম {member?.roomNo || 'N/A'} • {member?.mobile || ''}
                      </div>
                    </td>

                    {/* Slot Label */}
                    <td>
                      <span className="badge badge-primary">{item.slotLabel}</span>
                    </td>

                    {/* Note */}
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', maxWidth: '200px' }}>
                      {item.note || '-'}
                    </td>

                    {/* Status Badge */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span
                        className={`badge ${
                          item.status === 'completed'
                            ? 'badge-success'
                            : item.status === 'swapped'
                            ? 'badge-info'
                            : item.status === 'cancelled'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {item.status === 'completed'
                          ? 'সম্পন্ন'
                          : item.status === 'swapped'
                          ? 'সোয়াপড'
                          : item.status === 'cancelled'
                          ? 'বাতিল'
                          : 'অ্যাসাইনড'}
                      </span>
                    </td>

                    {/* Action Controls */}
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn btn-secondary btn-sm"
                          title="দিন সংখ্যা ও তারিখ এডিট করুন (Edit Duration / Dates)"
                          style={{ padding: '0.35rem 0.55rem' }}
                        >
                          <Edit3 size={13} color="var(--primary)" />
                        </button>

                        {/* Quick Complete Status Button */}
                        {item.status !== 'completed' && (
                          <button
                            onClick={() => {
                              updateMarketStatus(item.id, 'completed');
                              showToast('বাজার দায়িত্ব সফলভাবে সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে!', 'success');
                            }}
                            className="btn btn-secondary btn-sm"
                            title="সম্পন্ন হিসেবে চিহ্নিত করুন"
                            style={{ color: '#10b981', padding: '0.35rem 0.55rem' }}
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {/* Quick Cancel Status Button */}
                        {item.status !== 'cancelled' && (
                          <button
                            onClick={async () => {
                              const ok = await confirm({
                                title: 'বাজার দায়িত্ব বাতিলকরণ',
                                message: `${member?.name || 'সদস্য'}-এর ${formatDisplayDate(item.assignmentDate)} তারিখের বাজার দায়িত্বটি বাতিল করতে চান?`,
                                confirmText: 'হ্যাঁ, বাতিল করুন',
                                cancelText: 'না, রাখুন',
                                type: 'warning',
                              });
                              if (ok) {
                                updateMarketStatus(item.id, 'cancelled');
                                showToast('বাজার দায়িত্ব বাতিল করা হয়েছে!', 'warning');
                              }
                            }}
                            className="btn btn-secondary btn-sm"
                            title="বাতিল করুন"
                            style={{ color: '#ef4444', padding: '0.35rem 0.55rem' }}
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        {/* Delete Button with Beautiful UI Confirmation Dialog */}
                        <button
                          onClick={async () => {
                            const ok = await confirm({
                              title: 'বাজার শিডিউল মুছে ফেলা',
                              message: `${member?.name || 'সদস্য'}-এর ${formatDisplayDate(item.assignmentDate)} তারিখের বাজার শিডিউলটি আপনি কি মুছে ফেলতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।`,
                              confirmText: 'হ্যাঁ, মুছে ফেলুন',
                              cancelText: 'বাতিল',
                              type: 'danger',
                            });
                            if (ok) {
                              deleteMarketAssignment(item.id);
                              showToast('বাজার শিডিউল সফলভাবে মুছে ফেলা হয়েছে!', 'success');
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          title="মুছে ফেলুন"
                          style={{ color: '#ef4444', padding: '0.35rem 0.55rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL: ADD ASSIGNMENT ================= */}
      {isAddModalOpen && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={20} color="var(--primary)" />
              <span>বাজারের নতুন দায়িত্ব বণ্টন</span>
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  দায়িত্বপ্রাপ্ত সদস্য *
                </label>
                <select
                  className="form-select"
                  value={addMemberId}
                  onChange={(e) => setAddMemberId(e.target.value)}
                >
                  {members.filter((m) => m.isActive).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (রুম {m.roomNo})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    বাজার শুরুর তারিখ *
                  </label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={addStartDate}
                    onChange={(e) => setAddStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    বাজারের মেয়াদ (দিন) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    className="form-input"
                    value={addDaysCount}
                    onChange={(e) => setAddDaysCount(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* End Date Preview */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.825rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>গণনাকৃত শেষ তারিখ:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  {formatDisplayDate(addDays(addStartDate, Math.max(1, addDaysCount) - 1))} ({addDaysCount} দিন)
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  বাজারের স্লট / বিবরণ
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: সাপ্তাহিক বড় বাজার, মাছ ও সবজি"
                  value={addSlotLabel}
                  onChange={(e) => setAddSlotLabel(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  বিশেষ নোট
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: কারওয়ান বাজার থেকে কেনার কথা"
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                >
                  বাতিল
                </button>
                <button type="submit" className="btn btn-primary">
                  দায়িত্ব অ্যাসাইন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ASSIGNMENT (INDIVIDUAL DURATION ADJUSTMENT) ================= */}
      {isEditModalOpen && editingAssignment && (
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
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--surface-solid)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={20} color="var(--primary)" />
                <span>বাজারের শিডিউল ও মেয়াদ এডিট</span>
              </h3>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
              প্রয়োজন অনুযায়ী এই সদস্যের বাজার দিন সংখ্যা (যেমন ২ দিন, ৩ দিন, কিংবা ১০ দিন) পরিবর্তন করুন:
            </p>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  দায়িত্বপ্রাপ্ত সদস্য
                </label>
                <select
                  className="form-select"
                  value={editMemberId}
                  onChange={(e) => setEditMemberId(e.target.value)}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (রুম {m.roomNo})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    বাজার শুরুর তারিখ
                  </label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    বাজারের মেয়াদ (দিন)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    className="form-input"
                    value={editDaysCount}
                    onChange={(e) => setEditDaysCount(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Quick preset chips for days */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  কুইক ডে সিলেকশন:
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {presetDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setEditDaysCount(d)}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: editDaysCount === d ? 800 : 600,
                        background: editDaysCount === d ? 'var(--primary)' : 'var(--surface-hover)',
                        color: editDaysCount === d ? '#ffffff' : 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    >
                      {d} দিন
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated End Date Preview */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.825rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>হালনাগাদকৃত সময়সীমা:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  {formatDisplayDate(editStartDate)} – {formatDisplayDate(addDays(editStartDate, Math.max(1, editDaysCount) - 1))}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    বাজারের ধরণ (স্লট)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editSlotLabel}
                    onChange={(e) => setEditSlotLabel(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    স্ট্যাটাস
                  </label>
                  <select
                    className="form-select"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as MarketAssignment['status'])}
                  >
                    <option value="assigned">অ্যাসাইনড</option>
                    <option value="completed">সম্পন্ন</option>
                    <option value="swapped">সোয়াপড</option>
                    <option value="cancelled">বাতিল</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  নোট / বিশেষ বিবরণ
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
              </div>

              {/* Auto Cascade Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.65rem 0.75rem',
                  background: 'var(--surface-hover)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <input
                  type="checkbox"
                  id="autoCascade"
                  checked={editAutoCascade}
                  onChange={(e) => setEditAutoCascade(e.target.checked)}
                  style={{ marginTop: '0.15rem' }}
                />
                <label htmlFor="autoCascade" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer', lineHeight: 1.4 }}>
                  <strong>পরবর্তী শিডিউলগুলোও স্বয়ংক্রিয়ভাবে তারিখ মিলিয়ে সাজান</strong>
                  <br />
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    (যদি এই সদস্যের দিন বাড়ানো/কমানো হয়, তবে পরের সদস্যদের বাজারের তারিখ স্বয়ংক্রিয়ভাবে ধারাবাহিক থাকবে)
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary"
                >
                  বাতিল
                </button>
                <button type="submit" className="btn btn-primary">
                  পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: AUTO GENERATE SCHEDULE ================= */}
      {isAutoGenModalOpen && (
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
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--surface-solid)',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#a855f7" />
              <span>স্বয়ংক্রিয় বাজার শিডিউল জেনারেটর</span>
            </h3>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
              নির্বাচিত সদস্যদের মাঝে সম্পূর্ণ মাসের বাজার দিন সংখ্যা অনুযায়ী ধারাবাহিক ভাগে ভাগ হয়ে শিডিউল তৈরি হবে:
            </p>

            <form onSubmit={handleAutoGenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    শুরুর তারিখ
                  </label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={autoGenStartDate}
                    onChange={(e) => setAutoGenStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    প্রতি সদস্যের দিন সংখ্যা
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    className="form-input"
                    value={autoGenDays}
                    onChange={(e) => setAutoGenDays(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for Auto-Gen */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  কুইক মেয়াদ প্রিসেট:
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {presetDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setAutoGenDays(d)}
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.775rem',
                        fontWeight: autoGenDays === d ? 800 : 600,
                        background: autoGenDays === d ? '#a855f7' : 'var(--surface-hover)',
                        color: autoGenDays === d ? '#ffffff' : 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    >
                      {d} দিন করে
                    </button>
                  ))}
                </div>
              </div>

              {/* Members Checklist */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    শিডিউলে অন্তর্ভুক্ত সদস্যবৃন্দ ({autoGenSelectedMembers.length}/{members.filter((m) => m.isActive).length}):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const allActive = members.filter((m) => m.isActive).map((m) => m.id);
                      if (autoGenSelectedMembers.length === allActive.length) {
                        setAutoGenSelectedMembers([]);
                      } else {
                        setAutoGenSelectedMembers(allActive);
                      }
                    }}
                    style={{ fontSize: '0.725rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {autoGenSelectedMembers.length === members.filter((m) => m.isActive).length ? 'সব আনচেক করুন' : 'সবাইকে সিলেক্ট করুন'}
                  </button>
                </div>

                <div
                  style={{
                    maxHeight: '140px',
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    background: 'var(--surface-hover)',
                  }}
                >
                  {members.filter((m) => m.isActive).map((m) => {
                    const isChecked = autoGenSelectedMembers.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.825rem',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          padding: '0.2rem 0.35rem',
                          borderRadius: '4px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAutoGenSelectedMembers([...autoGenSelectedMembers, m.id]);
                            } else {
                              setAutoGenSelectedMembers(autoGenSelectedMembers.filter((id) => id !== m.id));
                            }
                          }}
                        />
                        <span>{m.name} (রুম {m.roomNo})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAutoGenModalOpen(false)}
                  className="btn btn-secondary"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#9333ea', borderColor: '#9333ea' }}
                >
                  ⚡ শিডিউল জেনারেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SWAP ASSIGNMENTS ================= */}
      {isSwapModalOpen && (
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeftRight size={18} color="var(--primary)" />
              <span>দুই সদস্যের বাজার সোয়াপ (Swap)</span>
            </h3>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
              যে দুটি তারিখের বাজার পরস্পর অদলবদল করতে চান তা নির্বাচন করুন:
            </p>

            <form onSubmit={handleSwapSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  প্রথম অ্যাসাইনমেন্ট:
                </label>
                <select
                  className="form-select"
                  value={swapId1}
                  onChange={(e) => setSwapId1(e.target.value)}
                >
                  {sortedAssignments.map((item) => {
                    const m = members.find((x) => x.id === item.memberId);
                    return (
                      <option key={item.id} value={item.id}>
                        {formatDisplayDate(item.assignmentDate)} — {m?.name} ({item.daysCount || defaultDays} দিন)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  দ্বিতীয় অ্যাসাইনমেন্ট:
                </label>
                <select
                  className="form-select"
                  value={swapId2}
                  onChange={(e) => setSwapId2(e.target.value)}
                >
                  {sortedAssignments.map((item) => {
                    const m = members.find((x) => x.id === item.memberId);
                    return (
                      <option key={item.id} value={item.id}>
                        {formatDisplayDate(item.assignmentDate)} — {m?.name} ({item.daysCount || defaultDays} দিন)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(false)}
                  className="btn btn-secondary"
                >
                  বাতিল
                </button>
                <button type="submit" className="btn btn-primary">
                  সোয়াপ নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
