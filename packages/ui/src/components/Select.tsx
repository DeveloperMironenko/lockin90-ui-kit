'use client';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { computeMenuPosition, type MenuPosition } from './tooltipPosition';

/** A single option in a {@link Select}. */
export interface SelectOption {
  value: string;
  label: string;
  /** render the option dimmed and unselectable */
  disabled?: boolean;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** options to render; defaults to a few sample options */
  options?: SelectOption[];
  /** controlled selected value */
  value?: string;
  /** fired with the newly selected value */
  onChange?: (value: string) => void;
  /** placeholder shown when no value is selected */
  placeholder?: string;
  /** small mono uppercase label rendered above the field */
  label?: string;
  /** appends an accent `*` after the label — matches `FormField` / `Input` */
  required?: boolean;
  /** red border + glow to signal an invalid value */
  invalid?: boolean;
  /** disable the field */
  disabled?: boolean;
  /** name for a hidden input so the value posts in a native form */
  name?: string;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
  { value: 'three', label: 'Option three' },
];

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Dark glassy custom select — NOT the browser `<select>`. A field trigger opens
 *  a portaled, collision-aware listbox (flips above / shifts to stay on-screen)
 *  with full keyboard support (arrows, Home/End, type-ahead, Enter/Esc). Mirrors
 *  the native `Select`'s look; same prop API. */
export function Select({
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  invalid = false,
  disabled = false,
  name,
  className,
  id,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const [triggerW, setTriggerW] = useState(0);
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const optRefs = useRef<Array<HTMLLIElement | null>>([]);
  const typeahead = useRef({ buf: '', at: 0 });

  const reactId = useId();
  const base = reactId.replace(/[^a-zA-Z0-9]/g, '');
  const listboxId = `lksel-${base}-list`;
  const optionId = (i: number) => `lksel-${base}-opt-${i}`;

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const enabledIndices = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const firstEnabled = () => (enabledIndices.length ? enabledIndices[0] : 0);
  const lastEnabled = () => (enabledIndices.length ? enabledIndices[enabledIndices.length - 1] : 0);
  /** next enabled index from `from` in `dir`, wrapping. */
  const step = (from: number, dir: 1 | -1): number => {
    if (!enabledIndices.length) return from;
    const cur = enabledIndices.indexOf(from);
    if (cur === -1) {
      return dir === 1
        ? enabledIndices.find((i) => i > from) ?? enabledIndices[0]
        : [...enabledIndices].reverse().find((i) => i < from) ?? lastEnabled();
    }
    const next = (cur + dir + enabledIndices.length) % enabledIndices.length;
    return enabledIndices[next];
  };

  const openMenu = () => {
    if (disabled) return;
    setActive(selectedIndex >= 0 ? selectedIndex : firstEnabled());
    setOpen(true);
  };
  const close = (focusBtn = true) => {
    setOpen(false);
    if (focusBtn) btnRef.current?.focus();
  };
  const choose = (i: number) => {
    const opt = options[i];
    if (!opt || opt.disabled) return;
    onChange?.(opt.value);
    close();
  };

  const onTypeAhead = (char: string) => {
    const now = Date.now();
    const ta = typeahead.current;
    if (now - ta.at > 700) ta.buf = '';
    ta.at = now;
    ta.buf += char.toLowerCase();
    const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(ta.buf));
    if (match >= 0) setActive(match);
  };

  // position while open + keep pinned on scroll/resize (mirrors Menu)
  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const reposition = () => {
      const t = rootRef.current;
      const p = panelRef.current;
      if (!t || !p) return;
      const r = t.getBoundingClientRect();
      setTriggerW(r.width);
      setPos(
        computeMenuPosition(
          { top: r.top, left: r.left, width: r.width, height: r.height },
          p.offsetWidth,
          p.offsetHeight,
          'left',
          window.innerWidth,
          window.innerHeight,
        ),
      );
    };
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, options]);

  // click-outside + ESC (panel is portaled, so check it too)
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  // keep the active option scrolled into view
  useEffect(() => {
    if (open) optRefs.current[active]?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => step(a, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => step(a, -1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(firstEnabled());
        break;
      case 'End':
        e.preventDefault();
        setActive(lastEnabled());
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) onTypeAhead(e.key);
    }
  };

  const panelStyle: CSSProperties = pos
    ? { top: pos.top, left: pos.left, minWidth: triggerW }
    : { top: 0, left: 0, minWidth: triggerW, opacity: 0, pointerEvents: 'none' };

  return (
    <div ref={rootRef} className={cn('lk-select-wrap', className)} {...rest}>
      {label ? (
        <span className="lk-select-label">
          {label}
          {required ? (
            <span className="lk-field-req" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      ) : null}

      <button
        ref={btnRef}
        type="button"
        id={id}
        className={cn('lk-select-trigger', invalid && 'lk-select-invalid', disabled && 'lk-select-disabled')}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKey}
      >
        <span className={cn('lk-select-value', !selected && 'lk-select-placeholder')}>
          {selected ? selected.label : (placeholder ?? '')}
        </span>
        <svg className="lk-select-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}

      {open && typeof document !== 'undefined'
        ? createPortal(
            <ul
              ref={panelRef}
              id={listboxId}
              role="listbox"
              aria-label={label}
              className={cn('lk-select-panel', pos && `lk-select-${pos.side}`, pos && 'is-open')}
              style={panelStyle}
            >
              {options.map((opt, i) => {
                const isSel = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    ref={(el) => {
                      optRefs.current[i] = el;
                    }}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSel}
                    aria-disabled={opt.disabled || undefined}
                    className={cn(
                      'lk-select-option',
                      i === active && 'is-active',
                      isSel && 'is-selected',
                      opt.disabled && 'is-disabled',
                    )}
                    onMouseEnter={() => !opt.disabled && setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(i)}
                  >
                    <span className="lk-select-option-label">{opt.label}</span>
                    {isSel ? (
                      <svg className="lk-select-check" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
