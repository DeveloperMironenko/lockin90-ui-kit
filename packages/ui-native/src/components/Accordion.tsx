import { useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

export interface AccordionItemData {
  /** Header row label. */
  title: string;
  /** Body content revealed when the item is open. */
  content: ReactNode;
}

export interface AccordionProps extends ViewProps {
  /** Disclosure rows. Defaults to a small FAQ sample. */
  items?: AccordionItemData[];
  /** Allow several rows open at once. Default false (single-open). */
  multiple?: boolean;
  /** Index open on mount. Default 0. */
  defaultOpen?: number;
}

const DEFAULT_ITEMS: AccordionItemData[] = [
  { title: 'How accurate are the estimates?', content: 'They improve as you log more sessions.' },
  { title: 'Can I cancel anytime?', content: 'Yes — your plan stays active until the end of the period.' },
  { title: 'Do you support wearables?', content: 'WHOOP, Oura, Apple Health and more.' },
];

/** Down chevron matching the web glyph (`M6 9l6 6 6-6`); rotates 180deg open. */
function Chevron({ open }: { open: boolean }) {
  return (
    <View style={open ? styles.chevOpen : undefined}>
      <Svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={open ? colors.accent : colors.textFaint}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M6 9l6 6 6-6" />
      </Svg>
    </View>
  );
}

/** Collapsible disclosure list — a header row with a chevron that rotates open
 *  while the body reveals. Items separated by a 1px hairline. */
export function Accordion({
  items = DEFAULT_ITEMS,
  multiple = false,
  defaultOpen = 0,
  style,
  ...rest
}: AccordionProps) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen >= 0 && defaultOpen < items.length ? [defaultOpen] : []),
  );

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  return (
    <View style={[styles.acc, style]} {...rest}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <View key={i} style={[styles.item, i === 0 && styles.itemFirst]}>
            <Pressable
              style={styles.head}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => toggle(i)}
            >
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Chevron open={isOpen} />
            </Pressable>
            {isOpen && (
              <View style={styles.body}>
                {typeof item.content === 'string' ? (
                  <Text style={styles.content}>{item.content}</Text>
                ) : (
                  item.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  acc: { flexDirection: 'column' },
  item: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemFirst: { borderTopWidth: 1, borderTopColor: colors.border },
  head: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  title: {
    flexShrink: 1,
    fontFamily: fonts.ui,
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.07,
    color: colors.text,
  },
  chevOpen: { transform: [{ rotate: '180deg' }] },
  body: { paddingHorizontal: 4, paddingBottom: 18 },
  content: { fontFamily: fonts.ui, fontSize: 13.5, lineHeight: 20, color: colors.textDim },
});
