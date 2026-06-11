import type { ReactNode } from 'react';

export interface PhoneFrameProps {
  children: ReactNode;
  /** Screen width in px (height scales to a 320×680 aspect). */
  width?: number;
  className?: string;
}

/**
 * Self-contained device bezel for mobile mockups / marketing demos — a notched
 * phone frame around a rounded screen. The children render inside the screen
 * (which clips overflow). Styling is inline so no extra global CSS is needed.
 */
export default function PhoneFrame({ children, width = 320, className = '' }: PhoneFrameProps) {
  const scale = width / 320;
  const height = 680 * scale;
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 46 * scale,
        padding: 12 * scale,
        background: 'linear-gradient(160deg, #20242F, #0b0d14)',
        border: '1px solid var(--border-strong)',
        boxShadow: 'var(--elev-2), inset 0 0 0 2px rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 10 * scale,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120 * scale,
          height: 26 * scale,
          background: '#000',
          borderRadius: 999,
          zIndex: 30,
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 36 * scale,
          overflow: 'hidden',
          background: 'var(--bg-base)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
