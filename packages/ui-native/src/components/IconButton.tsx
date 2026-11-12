import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';
import { hapticSelection } from '../internal/optionalHaptics';

// the two control sizes (CONVENTIONS "Control sizes"): md 44, sm 36 (its target still 44)
const SIDES = { sm: 36, md: 44 } as const;
const ICON_SIZES = { sm: 16, md: 18 } as const;
// The touch target's least side (the platforms' guideline).
const TARGET = 44;

export interface IconButtonProps
  extends Omit<
    PressableProps,
    'children' | 'style' | 'accessibilityLabel' | 'aria-label' | 'accessibilityLabelledBy' | 'aria-labelledby' | 'accessibilityRole' | 'role'
  > {
  /** The spoken name (`accessibilityLabel`): the button shows no text, so it is required. */
  label: string;
  /** The kit icon it shows, sized for the button and coloured `colors.text`. */
  icon: IconName;
  /** 36 / 44 px square (CONVENTIONS "Control sizes"; `sm` reaches a 44 target). @default 'md' */
  size?: 'sm' | 'md';
  /** On the touch target (at least 44 × 44, the square centred in it): for layout, e.g. `position`. */
  style?: StyleProp<ViewStyle>;
}

/** A square button with one kit icon and no text (IconButton.md), on Button's surface (the opaque field
 *  fill, a button's edge) and with a control's corners: for an action whose icon says it in a
 *  tight spot, like the camera on a profile picture. */
export function IconButton({ label, icon, size = 'md', style, onPress, ...rest }: IconButtonProps) {
  const side = SIDES[size];
  const disabled = rest.disabled === true;
  const press = onPress
    ? (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
        hapticSelection();
        onPress(e);
      }
    : undefined;
  const square = [styles.surface, { width: side, height: side }];

  return (
    <Pressable
      {...rest}
      onPress={press}
      // after the rest, and as aria-label too (it wins over accessibilityLabel): nothing passed replaces them
      accessibilityRole="button"
      role="button"
      accessibilityLabel={label}
      aria-label={label}
      style={[styles.target, style]}
    >
      {({ pressed }) => (
        <View style={[pressed && styles.pressed, disabled && styles.disabled]}>
          <View style={square}>
            <Icon name={icon} size={ICON_SIZES[size]} color={colors.text} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: { minWidth: TARGET, minHeight: TARGET, alignItems: 'center', justifyContent: 'center' },
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    // a control's fill (V19)
    backgroundColor: colors.field,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
  // as Button's (2026-11-09) and web's `.lk-icon-btn:disabled`
  disabled: { opacity: 0.5 },
});
