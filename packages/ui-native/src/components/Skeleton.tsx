import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '@lockin90/tokens';

export function Skeleton({ h = 72 }: { h?: number }) {
  return <View style={[styles.bar, { height: h }]} />;
}

export function SkeletonList({ count = 3, h = 72, gap = 8 }: { count?: number; h?: number; gap?: number }) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} h={h} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
});
