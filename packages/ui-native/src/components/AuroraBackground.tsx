import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Defs, G, Line, Mask, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '@lockin90/tokens';
import { absoluteFill } from '../internal/absoluteFill';
import { useReducedMotion } from '../internal/useReducedMotion';

export interface AuroraBackgroundProps {
  /** Intensity of the drifting blobs + grid veil. Default `'default'`. */
  variant?: 'default' | 'subtle' | 'vivid';
  /** Overlay the faint grid veil. Default `true`. */
  grid?: boolean;
  /** Disable the slow blob drift (matches web `prefers-reduced-motion`); blobs go static. */
  still?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Aurora Flux backdrop (native twin of the web `.lk-aurora`) — three drifting
 * energy-spectrum gradient blobs (violet → cyan → magenta) over a static radial
 * wash, with an optional faint grid veil. An absolute-fill, `pointerEvents:'none'`
 * layer that sits behind app content; drop it in as the first child of a screen
 * whose content establishes its own stacking context.
 *
 * The blobs are SVG radial gradients (soft edge → transparent, no native blur
 * filter needed) each wrapped in an `Animated.View` whose translate is animated
 * with the native driver, so the drift is smooth + cheap. `still` (or an intensity
 * of `subtle`) keeps it calm.
 */
export function AuroraBackground({
  variant = 'default',
  grid = true,
  still = false,
  style,
}: AuroraBackgroundProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  // the OS Reduce Motion setting holds it still, as `still` does
  const calm = useReducedMotion() || still;
  const intensity = variant === 'subtle' ? 0.55 : variant === 'vivid' ? 1 : 0.78;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width && height && (width !== size?.w || height !== size?.h)) {
      setSize({ w: Math.ceil(width), h: Math.ceil(height) });
    }
  };

  return (
    <View
      style={[styles.root, style]}
      onLayout={onLayout}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {size ? (
        <>
          {/* static radial wash — a faint indigo bloom from the upper area */}
          <Svg width={size.w} height={size.h} style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="lk-aurora-wash" cx="32%" cy="8%" r="90%">
                <Stop offset="0" stopColor="#7C5CFF" stopOpacity={0.16 * intensity} />
                <Stop offset="0.5" stopColor="#22D3EE" stopOpacity={0.05 * intensity} />
                <Stop offset="1" stopColor={colors.void} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect x={0} y={0} width={size.w} height={size.h} fill="url(#lk-aurora-wash)" />
          </Svg>

          {BLOBS.map((b, i) => (
            <Blob key={i} blob={b} size={size} intensity={intensity} still={calm} index={i} />
          ))}

          {grid ? <GridVeil size={size} opacity={GRID_OPACITY[variant]} /> : null}
        </>
      ) : null}
    </View>
  );
}

interface BlobDef {
  color: string;
  /** radius as a fraction of the container's larger side */
  r: number;
  /** center position as a fraction of width/height */
  cx: number;
  cy: number;
  /** peak drift in px (±) on each axis */
  drift: { x: number; y: number };
  /** loop duration in ms — staggered so the blobs never sync up */
  dur: number;
}

const BLOBS: BlobDef[] = [
  { color: '#7C5CFF', r: 0.62, cx: 0.2, cy: 0.16, drift: { x: 26, y: 34 }, dur: 17000 },
  { color: '#22D3EE', r: 0.54, cx: 0.84, cy: 0.3, drift: { x: -30, y: 26 }, dur: 21000 },
  { color: '#FF3D81', r: 0.66, cx: 0.62, cy: 0.9, drift: { x: 22, y: -30 }, dur: 25000 },
];

function Blob({
  blob,
  size,
  intensity,
  still,
  index,
}: {
  blob: BlobDef;
  size: { w: number; h: number };
  intensity: number;
  still: boolean;
  index: number;
}) {
  const anim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (still) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: blob.dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: blob.dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, blob.dur, still]);

  const d = Math.round(blob.r * Math.max(size.w, size.h));
  const left = Math.round(blob.cx * size.w - d / 2);
  const top = Math.round(blob.cy * size.h - d / 2);
  const id = `lk-aurora-blob-${index}`;

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-blob.drift.x, blob.drift.x] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-blob.drift.y, blob.drift.y] });

  return (
    <Animated.View
      style={{ position: 'absolute', left, top, width: d, height: d, transform: [{ translateX }, { translateY }] }}
    >
      <Svg width={d} height={d}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            {/* peaks calibrated to the web's blurred blobs (opacity × blur(70px)) at
                the same variant, measured side by side with the web app at 402×874 */}
            <Stop offset="0" stopColor={blob.color} stopOpacity={0.18 * intensity} />
            <Stop offset="0.5" stopColor={blob.color} stopOpacity={0.06 * intensity} />
            <Stop offset="1" stopColor={blob.color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={d / 2} cy={d / 2} r={d / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** grid-veil opacity per variant — the web's `--lk-aurora-g` */
const GRID_OPACITY = { default: 0.5, subtle: 0.32, vivid: 0.62 } as const;
/** the web's cell size and line colour */
const GRID_STEP = 56;
const GRID_STROKE = 'rgba(255,255,255,0.025)';

/**
 * The web grid veil (`.lk-aurora-grid`): 56px cells, fading out by the web's
 * mask `radial-gradient(ellipse at 50% 0%, #000 30%, transparent 75%)`. That
 * ellipse is farthest-corner from the top centre: rx = w/√2, ry = h·√2.
 */
function GridVeil({ size, opacity }: { size: { w: number; h: number }; opacity: number }) {
  const cols = Math.ceil(size.w / GRID_STEP);
  const rows = Math.ceil(size.h / GRID_STEP);
  return (
    <Svg width={size.w} height={size.h} style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient
          id="lk-aurora-grid-fade"
          gradientUnits="userSpaceOnUse"
          cx={size.w / 2}
          cy={0}
          rx={size.w / Math.SQRT2}
          ry={size.h * Math.SQRT2}
        >
          <Stop offset="0.3" stopColor="#ffffff" stopOpacity={1} />
          <Stop offset="0.75" stopColor="#ffffff" stopOpacity={0} />
        </RadialGradient>
        <Mask id="lk-aurora-grid-mask">
          <Rect x={0} y={0} width={size.w} height={size.h} fill="url(#lk-aurora-grid-fade)" />
        </Mask>
      </Defs>
      <G mask="url(#lk-aurora-grid-mask)" opacity={opacity}>
        {Array.from({ length: cols + 1 }, (_, i) => (
          <Line key={`v${i}`} x1={i * GRID_STEP} y1={0} x2={i * GRID_STEP} y2={size.h} stroke={GRID_STROKE} strokeWidth={1} />
        ))}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * GRID_STEP} x2={size.w} y2={i * GRID_STEP} stroke={GRID_STROKE} strokeWidth={1} />
        ))}
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    ...absoluteFill,
    overflow: 'hidden',
    backgroundColor: colors.void,
  },
});
