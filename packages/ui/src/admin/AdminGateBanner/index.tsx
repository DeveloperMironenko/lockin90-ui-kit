'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type ProbeState = 'unknown' | 'ok' | 'gate-off' | 'unauthenticated';

export interface Props {
  /** Override the probe target. Defaults to a tiny shipped /admin/* route. */
  probePath?: string;
  /** Inject a fetcher (used by tests). */
  fetcher?: typeof fetch;
}

// Inline mono code chip — was the kit's <Mono color="white"> in the old design.
function Code({ children }: { children: ReactNode }) {
  return (
    <span className="lk-mono" style={{ color: 'var(--text)' }}>
      {children}
    </span>
  );
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
    return () => {
      cancelled = true;
    };
  }, [probePath, fetcher]);

  if (state !== 'gate-off') return null;

  const wrap: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 24px',
    borderBottom: '1px solid rgba(255,176,32,.4)',
    background: 'rgba(255,176,32,.1)',
  };
  const tag: CSSProperties = {
    flex: '0 0 auto',
    marginTop: 2,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--zone-mid)',
  };
  const body: CSSProperties = {
    fontSize: 12,
    lineHeight: 1.6,
    color: 'var(--text-dim)',
  };

  return (
    <div role="alert" className="lk-admin-gate-banner" style={wrap}>
      <span style={tag}>ADMIN GATE OFF</span>
      <div style={body}>
        The back-end is returning <Code>404</Code> from <Code>/admin/*</Code> routes. Set{' '}
        <Code>ADMIN_ENABLED=true</Code> on the Fastify deploy and redeploy. Until then, every admin
        action will fail with a generic error.
      </div>
    </div>
  );
}
