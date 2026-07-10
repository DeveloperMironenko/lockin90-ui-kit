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
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { SearchInput } from './FormField';
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
  /** show a search field in the option panel to filter a long list (by label). */
  searchable?: boolean;
  /** placeholder for the search field (pass a localized string). @default 'Search…' */
  searchPlaceholder?: string;
  /** name for a hidden input so the value posts in a native form */
  name?: string;
  /**
   * Field scale. `'md'` (default) is the standard form field. `'sm'` is the
   * design settings compact glass pill (`.pref-select`): mono 13px value,
   * `--glass-2` fill, `--border` hairline, padding 8×14, 13px chevron — hugs
   * its content instead of stretching. Mirrors native `size="sm"`.
   */
  size?: 'md' | 'sm';
  /**
   * Optional leading icon rendered inside the field before the value
   * (design `.lang-wrap` globe on the language select). Mirrors native `leading`.
   */
  leading?: ReactNode;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
  { value: 'three', label: 'Option three' },
];

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Dark glassy custom select — NOT the browser `<select>`. A field trigger opens
 *  a portaled, collision-aware listbox (flips above / shifts to stay on-screen)
 *  with full keyboard support (arrows, Home/End, type-ahead, Enter/Esc). With
 *  `searchable`, the panel gains a kit `SearchInput` (autofocused) that filters
 *  options by label inside a FIXED-height panel. Mirrors the native `Select`'s
 *  look; same prop API. */
export function Select({
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  invalid = false,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search…',
  name,
  size = 'md',
  leading,
  className,
  id,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const [triggerW, setTriggerW] = useState(0);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const optRefs = useRef<Array<HTMLLIElement | null>>([]);
  const typeahead = useRef({ buf: '', at: 0 });

  const reactId = useId();
  const base = reactId.replace(/[^a-zA-Z0-9]/g, '');
  const listboxId = `lksel-${base}-list`;
  const optionId = (i: number) => `lksel-${base}-opt-${i}`;

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // the list the panel shows — filtered by label (case-insensitive) while searching.
  // Mirrors the native Select's filter; `active` indexes into THIS list.
  const trimmedQuery = query.trim().toLowerCase();
  const shown =
    searchable && trimmedQuery
      ? options.filter((o) => o.label.toLowerCase().includes(trimmedQuery))
      : options;

  const enabledIndices = shown.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
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
    // query is always '' here (reset on close), so `shown` === `options`
    setActive(selectedIndex >= 0 ? selectedIndex : firstEnabled());
    setOpen(true);
  };
  const close = (focusBtn = true) => {
    setOpen(false);
    setQuery('');
    if (focusBtn) btnRef.current?.focus();
  };
  const choose = (i: number) => {
    const opt = shown[i];
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
    const match = shown.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(ta.buf));
    if (match >= 0) setActive(match);
  };

  /** search field: re-filter and land the highlight on the first match. */
  const onQueryChange = (next: string) => {
    setQuery(next);
    const t = next.trim().toLowerCase();
    const filtered = t ? options.filter((o) => o.label.toLowerCase().includes(t)) : options;
    const first = filtered.findIndex((o) => !o.disabled);
    setActive(first >= 0 ? first : 0);
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

  /** keyboard on the (focused) search field — navigate/choose in the filtered list. */
  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => step(a, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => step(a, -1));
        break;
      case 'Enter':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        // preventDefault also stops type="search" from clearing itself first
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  // searchable panels are FIXED-size while open (height via CSS, width here) so
  // filtering never resizes them per keystroke — mirrors the native search sheet.
  const panelStyle: CSSProperties = {
    ...(pos
      ? { top: pos.top, left: pos.left, minWidth: triggerW }
      : { top: 0, left: 0, minWidth: triggerW, opacity: 0, pointerEvents: 'none' }),
    ...(searchable ? { width: Math.max(triggerW, 260) } : null),
  };

  const rows = !open
    ? null
    : shown.map((opt, i) => {
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
      });

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
        className={cn(
          'lk-select-trigger',
          size === 'sm' && 'lk-select-sm',
          invalid && 'lk-select-invalid',
          disabled && 'lk-select-disabled',
        )}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        // with a search field the input is the focused combobox and carries this
        aria-activedescendant={open && !searchable ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKey}
      >
        {leading != null ? (
          <span className="lk-select-lead" aria-hidden="true">
            {leading}
          </span>
        ) : null}
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
            searchable ? (
              <div
                ref={(el) => {
                  panelRef.current = el;
                }}
                className={cn(
                  'lk-select-panel',
                  'lk-select-searchable',
                  pos && `lk-select-${pos.side}`,
                  pos && 'is-open',
                )}
                style={panelStyle}
              >
                {/* the ONE search primitive (kit rule: never a bare <input> where
                    SearchInput exists) — sm shape to sit inside the panel, autofocused */}
                <SearchInput
                  shape="sm"
                  className="lk-select-search"
                  value={query}
                  onChange={onQueryChange}
                  placeholder={searchPlaceholder}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  role="combobox"
                  aria-expanded={true}
                  aria-autocomplete="list"
                  aria-controls={listboxId}
                  aria-activedescendant={shown.length ? optionId(active) : undefined}
                  onKeyDown={onSearchKey}
                />
                <ul id={listboxId} role="listbox" aria-label={label} className="lk-select-list">
                  {rows}
                </ul>
              </div>
            ) : (
              <ul
                ref={(el) => {
                  panelRef.current = el;
                }}
                id={listboxId}
                role="listbox"
                aria-label={label}
                className={cn('lk-select-panel', pos && `lk-select-${pos.side}`, pos && 'is-open')}
                style={panelStyle}
              >
                {rows}
              </ul>
            ),
            document.body,
          )
        : null}
    </div>
  );
}
