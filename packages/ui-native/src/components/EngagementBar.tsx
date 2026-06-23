import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Icon } from './Icon';

/* ============================================================================
   EngagementBar — the post/feed footer row: a horizontal group of icon+count
   "react" actions (like · comment · share · save). Each action is a pressable
   icon-button with a tabular count beside it; only actions whose prop object is
   provided are rendered.

   Native has no `currentColor`, so each glyph is colored explicitly: active
   states colorize the like heart rose/bad (and its count) and fill the saved
   bookmark accent (violet). Mirrors the web `EngagementBar` and the social
   feed design (feed.html / social.html).
   ========================================================================== */

export interface EngagementBarProps {
  like?: { count?: number; active?: boolean; onToggle?: () => void };
  comment?: { count?: number; onPress?: () => void };
  share?: { onPress?: () => void };
  save?: { active?: boolean; onToggle?: () => void };
  style?: StyleProp<ViewStyle>;
}

/** A single icon (+ optional count) react action inside the bar. */
function ReactAction({
  icon,
  count,
  color,
  label,
  active,
  onPress,
  style,
}: {
  icon: 'apple-health' | 'quote' | 'share' | 'save';
  count?: number;
  color: string;
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.react,
        pressed && styles.reactPressed,
        style,
      ]}
    >
      <Icon name={icon} size={16} color={color} />
      {count != null && <Text style={[styles.cnt, { color }]}>{count}</Text>}
    </Pressable>
  );
}

/** Horizontal like / comment / share / save action row for feed posts. */
export function EngagementBar({ like, comment, share, save, style }: EngagementBarProps) {
  return (
    <View style={[styles.bar, style]}>
      {like && (
        <ReactAction
          icon="apple-health"
          label={like.active ? 'Unlike' : 'Like'}
          count={like.count}
          active={like.active}
          color={like.active ? colors.bad : colors.textDim}
          onPress={like.onToggle}
        />
      )}
      {comment && (
        <ReactAction
          icon="quote"
          label="Comments"
          count={comment.count}
          color={colors.textDim}
          onPress={comment.onPress}
        />
      )}
      {share && (
        <ReactAction
          icon="share"
          label="Share"
          color={colors.textDim}
          onPress={share.onPress}
        />
      )}
      {save && (
        <ReactAction
          icon="save"
          label={save.active ? 'Saved' : 'Save'}
          active={save.active}
          color={save.active ? colors.accent : colors.textDim}
          onPress={save.onToggle}
          style={styles.save}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  react: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  reactPressed: {
    backgroundColor: colors.glass,
  },
  cnt: {
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  save: {
    marginLeft: 'auto',
  },
});
