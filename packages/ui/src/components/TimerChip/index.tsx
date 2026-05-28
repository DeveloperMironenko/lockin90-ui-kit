'use client';

import { useEffect, useState } from 'react';
import { Mono } from '../Typography';

interface TimerChipProps {
  // Number of seconds the timer has been running. Pass the latest sample from
  // the server or store; the chip will not tick on its own when `running=false`.
  elapsedSec: number;
  running: boolean;
  // When running=true, the chip will increment its display every second from
  // the supplied baseline. The `anchoredAt` prop (ms epoch) tells it when the
  // baseline was sampled so it can drift forward correctly.
  anchoredAt?: number;
  label?: string;
  className?: string;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatHMS(seconds: number) {
  const s = Math.max(0, seconds | 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

// Live mm:ss / hh:mm:ss chip. Pulses while running. Doesn't poll — increments
// from the supplied anchor.
export function TimerChip({ elapsedSec, running, anchoredAt, label, className }: TimerChipProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const drift = running && anchoredAt ? Math.max(0, Math.floor((Date.now() - anchoredAt) / 1000)) : 0;
  // Reading `tick` keeps the effect dependency honest without changing the value used.
  const _ = tick;
  void _;
  const display = formatHMS(elapsedSec + drift);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${
        running
          ? 'bg-accent/[0.08] border-accent/40 text-accent ea-pulse-dot-host'
          : 'bg-elevated border-border text-muted'
      } ${className ?? ''}`}
    >
      {running && (
        <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
      )}
      <Mono color={running ? 'accent' : 'muted'}>{display}</Mono>
      {label && (
        <span className="text-[10px] uppercase tracking-wider opacity-70 ml-1">{label}</span>
      )}
    </div>
  );
}

export default TimerChip;
