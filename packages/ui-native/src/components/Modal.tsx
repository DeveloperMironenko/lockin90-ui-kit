import { type ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { absoluteFill } from '../internal/absoluteFill';
import { TopLayerHost } from './TopLayer';
import { useAndroidKeyboardHeight } from '../internal/keyboard';
import { FooterActions } from '../internal/footer';
import { breakpoints } from '@lockin90/tokens';

export interface ModalProps {
  /** Show the modal. When false, nothing renders. */
  open?: boolean;
  /** Called on scrim tap, close-button tap, or Android back. */
  onClose?: () => void;
  /** Header title (font-display). Header is omitted when absent. */
  title?: string;
  /** Body content. */
  children?: ReactNode;
  /** Optional footer — the actions under a hairline (CONVENTIONS "Dialog actions"): "Cancel | Primary",
   *  each half the width at phone width (≤ 540), end-aligned on a wider screen. */
  footer?: ReactNode;
  /** Card max-width: sm ~380px, md ~460px, lg ~620px. */
  size?: 'sm' | 'md' | 'lg';
  /** accessibility label of the close button (pass a localized string). @default 'Close' */
  closeLabel?: string;
}

const MAX_WIDTH = { sm: 380, md: 460, lg: 620 } as const;

/** Centered glass dialog over a dimmed scrim. Closes on scrim tap + Android
 *  back; the card stops propagation. The body scrolls when it is taller than the room left, and the card
 *  rises above the keyboard (iOS `KeyboardAvoidingView`, Android the keyboard's height). */
export function Modal({ open = true, onClose, title, children, footer, size = 'md', closeLabel = 'Close' }: ModalProps) {
  const { width } = useWindowDimensions();
  const phone = width <= breakpoints.phone;
  const keyboard = useAndroidKeyboardHeight();
  return (
    <RNModal transparent visible={open} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {/* The scrim is a container for screen readers and the card a plain view that claims the touch:
          as accessible elements they would group the title, body and buttons into one item VoiceOver
          can't enter. VoiceOver's escape gesture closes it. */}
      <Pressable style={styles.scrim} onPress={() => onClose?.()} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={[styles.avoider, keyboard > 0 && { paddingBottom: keyboard }]}
        >
        <View
          style={[styles.card, { maxWidth: MAX_WIDTH[size] }]}
          onStartShouldSetResponder={() => true}
          accessibilityViewIsModal
          onAccessibilityEscape={() => onClose?.()}
        >
          {(title || onClose) && (
            <View style={styles.head}>
              {title ? (
                <Text style={styles.title} accessibilityRole="header">
                  {title}
                </Text>
              ) : (
                <View />
              )}
              {onClose && (
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel={closeLabel}
                  style={styles.close}
                >
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="m6 6 12 12M18 6 6 18" />
                  </Svg>
                </Pressable>
              )}
            </View>
          )}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            bounces={false}
          >
            {typeof children === 'string' ? <Text style={styles.bodyText}>{children}</Text> : children}
          </ScrollView>
          {footer && (
            <View style={[styles.foot, phone && styles.footPhone]}>
              <FooterActions equal={phone}>{footer}</FooterActions>
            </View>
          )}
        </View>
        </KeyboardAvoidingView>
      </Pressable>
      {/* toasts (TopLayer) over the scrim and the card, the page being under this window */}
      <TopLayerHost active={open} />
    </RNModal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...absoluteFill,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  // fills the scrim's padded box, the card centred in it; padded by the keyboard on Android
  avoider: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: colors.bg1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 64,
    shadowOffset: { width: 0, height: 24 },
    elevation: 20,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.17,
    color: colors.text,
  },
  close: {
    // a 44pt target, as the web at phone width (the glyph and the header line unchanged)
    width: 44,
    height: 44,
    marginVertical: -7,
    marginRight: -11,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // sized by its content, scrolling once the card reaches the room left
  scroll: { flexGrow: 0, flexShrink: 1 },
  body: {
    padding: 20,
  },
  bodyText: {
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textDim,
  },
  foot: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // phone width: the actions share the row equally (wider: at the end at their own width, a second line
  // when they don't fit)
  footPhone: { justifyContent: 'flex-start' },
});
