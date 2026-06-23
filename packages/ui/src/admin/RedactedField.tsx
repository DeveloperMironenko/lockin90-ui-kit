import { cn } from '../cn';
import { Icon } from '../components/Icon';

/* RedactedField — a hatched/striped pill communicating "contents encrypted —
   unreadable". Operators see this in place of E2EE coach-DM bodies: a lock
   glyph + a striped (diagonal) surface signal *you cannot see this*. Web-only
   (admin has no native surface). Matches the `.redacted` pill from
   lockin90-design/admin/moderation.html. */

export interface RedactedFieldProps {
  /** Visible label. @default 'Encrypted — unreadable' */
  label?: string;
  /** Visual tone. @default 'default' */
  tone?: 'default' | 'danger';
}

/** Per-tone modifier class (colour mapping lives in redacted.css). */
const TONE_CLASS: Record<NonNullable<RedactedFieldProps['tone']>, string> = {
  default: 'lk-redacted-default',
  danger: 'lk-redacted-danger',
};

/**
 * A hatched pill standing in for content the operator cannot read (E2EE DM
 * bodies). Diagonal repeating stripes over a faint surface + a lock glyph make
 * the "encrypted / unreadable" state unmistakable. `default` is neutral/faint;
 * `danger` is bad-tinted.
 */
export function RedactedField({
  label = 'Encrypted — unreadable',
  tone = 'default',
}: RedactedFieldProps) {
  return (
    <span className={cn('lk-redacted', TONE_CLASS[tone])} title={label}>
      <Icon name="lock" size={12} className="lk-redacted-ico" aria-hidden />
      <span className="lk-redacted-label">{label}</span>
    </span>
  );
}
