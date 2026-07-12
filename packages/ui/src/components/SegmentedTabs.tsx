import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

/** Per-segment tone. Two families:
 *  - SEMANTIC tones (`ok`/`canary`/`danger`) — a leading dot + active-only
 *    label tint. `canary` paints amber (`--warn`) for staged/partial rollouts
 *    (e.g. the pipeline Off/Canary/On flag); `ok` is mint (`--ok`), `danger`
 *    is red (`--bad`).
 *  - COLOR tones (`amber`/`cyan`/`violet`/`magenta`) — set-type tints (the
 *    edit-set type selector, design `.sg`: warm-up amber → `--warn`, working
 *    cyan, drop violet, failure magenta). The label is tinted at ALL times
 *    (inactive too), there is NO leading dot, and the ACTIVE segment paints a
 *    tone@16% fill + a 1px tone@50% border. */
export type SegmentedTone = 'ok' | 'canary' | 'danger' | 'amber' | 'cyan' | 'violet' | 'magenta';

/** The 4 color tones — always-tinted label, no dot (vs the semantic dots). */
const COLOR_TONES: ReadonlySet<SegmentedTone> = new Set(['amber', 'cyan', 'violet', 'magenta']);

/** A rich segment: a `label` plus an optional trailing `count` badge and a
 *  semantic `tone`. Plain strings are still accepted and render identically. */
export interface SegmentedTab {
  /** Segment label text. */
  label: string;
  /** Small trailing count badge inside the segment (e.g. catalog item counts). */
  count?: number;
  /** Semantic tone (dot + active tint) or color tone (always-tinted label,
   *  no dot, tinted active fill) — see `SegmentedTone`. */
  tone?: SegmentedTone;
  /** Leading 13px glyph before the label (e.g. the changelog service filter
   *  All/Web/Mobile). Mirrors the native `SegmentedTab.icon`. */
  icon?: IconName;
}

/** Accepts the legacy plain-string form or the rich object form, mixed freely. */
export type SegmentedTabItem = string | SegmentedTab;

const toTab = (t: SegmentedTabItem): SegmentedTab => (typeof t === 'string' ? { label: t } : t);

export interface SegmentedTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Segments, one button each. Each may be a plain label string (legacy) or a
   * `{ label, count?, tone? }` object — the two forms can be mixed.
   */
  tabs?: SegmentedTabItem[];
  /** Index of the active segment. */
  active?: number;
  /** Fires with the clicked segment index. */
  onChange?: (index: number) => void;
  /**
   * Indices of segments that are locked — dimmed, non-interactive (never fire
   * `onChange`), and rendered with a small lock glyph (e.g. the `1Y🔒 / All🔒`
   * upsell pattern on a time-range control).
   */
  locked?: number[];
  /**
   * Color of the SELECTED segment. `'accent'` (default) keeps the standard
   * raised glass pill; `'mint'` paints the active segment with the mint
   * gradient (`--grad-mint`) + mint glow + dark label — the onboarding
   * Activity-level control (design `.seg.on.mint`).
   *
   * `'gradient'` paints it with the CTA gradient (`--grad-cta`) + accent glow
   * + dark label — the design settings `.seg` treatment (unit system / week
   * start controls).
   *
   * Control-level: this is distinct from a rich item's per-segment
   * `SegmentedTab.tone` (`ok`/`canary`/`danger`), which tints individual
   * segments' label/badge and is unrelated to the selected-pill color.
   */
  tone?: 'accent' | 'mint' | 'gradient';
  /**
   * Control scale. `'md'` (default) is the full-width tab bar (equal-width
   * segments). `'sm'` is the design settings compact control: a
   * content-hugging pill track of mono segments (design `.seg`).
   */
  size?: 'md' | 'sm';
  /**
   * Track/active treatment. `'raised'` (default) keeps the standard raised
   * glass active pill. `'tint'` is the design changelog `.svc-toggle`
   * treatment: glass track, hairline-bordered segments, and an ACTIVE segment
   * painted with an accent tint + accent border (no shadow); count badges
   * shrink to mono 8.5 and tint cyan when active. Mirrors native
   * `appearance="tint"`.
   */
  appearance?: 'raised' | 'tint';
}

/** iOS-style segmented control — a pill track of equal-width segments; the
 *  active one is a raised lighter pill. Locked segments are dimmed,
 *  non-interactive, and show a lock glyph. */
export function SegmentedTabs({
  tabs = ['Stats', 'History', 'Guide', 'Ranks'],
  active = 0,
  onChange,
  locked,
  tone = 'accent',
  size = 'md',
  appearance = 'raised',
  className,
  ...rest
}: SegmentedTabsProps) {
  return (
    <div
      className={cn('lk-seg', size === 'sm' && 'lk-seg-sm', className)}
      role="tablist"
      data-tone={tone !== 'accent' ? tone : undefined}
      data-appearance={appearance !== 'raised' ? appearance : undefined}
      {...rest}
    >
      {tabs.map((item, i) => {
        const { label, count, tone, icon } = toTab(item);
        const isLocked = locked?.includes(i) ?? false;
        const isColorTone = tone != null && COLOR_TONES.has(tone);
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-disabled={isLocked || undefined}
            disabled={isLocked}
            className={cn(
              'lk-seg-tab',
              i === active && 'is-active',
              isLocked && 'lk-seg-locked',
              tone && `lk-seg-${tone}`,
              isColorTone && 'lk-seg-colortone',
            )}
            onClick={isLocked ? undefined : () => onChange?.(i)}
          >
            {tone && !isColorTone && <span className="lk-seg-dot" aria-hidden="true" />}
            {icon != null && <Icon name={icon} size={13} />}
            {label}
            {count != null && <span className="lk-seg-count">{count}</span>}
            {isLocked && <Icon name="lock" size={12} />}
          </button>
        );
      })}
    </div>
  );
}
