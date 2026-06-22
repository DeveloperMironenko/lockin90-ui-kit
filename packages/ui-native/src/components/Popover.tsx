import { useEffect, useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';
import { Icon } from './Icon';

/* expo-clipboard is an optional dependency — not a hard dep of this kit.
 * Resolve it lazily and guard usage; if it's absent we keep the visual
 * feedback (the check flash) and skip the actual clipboard write. */
let clipboard: { setStringAsync?: (v: string) => Promise<unknown> } | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  clipboard = require('expo-clipboard');
} catch {
  clipboard = null;
}

export interface PopoverProps {
  /** The pressable trigger. Defaults to a small "?" info button. */
  trigger?: ReactNode;
  /** Panel content. Defaults to a short sample explainer. */
  children?: ReactNode;
  /** Which edge of the trigger the panel aligns to. */
  align?: 'left' | 'right' | 'center';
}

const DEFAULT_TEXT =
  'This score blends your recent training, sleep, and recovery signals into a single readiness number.';

/** Click-triggered floating panel of arbitrary content (richer than a Tooltip).
 *  The "?" trigger toggles a transparent Modal whose full-screen backdrop closes
 *  on tap; the panel is a glass card anchored near the top (best-effort native
 *  positioning). Mirrors the web `Popover` prop API. */
export function Popover({ trigger, children, align = 'center' }: PopoverProps) {
  const [open, setOpen] = useState(false);

  const alignStyle = align === 'left' ? styles.left : align === 'right' ? styles.right : styles.center;

  return (
    <View style={styles.root}>
      <Pressable
        style={styles.trigger}
        accessibilityRole="button"
        onPress={() => setOpen((v) => !v)}
      >
        {trigger ?? <Icon name="info" size={16} color={colors.textDim} />}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View
            style={[styles.panel, alignStyle]}
            onStartShouldSetResponder={() => true}
          >
            {children ?? <Text style={styles.text}>{DEFAULT_TEXT}</Text>}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'flex-start' },
  trigger: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: { flex: 1 },
  panel: {
    position: 'absolute',
    top: 80,
    maxWidth: 260,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.bg1,
    ...nativeShadows.elev2,
  },
  left: { left: 16 },
  right: { right: 16 },
  center: { alignSelf: 'center' },
  text: { fontFamily: fonts.ui, fontSize: 12.5, lineHeight: 18, color: colors.textDim },
});

export interface CopyButtonProps {
  /** Text written to the clipboard on press. */
  value?: string;
  /** Optional label rendered beside the icon. */
  label?: string;
  /** Fires after the copy (clipboard write is best-effort on native). */
  onPress?: () => void;
}

/** Copies `value` to the clipboard (via expo-clipboard if present) and flashes
 *  a transient check for ~1.2s — the copy glyph (two overlapping rounded rects)
 *  swaps to a check Icon. Mirrors the web `CopyButton`. */
export function CopyButton({ value = 'LOCKIN-2026', label, onPress }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copied ? 'Copied' : 'Copy'}
      onPress={() => {
        if (value != null && typeof clipboard?.setStringAsync === 'function') {
          void clipboard.setStringAsync(value);
        }
        setCopied(true);
        onPress?.();
      }}
      style={({ pressed }) => [copyStyles.btn, copied && copyStyles.btnDone, pressed && copyStyles.btnPressed]}
    >
      {copied ? (
        <Icon name="check" size={15} color={colors.accent3} />
      ) : (
        <Svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.textDim}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Rect x={9} y={9} width={11} height={11} rx={2.5} />
          <Path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5V4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
        </Svg>
      )}
      {label != null && (
        <Text style={[copyStyles.label, copied && copyStyles.labelDone]}>{label}</Text>
      )}
    </Pressable>
  );
}

const copyStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
  },
  btnPressed: { opacity: 0.85 },
  btnDone: {
    borderColor: 'rgba(52, 245, 197, 0.4)',
    backgroundColor: 'rgba(52, 245, 197, 0.12)',
  },
  label: { fontFamily: fonts.ui, fontSize: 12.5, fontWeight: '600', color: colors.textDim },
  labelDone: { color: colors.accent3 },
});
