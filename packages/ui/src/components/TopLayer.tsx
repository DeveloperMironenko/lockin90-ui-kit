import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface TopLayerProps {
  /** what to draw above everything, e.g. an app's toast; it places itself in the viewport (the layer is
   *  `position: fixed; inset: 0`). The layer is click-through: give a control `pointer-events: auto`
   *  (the kit Toast's action and × have it). */
  children?: ReactNode;
}

/** Draws its children above everything (z-index 10000: over Modal and Sheet at 1000, Select, Menu,
 *  Popover and Combobox at 9999), in a click-through layer at the end of <body>. The native twin draws
 *  them inside the top-most open Sheet / Modal. */
export function TopLayer({ children }: TopLayerProps) {
  if (typeof document === 'undefined') return null;
  return createPortal(<div className="lk-top-layer">{children}</div>, document.body);
}
