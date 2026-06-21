/**
 * Vanilla scroll-reveal + count-up engine for the Aurora kit.
 * Toggles `.is-visible` on `[data-reveal]` elements as they enter the viewport
 * (which also fills `.lk-barfill`), and animates `[data-count]` numbers.
 * Honors `prefers-reduced-motion`. Returns a cleanup function.
 */
export interface InitMotionOptions {
  root?: ParentNode | null;
  threshold?: number;
}

export function initMotion(opts: InitMotionOptions = {}): () => void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return () => {};
  const root: ParentNode = opts.root ?? document;
  const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  const counts = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));

  if (reduce) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    counts.forEach((el) => finishCount(el));
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        const delay = Number(el.dataset.revealDelay ?? 0);
        window.setTimeout(() => {
          el.classList.add('is-visible');
          if (el.hasAttribute('data-count')) runCount(el);
          el.querySelectorAll<HTMLElement>('[data-count]').forEach(runCount);
        }, delay);
        io.unobserve(el);
      }
    },
    { threshold: opts.threshold ?? 0.16, rootMargin: '0px 0px -8% 0px' },
  );

  reveals.forEach((el) => io.observe(el));
  counts.filter((el) => !el.closest('[data-reveal]')).forEach((el) => io.observe(el));

  return () => io.disconnect();
}

function runCount(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = Number(el.dataset.count ?? el.textContent ?? 0);
  const decimals = Number(el.dataset.decimals ?? 0);
  const suffix = el.dataset.suffix ?? '';
  const duration = 1100;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  };
  requestAnimationFrame(tick);
}

function finishCount(el: HTMLElement) {
  const target = Number(el.dataset.count ?? el.textContent ?? 0);
  const decimals = Number(el.dataset.decimals ?? 0);
  el.textContent = target.toFixed(decimals) + (el.dataset.suffix ?? '');
}
