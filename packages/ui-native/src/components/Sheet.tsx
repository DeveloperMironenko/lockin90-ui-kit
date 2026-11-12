import { useEffect, useRef, type ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { absoluteFill } from '../internal/absoluteFill';
import { useBottomInset } from '../internal/optionalSafeArea';
import { TopLayerHost } from './TopLayer';

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
  /** Body content. The body scrolls (the kit's ScrollView, taps on fields kept, a drag puts the
   *  keyboard away): don't wrap it in a ScrollView of your own. */
  children?: ReactNode;
}


/** Fraction of the sheet height the user must drag past to dismiss. */
const DISMISS_FRACTION = 0.25;
/** Downward fling velocity (px/ms) that dismisses regardless of distance. */
const DISMISS_VELOCITY = 0.5;
/** The panel's own bottom padding (bottom sheet and drawers), under the safe-area inset. */
const PAD_BOTTOM = 18;
/** The body's own padding at each edge. */
const BODY_PAD = 2;

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
  // The body scrolls to the panel's bottom edge, the screen's (iOS: behind the home indicator, as
  // HIG sheets), and its content ends 18 + the safe-area inset higher, so the last line scrolls clear
  // of the home indicator. Never a padded panel around the scroll: that drew an opaque band the
  // content was cut at, 18 + 34pt above the bottom (owner, 2026-11-11).
  const bottomInset = useBottomInset();
  const contentEnd = { paddingBottom: BODY_PAD + PAD_BOTTOM + bottomInset };

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
      {/* The scrim is a container for screen readers (accessible={false}): as an accessible element it
          would swallow the title, fields and buttons inside (VoiceOver read the whole sheet as one item
          and could reach none of them). It stays tappable to close. */}
      <Pressable style={styles.scrim} onPress={() => onClose?.()} accessible={false}>
        {/* Keyboard avoidance (same pattern as the kit Select): the avoider
            fills the scrim and pads itself by the iOS keyboard height, so an
            input-bearing sheet rises above the keyboard instead of being
            covered. `box-none` keeps scrim taps dismissing as before. */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={[styles.avoider, align]}
        >
          {/* the panel claims the touch, so a tap on it never reaches the scrim (a plain view: as a
              Pressable it would be an accessible element grouping everything inside) */}
          <Animated.View
            style={[styles.panel, panel, isBottom && { transform: [{ translateY: dragY }] }]}
            onStartShouldSetResponder={() => true}
            accessibilityViewIsModal
            // VoiceOver's escape gesture (two-finger Z) closes it, the scrim not being an element
            onAccessibilityEscape={() => onClose?.()}
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
                {title ? (
                  <Text style={styles.title} accessibilityRole="header">
                    {title}
                  </Text>
                ) : null}
              </View>
            ) : title ? (
              <Text style={styles.title} accessibilityRole="header">
                {title}
              </Text>
            ) : null}
            <ScrollView
              style={styles.body}
              contentContainerStyle={[styles.bodyContent, contentEnd]}
              keyboardShouldPersistTaps="handled"
              // a number pad has no Done key: a drag puts the keyboard away
              keyboardDismissMode="on-drag"
            >
              {typeof children === 'string' ? <Text style={styles.bodyText}>{children}</Text> : children}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
      {/* toasts (TopLayer) over the scrim and the panel, the page being under this window */}
      <TopLayerHost active={open} />
    </RNModal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...absoluteFill,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  // Fills the scrim so the panel's %-heights keep a definite parent; the
  // side-alignment styles now live here (the avoider positions the panel).
  avoider: { flex: 1 },
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
    // the body's content carries the bottom padding (it scrolls to the edge)
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  panelRight: {
    height: '100%',
    width: 360,
    maxWidth: '100%',
    paddingTop: 18,
    paddingHorizontal: 20,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  panelLeft: {
    height: '100%',
    width: 360,
    maxWidth: '100%',
    paddingTop: 18,
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
  // sized by its content up to the panel's cap, then it scrolls
  body: {
    flexGrow: 0,
    flexShrink: 1,
  },
  bodyContent: {
    paddingTop: 12,
    paddingHorizontal: BODY_PAD,
  },
  bodyText: {
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textDim,
  },
});
