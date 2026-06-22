import { useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';
import { Icon } from './Icon';

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
