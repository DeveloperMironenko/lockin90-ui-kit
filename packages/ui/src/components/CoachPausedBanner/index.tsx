import React from 'react';

// Reason values mirror p90-backend src/modules/coach/coach.types.ts → COACH_FREEZE_REASONS.
// The component accepts an unknown string so a future reason that lands on the wire before
// the frontend type catches up doesn't crash — it falls back to the generic copy.
export type CoachPausedReason =
  | 'coach_plan_lapsed'
  | 'coach_account_suspended'
  | 'admin_freeze'
  | (string & { readonly __brand?: 'unknown-reason' });

interface CoachPausedBannerProps {
  // When false the component renders null. Keeps the call site free of inline conditionals.
  frozen: boolean;
  // Null when the connection isn't frozen OR when the wire doesn't ship a reason. The copy
  // for null mirrors the `admin_freeze` generic case — non-actionable; "we'll follow up".
  reason: string | null;
  className?: string;
}

interface BannerCopy {
  title: string;
  body: string;
}

function copyFor(reason: string | null): BannerCopy {
  switch (reason) {
    case 'coach_plan_lapsed':
      return {
        title: 'Coach subscription lapsed',
        body:
          "Your coach's subscription has lapsed. Message history is preserved; you can keep reading, but no new messages can be sent until they resubscribe.",
      };
    case 'coach_account_suspended':
      return {
        title: 'Coach account paused',
        body:
          "Your coach's account is paused by Performance 90 support. Message history is preserved. We'll let you know when this is resolved.",
      };
    default:
      // 'admin_freeze' OR any future reason the frontend hasn't enumerated yet. Generic,
      // non-actionable copy — the user doesn't need to do anything, and we shouldn't
      // speculate about why.
      return {
        title: 'Coach relationship paused',
        body: 'Coach relationship is paused. Message history preserved.',
      };
  }
}

// Subtle amber-tinted banner — not alarming. Renders nothing when not frozen so call sites
// can mount it unconditionally. role="status" lets assistive tech pick it up without
// interrupting focus the way an alert would.
export function CoachPausedBanner({ frozen, reason, className }: CoachPausedBannerProps) {
  if (!frozen) return null;
  const { title, body } = copyFor(reason);
  return (
    <aside
      role="status"
      aria-live="polite"
      className={`flex flex-col gap-1 border border-amber-zone/30 bg-amber-zone/[0.06] rounded px-[14px] py-[10px] ${className ?? ''}`}
      data-coach-paused-reason={reason ?? 'unknown'}
    >
      <div className="font-display italic font-bold text-[11px] tracking-[0.14em] uppercase text-amber-zone">
        {title}
      </div>
      <div className="font-mono text-[11px] text-secondary leading-relaxed">{body}</div>
    </aside>
  );
}
