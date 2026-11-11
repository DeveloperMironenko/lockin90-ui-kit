import { type HTMLAttributes, useLayoutEffect, useRef } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';
import { segFitPercent } from './segFit';

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
  /**
   * Segments share the track's width equally and may shrink below their padding: on phones
   * (≤ 540px) the labels drop to 12.5px with 4px side padding, so five choices fit one row
   * (design onboarding `.seg` at phone width: activity level, sex, chronotype).
   */
  fill?: boolean;
  /** the line in `--zone-low`, as an invalid `Input`: a required choice not made (onboarding Profile) */
  invalid?: boolean;
  /**
   * What the control is. `'tabs'` (default) switches views: a `tablist` of `tab`s. `'choice'` is a form
   * value (units, sex, activity level): a `radiogroup` of `radio`s with `aria-checked`, one Tab stop
   * (the chosen segment) and the arrow keys (Home / End too) moving and choosing, skipping locked
   * segments. Name the group with `aria-label` / `aria-labelledby`. Mirrors native `kind`.
   */
  kind?: 'tabs' | 'choice';
}

/** The next unlocked index from `from` in `step` direction (wrapping), or `from` when none. */
export function nextSegment(count: number, from: number, step: 1 | -1, locked: number[] = []): number {
  for (let n = 1; n <= count; n++) {
    const i = (((from + step * n) % count) + count) % count;
    if (!locked.includes(i)) return i;
  }
  return from;
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
  fill = false,
  invalid = false,
  kind = 'tabs',
  className,
  ...rest
}: SegmentedTabsProps) {
  const choice = kind === 'choice';
  // a choice is one Tab stop: the chosen segment, or the first unlocked one
  const stop = choice
    ? active >= 0 && active < tabs.length && !locked?.includes(active)
      ? active
      : nextSegment(tabs.length, -1, 1, locked)
    : -1;
  const move = (from: number, key: string) => {
    const last = tabs.length - 1;
    const to =
      key === 'ArrowRight' || key === 'ArrowDown'
        ? nextSegment(tabs.length, from, 1, locked)
        : key === 'ArrowLeft' || key === 'ArrowUp'
          ? nextSegment(tabs.length, from, -1, locked)
          : key === 'Home'
            ? nextSegment(tabs.length, -1, 1, locked)
            : key === 'End'
              ? nextSegment(tabs.length, last + 1, -1, locked)
              : null;
    if (to == null) return false;
    ref.current?.querySelectorAll<HTMLElement>('.lk-seg-tab')[to]?.focus();
    if (to !== active) onChange?.(to);
    return true;
  };
  const ref = useRef<HTMLDivElement>(null);
  const labels = tabs.map((item) => toTab(item).label).join('\u0000');

  // fill: a label wider than its segment shrinks to fit, down to 80% (native's adjustsFontSizeToFit
  // with minimumFontScale 0.8) — long words in uk / ru / es on a phone row. Labels that fit keep their
  // size (the stylesheet's, for every size and appearance: the fit only ever sets an inline size).
  useLayoutEffect(() => {
    const track = ref.current;
    if (!fill || !track) return;
    const fit = () => {
      for (const tab of track.querySelectorAll<HTMLElement>('.lk-seg-tab')) {
        tab.style.removeProperty('font-size');
        tab.classList.remove('lk-seg-wrap');
        if (tab.scrollWidth <= tab.clientWidth) continue;
        const style = getComputedStyle(tab);
        const base = parseFloat(style.fontSize);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        // one measure, then whole-percent steps for what rounding leaves over
        for (let percent = segFitPercent(tab.clientWidth, tab.scrollWidth, padding); percent >= 80; percent -= 2) {
          tab.style.fontSize = `${(base * percent) / 100}px`;
          if (tab.scrollWidth <= tab.clientWidth) break;
        }
        // still too wide at 80% (a long word at 320px): the label wraps inside its segment, never out of it
        if (tab.scrollWidth > tab.clientWidth) tab.classList.add('lk-seg-wrap');
      }
    };
    fit();
    // again once the webfonts arrive (labels widen), and when the row's width changes (not its height,
    // which the fit itself can move), next frame; without ResizeObserver (jsdom, old browsers) only
    // the first fit
    let width = track.clientWidth;
    let frame = 0;
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    void document.fonts?.ready.then(refit);
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            if (track.clientWidth === width) return;
            width = track.clientWidth;
            refit();
          });
    observer?.observe(track);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [fill, labels, size, appearance]);

  return (
    <div
      ref={ref}
      className={cn('lk-seg', size === 'sm' && 'lk-seg-sm', fill && 'lk-seg--fill', invalid && 'lk-seg--invalid', className)}
      aria-invalid={invalid || undefined}
      role={choice ? 'radiogroup' : 'tablist'}
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
            role={choice ? 'radio' : 'tab'}
            aria-selected={choice ? undefined : i === active}
            aria-checked={choice ? i === active : undefined}
            tabIndex={choice ? (i === stop ? 0 : -1) : undefined}
            onKeyDown={
              choice
                ? (e) => {
                    if (move(i, e.key)) e.preventDefault();
                  }
                : undefined
            }
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
