import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** small mono uppercase label rendered above the control */
  label?: string;
  /** faint helper text below the control (hidden when `error` is set) */
  help?: ReactNode;
  /** red error text below the control — replaces `help` when present */
  error?: ReactNode;
  /** appends a small accent `*` after the label */
  required?: boolean;
  /** ties the label to the control via `htmlFor`. Without it, a single control child gets a generated
   *  `id` (unless it has one), so the label still names it. */
  htmlFor?: string;
  /** a link or action at the end of the label row (e.g. "Forgot password?") */
  labelAction?: ReactNode;
  /** the form control to wrap */
  children?: ReactNode;
}

type ControlProps = {
  id?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

/** Labeled form-control wrapper — mono label, the control, then faint help or red error. The one control
 *  child is named by the label (`htmlFor` / its `id`), described by the error or help
 *  (`aria-describedby`) and marked `aria-required` when `required` (FormField.md §7). */
export function FormField({
  label,
  help,
  error,
  required = false,
  htmlFor,
  labelAction,
  children,
  className,
  ...rest
}: FormFieldProps) {
  const baseId = useId();
  const labelId = label ? `${baseId}-label` : undefined;
  const noteId = error ? `${baseId}-error` : help ? `${baseId}-help` : undefined;
  const only = Children.count(children) === 1 ? Children.toArray(children)[0] : null;
  const control =
    isValidElement<ControlProps>(only) && only.type !== Fragment ? (only as ReactElement<ControlProps>) : null;
  const controlId = htmlFor ?? control?.props.id ?? (control ? `${baseId}-control` : undefined);
  const describedBy = [control?.props['aria-describedby'], noteId].filter(Boolean).join(' ') || undefined;
  // mapped (never swapped for a bare element), so going between one and several children never remounts
  // the control. aria-labelledby names it too where a label's `for` can't (a CodeInput group, a choice
  // SegmentedTabs radiogroup), unless it is named already.
  const body = Children.map(children, (child) =>
    control && isValidElement<ControlProps>(child) && child.type !== Fragment
      ? cloneElement(child, {
          id: child.props.id ?? controlId,
          'aria-describedby': describedBy,
          'aria-required': required || child.props['aria-required'] || undefined,
          'aria-labelledby':
            child.props['aria-labelledby'] ?? (child.props['aria-label'] ? undefined : labelId),
        })
      : child,
  );
  return (
    <div className={cn('lk-field', className)} {...rest}>
      {label || labelAction ? (
        <div className="lk-field-label-row">
          {label ? (
            <label id={labelId} className="lk-field-label" htmlFor={controlId}>
              {label}
              {required ? <span className="lk-field-req" aria-hidden="true">*</span> : null}
            </label>
          ) : null}
          {labelAction}
        </div>
      ) : null}
      <div className="lk-field-control">{body}</div>
      {error ? (
        <p id={noteId} className="lk-field-error" role="alert">
          <Icon name="info" size={12} className="lk-field-error-icon" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : help ? (
        <p id={noteId} className="lk-field-help">
          {help}
        </p>
      ) : null}
    </div>
  );
}

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** current query value (controlled) */
  value?: string;
  /** fires with the next string value on every keystroke and on clear */
  onChange?: (value: string) => void;
  /** placeholder copy (default 'Search…') */
  placeholder?: string;
  /** invoked by the trailing × clear button (in addition to `onChange('')`) */
  onClear?: () => void;
  /** the clear button's name, in the app's language (CONVENTIONS "Accessibility": names via props).
   *  @default 'Clear search' (an English fallback for older apps) */
  clearLabel?: string;
  /** optional trailing keyboard-shortcut hint (e.g. `⌘K`) rendered as a faint mono chip */
  kbdHint?: string;
  /** @deprecated 2026-11-11 (one radius for every control): ignored, every search field has the control
   *  radius (10). Removed in the next major. */
  shape?: 'pill' | 'sm';
}

/** Search field — leading magnifier, transparent input, trailing × clear when non-empty. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  onClear,
  clearLabel = 'Clear search',
  kbdHint,
  shape: _shape,
  className,
  ...rest
}: SearchInputProps) {
  const hasValue = !!value && value.length > 0;

  function clear() {
    onChange?.('');
    onClear?.();
  }

  return (
    <div className={cn('lk-search', className)}>
      <span className="lk-search-lead" aria-hidden="true">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </span>
      <input
        type="search"
        className="lk-search-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
      {hasValue ? (
        <button type="button" className="lk-search-clear" aria-label={clearLabel} onClick={clear}>
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      ) : null}
      {kbdHint ? (
        <kbd className="lk-search-kbd" aria-hidden="true">{kbdHint}</kbd>
      ) : null}
    </div>
  );
}
