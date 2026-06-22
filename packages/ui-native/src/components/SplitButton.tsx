import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, gradients, fonts, nativeShadows } from '@lockin90/tokens';
import { Icon } from './Icon';
import { Menu, type MenuItemData } from './Menu';

export type SplitButtonVariant = 'primary' | 'default';

export interface SplitButtonProps {
  /** Primary action label (the wide left segment). */
  label: string;
  /** Fired when the primary segment is pressed. */
  onPress?: () => void;
  /** Secondary actions shown in the chevron dropdown. */
  items: MenuItemData[];
  /** `primary` = energy-gradient CTA (default); `default` = neutral glass. */
  variant?: SplitButtonVariant;
  /** Optional leading glyph on the primary segment. */
  icon?: ReactNode;
}

/** A primary action joined to a chevron toggle that opens a {@link Menu} of
 *  secondary actions (e.g. "Create page ▾" → New page / Duplicate / Import).
 *  The two segments share one rounded group with a hairline divider between;
 *  the chevron reuses {@link Menu} for the dropdown panel + outside-close. */
export function SplitButton({ label, onPress, items, variant = 'primary', icon }: SplitButtonProps) {
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? '#0A0A12' : colors.text;
  const chevColor = isPrimary ? '#0A0A12' : colors.textDim;

  return (
    <View style={[styles.group, isPrimary ? styles.groupPrimary : styles.groupDefault]}>
      {/* primary segment */}
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {isPrimary ? (
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.main}
          >
            {icon != null && <View style={styles.icon}>{icon}</View>}
            <Text style={[styles.label, { color: fg }]} numberOfLines={1}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.main, styles.mainDefault]}>
            {icon != null && <View style={styles.icon}>{icon}</View>}
            <Text style={[styles.label, { color: fg }]} numberOfLines={1}>{label}</Text>
          </View>
        )}
      </Pressable>

      {/* hairline divider */}
      <View style={[styles.divider, { backgroundColor: isPrimary ? 'rgba(0,0,0,0.22)' : colors.border }]} />

      {/* chevron segment — reuses Menu (modal panel + outside-close) */}
      <View style={isPrimary ? styles.chevWrapPrimary : styles.chevWrapDefault}>
        {isPrimary && (
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Menu
          align="right"
          items={items}
          trigger={
            <View style={styles.chev}>
              <Icon name="chevron" size={13} color={chevColor} />
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  groupPrimary: { ...nativeShadows.glowAccent },
  groupDefault: { borderWidth: 1, borderColor: colors.border },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  mainDefault: { backgroundColor: colors.glass2 },
  pressed: { opacity: 0.85 },
  icon: { flexShrink: 0 },
  label: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 13 },
  divider: { width: 1 },
  chevWrapPrimary: { position: 'relative', justifyContent: 'center', overflow: 'hidden' },
  chevWrapDefault: { position: 'relative', justifyContent: 'center', backgroundColor: colors.glass2 },
  chev: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
});
