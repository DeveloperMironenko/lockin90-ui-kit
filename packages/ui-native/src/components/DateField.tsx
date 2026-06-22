import { useState, type ComponentType, type ReactNode } from 'react';
import { View, Text, TextInput, Pressable, Platform, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path, Rect, Polyline } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/* @react-native-community/datetimepicker is an optional peer dependency. When
 * installed, tapping the field opens the OS date picker — the native analogue of
 * web's `<input type="date">`; when absent the field falls back to an editable
 * text input. Resolved lazily so the kit never hard-depends on it. */
let DateTimePicker: ComponentType<{
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  display?: string;
  onChange?: (event: { type: string }, date?: Date) => void;
}> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch {
  DateTimePicker = null;
}

/** Parse a `YYYY-MM-DD` string into a local Date (or undefined). */
function parseDate(v?: string): Date | undefined {
  if (!v) return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (!m) return undefined;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Format a Date as `YYYY-MM-DD`. */
function formatDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* ============================================================================
   DateField — a dark glassy date field. Mono uppercase label above, a leading
   calendar glyph, and an accent focus border. When the optional datetimepicker
   peer is present, tapping opens the OS date picker (the native analogue of web's
   `<input type="date">`) and `onChange` receives a 'YYYY-MM-DD' string; otherwise
   it falls back to a plain text field. Mirrors the web `@lockin90/ui` DateField.
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

/** Dark glassy date field — leading calendar glyph, accent focus border.
 *  Opens the OS date picker when the optional datetimepicker peer is installed;
 *  otherwise an editable text field (graceful fallback). */
export function DateField({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  label,
  style,
  ...rest
}: DateFieldProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const borderColor = focused || show ? colors.accent : colors.border2;

  const labelEl = label ? <Text style={styles.dateLabel}>{label.toUpperCase()}</Text> : null;

  // OS picker path — tap the field to open the platform date picker.
  if (DateTimePicker) {
    return (
      <View style={[styles.dateWrap, style]} {...rest}>
        {labelEl}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label ?? placeholder}
          onPress={() => setShow(true)}
          style={[styles.dateField, { borderColor }]}
        >
          <View style={styles.dateLead}>
            <CalendarIcon color={colors.textFaint} />
          </View>
          <Text style={[styles.dateInput, !value && styles.datePlaceholder]} numberOfLines={1}>
            {value || placeholder}
          </Text>
        </Pressable>
        {show ? (
          <>
            <DateTimePicker
              value={parseDate(value) ?? new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                if (Platform.OS !== 'ios') setShow(false);
                if (event.type === 'dismissed') return;
                if (date) onChange?.(formatDate(date));
              }}
            />
            {Platform.OS === 'ios' ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setShow(false)}
                style={styles.dateDone}
              >
                <Text style={styles.dateDoneText}>Done</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </View>
    );
  }

  // Fallback path — editable text field (no picker installed).
  return (
    <View style={[styles.dateWrap, style]} {...rest}>
      {labelEl}
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
  datePlaceholder: { color: colors.textFaint },
  dateDone: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  dateDoneText: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
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
