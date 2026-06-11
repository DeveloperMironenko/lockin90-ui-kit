'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ToastData, ToastTone } from './types';

interface ToastContextValue {
  push: (tone: ToastTone, message: string) => void;
  audit: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

const TONE_CLASS: Record<ToastTone, string> = {
  success: 'border-[#34F5C5]/40 text-white',
  audit:   'border-border-strong text-white',
  error:   'border-accent/50 text-accent',
};

const TONE_DOT: Record<ToastTone, string> = {
  success: 'bg-[#34F5C5]',
  audit:   'bg-accent',
  error:   'bg-accent',
};

interface ToastProviderProps {
  children: React.ReactNode;
  /**
   * Optional bridge so non-React code (e.g. an axios 429 handler) can emit toasts.
   * Receives `push` and returns an unsubscribe fn. Frontend omits it; admin passes
   * its `subscribeToast` bus.
   */
  bridge?: (push: (tone: ToastTone, message: string) => void) => (() => void) | void;
}

export function ToastProvider({ children, bridge }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const push = useCallback((tone: ToastTone, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, tone, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const audit = useCallback((message: string) => push('audit', `Logged: ${message}`), [push]);

  useEffect(() => {
    if (!bridge) return;
    return bridge(push) || undefined;
  }, [bridge, push]);

  return (
    <ToastContext.Provider value={{ push, audit }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-[400px]">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`bg-elevated-2 border rounded px-4 py-2.5 flex items-center gap-2.5 ea-fade-in ${TONE_CLASS[t.tone]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TONE_DOT[t.tone]}`} />
            <span className="text-[12px] font-mono">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function ToastTimeoutEffect({ ms = 4000, onDone }: { ms?: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, ms);
    return () => clearTimeout(t);
  }, [ms, onDone]);
  return null;
}
