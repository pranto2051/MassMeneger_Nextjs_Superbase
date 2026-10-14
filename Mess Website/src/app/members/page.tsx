'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  MessageCircle,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Building,
  Mail,
  Edit2,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';
import { useUIFeedback } from '@/context/UIFeedbackContext';
import { Member, MessRole } from '@/types';

export default function MembersPage() {
  const { members, addMember, updateMember, toggleMemberActive } = useMess();
  const { showToast, confirm } = useUIFeedback();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MessRole>('member');
  const [profileNote, setProfileNote] = useState('');

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setNickname('');
    setRoomNo('');
    setMobile('');
    setWhatsapp('');
    setEmail('');
    setRole('member');
    setProfileNote('');
    setIsModalOpen(true);
  };

  const openEditModal = (m: Member) => {
    setEditingMember(m);
    setName(m.name);
    setNickname(m.nickname || '');
    setRoomNo(m.roomNo || '');
    setMobile(m.mobile || '');
    setWhatsapp(m.whatsapp || '');
    setEmail(m.email || '');
    setRole(m.role);
    setProfileNote(m.profileNote || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('সদস্যের নাম দেওয়া বাধ্যতামূলক!', 'warning');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, {
        name,
        nickname,
        roomNo,
        mobile,
        whatsapp,
        email,
        role,
        profileNote,
      });
      showToast(`${name}-এর তথ্য সফলভাবে আপডেট করা হয়েছে!`, 'success');
    } else {
      addMember({
        name,
        nickname,
        roomNo,
        mobile,
        whatsapp,
        email,
        role,
        profileNote,
        joiningDate: new Date().toISOString().split('T')[0],
        isActive: true,
      });
      showToast(`নতুন সদস্য "${name}" সফলভাবে যুক্ত করা হয়েছে!`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.roomNo && m.roomNo.includes(searchTerm)) ||
      (m.mobile && m.mobile.includes(searchTerm))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', lineHeight: 1.3 }}>
            <Users size={24} color="var(--primary)" />
            <span>মেম্বার ডিরেক্টরি ({members.length} জন)</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            মেসের সক্রিয় ও সাবেক সকল সদস্যের তালিকা, মোবাইল নম্বর ও ভূমিকা ব্যবস্থাপনা
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary mobile-full-width">
          <UserPlus size={16} />
          <span>নতুন সদস্য যুক্ত করুন</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem 1rem' }}>
        <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          className="form-input"
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.9rem' }}
          placeholder="নাম, রুম নম্বর বা মোবাইল দিয়ে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Members Table with Horizontal Scroll */}
      <div className="glass-table-wrapper">
        <table className="glass-table" style={{ minWidth: '700px' }}>
          <thead>
            <tr>
              <th>সদস্যের নাম</th>
              <th>রুম নং</th>
              <th>ভূমিকা (Role)</th>
              <th>যোগাযোগ (Mobile / WhatsApp)</th>
              <th>যোগদানের তারিখ</th>
              <th>স্ট্যাটাস</th>
              <th style={{ textAlign: 'right' }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{m.name}</div>
                  {m.nickname && (
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      ডাকনাম: {m.nickname}
                    </div>
                  )}
                  {m.profileNote && (
                    <div style={{ fontSize: '0.725rem', color: 'var(--primary)', marginTop: '0.1rem' }}>
                      {m.profileNote}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-info" style={{ fontWeight: 700 }}>
                    রুম {m.roomNo || 'N/A'}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      m.role === 'owner'
                        ? 'badge-primary'
                        : m.role === 'manager'
                        ? 'badge-warning'
                        : 'badge-secondary'
                    }`}
                  >
                    {m.role === 'owner' ? 'মালিক' : m.role === 'manager' ? 'ম্যানেজার' : 'সাধারণ সদস্য'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', whiteSpace: 'nowrap' }}>
                    {m.mobile && (
                      <a
                        href={`tel:${m.mobile}`}
                        title="সরাসরি ফোন করুন"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        <Phone size={13} color="var(--primary)" />
                        <span>{m.mobile}</span>
                      </a>
                    )}
                    {m.whatsapp && (
                      <a
                        href={`https://wa.me/88${m.whatsapp.replace(/^0+/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                        style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}
                      >
                        <MessageCircle size={15} />
                      </a>
                    )}
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{m.joiningDate}</td>
                <td>
                  <span className={`badge ${m.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {m.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => openEditModal(m)}
                      className="btn btn-secondary btn-sm"
                      title="তথ্য সম্পাদন করুন"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={async () => {
                        if (m.isActive) {
                          const ok = await confirm({
                            title: 'সদস্য নিষ্ক্রিয়করণ',
                            message: `আপনি কি নিশ্চিত যে "${m.name}"-কে নিষ্ক্রিয় করতে চান?`,
                            confirmText: 'হ্যাঁ, নিষ্ক্রিয় করুন',
                            cancelText: 'বাতিল',
                            type: 'warning',
                          });
                          if (!ok) return;
                        }
                        toggleMemberActive(m.id);
                        showToast(
                          `সদস্য "${m.name}" এখন ${!m.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে!`,
                          !m.isActive ? 'success' : 'info'
                        );
                      }}
                      className="btn btn-secondary btn-sm"
                      title={m.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    >
                      {m.isActive ? <XCircle size={13} color="#ef4444" /> : <CheckCircle size={13} color="#10b981" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Member Modal (Mobile Friendly) */}
      {isModalOpen && (
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
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {editingMember ? 'মেম্বার তথ্য পরিবর্তন' : 'নতুন সদস্য নিবন্ধন'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="responsive-two-col">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    ডাকনাম
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="যেমন: প্রanto"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    রুম নম্বর
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="যেমন: 301"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="responsive-two-col">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    মোবাইল নম্বর (017... অক্ষত থাকবে)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="01712345678"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    হোয়াটসঅ্যাপ নম্বর
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="01712345678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              <div className="responsive-two-col">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    ভূমিকা (Role)
                  </label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as MessRole)}
                  >
                    <option value="member">সাধারণ সদস্য (Member)</option>
                    <option value="manager">ম্যানেজার (Manager)</option>
                    <option value="owner">মেস মালিক (Owner)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  প্রোফাইল নোট / মন্তব্য
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="যেমন: কোষাধ্যক্ষ বা রুম লিডার"
                  value={profileNote}
                  onChange={(e) => setProfileNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  বাতিল
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'সংরক্ষণ করুন' : 'নিবন্ধন সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
