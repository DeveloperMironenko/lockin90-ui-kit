import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface ListRowProps extends ViewProps {
  /** Leading slot — an icon, avatar, badge, or letter chip. */
  leading?: ReactNode;
  /** Primary line. */
  title: ReactNode;
  /** Optional dimmer second line under the title. */
  subtitle?: ReactNode;
  /** Trailing slot — a chevron, value, or icon (pinned to the right). */
  trailing?: ReactNode;
  /**
   * When set, the row becomes a `Pressable` (mirrors the web's `onClick`).
   * Native uses `onPress`; the web uses `onClick` — otherwise the same API.
   */
  onPress?: () => void;
  /** Accent-tinted selected state (used in pickers). */
  active?: boolean;
  /** Danger tone — tints the title `--zone-low`. */
  danger?: boolean;
  /**
   * Draw a hairline top border (separates adjacent rows). Defaults to `true`;
   * set `divider={false}` on the FIRST row of a stack so it has no top border.
   * (Web draws this between rows via `.lk-listrow + .lk-listrow`; native has no
   * sibling selectors, so the divider is opt-out per row instead.)
   */
  divider?: boolean;
}

/** Title/subtitle helpers: render strings as <Text>, pass nodes through. */
function asText(node: ReactNode, textStyle: object): ReactNode {
  return typeof node === 'string' || typeof node === 'number' ? (
    <Text style={textStyle} numberOfLines={1}>
      {node}
    </Text>
  ) : (
    node
  );
}

/** Generic tappable list item — leading + title/subtitle + trailing. Mirrors
 *  the web `@lockin90/ui` `ListRow`. With `onPress` it renders a `Pressable`
 *  that highlights while pressed; otherwise a static `View`. */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onPress,
  active,
  danger,
  divider = true,
  style,
  ...rest
}: ListRowProps) {
  const titleStyle = [styles.title, danger && styles.titleDanger];

  const body = (
    <>
      {leading != null && <View style={styles.leading}>{leading}</View>}
      <View style={styles.main}>
        {asText(title, titleStyle)}
        {subtitle != null && asText(subtitle, styles.subtitle)}
      </View>
      {trailing != null && <View style={styles.trailing}>{trailing}</View>}
    </>
  );

  const rowStyle = [
    styles.row,
    divider && styles.divider,
    active && styles.active,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...rowStyle, pressed && styles.pressed]}
        {...rest}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View style={rowStyle} {...rest}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.glass,
  },
  active: {
    // accent tint ~12% — RN has no color-mix; use a translucent accent fill.
    backgroundColor: 'rgba(124,92,255,0.14)',
  },
  leading: {
    flexShrink: 0,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.ui,
    fontSize: 14.5,
    lineHeight: 18,
    color: colors.text,
  },
  titleDanger: {
    color: colors.zoneLow,
  },
  subtitle: {
    marginTop: 1,
    fontFamily: fonts.ui,
    fontSize: 12.5,
    lineHeight: 16,
    color: colors.textDim,
  },
  trailing: {
    flexShrink: 0,
    marginLeft: 'auto',
  },
});
