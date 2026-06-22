import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { CopyButton } from './Popover';

export interface CodeBlockProps {
  /** The raw code / JSON / identifier shown in the block. */
  code: string;
  /** Optional header title, e.g. 'Response' / 'Incident ID' / a filename. */
  label?: string;
  /** Render a CopyButton (value=code) in the header. Default true. */
  copyable?: boolean;
  /** Wrap long lines instead of horizontal scrolling. Default false. */
  wrap?: boolean;
  /** Cap the scroll area height (px); content scrolls vertically past it. */
  maxHeight?: number;
}

/** Monospace code / JSON block on a dark inset surface. Optional header
 *  (label + traffic-light dots + copy) over a horizontally scrolling mono body
 *  (or wrapped), optionally height-capped with vertical scroll. Mirrors the web
 *  `CodeBlock` prop API. Used for raw-record/JSON viewers, incident IDs, keys. */
export function CodeBlock({ code, label, copyable = true, wrap = false, maxHeight }: CodeBlockProps) {
  const hasHeader = label != null || copyable;

  const body = wrap ? (
    <View style={styles.body}>
      <Text style={styles.code}>{code}</Text>
    </View>
  ) : (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.body}
    >
      <Text style={styles.code}>{code}</Text>
    </ScrollView>
  );

  return (
    <View style={styles.root}>
      {hasHeader && (
        <View style={styles.head}>
          <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={[styles.dot, { backgroundColor: colors.zoneLow }]} />
            <View style={[styles.dot, { backgroundColor: colors.zoneMid }]} />
            <View style={[styles.dot, { backgroundColor: colors.mint }]} />
          </View>
          {label != null && (
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          )}
          {copyable && (
            <View style={styles.copy}>
              <CopyButton value={code} />
            </View>
          )}
        </View>
      )}
      {maxHeight != null ? (
        <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg0,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.glass,
  },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 9, height: 9, borderRadius: 999 },
  label: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 0.4,
    color: colors.textFaint,
  },
  copy: { marginLeft: 'auto' },
  body: { paddingHorizontal: 16, paddingVertical: 14 },
  code: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    lineHeight: 20,
    color: colors.textDim,
  },
});
