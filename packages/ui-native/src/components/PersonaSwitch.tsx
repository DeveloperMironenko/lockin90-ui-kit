import { type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** Which app persona is active. */
export type Persona = 'personal' | 'coach';

/** One persona segment in the toggle. */
export interface PersonaOption {
  /** the persona key this segment selects */
  key: Persona;
  /** segment label, e.g. "Personal" */
  label: string;
}

export interface PersonaSwitchProps {
  /** the active persona — drives which half the sliding gradient pill sits under */
  active?: Persona;
  /** the two segments (icon is derived from `key`); defaults to Personal/Coach */
  options?: [PersonaOption, PersonaOption];
  /** current-context line — bold lead (e.g. "Coaching 8 athletes") */
  contextLine?: ReactNode;
  /** trailing dimmed part of the context line, separated by " · " */
  contextTrailer?: ReactNode;
  /** copy before the keycap in the switch-back hint */
  hintLabel?: string;
  /** the keycap text in the switch-back hint (the persona you'd switch back to) */
  hintKey?: string;
  /** fired with the persona key when a segment is pressed */
  onSelect?: (persona: Persona) => void;
  style?: StyleProp<ViewStyle>;
}

/** person glyph (Personal) / two-figure glyph (Coach). */
function PersonaIcon({ persona, color }: { persona: Persona; color: string }) {
  if (persona === 'coach') {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Circle cx={9} cy={8} r={3.2} stroke={color} strokeWidth={1.8} />
        <Path
          d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.2 3.2 0 0 1 0 6.2M17 20a6.5 6.5 0 0 0-3-5.5"
          stroke={color}
          strokeWidth={1.8}
          fill="none"
        />
      </Svg>
    );
  }
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.8} />
      <Path d="M4 21a8 8 0 0 1 16 0" stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

const DEFAULT_OPTIONS: [PersonaOption, PersonaOption] = [
  { key: 'personal', label: 'Personal' },
  { key: 'coach', label: 'Coach' },
];

/** Persona / mode switch — a segmented app-chrome toggle that swaps the app
 *  between Personal and Coach modes. A sliding gradient pill marks the active
 *  persona, with a current-context line and a switch-back hint. Same prop API
 *  as the web component. */
export function PersonaSwitch({
  active = 'coach',
  options = DEFAULT_OPTIONS,
  contextLine = 'Coaching 8 athletes',
  contextTrailer = 'viewing as coach',
  hintLabel = 'Switch back to',
  hintKey = 'Personal',
  onSelect,
  style,
}: PersonaSwitchProps) {
  const activeIndex = options.findIndex((o) => o.key === active);

  return (
    <View style={[styles.persona, style]}>
      {/* segmented track + sliding gradient pill */}
      <View style={styles.track} accessibilityRole="radiogroup" accessibilityLabel="App mode">
        <View style={[styles.pillWrap, activeIndex === 1 && styles.pillWrapRight]} pointerEvents="none">
          <LinearGradient
            colors={gradients.violet.stops}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pill}
          />
        </View>
        {options.map((opt) => {
          const isActive = opt.key === active;
          const tint = isActive ? '#07080D' : colors.textDim;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onSelect?.(opt.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={opt.label}
              style={styles.seg}
            >
              <PersonaIcon persona={opt.key} color={tint} />
              <Text style={[styles.segText, { color: tint }]} numberOfLines={1}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* current-context line */}
      <View style={styles.ctx}>
        <View style={styles.cdot} />
        <Text style={styles.ctxText}>
          <Text style={styles.ctxLead}>{contextLine}</Text>
          {contextTrailer ? (
            <>
              <Text style={styles.ctxSep}> · </Text>
              {contextTrailer}
            </>
          ) : null}
        </Text>
      </View>

      {/* switch-back hint */}
      <View style={styles.hint}>
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <Path d="M9 14 4 9l5-5" stroke={colors.textFaint} strokeWidth={1.9} fill="none" />
          <Path d="M4 9h11a5 5 0 0 1 5 5v1" stroke={colors.textFaint} strokeWidth={1.9} fill="none" />
        </Svg>
        <Text style={styles.hintText}>{hintLabel} </Text>
        <View style={styles.kbd}>
          <Text style={styles.kbdText}>{hintKey}</Text>
        </View>
        <Text style={styles.hintText}> anytime</Text>
      </View>
    </View>
  );
}

export type { Persona as PersonaSwitchPersona, PersonaOption as PersonaSwitchOption };

const styles = StyleSheet.create({
  persona: { alignSelf: 'flex-start', maxWidth: 380, gap: 13 },

  // segmented track
  track: {
    position: 'relative',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 4,
    gap: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  // pill occupies the active half (left by default, right when coach active)
  pillWrap: { position: 'absolute', top: 4, bottom: 4, left: 4, right: '50%' },
  pillWrapRight: { left: '50%', right: 4 },
  pill: {
    flex: 1,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  // segments
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
  },
  segText: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '600', letterSpacing: -0.13 },

  // current-context line
  ctx: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  cdot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  ctxText: { flex: 1, fontFamily: fonts.ui, fontSize: 12.5, lineHeight: 18, color: colors.textDim },
  ctxLead: { color: colors.text, fontWeight: '600' },
  ctxSep: { color: colors.textFaint },

  // switch-back hint
  hint: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6 },
  hintText: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 0.2, color: colors.textFaint },
  kbd: {
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  kbdText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim },
});
