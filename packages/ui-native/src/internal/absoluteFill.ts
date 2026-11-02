// The plain style object to spread for an absolute fill. React Native 0.88
// removed StyleSheet.absoluteFillObject (spreading it silently drops the
// positioning), and older versions type StyleSheet.absoluteFill as a
// registered id that can't be spread.
export const absoluteFill = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const;
