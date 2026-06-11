import type { BrandMarkProps } from './types';

// Aurora Flux brand mark: a gradient-stroked rounded square with an upward
// "energy" checkmark + endpoint dot, beside the "LockIn90" wordmark (the 90 in
// flowing spectrum). Replaces the retired "90 + slash + PERFORMANCE" lockup.
const SIZES = {
  sm: { box: 28, gap: 8, word: 16 },
  md: { box: 34, gap: 10, word: 19 },
  lg: { box: 44, gap: 13, word: 25 },
};

export default function BrandMark({ size = 'sm', wordmark = true }: BrandMarkProps) {
  const s = SIZES[size];
  return (
    <span className="inline-flex items-center" style={{ gap: s.gap }}>
      <svg width={s.box} height={s.box} viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="lk-brandmark" x1="0" y1="0" x2="36" y2="36">
            <stop stopColor="#A8FF35" />
            <stop offset=".5" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="33" height="33" rx="10" stroke="url(#lk-brandmark)" strokeWidth="2" />
        <path
          d="M9 23 L15 13 L20 20 L27 10"
          stroke="url(#lk-brandmark)" strokeWidth="2.6"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="27" cy="10" r="2.6" fill="#A8FF35" />
      </svg>
      {wordmark && (
        <span
          className="font-display font-bold text-white tracking-[-0.01em] leading-none"
          style={{ fontSize: s.word }}
        >
          LockIn<span className="ea-gradient-text">90</span>
        </span>
      )}
    </span>
  );
}
