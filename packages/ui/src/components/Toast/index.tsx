'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../cn';

export type ToastTone = 'info' | 'ok' | 'warn' | 'bad';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Auto-dismiss after N ms (default 4000; 0 = sticky). */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_COLOR: Record<ToastTone, string> = {
  info: 'var(--info)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  bad: 'var(--bad)',
};

/** Wrap your app once; call `useToast()` anywhere below to raise toasts. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (opts: ToastOptions): number => {
      const id = ++seq.current;
      setItems((list) => [...list, { ...opts, id }]);
      const duration = opts.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxWidth: 'min(360px, 90vw)',
        }}
      >
        {items.map((t) => (
          <Toast key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Access the toast dispatcher. Must be used under a <ToastProvider>. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
  return ctx;
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const color = TONE_COLOR[item.tone ?? 'info'];
  return (
    <div
      role="status"
      className={cn('lk-card', 'lk-reveal', 'lk-in')}
      style={{ padding: 14, display: 'flex', gap: 11, alignItems: 'flex-start', boxShadow: 'var(--elev-2)' }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, marginTop: 5, flex: '0 0 auto' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
        {item.description != null && (
          <div className="lk-muted" style={{ fontSize: 13, marginTop: 2 }}>
            {item.description}
          </div>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: 0, lineHeight: 1 }}
      >
        <svg viewBox="0 0 24 24" width={16} height={16} stroke="currentColor" strokeWidth={1.8} fill="none">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
