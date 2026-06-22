'use client';

import { cn } from '../cn';
import { Input } from './Input';
import { Popover } from './Popover';

export interface ColorPickerProps {
  /** Current color as a hex string (e.g. "#7C5CFF" or "#7C5CFF80" when alpha). */
  value: string;
  /** Fires with the next hex string whenever the color changes. */
  onChange: (hex: string) => void;
  /** Preset swatch hexes shown in the grid. Defaults to the Aurora spectrum. */
  swatches?: string[];
  /** Allow editing an 8-digit (#RRGGBBAA) alpha channel. Default false. */
  allowAlpha?: boolean;
  /** Optional small mono label above the trigger row. */
  label?: string;
  /** Marks the field invalid (red hex Input). */
  invalid?: boolean;
  /** Extra class on the root. */
  className?: string;
}

/** Aurora energy-spectrum default swatches (token hexes — data, not chrome). */
const DEFAULT_SWATCHES = [
  '#A8FF35', // lime
  '#34F5C5', // mint
  '#22D3EE', // cyan
  '#6E7BFF', // indigo
  '#7C5CFF', // accent
  '#A855F7', // violet
  '#FF3D81', // magenta
  '#FFB020', // warn / amber
  '#FF4D6D', // zone-low
  '#EEF1F8', // text (near-white)
];

/** Normalize loose input to a `#`-prefixed uppercase hex, tolerating partials. */
function normalizeHex(raw: string): string {
  let v = raw.trim().toUpperCase();
  if (!v.startsWith('#')) v = `#${v}`;
  return v;
}

/** A full, drawable 6/8-digit hex (the only thing <input type=color> accepts is 6). */
function isCompleteHex(v: string): boolean {
  return /^#([0-9A-F]{6}|[0-9A-F]{8})$/.test(v);
}

/** Strip any alpha pair so a 6-digit value can feed <input type="color">. */
function toBaseHex(v: string): string {
  const m = /^#([0-9A-F]{6})/i.exec(v);
  return m ? `#${m[1]}` : '#000000';
}

/** Swatch-trigger color field. The trigger shows the current color; clicking it
 *  opens a Popover with a native OS picker (`<input type="color">`), a hex
 *  `Input`, and a grid of preset swatches. Reuses Popover + Input — chrome is
 *  tokens-only; the default swatch hexes are data. */
export function ColorPicker({
  value,
  onChange,
  swatches = DEFAULT_SWATCHES,
  allowAlpha = false,
  label,
  invalid = false,
  className,
}: ColorPickerProps) {
  const display = normalizeHex(value || '');
  const baseHex = toBaseHex(display);

  const trigger = (
    <span className="lk-colorpicker-swatch" aria-hidden="true">
      <span className="lk-colorpicker-swatch-fill" style={{ background: display }} />
    </span>
  );

  return (
    <div className={cn('lk-colorpicker', className)}>
      {label ? <span className="lk-colorpicker-label">{label}</span> : null}
      <Popover className="lk-colorpicker-pop" trigger={trigger} align="left">
        <div className="lk-colorpicker-panel">
          <div className="lk-colorpicker-native">
            <input
              type="color"
              className="lk-colorpicker-native-input"
              value={baseHex}
              aria-label="Pick a color"
              onChange={(e) => onChange(normalizeHex(e.target.value))}
            />
            <Input
              aria-label="Hex color"
              inputSize="sm"
              invalid={invalid}
              value={display}
              spellCheck={false}
              autoComplete="off"
              maxLength={allowAlpha ? 9 : 7}
              placeholder={allowAlpha ? '#RRGGBBAA' : '#RRGGBB'}
              className="lk-colorpicker-hex"
              onChange={(e) => onChange(normalizeHex(e.target.value))}
            />
          </div>
          <div className="lk-colorpicker-swatches" role="group" aria-label="Preset colors">
            {swatches.map((sw) => {
              const swNorm = normalizeHex(sw);
              const selected = isCompleteHex(display) && swNorm === display;
              return (
                <button
                  key={swNorm}
                  type="button"
                  className={cn('lk-colorpicker-preset', selected && 'is-selected')}
                  style={{ background: swNorm }}
                  aria-label={swNorm}
                  aria-pressed={selected}
                  onClick={() => onChange(swNorm)}
                />
              );
            })}
          </div>
        </div>
      </Popover>
    </div>
  );
}
