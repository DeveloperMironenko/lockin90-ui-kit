import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { Card } from './Card';
import { Icon } from './Icon';
import { Badge } from './Badge';

/**
 * A single feature row. A plain `string` (or `{ included: true }`) renders a
 * mint check ✓; `{ included: false }` renders a muted cross ✗ (feature not in
 * this tier). Lets one component express both included and excluded features.
 */
export type PricingFeature = string | { label: string; included?: boolean };

export interface PricingTierCardProps {
  /** tier name, e.g. 'Free' | 'Pro' | 'Elite' */
  name: string;
  /** preformatted price, e.g. '$9' or 'Free' */
  price: string;
  /** billing period, e.g. '/mo' */
  period?: string;
  description?: string;
  /**
   * Feature list. A plain string → mint check ✓; an object with
   * `included: false` → a muted cross ✗ (excluded from this tier).
   */
  features: PricingFeature[];
  /** accent/cta-gradient border + glow + a ribbon */
  featured?: boolean;
  /** ribbon copy (only when `featured`) @default 'Most popular' */
  ribbonLabel?: string;
  /** small tier badge label */
  badge?: string;
  /** CTA slot — consumer passes a `<Button>` (renders at the bottom) */
  cta?: ReactNode;
  /** dim + disable the whole card (unavailable / current plan / coming soon) */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * PricingTierCard — a glass plan card: tier name + optional badge, a big price
 * (display font) + period, a description, a feature list each with a leading
 * mint check Icon, and a CTA slot pinned to the bottom. When `featured`, it
 * gains a cta-gradient border + accent glow and a ribbon (`ribbonLabel`).
 * Composed from Card + Icon + Badge; mirrors the web `@lockin90/ui`
 * PricingTierCard and the `.tier` cards in the billing mockup.
 */
export function PricingTierCard({
  name,
  price,
  period,
  description,
  features,
  featured,
  ribbonLabel = 'Most popular',
  badge,
  cta,
  disabled = false,
  style,
}: PricingTierCardProps) {
  const dim = disabled ? { opacity: 0.5 } : null;
  const body = (
    <>
      {featured ? <Ribbon label={ribbonLabel} /> : null}

      <View style={styles.head}>
        <Text style={styles.name}>{name}</Text>
        {badge ? <Badge tone="accent">{badge}</Badge> : null}
      </View>

      {description ? <Text style={styles.desc}>{description}</Text> : null}

      <View style={styles.price}>
        <Text style={styles.amt}>{price}</Text>
        {period ? <Text style={styles.per}>{period}</Text> : null}
      </View>

      <View style={styles.feat}>
        {features.map((f, i) => {
          const label = typeof f === 'string' ? f : f.label;
          const included = typeof f === 'string' ? true : f.included !== false;
          return (
            <View key={`${label}-${i}`} style={styles.featRow}>
              <Icon
                name={included ? 'check' : 'close'}
                size={16}
                color={included ? colors.zoneHigh : colors.textFaint}
              />
              <Text style={[styles.featText, !included && styles.featTextOff]}>{label}</Text>
            </View>
          );
        })}
      </View>

      {cta ? <View style={styles.cta}>{cta}</View> : null}
    </>
  );

  // featured: a cta-gradient hairline border (LinearGradient padding) wraps the
  // Card, plus the accent glow — matches the web `.lk-tier-featured` ::before.
  if (featured) {
    return (
      <LinearGradient
        colors={gradients.cta.stops as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.featuredBorder, dim, style]}
        pointerEvents={disabled ? 'none' : undefined}
      >
        <Card flat style={styles.featuredInner}>
          {body}
        </Card>
      </LinearGradient>
    );
  }

  return (
    <Card style={[styles.card, dim, style]} pointerEvents={disabled ? 'none' : undefined}>
      {body}
    </Card>
  );
}

function Ribbon({ label }: { label: string }) {
  return (
    <LinearGradient
      colors={gradients.cta.stops as unknown as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.ribbon}
    >
      <Text style={styles.ribbonText}>{label.toUpperCase()}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { position: 'relative' },
  featuredBorder: {
    borderRadius: radii.md,
    padding: 1.5,
    ...nativeShadows.glowAccent,
  },
  featuredInner: {
    position: 'relative',
    // fill the gradient-border wrapper — in a stretched row (horizontal tier
    // scroller) a content-sized inner card left the wrapper's lower half as a
    // thick gradient band instead of a 1.5px hairline.
    flex: 1,
    backgroundColor: colors.bg1,
    borderWidth: 0,
    borderRadius: radii.md - 1.5,
  },
  ribbon: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    ...nativeShadows.glowAccent,
  },
  ribbonText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.1,
    color: '#0A0A12',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  name: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 19,
    color: colors.text,
  },
  desc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textDim,
    minHeight: 34,
    marginTop: 4,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 8,
    marginBottom: 2,
  },
  amt: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 42,
    letterSpacing: -1.7,
    lineHeight: 44,
    color: colors.text,
  },
  per: {
    fontFamily: fonts.mono,
    fontSize: 12.5,
    color: colors.textFaint,
  },
  feat: {
    marginVertical: 16,
    gap: 11,
    flex: 1,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  featTextOff: {
    color: colors.textDim,
  },
  cta: {
    marginTop: 'auto',
    paddingTop: 4,
  },
});
