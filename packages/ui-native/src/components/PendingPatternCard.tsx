import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Button } from './Button';
import { Chip } from './Chip';
import { Icon } from './Icon';

export interface PendingPatternConfidence {
  label: string;
  value: string;
}

export interface PendingPatternCardProps {
  /** The detected-pattern prose — what the engine thinks it found. */
  interpretation: ReactNode;
  /** Effect line, e.g. '+8 energy when sleep > 7h'. Signed value is highlighted
   *  (mint for +, red for −). */
  effect?: string;
  /** Optional supporting chips, e.g. `[{ label: 'n', value: '22 events' }]`. */
  confidence?: PendingPatternConfidence[];
  onAccept?: () => void;
  onDismiss?: () => void;
  /** @default 'Accept' */
  acceptLabel?: string;
  /** @default 'Dismiss' */
  dismissLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Split an effect string into its leading signed token and the trailing prose,
 *  so the magnitude (e.g. `+8`, `−18m`) can be emphasized and tone-colored. */
function splitEffect(effect: string): { sign: 'pos' | 'neg' | 'none'; value: string; rest: string } {
  const match = /^\s*([+\-−]\s*[\d.,]+\s*[^\s]*)(.*)$/.exec(effect);
  if (!match) return { sign: 'none', value: '', rest: effect.trim() };
  const value = match[1].trim();
  const rest = match[2].trim();
  const sign = value.startsWith('-') || value.startsWith('−') ? 'neg' : 'pos';
  return { sign, value, rest };
}

/** A detected-but-unconfirmed pattern surfaced for review — glass card with a
 *  "Pending pattern" eyebrow, the interpretation prose, an emphasized effect
 *  line, optional confidence chips, and an Accept / Dismiss action row. */
export function PendingPatternCard({
  interpretation,
  effect,
  confidence,
  onAccept,
  onDismiss,
  acceptLabel = 'Accept',
  dismissLabel = 'Dismiss',
  style,
}: PendingPatternCardProps) {
  const eff = effect ? splitEffect(effect) : null;
  const hasActions = onAccept != null || onDismiss != null;
  const effColor =
    eff?.sign === 'pos' ? colors.zoneHigh : eff?.sign === 'neg' ? colors.zoneLow : colors.text;

  return (
    <Card lit style={[styles.card, style]}>
      <View style={styles.head}>
        <View style={styles.ic}>
          <Icon name="sparkle" size={18} color={colors.accent} />
        </View>
        <Text style={styles.eyebrow}>Pending pattern</Text>
      </View>

      {typeof interpretation === 'string' ? (
        <Text style={styles.prose}>{interpretation}</Text>
      ) : (
        <View style={styles.prose}>{interpretation}</View>
      )}

      {eff && (
        <View style={styles.effect}>
          {!!eff.value && <Text style={[styles.effectVal, { color: effColor }]}>{eff.value}</Text>}
          {!!eff.rest && <Text style={styles.effectLabel}>{eff.rest}</Text>}
        </View>
      )}

      {confidence && confidence.length > 0 && (
        <View style={styles.meta}>
          {confidence.map((c, i) => (
            <Chip key={`${c.label}-${i}`} tone="neutral" label={`${c.label} · ${c.value}`} />
          ))}
        </View>
      )}

      {hasActions && (
        <View style={styles.actions}>
          {onAccept != null && (
            <Button variant="primary" title={acceptLabel} onPress={onAccept} style={styles.action} />
          )}
          {onDismiss != null && (
            <Button variant="ghost" title={dismissLabel} onPress={onDismiss} style={styles.action} />
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ic: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    color: colors.textFaint,
  },
  prose: { marginTop: 14, fontSize: 13.5, lineHeight: 21, color: colors.textDim },
  effect: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg1,
  },
  effectVal: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  effectLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.textFaint,
    flexShrink: 1,
  },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  action: { flex: 1 },
});
