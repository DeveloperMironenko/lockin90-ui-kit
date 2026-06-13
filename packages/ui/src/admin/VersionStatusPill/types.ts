// Visual status of an estimation system version row in the admin console.
// `canary` = approved into a small user_list scope; `standard` = standard_users scope;
// `all` = all_users scope; `rolled_back` = the latest approval was rolled back;
// `inactive` = registered but never approved.
export type VersionStatus = 'canary' | 'standard' | 'all' | 'rolled_back' | 'inactive';

export interface VersionStatusPillProps {
  status: VersionStatus;
  className?: string;
}
