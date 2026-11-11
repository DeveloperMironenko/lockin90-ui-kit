import { type ReactNode } from 'react';
import { Modal as RNModal, View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { absoluteFill } from '../internal/absoluteFill';

export interface ModalProps {
  /** Show the modal. When false, nothing renders. */
  open?: boolean;
  /** Called on scrim tap, close-button tap, or Android back. */
  onClose?: () => void;
  /** Header title (font-display). Header is omitted when absent. */
  title?: string;
  /** Body content. */
  children?: ReactNode;
  /** Optional footer — right-aligned actions under a hairline. */
  footer?: ReactNode;
  /** Card max-width: sm ~380px, md ~460px, lg ~620px. */
  size?: 'sm' | 'md' | 'lg';
  /** accessibility label of the close button (pass a localized string). @default 'Close' */
  closeLabel?: string;
}

const MAX_WIDTH = { sm: 380, md: 460, lg: 620 } as const;

/** Centered glass dialog over a dimmed scrim. Closes on scrim tap + Android
 *  back; the card stops propagation. */
export function Modal({ open = true, onClose, title, children, footer, size = 'md', closeLabel = 'Close' }: ModalProps) {
  return (
    <RNModal transparent visible={open} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {/* The scrim is a container for screen readers and the card a plain view that claims the touch:
          as accessible elements they would group the title, body and buttons into one item VoiceOver
          can't enter. VoiceOver's escape gesture closes it. */}
      <Pressable style={styles.scrim} onPress={() => onClose?.()} accessible={false}>
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
          <View style={styles.body}>
            {typeof children === 'string' ? <Text style={styles.bodyText}>{children}</Text> : children}
          </View>
          {footer && <View style={styles.foot}>{footer}</View>}
        </View>
      </Pressable>
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
  card: {
    width: '100%',
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
