'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Utensils,
  ShoppingCart,
  Wallet,
  Calculator,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useMess } from '@/context/MessContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { mess, period, t, language } = useMess();

  const navItems = [
    { label: t('dashboard'), href: '/', icon: LayoutDashboard },
    { label: t('members'), href: '/members', icon: Users },
    { label: t('meals'), href: '/meals', icon: Utensils },
    { label: t('market'), href: '/market', icon: ShoppingCart },
    { label: t('accounts'), href: '/accounts', icon: Wallet },
    { label: t('settlement'), href: '/settlement', icon: Calculator },
    { label: t('reports'), href: '/reports', icon: FileSpreadsheet },
    { label: t('settings'), href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
            display: 'block',
          }}
        />
      )}

      <aside
        style={{
          width: '270px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem',
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-glass)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="sidebar-container"
      >
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingLeft: '0.25rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 16px var(--primary-glow)',
              }}
            >
              <Building2 size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Mess Manager
              </h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={12} /> PRO ADMIN
              </span>
            </div>
          </div>

          {/* Active Mess Info Card */}
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-light)',
              border: '1px solid var(--border-glass)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              বর্তমান মেস
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mess.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>স্ট্যাটাস:</span>
              <span className={`badge ${period.status === 'locked' ? 'badge-danger' : 'badge-success'}`}>
                {period.status === 'locked' ? 'লকড' : 'হিসাব চালু'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)'
                      : 'transparent',
                    boxShadow: isActive ? '0 4px 12px var(--primary-glow)' : 'none',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--surface-elevated)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Role Card at Bottom */}
        <div
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            প্র
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              তানভীর প্রanto
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>মালিক ও ম্যানেজার</div>
          </div>
        </div>
      </aside>

      {/* Responsive CSS helper */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .sidebar-container {
            transform: translateX(0) !important;
          }
          .main-content-canvas {
            margin-left: 270px !important;
          }
        }
      `}</style>
    </>
  );
}
