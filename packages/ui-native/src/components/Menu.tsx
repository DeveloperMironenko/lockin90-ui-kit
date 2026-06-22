import { useRef, useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';
import { Icon } from './Icon';

/** A single row in a {@link Menu}. A `divider` row renders a hairline
 *  separator instead of an action (its `label` is ignored). */
export interface MenuItemData {
  /** Visible row text. */
  label: string;
  /** Optional leading glyph (e.g. an `<Icon />`). */
  icon?: ReactNode;
  /** Fired on press; the menu closes afterwards. */
  onClick?: () => void;
  /** Render the row in the danger tone (`zoneLow`). */
  danger?: boolean;
  /** Render a 1px separator instead of an action row. */
  divider?: boolean;
}

export interface MenuProps {
  /** The pressable trigger. Defaults to a small ⋯ icon button. */
  trigger?: ReactNode;
  /** Action rows to render in the panel. */
  items?: MenuItemData[];
  /** Which edge of the trigger the panel aligns to. */
  align?: 'left' | 'right';
}

const DEFAULT_ITEMS: MenuItemData[] = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { divider: true, label: '' },
  { label: 'Delete', danger: true },
];

interface Anchor {
  x: number;
  y: number;
  w: number;
  h: number;
}

const { width: SW, height: SH } = Dimensions.get('window');
const EST_W = 160;
const EST_H = 160;

/** Popover menu of actions — a glass panel of item rows. The ⋯ trigger toggles
 *  a transparent Modal whose full-screen backdrop closes on tap; the panel is
 *  absolutely anchored to the measured trigger (flips above near the bottom). */
export function Menu({ trigger, items = DEFAULT_ITEMS, align = 'right' }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [size, setSize] = useState({ pw: EST_W, ph: EST_H });
  const triggerRef = useRef<View>(null);

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, w, h) => setAnchor({ x, y, w, h }));
    setOpen(true);
  };

  const { pw, ph } = size;
  let top = 0;
  let left = 0;
  if (anchor) {
    const flipAbove = anchor.y + anchor.h + ph + 8 > SH && anchor.y - 8 - ph > 0;
    top = flipAbove ? anchor.y - 8 - ph : anchor.y + anchor.h + 6;

    if (align === 'left') left = anchor.x;
    else left = anchor.x + anchor.w - pw;
    left = Math.max(8, Math.min(left, SW - pw - 8));
  }

  return (
    <View style={styles.root}>
      <Pressable
        ref={triggerRef}
        style={styles.trigger}
        accessibilityRole="button"
        onPress={() => (open ? setOpen(false) : openMenu())}
      >
        {trigger ?? <Icon name="more" size={18} color={colors.textDim} />}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        {anchor != null && (
          <View
            style={[styles.panel, { top, left }]}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              if (width !== pw || height !== ph) setSize({ pw: width, ph: height });
            }}
          >
            {items.map((item, i) =>
              item.divider ? (
                <View key={i} style={styles.divider} />
              ) : (
                <Pressable
                  key={i}
                  accessibilityRole="menuitem"
                  style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                  onPress={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                >
                  {item.icon != null && <View style={styles.icon}>{item.icon}</View>}
                  <Text style={[styles.label, item.danger && styles.danger]} numberOfLines={1}>
                    {item.label}
                  </Text>
                </Pressable>
              ),
            )}
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'flex-start' },
  trigger: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  panel: {
    position: 'absolute',
    minWidth: 160,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.bg1,
    ...nativeShadows.elev2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
  },
  itemPressed: { backgroundColor: colors.glass2 },
  icon: { flexShrink: 0 },
  label: { flex: 1, fontFamily: fonts.ui, fontSize: 13.5, color: colors.textDim },
  danger: { color: colors.zoneLow },
  divider: { height: 1, marginVertical: 5, marginHorizontal: 6, backgroundColor: colors.border },
});
