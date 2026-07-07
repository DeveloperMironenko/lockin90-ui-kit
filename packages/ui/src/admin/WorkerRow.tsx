import { cn } from '../cn';

/* WorkerRow — a background-worker status line: pulsing tone dot, mono name, right-aligned meta
   (queue depth / failures). Mirrors `.worker-row` from lockin90-design/admin/overview.html.
   Web-only. `lk-worker*` classes. */

export type WorkerTone = 'ok' | 'warn' | 'bad';

export interface WorkerRowProps {
  /** Worker/queue name, e.g. "pg-boss · sync". */
  name: string;
  /** Right-aligned meta, e.g. "depth 14 · 0 fail". */
  meta: string;
  /** Health dot colour. */
  tone?: WorkerTone;
  className?: string;
}

/** One worker status line: pulse dot · name · meta. */
export function WorkerRow({ name, meta, tone = 'ok', className }: WorkerRowProps) {
  return (
    <div className={cn('lk-worker', className)}>
      <span className={cn('lk-worker-dot', `lk-worker-dot--${tone}`)} />
      <span className="lk-worker-nm">{name}</span>
      <span className="lk-worker-meta">{meta}</span>
    </div>
  );
}
