export type Env = 'DEV' | 'STAGING' | 'PROD';

export interface EnvIndicatorProps {
  env: Env;
  className?: string;
}
