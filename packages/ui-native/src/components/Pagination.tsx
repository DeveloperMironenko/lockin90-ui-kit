import { Fragment } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Icon } from './Icon';

/* ============================================================================
   Pagination + Breadcrumb — admin/CMS navigation atoms.
   ========================================================================== */

export interface PaginationProps {
  /** current page, 1-based */
  page?: number;
  /** total number of pages */
  pageCount?: number;
  onChange?: (page: number) => void;
}

/** Build the page list with ellipsis truncation — always shows first, last,
 *  current, and current ±1; `'…'` marks collapsed ranges. */
function pageItems(page: number, pageCount: number): Array<number | '…'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const out: Array<number | '…'> = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(pageCount - 1, page + 1);
  if (left > 2) out.push('…');
  for (let p = left; p <= right; p += 1) out.push(p);
  if (right < pageCount - 1) out.push('…');
  out.push(pageCount);
  return out;
}

/** Numbered pager — mono numerals, accent-filled active page, chevron
 *  prev/next that dim and disable at the ends. */
export function Pagination({ page = 1, pageCount = 8, onChange }: PaginationProps) {
  const count = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), count);
  const go = (p: number) => {
    if (p < 1 || p > count || p === current) return;
    onChange?.(p);
  };

  const atStart = current <= 1;
  const atEnd = current >= count;

  return (
    <View style={styles.pager}>
      <Pressable
        onPress={() => go(current - 1)}
        disabled={atStart}
        style={({ pressed }) => [
          styles.btn,
          styles.edge,
          atStart && styles.btnDisabled,
          pressed && !atStart && styles.btnPressed,
        ]}
      >
        <Icon name="back" size={16} color={atStart ? colors.textFaint : colors.textDim} />
      </Pressable>

      {pageItems(current, count).map((item, i) =>
        item === '…' ? (
          <View key={`gap-${i}`} style={styles.gap}>
            <Text style={styles.gapText}>…</Text>
          </View>
        ) : (
          <Pressable
            key={item}
            onPress={() => go(item)}
            style={({ pressed }) => [
              styles.btn,
              item === current && styles.btnActive,
              pressed && item !== current && styles.btnPressed,
            ]}
          >
            <Text style={[styles.btnText, item === current && styles.btnTextActive]}>{item}</Text>
          </Pressable>
        ),
      )}

      <Pressable
        onPress={() => go(current + 1)}
        disabled={atEnd}
        style={({ pressed }) => [
          styles.btn,
          styles.edge,
          atEnd && styles.btnDisabled,
          pressed && !atEnd && styles.btnPressed,
        ]}
      >
        <Icon name="chevron" size={16} color={atEnd ? colors.textFaint : colors.textDim} />
      </Pressable>
    </View>
  );
}

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: Crumb[];
  onNavigate?: (index: number) => void;
}

const DEFAULT_CRUMBS: Crumb[] = [{ label: 'Admin' }, { label: 'Users' }, { label: 'Profile' }];

/** Inline breadcrumb trail — dim pressable ancestors, bold current leaf,
 *  faint chevron separators. */
export function Breadcrumb({ items = DEFAULT_CRUMBS, onNavigate }: BreadcrumbProps) {
  return (
    <View style={styles.crumb}>
      {items.map((crumb, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={`${crumb.label}-${i}`}>
            {last ? (
              <Text style={[styles.crumbItem, styles.crumbCurrent]}>{crumb.label}</Text>
            ) : (
              <Pressable onPress={() => onNavigate?.(i)}>
                {({ pressed }) => (
                  <Text style={[styles.crumbItem, pressed && styles.crumbLinkActive]}>
                    {crumb.label}
                  </Text>
                )}
              </Pressable>
            )}
            {!last && (
              <View style={styles.crumbSep}>
                <Icon name="chevron" size={13} color={colors.textFaint} />
              </View>
            )}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── Pagination ── */
  pager: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.glass,
  },
  edge: {},
  btnPressed: { backgroundColor: colors.glass2, borderColor: colors.border2 },
  btnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    fontFamily: fonts.mono,
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 12.5,
    color: colors.textDim,
  },
  btnTextActive: { color: colors.text, fontWeight: '600' },
  gap: {
    minWidth: 20,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gapText: { fontFamily: fonts.mono, fontSize: 12.5, color: colors.textFaint },

  /* ── Breadcrumb ── */
  crumb: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  crumbItem: {
    fontFamily: fonts.ui,
    fontSize: 12.5,
    lineHeight: 14,
    color: colors.textDim,
  },
  crumbLinkActive: { color: colors.text },
  crumbCurrent: { color: colors.text, fontWeight: '600' },
  crumbSep: { opacity: 0.6 },
});
