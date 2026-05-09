import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { BreakdownItem } from '../models/Analytics';
import { Colors } from '../constants/colors';

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', CA: '🇨🇦', AU: '🇦🇺',
  IN: '🇮🇳', BR: '🇧🇷', JP: '🇯🇵', CN: '🇨🇳', KR: '🇰🇷', NL: '🇳🇱',
  SE: '🇸🇪', NO: '🇳🇴', CH: '🇨🇭', PL: '🇵🇱', RU: '🇷🇺', ES: '🇪🇸',
  IT: '🇮🇹', PT: '🇵🇹', MX: '🇲🇽', AR: '🇦🇷', ZA: '🇿🇦', NG: '🇳🇬',
  EG: '🇪🇬', TR: '🇹🇷', SG: '🇸🇬', HK: '🇭🇰', TW: '🇹🇼', ID: '🇮🇩',
  TH: '🇹🇭', VN: '🇻🇳', PH: '🇵🇭', PK: '🇵🇰', BD: '🇧🇩', UA: '🇺🇦',
  CZ: '🇨🇿', AT: '🇦🇹', BE: '🇧🇪', FI: '🇫🇮', DK: '🇩🇰', GR: '🇬🇷',
  RO: '🇷🇴', HU: '🇭🇺', SK: '🇸🇰', HR: '🇭🇷', BG: '🇧🇬', RS: '🇷🇸',
  IL: '🇮🇱', SA: '🇸🇦', AE: '🇦🇪', IR: '🇮🇷', IQ: '🇮🇶', CO: '🇨🇴',
  CL: '🇨🇱', PE: '🇵🇪', VE: '🇻🇪', NZ: '🇳🇿', IE: '🇮🇪',
};

interface BreakdownCardProps {
  icon: React.ReactNode;
  title: string;
  items: BreakdownItem[];
  showAsCountry?: boolean;
  showAsPercent?: boolean;
  total?: number;
  isEmpty?: boolean;
}

export function BreakdownCard({
  icon,
  title,
  items,
  showAsCountry = false,
  showAsPercent = false,
  total,
  isEmpty = false,
}: BreakdownCardProps) {
  const displayItems = items.slice(0, 8);
  const maxVisitors = displayItems.length > 0 ? displayItems[0].visitors : 1;

  function renderKey(key: string): string {
    if (!key || key === '') return 'Direct';
    if (showAsCountry) {
      const flag = COUNTRY_FLAGS[key.toUpperCase()] ?? '🌍';
      return `${flag} ${key}`;
    }
    return key;
  }

  function renderValue(item: BreakdownItem): string {
    if (showAsPercent && total && total > 0) {
      return `${Math.round((item.visitors / total) * 100)}%`;
    }
    if (item.visitors >= 1000) return `${(item.visitors / 1000).toFixed(1)}K`;
    return `${item.visitors}`;
  }

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>

      <View style={styles.divider} />

      {isEmpty || displayItems.length === 0 ? (
        <Text style={styles.emptyText}>No data</Text>
      ) : (
        <View style={styles.rows}>
          {displayItems.map((item, i) => {
            const barWidth = maxVisitors > 0 ? (item.visitors / maxVisitors) * 100 : 0;
            return (
              <View key={item.key + i} style={styles.row}>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { width: `${barWidth}%` }]} />
                  <Text style={styles.rowKey} numberOfLines={1}>{renderKey(item.key)}</Text>
                </View>
                <Text style={styles.rowValue}>{renderValue(item)}</Text>
              </View>
            );
          })}
        </View>
      )}
      <View style={styles.border} pointerEvents="none" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    gap: 12,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 1.2,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  rows: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  barContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    height: 20,
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(59,130,246,0.22)',
    borderRadius: 3,
  },
  rowKey: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
    zIndex: 1,
    paddingHorizontal: 4,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    minWidth: 40,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textDisabled,
    textAlign: 'center',
    paddingVertical: 8,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
