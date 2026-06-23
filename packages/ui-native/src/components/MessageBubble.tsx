import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export type MessageBubbleVariant = 'incoming' | 'outgoing';
export type MessageBubbleStatus = 'sent' | 'delivered' | 'read';

export interface MessageBubbleProps {
  /** `incoming` = glass, left-aligned; `outgoing` = accent, right-aligned. */
  variant: MessageBubbleVariant;
  /** Message body — string or wrapped nodes. */
  children: ReactNode;
  /** Small line under the bubble, e.g. "Sofia · 8:02am". */
  meta?: string;
  /** Outgoing only — tiny trailing delivery glyph. */
  status?: MessageBubbleStatus;
  style?: StyleProp<ViewStyle>;
}

const STATUS_COLOR: Record<MessageBubbleStatus, string> = {
  sent: colors.textFaint,
  delivered: colors.textDim,
  read: colors.accent2,
};

/** Plain-text check glyph — unicode ✓ / ✓✓ to match the web's inline checks. */
function StatusGlyph({ status }: { status: MessageBubbleStatus }) {
  return (
    <Text style={[styles.check, { color: STATUS_COLOR[status] }]}>
      {status === 'sent' ? '✓' : '✓✓'}
    </Text>
  );
}

/** Chat message bubble — `incoming` (glass, left) / `outgoing` (accent, right),
 *  with an optional `meta` line and an outgoing-only delivery `status` glyph.
 *  Mirrors the web `@lockin90/ui` `MessageBubble`. */
export function MessageBubble({ variant, children, meta, status, style }: MessageBubbleProps) {
  const outgoing = variant === 'outgoing';
  const showStatus = outgoing && status != null;

  return (
    <View style={[styles.msg, outgoing ? styles.msgOut : styles.msgIn, style]}>
      <View style={[styles.bubble, outgoing ? styles.bubbleOut : styles.bubbleIn]}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text style={[styles.body, outgoing ? styles.bodyOut : styles.bodyIn]}>{children}</Text>
        ) : (
          children
        )}
      </View>
      {(meta != null || showStatus) && (
        <View style={styles.meta}>
          {showStatus && <StatusGlyph status={status!} />}
          {meta != null && <Text style={styles.metaText}>{meta}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  msg: {
    maxWidth: '82%',
    gap: 4,
  },
  msgIn: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  msgOut: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  bubbleIn: {
    backgroundColor: colors.glass2,
    borderColor: colors.border2,
    borderBottomLeftRadius: radii.sm,
  },
  bubbleOut: {
    backgroundColor: 'rgba(124,92,255,0.16)',
    borderColor: 'rgba(124,92,255,0.34)',
    borderBottomRightRadius: radii.sm,
  },
  body: {
    fontFamily: fonts.ui,
    fontSize: 13.5,
    lineHeight: 20,
  },
  bodyIn: {
    color: colors.text,
  },
  bodyOut: {
    color: '#ece8ff',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: fonts.ui,
    fontSize: 10.5,
    lineHeight: 13,
    color: colors.textDim,
  },
  check: {
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '700',
  },
});
