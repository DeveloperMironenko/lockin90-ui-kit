import { useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
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

/** Popover menu of actions — a glass panel of item rows. The ⋯ trigger toggles
 *  a transparent Modal whose full-screen backdrop closes on tap; the panel is
 *  absolutely anchored near the top (best-effort positioning on native). */
export function Menu({ trigger, items = DEFAULT_ITEMS, align = 'right' }: MenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.root}>
      <Pressable
        style={styles.trigger}
        accessibilityRole="button"
        onPress={() => setOpen((v) => !v)}
      >
        {trigger ?? <Icon name="more" size={18} color={colors.textDim} />}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View
            style={[styles.panel, align === 'left' ? styles.left : styles.right]}
            // stop backdrop press from firing when tapping inside the panel
            onStartShouldSetResponder={() => true}
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
        </Pressable>
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
  backdrop: { flex: 1 },
  panel: {
    position: 'absolute',
    top: 60,
    minWidth: 160,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.bg1,
    ...nativeShadows.elev2,
  },
  right: { right: 16 },
  left: { left: 16 },
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
