'use client';

import type { SelectHTMLAttributes, ReactNode, ChangeEvent, ChangeEventHandler } from 'react';
import { cn } from '../../cn';

/** A single option for the back-compat `options` prop. */
export interface SelectOption {
  value: string;
  label: ReactNode;
}

type SelectBase = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'onChange'> & {
  /** Back-compat (pre-Aurora): a field label rendered above the control. */
  label?: ReactNode;
  className?: string;
};

/**
 * Native (Aurora) shape: render `<option>` children and receive the native
 * change event — exactly like a plain `<select>`.
 */
export interface SelectNativeProps extends SelectBase {
  /** The `<option>` elements to render. */
  children?: ReactNode;
  options?: undefined;
  /** Native change handler — receives the `ChangeEvent`. */
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}

/**
 * Back-compat (pre-Aurora) declarative shape: pass `options` and receive the
 * selected string value in `onChange`.
 */
export interface SelectOptionsProps extends SelectBase {
  /**
   * Declarative options. The kit renders the `<option>`s itself. Accepts either
   * a list of plain strings (value === label) or `{ value, label }` objects.
   */
  options: ReadonlyArray<string | SelectOption>;
  children?: ReactNode;
  /** Value-string change handler — receives the selected option's value. */
  onChange?: (value: string) => void;
}

export type SelectProps = SelectNativeProps | SelectOptionsProps;

function normalizeOptions(options: ReadonlyArray<string | SelectOption>): SelectOption[] {
  return options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
}

type SelectAllProps = SelectBase & {
  children?: ReactNode;
  options?: ReadonlyArray<string | SelectOption>;
  onChange?: ((value: string) => void) | ChangeEventHandler<HTMLSelectElement>;
};

/** Aurora native `<select>` (mono). Controlled via native `value`/`onChange`. */
export default function Select(props: SelectProps) {
  const { children, label, options, onChange, className, id, ...rest } = props as SelectAllProps;

  // With declarative `options`, the pre-Aurora value-string callback is the
  // natural fit, so call it with the string value. Without `options` (the
  // native `children` path used by Aurora consumers such as FilterBuilder),
  // forward the native change event unchanged.
  const handleChange: ChangeEventHandler<HTMLSelectElement> | undefined = onChange
    ? (event: ChangeEvent<HTMLSelectElement>) => {
        if (options) {
          (onChange as (value: string) => void)(event.target.value);
        } else {
          (onChange as ChangeEventHandler<HTMLSelectElement>)(event);
        }
      }
    : undefined;

  const selectEl = (
    <select id={id} className={cn('lk-select', className)} onChange={handleChange} {...rest}>
      {options
        ? normalizeOptions(options).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        : children}
    </select>
  );

  if (label != null) {
    return (
      <div className="lk-form-row">
        <label className="lk-form-label" htmlFor={id}>
          {label}
        </label>
        {selectEl}
      </div>
    );
  }

  return selectEl;
}
