import { useRef, useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';
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

interface Anchor {
  x: number;
  y: number;
  w: number;
  h: number;
}

const { width: SW, height: SH } = Dimensions.get('window');
const EST_W = 160;
const EST_H = 32;
const GAP = 8;

/** Press-to-show tooltip (native has no hover) — wraps a trigger and toggles a
 *  glassy bubble positioned above/below/beside it in a transparent Modal,
 *  anchored to the measured trigger and clamped on-screen. Tapping again (or the
 *  backdrop) hides it. Mirrors the web `Tooltip` prop API + bubble styling. */
export function Tooltip({ content = 'Tooltip', placement = 'top', children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [size, setSize] = useState({ pw: EST_W, ph: EST_H });
  const triggerRef = useRef<View>(null);

  const triggerNode = children ?? (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>?</Text>
    </View>
  );

  const openBubble = () => {
    triggerRef.current?.measureInWindow((x, y, w, h) => setAnchor({ x, y, w, h }));
    setOpen(true);
  };

  const { pw, ph } = size;
  let top = 0;
  let left = 0;
  if (anchor) {
    switch (placement) {
      case 'bottom':
        top = anchor.y + anchor.h + GAP;
        left = anchor.x + anchor.w / 2 - pw / 2;
        break;
      case 'left':
        top = anchor.y + anchor.h / 2 - ph / 2;
        left = anchor.x - GAP - pw;
        break;
      case 'right':
        top = anchor.y + anchor.h / 2 - ph / 2;
        left = anchor.x + anchor.w + GAP;
        break;
      case 'top':
      default: {
        // place above; fall back below when there's no room above
        const above = anchor.y - GAP - ph;
        top = above > 0 ? above : anchor.y + anchor.h + GAP;
        left = anchor.x + anchor.w / 2 - pw / 2;
        break;
      }
    }
    top = Math.max(8, Math.min(top, SH - ph - 8));
    left = Math.max(8, Math.min(left, SW - pw - 8));
  }

  return (
    <View style={styles.root}>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        onPress={() => (open ? setOpen(false) : openBubble())}
      >
        {triggerNode}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        {anchor != null && (
          <View
            style={[styles.bubble, { top, left }]}
            pointerEvents="none"
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              if (width !== pw || height !== ph) setSize({ pw: width, ph: height });
            }}
          >
            {typeof content === 'string' ? (
              <Text style={styles.text}>{content}</Text>
            ) : (
              content
            )}
          </View>
        )}
      </Modal>
    </View>
  );
}

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
  backdrop: { ...StyleSheet.absoluteFillObject },
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
