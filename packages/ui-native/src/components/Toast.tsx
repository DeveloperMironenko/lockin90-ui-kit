import React, { createContext, useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius, zIndex } from '@p90/tokens';

export type ToastLevel = 'success' | 'audit' | 'error' | 'info';

interface ToastData { id: string; level: ToastLevel; message: string }

interface ToastContextValue {
  push: (level: ToastLevel, msg: string) => void;
  audit: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

const COLOR: Record<ToastLevel, string> = {
  success: colors.statusGreen, audit: colors.textPrimary, error: colors.accent, info: colors.textSecondary,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const push = useCallback((level: ToastLevel, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, level, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const audit = useCallback((message: string) => push('audit', `Logged: ${message}`), [push]);
  return (
    <ToastContext.Provider value={{ push, audit }}>
      {children}
      <View pointerEvents="box-none" style={styles.stack}>
        {toasts.map(t => (
          <View key={t.id} style={[styles.toast, { borderColor: COLOR[t.level] + '80' }]}>
            <View style={[styles.dot, { backgroundColor: COLOR[t.level] }]} />
            <Text style={styles.msg}>{t.message}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  stack: { position: 'absolute', bottom: 24, left: 16, right: 16, gap: 8, zIndex: zIndex.toast },
  toast: { backgroundColor: colors.bgElevated2, borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot:   { width: 6, height: 6, borderRadius: 3 },
  msg:   { fontFamily: fonts.mono, fontSize: 12, color: colors.textPrimary, flex: 1 },
});
