'use client';

import { type KeyboardEvent } from 'react';
import { cn } from '../cn';
import { Icon } from '../components/Icon';

/* PermissionMatrix — the operator capability × role permission grid for the
   admin settings console. A scrollable table with a sticky first column of
   capability rows (label + optional desc; `danger` rows tinted bad) and role
   columns; every body cell is a MatrixToggle reflecting one of four states:
   `on` (granted, accent/ok fill + check), `off` (empty outline), `locked`
   (immutable grant — lock glyph, disabled), `na` (not applicable — faint dash).
   Non-locked / non-na cells fire onToggle (controlled). Web-only (admin has no
   native surface). Matches `table.matrix` + `.mtog` from
   lockin90-design/admin/settings.html. */

/** Visual + interaction state of a single capability/role intersection.
 *  - `on`     — granted; toggleable.
 *  - `off`    — not granted; toggleable.
 *  - `locked` — immutable grant (e.g. root); shown with a lock, not interactive.
 *  - `na`     — capability does not apply to this role; faint dash, inert. */
export type MatrixState = 'on' | 'off' | 'locked' | 'na';

/** A capability (table row). `danger` tints the label + on-state warm/bad. */
export interface MatrixRow {
  key: string;
  label: string;
  desc?: string;
  danger?: boolean;
}

/** A role (table column). */
export interface MatrixCol {
  key: string;
  label: string;
}

export interface PermissionMatrixProps {
  /** Capabilities, top-to-bottom. */
  rows: MatrixRow[];
  /** Roles, left-to-right. */
  cols: MatrixCol[];
  /** Cell states keyed `cells[rowKey][colKey]`. Missing entries render `off`. */
  cells: Record<string, Record<string, MatrixState>>;
  /** Fired when a toggleable (on/off) cell is activated by click or keyboard. */
  onToggle?: (rowKey: string, colKey: string) => void;
}

export interface MatrixToggleProps {
  /** State of this cell. */
  state: MatrixState;
  /** Warm/bad treatment for danger capabilities. */
  danger?: boolean;
  /** Accessible label, e.g. "billing: users.read". */
  label: string;
  /** Fired on click / Space / Enter when the cell is toggleable. */
  onToggle?: () => void;
}

/**
 * A single permission cell. `on`/`off` render as a `role="switch"` checkbox-like
 * toggle (Space/Enter or click flips it via onToggle); `locked` renders a
 * non-interactive lock glyph; `na` renders an inert faint dash.
 */
export function MatrixToggle({ state, danger, label, onToggle }: MatrixToggleProps) {
  const interactive = state === 'on' || state === 'off';

  if (state === 'na') {
    return (
      <span
        className={cn('lk-mtog', 'lk-mtog-dash')}
        role="img"
        aria-label={`${label}: not applicable`}
      />
    );
  }

  if (state === 'locked') {
    return (
      <span
        className={cn('lk-mtog', 'lk-mtog-locked', danger && 'lk-mtog-danger')}
        role="img"
        aria-label={`${label}: granted (locked)`}
        title="Granted — cannot be changed"
      >
        <Icon name="lock" size={12} aria-hidden />
      </span>
    );
  }

  const checked = state === 'on';
  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle?.();
    }
  };

  return (
    <span
      className={cn('lk-mtog', danger && 'lk-mtog-danger')}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={interactive ? 0 : -1}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      <Icon name="check" size={13} className="lk-mtog-check" aria-hidden />
    </span>
  );
}

/**
 * The full capability × role grid. Sticky first column carries the capability
 * label + optional description; each remaining cell is a MatrixToggle. Toggling a
 * cell is delegated to the controlling parent via `onToggle` (this component
 * holds no cell state of its own).
 */
export function PermissionMatrix({ rows, cols, cells, onToggle }: PermissionMatrixProps) {
  return (
    <div className="lk-matrix-wrap">
      <table className="lk-matrix" aria-label="Permission matrix: capabilities by role">
        <thead>
          <tr>
            <th scope="col" className="lk-matrix-caphead">
              Capability
            </th>
            {cols.map((col) => (
              <th scope="col" key={col.key}>
                <span className="lk-matrix-role">{col.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className={cn('lk-matrix-cap', row.danger && 'lk-matrix-cap-danger')}>
                <span className="lk-matrix-cap-label">{row.label}</span>
                {row.desc ? <span className="lk-matrix-cap-desc">{row.desc}</span> : null}
              </td>
              {cols.map((col) => {
                const state = cells[row.key]?.[col.key] ?? 'off';
                return (
                  <td key={col.key} className="lk-matrix-cell">
                    <MatrixToggle
                      state={state}
                      danger={row.danger}
                      label={`${col.label}: ${row.label}`}
                      onToggle={
                        onToggle ? () => onToggle(row.key, col.key) : undefined
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
