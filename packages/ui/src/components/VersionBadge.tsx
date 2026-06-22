import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type VersionEnv = 'prod' | 'staging' | 'dev';

export interface VersionBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** version string, e.g. `v1.6.0` */
  version: string;
  /** short build hash, e.g. `a1b2c3d` */
  build?: string;
  /** deployment environment — tints the leading dot + env label (default `prod`) */
  env?: VersionEnv;
  /** optional build/release date segment */
  date?: string;
  /** show the leading env-colored status dot (default true) */
  dot?: boolean;
}

const ENV: Record<VersionEnv, string> = {
  prod: 'lk-verbadge-prod',
  staging: 'lk-verbadge-staging',
  dev: 'lk-verbadge-dev',
};

const ENV_LABEL: Record<VersionEnv, string> = {
  prod: 'PROD',
  staging: 'STAGING',
  dev: 'DEV',
};

/** Compact monospace build/version chip — version · build · env · date, with an env-colored status dot. */
export const VersionBadge = forwardRef<HTMLSpanElement, VersionBadgeProps>(function VersionBadge(
  { version, build, env = 'prod', date, dot = true, className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn('lk-verbadge', ENV[env], className)} {...rest}>
      <span className="lk-verbadge-ver">
        {dot && <span className="lk-verbadge-dot" aria-hidden="true" />}
        {version}
      </span>
      {build && <span className="lk-verbadge-seg">build {build}</span>}
      {date && <span className="lk-verbadge-seg">{date}</span>}
      <span className="lk-verbadge-seg lk-verbadge-env">{ENV_LABEL[env]}</span>
    </span>
  );
});
