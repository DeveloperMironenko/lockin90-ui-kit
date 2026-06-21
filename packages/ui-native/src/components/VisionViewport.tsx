import { type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Line, Rect } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';

/** A HUD overlay chip (top-left), e.g. a "LIVE" indicator or a context note. */
export interface VisionHudChip {
  label: string;
  tone?: ChipTone;
  /** render the red "live" dot before the label */
  live?: boolean;
}

/** One selectable scan mode pill in the footer (Food / Barcode / Posture…). */
export interface VisionMode {
  /** stable id passed back to `onModeChange` (defaults to the lowercased label) */
  id?: string;
  label: string;
}

/** The detected-item readout shown on the detection box. */
export interface VisionDetection {
  /** recognized item name, e.g. "Greek yogurt" */
  name: string;
  /** optional extra detail (e.g. a barcode number) appended after the name */
  detail?: string;
  /** confidence 0–100; rendered as "· 89%" after the name/detail */
  confidence?: number;
}

export interface VisionViewportProps {
  /** mode tag, top-right of the frame (e.g. "Food") */
  label?: string;
  /** HUD chips, top-left of the frame */
  hud?: VisionHudChip[];
  /** the detected-item readout on the detection box; `null` hides the box */
  detected?: VisionDetection | null;
  /** scan-mode pills in the footer */
  modes?: VisionMode[];
  /** id of the currently-active mode (defaults to the first mode's id) */
  activeMode?: string;
  /** fired with the chosen mode (and its resolved id) when a pill is pressed */
  onModeChange?: (mode: VisionMode, id: string) => void;
  /** capture/scan control label (set to `null` to hide the control) */
  captureLabel?: ReactNode;
  /** fired when the capture/scan control is pressed */
  onCapture?: () => void;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_HUD: VisionHudChip[] = [
  { label: 'LIVE', live: true },
  { label: 'AI vision' },
  { label: 'good light' },
];

const DEFAULT_MODES: VisionMode[] = [
  { label: 'Food' },
  { label: 'Barcode' },
  { label: 'Posture' },
];

const DEFAULT_DETECTION: VisionDetection = { name: 'Greek yogurt', confidence: 89 };

function modeId(m: VisionMode): string {
  return m.id ?? m.label.toLowerCase();
}

/** Compose the detection readout: "Greek yogurt · 0123456 · 89%". */
function detectionText(d: VisionDetection): string {
  const parts = [d.name];
  if (d.detail) parts.push(d.detail);
  if (d.confidence != null) parts.push(`${Math.round(d.confidence)}%`);
  return parts.join(' · ');
}

const FRAME_H = 240; // 4:3 surface; width fills the card
const CYAN = 'rgba(34,211,238,0.8)';
const WHITE = 'rgba(255,255,255,0.45)';

/**
 * Vision / AR viewport (native) — a camera scan surface: a framed canvas with
 * SVG corner brackets, a reticle, a scan-line and HUD chips, a mode tag, a
 * dashed detection box reading out the recognized item (food / barcode) +
 * confidence, a row of mode pills and a capture/scan control. Mirrors the web
 * `VisionViewport` prop API. Scan animation is static in v1.
 */
export function VisionViewport({
  label = 'Food',
  hud = DEFAULT_HUD,
  detected = DEFAULT_DETECTION,
  modes = DEFAULT_MODES,
  activeMode,
  onModeChange,
  captureLabel = 'Capture',
  onCapture,
  style,
}: VisionViewportProps) {
  const active = activeMode ?? (modes.length ? modeId(modes[0]) : undefined);

  return (
    <View style={[styles.card, style]} accessibilityLabel="Camera scan viewport">
      <View style={styles.frame}>
        {/* corner brackets + scan line drawn as one overlay SVG */}
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 320 240">
          {/* top-left */}
          <Path d="M20 50 L20 26 Q20 20 26 20 L50 20" stroke={WHITE} strokeWidth={2.5} fill="none" />
          {/* top-right */}
          <Path d="M270 20 L294 20 Q300 20 300 26 L300 50" stroke={WHITE} strokeWidth={2.5} fill="none" />
          {/* bottom-left */}
          <Path d="M20 190 L20 214 Q20 220 26 220 L50 220" stroke={WHITE} strokeWidth={2.5} fill="none" />
          {/* bottom-right */}
          <Path d="M270 220 L294 220 Q300 220 300 214 L300 190" stroke={WHITE} strokeWidth={2.5} fill="none" />
          {/* scan line (static) */}
          <Line x1="0" y1="108" x2="320" y2="108" stroke={colors.accent2} strokeWidth={2} />
          {/* detection box */}
          {detected ? (
            <Rect
              x="96"
              y="91"
              width="128"
              height="79"
              rx="10"
              stroke="rgba(168,255,53,0.7)"
              strokeWidth={1.5}
              strokeDasharray="6 5"
              fill="none"
            />
          ) : null}
        </Svg>

        {/* reticle */}
        <View style={styles.reticle} pointerEvents="none" />

        {/* HUD chips, top-left */}
        {hud.length > 0 ? (
          <View style={styles.hud} pointerEvents="none">
            {hud.map((c) => (
              <View key={c.label} style={styles.hudChip}>
                {c.live ? <View style={styles.live} /> : null}
                <Chip tone={c.tone} label={c.label} style={styles.chipReset} />
              </View>
            ))}
          </View>
        ) : null}

        {/* mode tag, top-right */}
        {label != null ? (
          <View style={styles.tag} pointerEvents="none">
            <Text style={styles.tagText}>{label.toUpperCase()}</Text>
          </View>
        ) : null}

        {/* detection readout */}
        {detected ? (
          <View style={styles.detectLabel} pointerEvents="none">
            <Text style={styles.detectText}>{detectionText(detected)}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.foot}>
        <View style={styles.modes}>
          {modes.map((m) => {
            const id = modeId(m);
            const on = id === active;
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => onModeChange?.(m, id)}
                style={({ pressed }) => [styles.pill, on && styles.pillOn, pressed && styles.pillPressed]}
              >
                <Text style={[styles.pillText, on && styles.pillTextOn]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {captureLabel != null ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onCapture?.()}
            style={({ pressed }) => [styles.capture, pressed && styles.capturePressed]}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24">
              <Path
                d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z"
                stroke="#0A0A12"
                strokeWidth={1.8}
                fill="none"
              />
              <Path d="M12 13m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" stroke="#0A0A12" strokeWidth={1.8} fill="none" />
            </Svg>
            <Text style={styles.captureText}>{captureLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  frame: {
    width: '100%',
    height: FRAME_H,
    backgroundColor: '#080A12',
    position: 'relative',
  },
  reticle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 120,
    height: 120,
    marginTop: -60,
    marginLeft: -60,
    borderWidth: 1.5,
    borderColor: 'rgba(34,211,238,0.55)',
    borderRadius: 18,
  },
  hud: {
    position: 'absolute',
    left: 14,
    top: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  hudChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(6,8,14,0.6)',
  },
  chipReset: { backgroundColor: 'transparent', borderColor: 'transparent' },
  live: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#ff5470' },
  tag: {
    position: 'absolute',
    right: 14,
    top: 14,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.35)',
    backgroundColor: 'rgba(6,8,14,0.6)',
  },
  tagText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.4, color: colors.accent2 },
  detectLabel: {
    position: 'absolute',
    left: 104,
    top: 81,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 5,
    backgroundColor: colors.lime,
  },
  detectText: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.7, color: '#0a0d16' },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modes: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  pillOn: { borderColor: 'rgba(124,92,255,0.5)', backgroundColor: 'rgba(124,92,255,0.12)' },
  pillPressed: { opacity: 0.8 },
  pillText: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '600', color: colors.textDim },
  pillTextOn: { color: '#fff' },
  capture: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  capturePressed: { opacity: 0.85 },
  captureText: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '600', color: '#0A0A12' },
});
