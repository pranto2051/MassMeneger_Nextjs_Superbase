'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Trash2,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration: number;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface UIFeedbackContextType {
  showToast: (
    message: string,
    type?: ToastType,
    title?: string,
    duration?: number
  ) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const UIFeedbackContext = createContext<UIFeedbackContextType | undefined>(undefined);

export function UIFeedbackProvider({ children }: { children: React.ReactNode }) {
  // Toasts State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'হ্যাঁ, নিশ্চিত',
    cancelText: 'বাতিল',
    type: 'danger',
  });

  const confirmPromiseRef = useRef<{
    resolve: (val: boolean) => void;
  } | null>(null);

  // Show Toast Implementation
  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'success',
      title?: string,
      duration: number = 3800
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const defaultTitle =
        type === 'success'
          ? 'সফল হয়েছে'
          : type === 'error'
          ? 'ত্রুটি হয়েছে'
          : type === 'warning'
          ? 'সতর্কতা'
          : 'তথ্য';

      const newToast: ToastItem = {
        id,
        message,
        title: title || defaultTitle,
        type,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Confirm Implementation (Promise-based)
  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmPromiseRef.current = { resolve };
      setConfirmDialog({
        isOpen: true,
        title: options.title || 'অনুরোধ নিশ্চিত করুন',
        message: options.message,
        confirmText: options.confirmText || 'হ্যাঁ, নিশ্চিত',
        cancelText: options.cancelText || 'বাতিল',
        type: options.type || 'danger',
      });
    });
  }, []);

  const handleConfirmClose = (result: boolean) => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    if (confirmPromiseRef.current) {
      confirmPromiseRef.current.resolve(result);
      confirmPromiseRef.current = null;
    }
  };

  return (
    <UIFeedbackContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* ================= FLOATING TOAST CONTAINER ================= */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxWidth: '380px',
          width: 'calc(100% - 2.5rem)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          const accentColor = isSuccess
            ? '#10b981'
            : isError
            ? '#ef4444'
            : isWarning
            ? '#f59e0b'
            : '#3b82f6';

          const bgSubtle = isSuccess
            ? 'rgba(16, 185, 129, 0.12)'
            : isError
            ? 'rgba(239, 68, 68, 0.12)'
            : isWarning
            ? 'rgba(245, 158, 11, 0.12)'
            : 'rgba(59, 130, 246, 0.12)';

          return (
            <div
              key={toast.id}
              className="toast-slide-in"
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--surface-solid)',
                border: `1px solid ${accentColor}40`,
                boxShadow: '0 12px 35px -6px rgba(0, 0, 0, 0.35)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: bgSubtle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.1rem',
                }}
              >
                {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
                {isError && <XCircle size={18} color="#ef4444" />}
                {isWarning && <AlertTriangle size={18} color="#f59e0b" />}
                {!isSuccess && !isError && !isWarning && <Info size={18} color="#3b82f6" />}
              </div>

              {/* Message */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      lineHeight: 1.25,
                    }}
                  >
                    {toast.title}
                  </div>
                )}
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.2rem',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                  }}
                >
                  {toast.message}
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                }}
                title="বন্ধ করুন"
              >
                <X size={15} />
              </button>

              {/* Progress Countdown Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '3px',
                  background: accentColor,
                  animation: `toastProgress ${toast.duration}ms linear forwards`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ================= CONFIRMATION DIALOG MODAL ================= */}
      {confirmDialog.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(10px)',
          }}
          onClick={() => handleConfirmClose(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '430px',
              background: 'var(--surface-solid)',
              border: `1px solid ${
                confirmDialog.type === 'danger'
                  ? 'rgba(239, 68, 68, 0.4)'
                  : confirmDialog.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.4)'
                  : 'rgba(59, 130, 246, 0.4)'
              }`,
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Pulsing Glowing Icon Circle */}
            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 1.25rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  confirmDialog.type === 'danger'
                    ? 'rgba(239, 68, 68, 0.12)'
                    : confirmDialog.type === 'warning'
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'rgba(59, 130, 246, 0.12)',
                border: `1.5px solid ${
                  confirmDialog.type === 'danger'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : confirmDialog.type === 'warning'
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'rgba(59, 130, 246, 0.3)'
                }`,
              }}
            >
              {confirmDialog.type === 'danger' && <Trash2 size={28} color="#ef4444" />}
              {confirmDialog.type === 'warning' && <AlertTriangle size={28} color="#f59e0b" />}
              {confirmDialog.type === 'info' && <HelpCircle size={28} color="#3b82f6" />}
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.65rem',
                lineHeight: 1.3,
              }}
            >
              {confirmDialog.title}
            </h3>

            {/* Message Body */}
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                marginBottom: '1.75rem',
              }}
            >
              {confirmDialog.message}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {confirmDialog.cancelText}
              </button>

              <button
                type="button"
                onClick={() => handleConfirmClose(true)}
                style={{
                  flex: 1.25,
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#ffffff',
                  background:
                    confirmDialog.type === 'danger'
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : confirmDialog.type === 'warning'
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'var(--primary)',
                  boxShadow:
                    confirmDialog.type === 'danger'
                      ? '0 4px 14px rgba(239, 68, 68, 0.4)'
                      : confirmDialog.type === 'warning'
                      ? '0 4px 14px rgba(245, 158, 11, 0.4)'
                      : '0 4px 14px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.15s ease',
                }}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </UIFeedbackContext.Provider>
  );
}

export function useUIFeedback() {
  const context = useContext(UIFeedbackContext);
  if (!context) {
    throw new Error('useUIFeedback must be used within a UIFeedbackProvider');
  }
  return context;
}
