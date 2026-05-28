export interface WearableCardProps {
  provider: string;
  name: string;
  isConnected: boolean;
  lastSyncAt?: string | null;
  details?: { label: string; value: string }[];
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
  comingSoon?: boolean;
}
