import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii } from '@lockin90/tokens';
import { NoteField } from './NoteField';

/* ============================================================================
   RichTextEditor (native fallback)

   React Native has no `contentEditable`, so there is no native equivalent of
   the web rich-text surface + `document.execCommand` formatting. Per the kit's
   parity rule we still ship the SAME export name and the SAME props as the web
   `RichTextEditor`, but as a documented **graceful fallback**: a multiline,
   plain-text editor built on the shared `NoteField`.

   Because of that:
     • `value` / `onChange` carry **plain text** here (NOT HTML).
     • `toolbar` is accepted for prop parity but has no effect (no formatting UI).
     • Rich formatting (bold/italic/lists/headings/links/quote/code) is
       **web-only**. On native the user edits plain text / markdown by hand.

   App code that needs identical behavior on both platforms should treat the
   stored value accordingly (e.g. author markdown and render it on display).
   ========================================================================== */

/** The formatting actions a RichTextEditor toolbar can expose (web). Kept here
 *  for prop-type parity; on native these have no effect. */
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
  /** current value — **plain text** on native (HTML on web) */
  value: string;
  /** called with the next value (plain text on native) */
  onChange: (value: string) => void;
  /** placeholder shown while the editor is empty */
  placeholder?: string;
  /** accepted for parity with web; ignored on native (no formatting UI) */
  toolbar?: RichTextAction[];
  /** minimum height of the editing surface, in text rows (default 6) */
  minRows?: number;
  /** invalid state — red border */
  invalid?: boolean;
  /** disable editing */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Native graceful fallback for the web `RichTextEditor`: a multiline plain-text
 * editor (built on `NoteField`). Rich formatting is web-only — see the file
 * header. Same export name and prop names as web; `value`/`onChange` carry
 * plain text on native.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  minRows = 6,
  invalid = false,
  disabled = false,
  style,
}: RichTextEditorProps) {
  // `toolbar` is part of the props for parity with web but has no native effect.
  return (
    <View style={style}>
      <NoteField
        value={value}
        onChangeText={onChange}
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
  surface: {
    borderRadius: radii.sm,
  },
  invalid: {
    borderColor: colors.zoneLow,
  },
  disabled: {
    opacity: 0.6,
  },
});
