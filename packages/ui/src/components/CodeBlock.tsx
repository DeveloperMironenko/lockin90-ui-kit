import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { CopyButton } from './Popover';

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** The raw code / JSON / identifier shown in the block. */
  code: string;
  /** Optional header title, e.g. 'Response' / 'Incident ID' / a filename. */
  label?: string;
  /** Render a CopyButton (value=code) in the header. Default true. */
  copyable?: boolean;
  /** Wrap long lines instead of horizontal scrolling. Default false. */
  wrap?: boolean;
  /** Cap the scroll area height (px); content scrolls vertically past it. */
  maxHeight?: number;
}

/** Monospace code / JSON block on a dark inset surface. Optional header
 *  (label + traffic-light dots + copy) and a scrolling <pre><code> body.
 *  Used for raw-record/JSON viewers, incident IDs, OTP/keys. */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { code, label, copyable = true, wrap = false, maxHeight, className, ...rest },
  ref,
) {
  const hasHeader = label != null || copyable;
  const bodyStyle: CSSProperties | undefined =
    maxHeight != null ? { maxHeight, overflowY: 'auto' } : undefined;

  return (
    <div ref={ref} className={cn('lk-codeblock', className)} {...rest}>
      {hasHeader && (
        <div className="lk-codeblock-head">
          <span className="lk-codeblock-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {label != null && <span className="lk-codeblock-label">{label}</span>}
          {copyable && <CopyButton className="lk-codeblock-copy" value={code} aria-label="Copy code" />}
        </div>
      )}
      <pre
        className={cn('lk-codeblock-pre', wrap && 'lk-codeblock-wrap')}
        style={bodyStyle}
        tabIndex={0}
      >
        <code className="lk-codeblock-code">{code}</code>
      </pre>
    </div>
  );
});
