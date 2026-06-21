import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type TextStyle, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/** Inline emphasis in the interpretation (matches web `.lk-gene-em`). */
const emStyle: TextStyle = { color: colors.text, fontWeight: '600' };
/** Bold copy in the cyan use-case callout (matches web `.lk-gene-use b`). */
const useEmStyle: TextStyle = { color: '#9fe9f7', fontWeight: '600' };

export interface GeneInsight {
  /** Gene symbol, e.g. "CYP1A2". */
  gene: string;
  /** Trait eyebrow under the gene name, e.g. "Caffeine metabolism". */
  trait: string;
  /** Mono genotype badge, e.g. "AC · slow". */
  genotype: string;
  /** Plain-language interpretation. ReactNode so consumers can nest an
   *  emphasized `<Text>…</Text>`. */
  interpretation: ReactNode;
  /** "What to do" callout copy. ReactNode so consumers can nest emphasis. */
  useCase: ReactNode;
}

export interface GeneticInsightCardProps extends ViewProps {
  /** Genes to render, each as its own card. */
  genes?: GeneInsight[];
}

const DEFAULT_GENES: GeneInsight[] = [
  {
    gene: 'CYP1A2',
    trait: 'Caffeine metabolism',
    genotype: 'AC · slow',
    interpretation: (
      <Text>
        You clear caffeine <Text style={emStyle}>~40% slower</Text> than average — afternoon coffee lingers into the
        night.
      </Text>
    ),
    useCase: <Text style={useEmStyle}>Set your caffeine cutoff to ~12pm.</Text>,
  },
  {
    gene: 'ACTN3',
    trait: 'Power / sprint',
    genotype: 'RR',
    interpretation: (
      <Text>
        Two working copies of <Text style={emStyle}>α-actinin-3</Text> — you favor fast-twitch fibers and respond
        well to explosive, heavy training.
      </Text>
    ),
    useCase: <Text style={useEmStyle}>Prioritize sprints &amp; low-rep heavy lifts over long cardio.</Text>,
  },
];

/** Lightbulb glyph for the "what to do" use-case callout. */
function Bulb() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Path
        d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z"
        stroke={colors.accent2}
        strokeWidth={1.7}
        fill="none"
      />
    </Svg>
  );
}

/**
 * Genetic insight — a list of gene/trait cards. Each shows the gene name + a
 * trait eyebrow, a mono violet genotype badge, a plain-language interpretation,
 * and a cyan "what to do" use-case callout with a lightbulb icon. Renders the
 * showcase example by default.
 */
export function GeneticInsightCard({ genes = DEFAULT_GENES, style, ...rest }: GeneticInsightCardProps) {
  return (
    <View style={[styles.list, style]} {...rest}>
      {genes.map((g, i) => (
        <View key={`${g.gene}-${i}`} style={styles.card}>
          <View style={styles.top}>
            <View style={styles.heading}>
              <Text style={styles.name}>{g.gene}</Text>
              <Text style={styles.trait}>{g.trait}</Text>
            </View>
            <View style={styles.geno}>
              <Text style={styles.genoText}>{g.genotype}</Text>
            </View>
          </View>
          <Text style={styles.interp}>{g.interpretation}</Text>
          <View style={styles.use}>
            <View style={styles.bulb}>
              <Bulb />
            </View>
            <Text style={styles.useText}>{g.useCase}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 14 },
  card: {
    padding: 15,
    gap: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  heading: { flex: 1 },
  name: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.15,
    lineHeight: 16,
    color: colors.text,
  },
  trait: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 3,
  },
  geno: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.35)',
    backgroundColor: 'rgba(168,85,247,0.1)',
  },
  genoText: { fontFamily: fonts.mono, fontSize: 9.5, fontWeight: '600', color: '#d6b8ff' },
  interp: { fontSize: 11.5, color: colors.textDim, lineHeight: 17 },
  use: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    padding: 11,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.20)',
    backgroundColor: 'rgba(34,211,238,0.06)',
  },
  bulb: { marginTop: 1 },
  useText: { flex: 1, fontSize: 11, color: colors.text, lineHeight: 15 },
});
