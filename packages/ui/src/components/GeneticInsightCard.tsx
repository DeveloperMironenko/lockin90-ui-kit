import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface GeneInsight {
  /** Gene symbol, e.g. "CYP1A2". */
  gene: string;
  /** Trait eyebrow under the gene name, e.g. "Caffeine metabolism". */
  trait: string;
  /** Mono genotype badge, e.g. "AC · slow". */
  genotype: string;
  /** Plain-language interpretation. ReactNode so consumers can pass
   *  `<span className="lk-gene-em">…</span>` emphasis. */
  interpretation: ReactNode;
  /** "What to do" callout copy. ReactNode so consumers can pass `<b>…</b>`. */
  useCase: ReactNode;
}

export interface GeneticInsightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Genes to render, each as its own card. */
  genes?: GeneInsight[];
}

const DEFAULT_GENES: GeneInsight[] = [
  {
    gene: 'CYP1A2',
    trait: 'Caffeine metabolism',
    genotype: 'AC · slow',
    interpretation: (
      <>
        You clear caffeine <span className="lk-gene-em">~40% slower</span> than average — afternoon coffee lingers
        into the night.
      </>
    ),
    useCase: <b>Set your caffeine cutoff to ~12pm.</b>,
  },
  {
    gene: 'ACTN3',
    trait: 'Power / sprint',
    genotype: 'RR',
    interpretation: (
      <>
        Two working copies of <span className="lk-gene-em">α-actinin-3</span> — you favor fast-twitch fibers and
        respond well to explosive, heavy training.
      </>
    ),
    useCase: <b>Prioritize sprints &amp; low-rep heavy lifts over long cardio.</b>,
  },
];

/** Lightbulb glyph for the "what to do" use-case callout. */
function Bulb() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

/**
 * Genetic insight — a list of gene/trait cards. Each shows the gene name + a
 * trait eyebrow, a mono violet genotype badge, a plain-language interpretation,
 * and a cyan "what to do" use-case callout with a lightbulb icon. Renders the
 * showcase example by default.
 */
export function GeneticInsightCard({ genes = DEFAULT_GENES, className, ...rest }: GeneticInsightCardProps) {
  return (
    <div className={cn('lk-gene', className)} {...rest}>
      {genes.map((g, i) => (
        <div key={`${g.gene}-${i}`} className="lk-card lk-gene-card">
          <div className="lk-gene-top">
            <div>
              <div className="lk-gene-name lk-display">{g.gene}</div>
              <div className="lk-gene-trait">{g.trait}</div>
            </div>
            <span className="lk-gene-geno lk-mono">{g.genotype}</span>
          </div>
          <p className="lk-gene-interp">{g.interpretation}</p>
          <div className="lk-gene-use">
            <Bulb />
            <p>{g.useCase}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
