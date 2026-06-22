import { useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** the bubble text/content shown on press */
  content?: ReactNode;
  /** which side the bubble sits on relative to the trigger */
  placement?: TooltipPlacement;
  /** the trigger; if omitted a small "?" badge is rendered instead */
  children?: ReactNode;
}

/** Press-to-show tooltip (native has no hover) — wraps a trigger and toggles a
 *  glassy bubble positioned above/below/beside it. Tapping the trigger again
 *  hides it. Mirrors the web `Tooltip` prop API + bubble styling. */
export function Tooltip({ content = 'Tooltip', placement = 'top', children }: TooltipProps) {
  const [open, setOpen] = useState(false);

  const trigger = children ?? (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>?</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <Pressable accessibilityRole="button" onPress={() => setOpen((v) => !v)}>
        {trigger}
      </Pressable>

      {open && (
        <View style={[styles.bubble, PLACEMENT[placement]]} pointerEvents="none">
          {typeof content === 'string' ? (
            <Text style={styles.text}>{content}</Text>
          ) : (
            content
          )}
        </View>
      )}
    </View>
  );
}

const PLACEMENT: Record<TooltipPlacement, object> = {
  top: { bottom: '100%', alignSelf: 'center', marginBottom: 8 },
  bottom: { top: '100%', alignSelf: 'center', marginTop: 8 },
  left: { right: '100%', top: 0, marginRight: 8 },
  right: { left: '100%', top: 0, marginLeft: 8 },
};

const styles = StyleSheet.create({
  root: { alignSelf: 'flex-start' },
  badge: {
    width: 16,
    height: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.ui, fontSize: 11, fontWeight: '600', color: colors.textDim },
  bubble: {
    position: 'absolute',
    maxWidth: 220,
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.bg1,
    ...nativeShadows.elev1,
  },
  text: { fontFamily: fonts.ui, fontSize: 12, lineHeight: 16, color: colors.text },
});
