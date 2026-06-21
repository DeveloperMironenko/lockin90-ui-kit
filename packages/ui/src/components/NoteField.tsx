import { type TextareaHTMLAttributes } from 'react';
import { cn } from '../cn';

export interface NoteFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** small mono uppercase label rendered above the field, e.g. "Private notes" */
  label?: string;
}

/** Private-notes field — a small mono uppercase label over a glass multiline
 *  textarea. Wraps the label + textarea in a `<label>` so the caption focuses
 *  the field. All other textarea props spread onto the `<textarea>`. */
export function NoteField({ label, className, rows, placeholder, ...rest }: NoteFieldProps) {
  return (
    <label className="lk-note-wrap">
      {label && <span className="lk-note-label">{label}</span>}
      <textarea
        className={cn('lk-note', className)}
        rows={rows ?? 3}
        placeholder={placeholder ?? 'Add a note…'}
        {...rest}
      />
    </label>
  );
}
