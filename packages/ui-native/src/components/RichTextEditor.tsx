import { useState } from 'react';
import { View, Text, StyleSheet, type NativeSyntheticEvent, type TextInputSelectionChangeEventData, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import { colors, radii } from '@lockin90/tokens';
import { NoteField } from './NoteField';
import { Toolbar, type ToolbarItem } from './Toolbar';

/* ============================================================================
   RichTextEditor (native)

   React Native has no `contentEditable`, so there is no equivalent of the web
   contentEditable surface + `document.execCommand`. To keep VISUAL + functional
   parity with the web `RichTextEditor`, native ships the SAME toolbar (same
   glyphs/order) over a multiline field, with each button applying **markdown**
   to the plain-text value (e.g. **bold**, *italic*, `## heading`, `- list`).

     • `value` / `onChange` carry **markdown plain text** on native (HTML on web).
     • The toolbar inserts/wraps markdown around the current selection.
   ========================================================================== */

export type RichTextAction =
  | 'bold'
  | 'italic'
  | 'link'
  | 'bulletList'
  | 'orderedList'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'code'
  | 'clear';

export interface RichTextEditorProps {
  /** current value — markdown plain text on native (HTML on web) */
  value: string;
  /** called with the next value (markdown plain text on native) */
  onChange: (value: string) => void;
  /** placeholder shown while the editor is empty */
  placeholder?: string;
  /** which toolbar actions to show, in order */
  toolbar?: RichTextAction[];
  /** minimum height of the editing surface, in text rows (default 6) */
  minRows?: number;
  /** invalid state — red border */
  invalid?: boolean;
  /** disable editing (surface read-only, toolbar hidden) */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_TOOLBAR: RichTextAction[] = [
  'bold', 'italic', 'link', 'bulletList', 'orderedList', 'h2', 'h3', 'quote', 'code', 'clear',
];

const LABELS: Record<RichTextAction, string> = {
  bold: 'Bold',
  italic: 'Italic',
  link: 'Insert link',
  bulletList: 'Bulleted list',
  orderedList: 'Numbered list',
  h2: 'Heading 2',
  h3: 'Heading 3',
  quote: 'Block quote',
  code: 'Code block',
  clear: 'Clear formatting',
};

const stroke = { fill: 'none', stroke: colors.textDim, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/* glyphs mirror the web RichTextEditor toolbar exactly */
function glyph(action: RichTextAction) {
  switch (action) {
    case 'bold':
      return <Text style={[styles.txtGlyph, { fontWeight: '700' }]}>B</Text>;
    case 'italic':
      return <Text style={[styles.txtGlyph, { fontStyle: 'italic' }]}>I</Text>;
    case 'h2':
      return <Text style={[styles.txtGlyph, { fontWeight: '700', fontSize: 12 }]}>H2</Text>;
    case 'h3':
      return <Text style={[styles.txtGlyph, { fontWeight: '700', fontSize: 12 }]}>H3</Text>;
    case 'link':
      return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...stroke}>
          <Path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
          <Path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
        </Svg>
      );
    case 'bulletList':
      return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...stroke}>
          <Path d="M8 6h12M8 12h12M8 18h12" />
          <Circle cx="4" cy="6" r="1.4" fill={colors.textDim} stroke="none" />
          <Circle cx="4" cy="12" r="1.4" fill={colors.textDim} stroke="none" />
          <Circle cx="4" cy="18" r="1.4" fill={colors.textDim} stroke="none" />
        </Svg>
      );
    case 'orderedList':
      return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...stroke}>
          <Path d="M10 6h10M10 12h10M10 18h10" />
          <Path d="M4 5.5h1V9M3.6 9h1.8" />
          <Path d="M3.6 13.4c.2-.6 1.6-.7 1.6.3 0 .7-1.6 1.3-1.6 2.3h1.8" />
        </Svg>
      );
    case 'quote':
      return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...stroke}>
          <Path d="M9 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2" />
          <Path d="M19 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2" />
        </Svg>
      );
    case 'code':
      return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...stroke}>
          <Polyline points="8 7 3 12 8 17" />
          <Polyline points="16 7 21 12 16 17" />
        </Svg>
      );
    case 'clear':
      return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...stroke}>
          <Path d="M5 7h14" />
          <Path d="M14 7l-1 12M10 7l-1 12" />
          <Path d="M7 7l1-2h8l1 2" />
        </Svg>
      );
  }
}

/** Apply a markdown transform for `action` to `value` over selection [start,end]. */
function applyMarkdown(action: RichTextAction, value: string, start: number, end: number): string {
  const before = value.slice(0, start);
  const sel = value.slice(start, end);
  const after = value.slice(end);
  const wrap = (m: string) => `${before}${m}${sel || ''}${m}${after}`;
  // prefix the line that contains `start`
  const linePrefix = (pre: string) => {
    const ls = value.lastIndexOf('\n', start - 1) + 1;
    return value.slice(0, ls) + pre + value.slice(ls);
  };
  switch (action) {
    case 'bold': return wrap('**');
    case 'italic': return wrap('*');
    case 'code': return wrap('`');
    case 'link': return `${before}[${sel || 'text'}](https://)${after}`;
    case 'bulletList': return linePrefix('- ');
    case 'orderedList': return linePrefix('1. ');
    case 'h2': return linePrefix('## ');
    case 'h3': return linePrefix('### ');
    case 'quote': return linePrefix('> ');
    case 'clear': return before + sel.replace(/[*`>#_~-]/g, '') + after;
    default: return value;
  }
}

/**
 * Native RichTextEditor — the web toolbar over a multiline field, applying
 * markdown to the plain-text `value`. Same export name + props as the web twin.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  toolbar = DEFAULT_TOOLBAR,
  minRows = 6,
  invalid = false,
  disabled = false,
  style,
}: RichTextEditorProps) {
  const [sel, setSel] = useState({ start: 0, end: 0 });
  const onSelectionChange = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) =>
    setSel(e.nativeEvent.selection);

  const items: ToolbarItem[] = toolbar.map((action) => ({
    icon: glyph(action),
    label: LABELS[action],
    onPress: () => onChange(applyMarkdown(action, value, sel.start, sel.end)),
  }));

  return (
    <View style={style}>
      {!disabled && toolbar.length > 0 ? <Toolbar items={items} style={styles.toolbar} /> : null}
      <NoteField
        value={value}
        onChangeText={onChange}
        onSelectionChange={onSelectionChange}
        editable={!disabled}
        placeholder={placeholder}
        numberOfLines={minRows}
        style={[
          styles.surface,
          { minHeight: minRows * 22 + 24 },
          invalid && styles.invalid,
          disabled && styles.disabled,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: { marginBottom: 10 },
  txtGlyph: { fontSize: 14, color: colors.textDim },
  surface: { borderRadius: radii.sm },
  invalid: { borderColor: colors.zoneLow },
  disabled: { opacity: 0.6 },
});
