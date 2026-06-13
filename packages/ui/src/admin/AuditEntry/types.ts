export interface AuditEntryProps {
  timestamp: string;
  adminEmail: string;
  action: string;
  targetLabel: string;
  summary: string;
  className?: string;
}
