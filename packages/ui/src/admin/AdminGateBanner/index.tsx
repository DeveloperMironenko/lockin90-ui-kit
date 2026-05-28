'use client';

import { useEffect, useState } from 'react';
import { Mono } from '../../components/Typography';

type ProbeState = 'unknown' | 'ok' | 'gate-off' | 'unauthenticated';

interface Props {
  /** Override the probe target. Defaults to a tiny shipped /admin/* route. */
  probePath?: string;
  /** Inject a fetcher (used by tests). */
  fetcher?: typeof fetch;
}

/**
 * Probes /api/admin/* once on mount. If the back-end's admin gate is off
 * (Fastify returns 404 from /admin/*, the proxy forwards it), surface a
 * banner explaining the operator must set ADMIN_ENABLED=true.
 *
 * Probe target is `GET /admin/goals/firings?userId=0&date=2026-01-01`:
 *   - admin gate off → 404 (no body code) → banner appears
 *   - admin gate on  → 400 INVALID_PARAMS (gate passed, validation rejected) → banner stays hidden
 *   - unauthenticated → 401 → banner stays hidden (separate concern)
 *
 * Per CLAUDE.md: "Every /admin/* proxy route handles a 404 from Fastify
 * (admin gate off) and surfaces a clear UI message — never a generic error."
 */
export default function AdminGateBanner({
  probePath = '/api/admin/goals/firings?userId=0&date=2026-01-01',
  fetcher = fetch,
}: Props) {
  const [state, setState] = useState<ProbeState>('unknown');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetcher(probePath, { method: 'GET', cache: 'no-store' });
        if (cancelled) return;
        if (res.status === 404) setState('gate-off');
        else if (res.status === 401) setState('unauthenticated');
        else setState('ok');
      } catch {
        if (!cancelled) setState('ok'); // network error: don't block UI on the gate signal
      }
    })();
    return () => { cancelled = true; };
  }, [probePath, fetcher]);

  if (state !== 'gate-off') return null;

  return (
    <div
      role="alert"
      className="bg-amber-zone/10 border-b border-amber-zone/40 px-6 py-3 flex items-start gap-3"
    >
      <span className="font-display italic font-bold text-[11px] tracking-[0.12em] uppercase text-amber-zone shrink-0 mt-0.5">
        ADMIN GATE OFF
      </span>
      <div className="text-[12px] text-secondary leading-relaxed">
        The back-end is returning <Mono color="white">404</Mono> from{' '}
        <Mono color="white">/admin/*</Mono> routes. Set{' '}
        <Mono color="white">ADMIN_ENABLED=true</Mono> on the Fastify deploy and redeploy.
        Until then, every admin action will fail with a generic error.
      </div>
    </div>
  );
}
