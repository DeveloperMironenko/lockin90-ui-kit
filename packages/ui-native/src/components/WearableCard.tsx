import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { colors, fonts, radius, spacing } from '@p90/tokens';

export type WearableProvider =
  | 'whoop'
  | 'apple_health'
  | 'health_connect'
  | 'oura'
  | 'dexcom'
  | 'google_calendar';

export interface WearableCardProps {
  provider: WearableProvider;
  name: string;
  isConnected: boolean;
  isConnecting?: boolean;
  isSyncing?: boolean;
  lastSyncAt?: Date | string | null;
  details?: { label: string; value: string }[];
  onConnect: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
}

function ProviderLogo({ provider }: { provider: WearableProvider }) {
  if (provider === 'whoop') {
    return (
      <Svg width={28} height={28} viewBox="0 0 28 28">
        <SvgText
          x="50%"
          y="68%"
          textAnchor="middle"
          fontFamily="Arial Black"
          fontWeight="900"
          fontSize={18}
          fill={colors.textPrimary}
          letterSpacing={-1}
        >
          W
        </SvgText>
      </Svg>
    );
  }
  if (provider === 'apple_health') {
    return (
      <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <Path
          d="M14 22 C8 17, 5 13, 7 9.5 C8.5 7, 11 7, 14 10.5 C17 7, 19.5 7, 21 9.5 C23 13, 20 17, 14 22Z"
          fill="#FF375F"
        />
      </Svg>
    );
  }
  if (provider === 'health_connect') {
    return (
      <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <Path
          d="M9 14 L13 14 L13 10 L17 10 L17 14 L21 14 L21 18 L17 18 L17 22 L13 22 L13 18 L9 18Z"
          fill={colors.textPrimary}
        />
      </Svg>
    );
  }
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.displayItalic, fontSize: 18, color: colors.textPrimary }}>
        {provider[0].toUpperCase()}
      </Text>
    </View>
  );
}

function formatLastSync(at: Date | string | null | undefined): string {
  if (!at) return '';
  const d = typeof at === 'string' ? new Date(at) : at;
  if (Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return d.toLocaleDateString();
}

const STALE_SYNC_MS = 24 * 60 * 60 * 1000;

function isStaleSync(at: Date | string | null | undefined): boolean {
  if (!at) return true;
  const d = typeof at === 'string' ? new Date(at) : at;
  if (Number.isNaN(d.getTime())) return false;
  return Date.now() - d.getTime() > STALE_SYNC_MS;
}

export default function WearableCard({
  provider,
  name,
  isConnected,
  isConnecting,
  isSyncing,
  lastSyncAt,
  details,
  onConnect,
  onDisconnect,
  onSync,
}: WearableCardProps) {
  const [expanded, setExpanded] = useState(false);
  const stale = isConnected && isStaleSync(lastSyncAt);
  const status = isConnecting
    ? 'CONNECTING…'
    : isConnected
    ? `CONNECTED${lastSyncAt ? ` · synced ${formatLastSync(lastSyncAt)}` : ''}`
    : 'NOT CONNECTED';

  const canExpand = isConnected && (details?.length ?? 0) > 0;

  return (
    <View style={styles.card}>
      <View style={[styles.cardCorner, !isConnected && styles.cardCornerInactive]} />

      <Pressable
        onPress={() => {
          if (!isConnected) {
            onConnect();
          } else if (canExpand) {
            setExpanded((v) => !v);
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${status}`}
        style={styles.cardHeader}
      >
        <View style={styles.cardLogo}>
          <ProviderLogo provider={provider} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>{name}</Text>
          <Text style={styles.cardStatus}>{status}</Text>
          {stale && (
            <View style={styles.staleBadge} accessibilityLabel="Stale sync">
              <View style={styles.staleDot} />
              <Text style={styles.staleLabel}>NOT SYNCED TODAY</Text>
            </View>
          )}
        </View>
        {isConnecting ? (
          <ActivityIndicator color={colors.textSecondary} />
        ) : isConnected ? (
          canExpand ? (
            <View style={styles.detailsHint}>
              <Text style={styles.detailsLabel}>{expanded ? 'HIDE' : 'DETAILS'}</Text>
              <Text style={[styles.detailsChevron, expanded && styles.detailsChevronOpen]}>▾</Text>
            </View>
          ) : null
        ) : (
          <Text style={styles.connectLabel}>CONNECT →</Text>
        )}
      </Pressable>

      {expanded && details && details.length > 0 && (
        <View style={styles.detailsWrap}>
          <View style={styles.detailGrid}>
            {details.map(({ label, value }) => (
              <View key={label} style={styles.detailCell}>
                <Text style={styles.detailCellLabel}>{label.toUpperCase()}</Text>
                <Text style={styles.detailCellValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {isConnected && (onSync || onDisconnect) && (
        <View style={styles.actionsRow}>
          {onSync && (
            <Pressable
              onPress={onSync}
              disabled={isSyncing}
              accessibilityRole="button"
              accessibilityLabel={`Sync ${name} now`}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.actionBtnPressed,
              ]}
            >
              {isSyncing ? (
                <ActivityIndicator color={colors.textPrimary} size="small" />
              ) : (
                <Text style={styles.actionLabel}>SYNC NOW</Text>
              )}
            </Pressable>
          )}
          {onDisconnect && (
            <Pressable
              onPress={onDisconnect}
              accessibilityRole="button"
              accessibilityLabel={`Disconnect ${name}`}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.actionBtnDanger,
                pressed && styles.actionBtnDangerPressed,
              ]}
            >
              <Text style={[styles.actionLabel, styles.actionLabelDanger]}>
                DISCONNECT
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  cardCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    backgroundColor: colors.accent,
  },
  cardCornerInactive: {
    backgroundColor: colors.borderStrong,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  cardLogo: {
    width: 44,
    height: 44,
    borderRadius: 2,
    backgroundColor: colors.bgBase,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardStatus: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginTop: 3,
  },
  detailsHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsLabel: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  detailsChevron: {
    fontSize: 14,
    color: colors.accent,
  },
  detailsChevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  connectLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  detailsWrap: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 14,
  },
  detailCell: {
    width: '31%',
    backgroundColor: colors.bgBase,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  detailCellLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  detailCellValue: {
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: colors.bgElevated,
  },
  actionBtnDanger: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  actionBtnDangerPressed: {
    backgroundColor: colors.bgElevated,
  },
  actionLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  actionLabelDanger: {
    color: colors.accent,
  },
  staleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 2,
  },
  staleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  staleLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1.2,
    color: colors.accent,
    textTransform: 'uppercase',
  },
});
