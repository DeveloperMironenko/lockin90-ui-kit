import type { Env, EnvIndicatorProps } from './types';

const ENV_CLASS: Record<Env, string> = {
  DEV:     'text-secondary border-border-strong',
  STAGING: 'text-[#FFB020] border-[#FFB020]/40',
  PROD:    'text-accent border-accent/50',
};

export default function EnvIndicator({ env, className }: EnvIndicatorProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 border rounded font-mono text-[10px] tracking-[0.18em] uppercase ${ENV_CLASS[env]} ${className ?? ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${env === 'PROD' ? 'bg-accent' : env === 'STAGING' ? 'bg-[#FFB020]' : 'bg-secondary'}`} />
      {env}
    </div>
  );
}
