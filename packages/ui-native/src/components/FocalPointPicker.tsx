import { useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  type LayoutChangeEvent,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radii } from '@lockin90/tokens';

/** A normalized focal point — `x`/`y` each in the `0..1` range (top-left origin). */
export interface FocalPoint {
  x: number;
  y: number;
}

export interface FocalPointPickerProps {
  /** Image URL shown beneath the focal marker. */
  src: string;
  /** Current focal point — `x`/`y` each clamped to `0..1` (top-left origin). */
  value: FocalPoint;
  /** Fired with the next focal point on tap / drag. */
  onChange: (point: FocalPoint) => void;
  /** Frame aspect ratio (width / height). @default 1.6 */
  aspect?: number;
  /** Render the rule-of-thirds overlay (2 vertical + 2 horizontal lines). @default true */
  showGrid?: boolean;
  /** Accessibility label for the image. */
  alt?: string;
  style?: StyleProp<ViewStyle>;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * FocalPointPicker — pick the "keep in frame" point of an image. Mirrors the web
 * `@lockin90/ui` FocalPointPicker export + prop API. Tap or drag anywhere on the
 * framed image to move the focal marker; the position is reported as normalized
 * `{ x, y }` coordinates (each `0..1`, top-left origin). A rule-of-thirds overlay
 * aids composition. A `PanResponder` drives the same tap-and-drag interaction as
 * the web pointer twin (press to set, drag to refine).
 */
export function FocalPointPicker({
  src,
  value,
  onChange,
  aspect = 1.6,
  showGrid = true,
  alt,
  style,
}: FocalPointPickerProps) {
  const sizeRef = useRef({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  // latest onChange, read by the (stable) PanResponder so it never goes stale
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const x = clamp01(value?.x ?? 0.5);
  const y = clamp01(value?.y ?? 0.5);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    sizeRef.current = { width, height };
  };

  // emit a normalized focal point from a touch's position within the frame. Reads
  // `sizeRef`/`onChangeRef` (stable refs) so the once-created responder stays fresh.
  const emit = (e: GestureResponderEvent) => {
    const { width, height } = sizeRef.current;
    if (width === 0 || height === 0) return;
    const { locationX, locationY } = e.nativeEvent;
    onChangeRef.current({
      x: clamp01(locationX / width),
      y: clamp01(locationY / height),
    });
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        setDragging(true);
        emit(e);
      },
      onPanResponderMove: (e) => emit(e),
      onPanResponderRelease: () => setDragging(false),
      onPanResponderTerminate: () => setDragging(false),
      onPanResponderTerminationRequest: () => true,
    }),
  ).current;

  return (
    <View
      onLayout={onLayout}
      accessibilityRole="adjustable"
      accessibilityLabel={alt}
      style={[styles.frame, { aspectRatio: aspect }, style]}
      {...responder.panHandlers}
    >
      <Image
        source={{ uri: src }}
        style={styles.img}
        resizeMode="cover"
        accessibilityLabel={alt}
      />

      {showGrid ? (
        <View style={styles.grid} pointerEvents="none">
          <View style={[styles.vLine, { left: '33.333%' }]} />
          <View style={[styles.vLine, { left: '66.666%' }]} />
          <View style={[styles.hLine, { top: '33.333%' }]} />
          <View style={[styles.hLine, { top: '66.666%' }]} />
        </View>
      ) : null}

      <View
        pointerEvents="none"
        style={[
          styles.marker,
          { left: `${x * 100}%`, top: `${y * 100}%` },
        ]}
      >
        <View style={[styles.ring, dragging && styles.ringActive]} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg1,
  },
  img: { width: '100%', height: '100%' },
  grid: { ...StyleSheet.absoluteFillObject },
  vLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    marginLeft: -0.5,
    backgroundColor: colors.border2,
  },
  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    marginTop: -0.5,
    backgroundColor: colors.border2,
  },
  marker: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 30,
    height: 30,
    marginLeft: -15,
    marginTop: -15,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: 'rgba(124,92,255,0.12)',
  },
  // a touch of feedback while dragging (the web twin shows a grabbing cursor)
  ringActive: {
    backgroundColor: 'rgba(124,92,255,0.22)',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    marginLeft: -3,
    marginTop: -3,
    borderRadius: radii.pill,
    backgroundColor: '#fff',
  },
});
