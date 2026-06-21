import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode } from 'react';

const meta = { title: 'Docs/Overview' } satisfies Meta;
export default meta;

type Status = 'have' | 'partial' | 'missing';
const STATUS: Record<Status, { label: string; color: string }> = {
  have: { label: 'HAVE', color: 'var(--zone-high)' },
  partial: { label: 'PARTIAL', color: 'var(--zone-mid)' },
  missing: { label: 'MISSING', color: 'var(--zone-low)' },
};

function Badge({ s }: { s: Status }) {
  const { label, color } = STATUS[s];
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: '.08em',
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: '2px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function CoverRow({ s, name, note }: { s: Status; name: string; note: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '78px 200px 1fr',
        gap: 14,
        alignItems: 'center',
        padding: '9px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Badge s={s} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text)' }}>{name}</span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: 'var(--text-dim)' }}>{note}</span>
    </div>
  );
}

function H({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
        margin: '26px 0 8px',
      }}
    >
      {children}
    </div>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 760, color: 'var(--text)' }}>
      <span className="lk-display lk-gradient-text" style={{ fontSize: 30 }}>
        LockIn90 UI Kit
      </span>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 600 }}>
        “Aurora Flux” — a dark glassmorphism design system on the energy-spectrum gradient. Plain <code>lk-*</code> CSS (no
        Tailwind), fully tokens-driven. Shipped as <b>@lockin90/ui</b> (web, React) ↔ <b>@lockin90/ui-native</b> (React
        Native) in lockstep, with <b>@lockin90/tokens</b> as the shared source of truth.
      </p>

      <H>Foundations</H>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-dim)' }}>
        Tokens · Colors · Typography · Icon · Avatar · BrandMark
      </p>
      <H>Primitives</H>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-dim)' }}>
        Button · Chip · Card · Input · NoteField · Skeleton · BarFill · Stat · Pulse · Divider · GradientText ·
        SegmentedTabs · ProGate / LockedRow
      </p>
      <H>Product components</H>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-dim)' }}>
        60+ surfaces — loggers, charts, cards, feeds, calendars, leaderboards, onboarding, and more (see Components).
      </p>

      <div style={{ height: 24 }} />
      <span className="lk-display" style={{ fontSize: 19 }}>
        Exercise-detail coverage
      </span>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: 'var(--text-faint)', marginTop: 4 }}>
        What the kit covers for the tap-an-exercise pages (Stats · History · Guide · Ranks).
      </p>
      <div style={{ marginTop: 10 }}>
        <CoverRow s="have" name="Leaderboard" note="Ranks tab — name · set · 1RM · #" />
        <CoverRow s="have" name="PersonalRecords" note="Stats → PR History list" />
        <CoverRow s="have" name="WorkoutSetLogger" note="set table + tappable exercise + set types" />
        <CoverRow s="have" name="charts" note="EnergyForecast / GlycemicCurve → trend & PR charts" />
        <CoverRow s="have" name="SegmentedTabs" note="Stats·History·Guide·Ranks switcher (new)" />
        <CoverRow s="have" name="Icon · Avatar · ProGate" note="header chrome + premium lock gate (new)" />
        <CoverRow s="have" name="Input · NoteField" note="form primitives + private notes (new)" />
        <CoverRow s="partial" name="ExerciseCard" note="reuse for similar-exercise row + real video thumbs" />
        <CoverRow s="partial" name="MuscleTags" note="ExerciseCard / TagCloud pattern — needs an inline list" />
        <CoverRow s="missing" name="RepMaxTable" note="reps → estimated → achieved, lock-gated rows" />
        <CoverRow s="missing" name="InstructionList" note="Guide → numbered setup steps + More" />
        <CoverRow s="missing" name="VideoStrip" note="Guide → play-thumbnail row" />
        <CoverRow s="missing" name="ExerciseHistoryEntry" note="History → date + read-only sets" />
      </div>
    </div>
  ),
};
