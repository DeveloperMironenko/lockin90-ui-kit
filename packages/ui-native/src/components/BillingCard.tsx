import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Chip } from './Chip';
import { BarFill } from './BarFill';

/** A saved payment card's visual data — brand, masked number tail, holder, expiry. */
export interface BillingPaymentCard {
  /** Network brand, e.g. "VISA". */
  brand: string;
  /** Last four digits — preceding groups render masked. */
  last4: string;
  /** Cardholder name as printed, e.g. "M. KANE". */
  holder: string;
  /** Expiry as printed, e.g. "06 / 27". */
  expiry: string;
}

/** A single plan-quota usage meter row. */
export interface BillingQuota {
  /** Quota label, e.g. "AI insights". */
  label: string;
  /** Used count this period. */
  used: number;
  /** Allowance for this period. */
  limit: number;
  /** Fill fraction 0..1 (defaults to `used / limit`). */
  pct?: number;
  /** Fill tint — `mint` healthy, `warn` nearing the limit. */
  tone?: 'mint' | 'warn';
  /** Period label, e.g. "this month". */
  period?: string;
  /** Free-tier note shown bottom-right, e.g. "Free: 5/mo". */
  freeNote?: string;
  /** Leading glyph; defaults to a per-tone icon. */
  icon?: ReactNode;
}

export interface BillingCardProps extends ViewProps {
  /** Section heading. */
  title?: string;
  /** Plan pill label, e.g. "Pro · $19/mo". */
  plan?: string;
  /** The saved payment card. */
  card?: BillingPaymentCard;
  /** Plan-quota usage meters. */
  quotas?: BillingQuota[];
}

function SparkleIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"
        stroke={colors.accent}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

function ImageIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3h18v18H3zM3 15l5-5 4 4 3-3 6 6" stroke={colors.accent3} strokeWidth={1.6} />
      <Circle cx={8.5} cy={8.5} r={1.5} stroke={colors.accent3} strokeWidth={1.6} />
    </Svg>
  );
}

const DEFAULT_CARD: BillingPaymentCard = {
  brand: 'VISA',
  last4: '4242',
  holder: 'M. KANE',
  expiry: '06 / 27',
};

const DEFAULT_QUOTAS: BillingQuota[] = [
  { label: 'AI insights', used: 142, limit: 300, pct: 0.47, tone: 'mint', period: 'this month', freeNote: 'Free: 5/mo' },
  { label: 'Photo scans', used: 88, limit: 100, pct: 0.88, tone: 'warn', period: 'this month', freeNote: 'Free: locked' },
];

/**
 * Billing & usage — a gradient credit-card visual (chip, brand, masked number,
 * holder + expiry) with a plan pill, plus plan-quota usage meters. Native
 * counterpart of the web BillingCard (same prop API); composes Chip + BarFill.
 */
export function BillingCard({
  title = 'Payment & quotas',
  plan = 'Pro · $19/mo',
  card = DEFAULT_CARD,
  quotas = DEFAULT_QUOTAS,
  style,
  ...rest
}: BillingCardProps) {
  return (
    <View style={[styles.bill, style]} {...rest}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Chip tone="high" dot label={plan} />
      </View>

      <View style={styles.cardWrap}>
        <LinearGradient
          colors={['#15182a', '#0c0f1a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Corner glow */}
        <LinearGradient
          colors={['rgba(124,92,255,0.4)', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.4, y: 0.6 }}
          style={styles.glow}
        />

        <View style={styles.ccTop}>
          <View style={styles.ccChip}>
            <LinearGradient
              colors={['#d8c47a', '#a4863b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <Text style={styles.ccBrand}>{card.brand}</Text>
        </View>

        <Text style={styles.ccNum}>{`••••   ••••   ••••   ${card.last4}`}</Text>

        <View style={styles.ccBottom}>
          <View>
            <Text style={styles.ccLbl}>Card holder</Text>
            <Text style={styles.ccVal}>{card.holder}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.ccLbl}>Expires</Text>
            <Text style={styles.ccVal}>{card.expiry}</Text>
          </View>
        </View>
      </View>

      <View style={styles.quotas}>
        {quotas.map((q, i) => {
          const fraction = q.pct ?? (q.limit > 0 ? q.used / q.limit : 0);
          const v = Math.max(0, Math.min(1, fraction));
          const left = Math.max(0, q.limit - q.used);
          const percentLabel = `${Math.round(v * 100)}%`;
          const icon = q.icon ?? (q.tone === 'warn' ? <ImageIcon /> : <SparkleIcon />);
          return (
            <View style={styles.quota} key={i}>
              <View style={styles.qtop}>
                <View style={styles.qname}>
                  {icon}
                  <Text style={styles.qnameText}>{q.label}</Text>
                </View>
                <Chip tone="mid" label={percentLabel} />
              </View>
              <Text style={styles.qfig}>
                {q.used}
                <Text style={styles.qfigSmall}>
                  {' '}
                  / {q.limit} {q.period}
                </Text>
              </Text>
              <BarFill value={v} height={8} />
              <View style={styles.qsub}>
                <Text style={styles.qsubText}>
                  {q.used} used · {left} left
                </Text>
                {q.freeNote != null && (
                  <Text style={[styles.qsubText, styles.qsubCap]}>{q.freeNote}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bill: { gap: 14 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 14, letterSpacing: -0.28, color: colors.text },

  cardWrap: {
    position: 'relative',
    borderRadius: radii.md,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border2,
    aspectRatio: 1.7,
    maxWidth: 380,
    justifyContent: 'space-between',
  },
  glow: { position: 'absolute', right: -30, top: -40, width: 160, height: 160, borderRadius: 80 },

  ccTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ccChip: { width: 32, height: 24, borderRadius: 5, overflow: 'hidden' },
  ccBrand: { fontFamily: fonts.display, fontWeight: '700', fontStyle: 'italic', fontSize: 18, letterSpacing: -0.36, color: colors.accent },
  ccNum: { fontFamily: fonts.mono, fontSize: 15, letterSpacing: 1.5, color: colors.text },

  ccBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  ccLbl: { fontFamily: fonts.mono, fontSize: 7, letterSpacing: 0.7, textTransform: 'uppercase', color: colors.textFaint },
  ccVal: { fontFamily: fonts.mono, fontSize: 11, color: colors.text, marginTop: 1 },

  quotas: { gap: 12 },
  quota: {},
  qtop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 },
  qname: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qnameText: { fontWeight: '600', fontSize: 12.5, color: colors.text, fontFamily: fonts.ui },
  qfig: { fontFamily: fonts.display, fontWeight: '700', fontSize: 20, letterSpacing: -0.4, color: colors.text, marginTop: 4, marginBottom: 6 },
  qfigSmall: { fontFamily: fonts.mono, fontSize: 10, fontWeight: '500', color: colors.textFaint, letterSpacing: 0 },
  qsub: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginTop: 6 },
  qsubText: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textDim },
  qsubCap: { color: colors.textFaint },
});
