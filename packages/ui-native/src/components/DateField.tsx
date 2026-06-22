import { useState, type ReactNode } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path, Rect, Polyline } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/* ============================================================================
   DateField — a dark glassy date field. Mono uppercase label above, a leading
   calendar glyph, and an accent focus border. React Native has no native date
   input, so this renders a plain text field (default placeholder 'YYYY-MM-DD');
   accept value / onChange as text. Mirrors the web `@lockin90/ui` DateField.
   ========================================================================== */

export interface DateFieldProps extends Omit<ViewProps, 'onChange'> {
  /** current value (text, e.g. 2026-06-21) */
  value?: string;
  /** fires with the raw input value on every change */
  onChange?: (value: string) => void;
  /** placeholder when empty */
  placeholder?: string;
  /** small mono uppercase label rendered above the field */
  label?: string;
}

/** Leading calendar glyph for the date field. */
function CalendarIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <Path d="M3 9h18" />
      <Path d="M8 2.5v4M16 2.5v4" />
    </Svg>
  );
}

/** Dark glassy date field — leading calendar glyph, accent focus border. */
export function DateField({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  label,
  style,
  ...rest
}: DateFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? colors.accent : colors.border2;

  return (
    <View style={[styles.dateWrap, style]} {...rest}>
      {label ? <Text style={styles.dateLabel}>{label.toUpperCase()}</Text> : null}
      <View style={[styles.dateField, { borderColor }]}>
        <View style={styles.dateLead}>
          <CalendarIcon color={colors.textFaint} />
        </View>
        <TextInput
          style={styles.dateInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

/* ============================================================================
   TreeItem — a nested, expandable tree row for nav / page trees. A chevron that
   rotates when expanded, an optional leading icon, the label, an optional faint
   drag handle, an accent-tinted active state, and indented children rendered
   below when expanded. Mirrors the web `@lockin90/ui` TreeItem.
   ========================================================================== */

export interface TreeItemProps extends Omit<ViewProps, 'children'> {
  /** row label text */
  label?: string;
  /** nesting depth — indents the row by depth * 16 */
  depth?: number;
  /** show a chevron and allow toggling open/closed */
  expandable?: boolean;
  /** whether the children are currently revealed */
  expanded?: boolean;
  /** called when the chevron / row toggle is activated */
  onToggle?: () => void;
  /** optional leading glyph (before the label) */
  icon?: ReactNode;
  /** accent-tinted selected row */
  active?: boolean;
  /** show a faint ⠿ drag handle on the left */
  dragHandle?: boolean;
  /** nested TreeItems, shown only when `expanded` */
  children?: ReactNode;
}

/** Chevron glyph — rotated 90° when expanded. */
function ChevronIcon({ color }: { color: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 6 15 12 9 18" />
    </Svg>
  );
}

/** Nested, expandable tree row — chevron, optional icon, label, drag handle. */
export function TreeItem({
  label = 'Page',
  depth = 0,
  expandable = false,
  expanded = false,
  onToggle,
  icon,
  active = false,
  dragHandle = false,
  children,
  style,
  ...rest
}: TreeItemProps) {
  return (
    <View style={styles.treeItem}>
      <Pressable
        style={[styles.treeRow, active && styles.treeActive, { paddingLeft: depth * 16 + 8 }, style]}
        onPress={expandable ? onToggle : undefined}
        {...rest}
      >
        {dragHandle ? <Text style={styles.treeGrip}>⠿</Text> : null}

        {expandable ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Collapse' : 'Expand'}
            accessibilityState={{ expanded }}
            onPress={onToggle}
            style={styles.treeChevron}
            hitSlop={6}
          >
            <View style={expanded ? styles.treeChevronOpen : undefined}>
              <ChevronIcon color={colors.textFaint} />
            </View>
          </Pressable>
        ) : (
          <View style={styles.treeSpacer} />
        )}

        {icon ? <View style={styles.treeIcon}>{icon}</View> : null}

        <Text style={styles.treeLabel} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>

      {expandable && expanded && children ? <View style={styles.treeChildren}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  /* ---- DateField ---- */
  dateWrap: {
    alignSelf: 'flex-start',
    gap: 6,
    minWidth: 0,
  },
  dateLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minWidth: 0,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    borderWidth: 1,
    backgroundColor: colors.glass2,
  },
  dateLead: { flexShrink: 0 },
  dateInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 20,
  },
  /* ---- TreeItem ---- */
  treeItem: {},
  treeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 10,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  treeActive: {
    backgroundColor: 'rgba(124,92,255,0.12)',
    borderColor: 'rgba(124,92,255,0.4)',
  },
  treeGrip: {
    flexShrink: 0,
    fontSize: 13,
    lineHeight: 13,
    color: colors.textFaint,
  },
  treeChevron: {
    flexShrink: 0,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeChevronOpen: { transform: [{ rotate: '90deg' }] },
  treeSpacer: { flexShrink: 0, width: 18, height: 18 },
  treeIcon: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeLabel: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.ui,
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 16,
    color: colors.text,
  },
  treeChildren: {
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 17,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: colors.border2,
    borderStyle: 'dashed',
    gap: 2,
  },
});
