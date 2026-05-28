import React from 'react';
import { Modal as RNModal, Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '@p90/tokens';
import { Eyebrow } from './Typography';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ open, onClose, title, eyebrow, children, footer, maxWidth = 520 }: ModalProps) {
  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.panel, { maxWidth }]} onPress={(e) => e.stopPropagation()}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {title && <Text style={styles.title}>{title}</Text>}
          {children}
          {footer && <View style={styles.footer}>{footer}</View>}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  panel:    { width: '100%', backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, padding: 24 },
  title:    { fontFamily: fonts.displayItalic, fontSize: 28, color: colors.textPrimary, marginTop: 8, marginBottom: 16, textTransform: 'uppercase' },
  footer:   { marginTop: 24, flexDirection: 'row', gap: 8 },
});
