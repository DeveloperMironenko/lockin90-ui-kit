import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { Icon } from './Icon';

export interface MessageComposerProps {
  /** called with the trimmed, non-empty text; the field clears afterwards */
  onSend: (text: string) => void;
  /** placeholder shown in the empty field */
  placeholder?: string;
  /** show a leading lock glyph marking the thread end-to-end encrypted */
  e2ee?: boolean;
  /** disable the whole bar (input + buttons) */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * MessageComposer — the DM/chat input bar: a glassy pill containing an
 * optional E2EE lock, an attach button, a growing multiline text field, an
 * emoji button and an accent-filled send button. Mirrors `.composer` from the
 * coach/chat design. Pressing send fires `onSend` then clears.
 */
export function MessageComposer({
  onSend,
  placeholder = 'Message…',
  e2ee = false,
  disabled = false,
  style,
}: MessageComposerProps) {
  const [value, setValue] = useState('');
  const canSend = !disabled && value.trim().length > 0;

  function send() {
    const text = value.trim();
    if (disabled || text.length === 0) return;
    onSend(text);
    setValue('');
  }

  return (
    <View style={[styles.bar, disabled && styles.barDisabled, style]}>
      {e2ee ? (
        <View style={styles.lock} accessibilityLabel="End-to-end encrypted">
          <Icon name="lock" size={16} color={colors.zoneHigh} />
        </View>
      ) : null}

      <Pressable
        style={({ pressed }) => [styles.btn, pressed && !disabled && styles.btnPressed]}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Attach"
      >
        <Icon name="plus" size={18} color={colors.textDim} />
      </Pressable>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          editable={!disabled}
          multiline
          accessibilityLabel="Message text"
        />
        {value.length === 0 ? (
          <View style={styles.placeholderWrap} pointerEvents="none">
            <Text style={styles.placeholderText} numberOfLines={1}>
              {placeholder}
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable
        style={({ pressed }) => [styles.btn, pressed && !disabled && styles.btnPressed]}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Emoji"
      >
        <Icon name="sparkle" size={18} color={colors.textDim} />
      </Pressable>

      <Pressable
        onPress={send}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        {({ pressed }) => (
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.send, !canSend && styles.sendDisabled, pressed && canSend && styles.sendPressed]}
          >
            <Icon name="share" size={18} color="#0A0A12" />
          </LinearGradient>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  barDisabled: { opacity: 0.8 },
  lock: {
    flexShrink: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
  },
  btn: {
    flexShrink: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  btnPressed: { opacity: 0.7, borderColor: colors.border2 },
  inputWrap: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    minWidth: 0,
    // match the send button's height at rest; grow only on multiline
    minHeight: 42,
    maxHeight: 120,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    // center single-line text so the field isn't taller than the buttons
    textAlignVertical: 'center',
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: 13.5,
    lineHeight: 18,
  },
  // single-line, truncating placeholder overlay — the multiline TextInput's own
  // placeholder wraps a long string (e.g. "Encrypted message…") onto 2 lines, making
  // the pill taller than the buttons. Overlaying our own numberOfLines={1} text keeps
  // the resting field exactly one line high; it's hidden the moment the user types.
  placeholderWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textFaint,
    fontFamily: fonts.ui,
    fontSize: 13.5,
  },
  send: {
    flexShrink: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    ...nativeShadows.glowAccent,
  },
  sendDisabled: { opacity: 0.4 },
  sendPressed: { transform: [{ translateY: -2 }] },
});
