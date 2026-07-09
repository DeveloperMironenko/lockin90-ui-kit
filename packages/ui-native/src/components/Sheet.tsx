import { useEffect, useRef, type ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface SheetProps {
  /** Show the sheet. When false, nothing renders. */
  open?: boolean;
  /** Called on scrim tap or Android back. */
  onClose?: () => void;
  /** Edge the panel slides in from. Bottom = full-width bottom sheet with a
   *  drag handle; right/left = full-height side drawer. */
  side?: 'bottom' | 'right' | 'left';
  /** Optional header title (font-display). */
  title?: string;
  /** Body content. */
  children?: ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Fraction of the sheet height the user must drag past to dismiss. */
const DISMISS_FRACTION = 0.25;
/** Downward fling velocity (px/ms) that dismisses regardless of distance. */
const DISMISS_VELOCITY = 0.5;

/** Side drawer + bottom sheet over a dimmed scrim. The bottom variant is
 *  anchored to the bottom edge with rounded top corners and a centered drag
 *  handle; right/left variants are full-height ~360px edge panels. Closes on
 *  scrim tap + Android back; the panel stops propagation. The bottom variant's
 *  header strip (handle + title) is draggable: pull down past ~25% of the
 *  sheet height (or fling) to dismiss, otherwise it springs back. */
export function Sheet({ open = true, onClose, side = 'bottom', title, children }: SheetProps) {
  const isBottom = side === 'bottom';
  const align = isBottom ? styles.scrimBottom : side === 'right' ? styles.scrimRight : styles.scrimLeft;
  const panel = isBottom ? styles.panelBottom : side === 'right' ? styles.panelRight : styles.panelLeft;

  // ---- drag-to-dismiss (bottom sheet only) ----
  const dragY = useRef(new Animated.Value(0)).current;
  const sheetHeightRef = useRef(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) dragY.setValue(0);
  }, [open, dragY]);

  const springBack = useRef(() => {
    Animated.spring(dragY, { toValue: 0, bounciness: 4, useNativeDriver: true }).start();
  }).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 2,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_e, g) => {
        dragY.setValue(Math.max(0, g.dy));
      },
      onPanResponderRelease: (_e, g) => {
        const height = sheetHeightRef.current || 320;
        const shouldDismiss =
          onCloseRef.current && (g.dy > height * DISMISS_FRACTION || (g.dy > 0 && g.vy > DISMISS_VELOCITY));
        if (shouldDismiss) {
          Animated.timing(dragY, { toValue: height, duration: 180, useNativeDriver: true }).start(
            () => onCloseRef.current?.(),
          );
        } else {
          springBack();
        }
      },
      onPanResponderTerminate: () => springBack(),
    }),
  ).current;

  return (
    <RNModal transparent visible={open} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[styles.scrim, align]} onPress={() => onClose?.()}>
        <AnimatedPressable
          style={[styles.panel, panel, isBottom && { transform: [{ translateY: dragY }] }]}
          onPress={() => {}}
          accessibilityViewIsModal
          onLayout={
            isBottom
              ? (e) => {
                  sheetHeightRef.current = e.nativeEvent.layout.height;
                }
              : undefined
          }
        >
          {isBottom ? (
            <View
              hitSlop={{ top: 8, bottom: 10, left: 16, right: 16 }}
              {...panResponder.panHandlers}
            >
              <View style={styles.handle} pointerEvents="none" />
              {title ? <Text style={styles.title}>{title}</Text> : null}
            </View>
          ) : title ? (
            <Text style={styles.title}>{title}</Text>
          ) : null}
          <View style={styles.body}>
            {typeof children === 'string' ? <Text style={styles.bodyText}>{children}</Text> : children}
          </View>
        </AnimatedPressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  scrimBottom: { justifyContent: 'flex-end' },
  scrimRight: { flexDirection: 'row', justifyContent: 'flex-end' },
  scrimLeft: { flexDirection: 'row', justifyContent: 'flex-start' },

  panel: {
    backgroundColor: colors.bg1,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: -18 },
    elevation: 20,
  },
  panelBottom: {
    width: '100%',
    maxHeight: '86%',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomWidth: 0,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  panelRight: {
    height: '100%',
    width: 360,
    maxWidth: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  panelLeft: {
    height: '100%',
    width: 360,
    maxWidth: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopRightRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
  },

  handle: {
    width: 40,
    height: 4,
    marginTop: 2,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: colors.border2,
  },
  title: {
    paddingTop: 2,
    paddingHorizontal: 2,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.16,
    color: colors.text,
  },
  body: {
    flexShrink: 1,
    paddingTop: 12,
    paddingHorizontal: 2,
    paddingBottom: 2,
  },
  bodyText: {
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textDim,
  },
});
