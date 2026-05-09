import React, { useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../auth/AuthManager';
import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { StatCard } from '../components/StatCard';
import { BreakdownCard } from '../components/BreakdownCard';
import { Shimmer } from '../components/Shimmer';
import { BottomSheet, BottomSheetOption } from '../components/BottomSheet';
import { Colors } from '../constants/colors';
import {
  TIME_RANGES,
  ENVIRONMENTS,
  TimeRangeConfig,
  EnvironmentConfig,
  getVisitorsChange,
  getPageViewsChange,
  getBounceRateChange,
} from '../models/Analytics';
import type { RootStackParamList } from '../../App';

type RouteProps = RouteProp<RootStackParamList, 'Analytics'>;

function formatNumber(n: number | undefined): string {
  if (n == null) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

function formatPercent(n: number | undefined): string {
  if (n == null) return '—';
  return `${Math.round(n)}%`;
}

function AnalyticsSkeleton() {
  return (
    <View style={skStyles.container}>
      <View style={skStyles.statsRow}>
        {[0, 1, 2].map(i => (
          <View key={i} style={skStyles.statCard}>
            <Shimmer width="60%" height={11} borderRadius={4} />
            <Shimmer width="80%" height={28} borderRadius={6} />
            <Shimmer width="40%" height={18} borderRadius={8} />
          </View>
        ))}
      </View>
      <Shimmer width="100%" height={160} borderRadius={18} />
      <View style={skStyles.grid}>
        {[0, 1, 2, 3].map(i => (
          <Shimmer key={i} width="100%" height={140} borderRadius={18} />
        ))}
      </View>
    </View>
  );
}

const skStyles = StyleSheet.create({
  container: { gap: 12 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: 14, gap: 10 },
  grid: { gap: 10 },
});

export function AnalyticsScreen() {
  const { top } = useSafeAreaInsets();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { projectId, projectName, teamId, domain, framework } = route.params;

  const token = useAuthStore(s => s.accounts.find(a => a.id === s.activeAccountId)?.token);
  const [timeRange, setTimeRange] = useState<TimeRangeConfig>(TIME_RANGES[1]);
  const [environment, setEnvironment] = useState<EnvironmentConfig>(ENVIRONMENTS[0]);

  const { data, isLoading, error, lastUpdated, load } = useAnalytics(projectId, teamId, token ?? '');

  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTitle, setSheetTitle] = useState('');
  const [sheetOptions, setSheetOptions] = useState<BottomSheetOption[]>([]);

  useEffect(() => {
    if (token) load(timeRange, environment);
  }, [timeRange, environment, token]);

  const showTimeRangePicker = () => {
    setSheetTitle('Time Range');
    setSheetOptions(
      TIME_RANGES.map(r => ({
        label: r.label,
        checked: r.key === timeRange.key,
        onPress: () => setTimeRange(r),
      }))
    );
    setSheetVisible(true);
  };

  const showEnvironmentPicker = () => {
    setSheetTitle('Environment');
    setSheetOptions(
      ENVIRONMENTS.map(e => ({
        label: e.label,
        checked: e.key === environment.key,
        onPress: () => setEnvironment(e),
      }))
    );
    setSheetVisible(true);
  };

  const isAnalyticsNotEnabled = !!error && (error.includes('Web Analytics') || error.includes('400'));

  const visitorsChange = getVisitorsChange(data);
  const pageViewsChange = getPageViewsChange(data);
  const bounceRateChange = getBounceRateChange(data);
  const totalDevices = data.overview?.devices ?? 0;

  const lastUpdatedText = lastUpdated
    ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : '';

  return (
    <View style={styles.container}>
      <BottomSheet
        visible={sheetVisible}
        title={sheetTitle}
        options={sheetOptions}
        onClose={() => setSheetVisible(false)}
      />
      {/* Navigation header */}
      <View style={[styles.navHeader, { paddingTop: top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.navTitleArea}>
          <Text style={styles.navTitle} numberOfLines={1}>{projectName}</Text>
          {domain && (
            <Pressable onPress={() => Linking.openURL(`https://${domain}`)}>
              <Text style={styles.navDomain} numberOfLines={1}>{domain}</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.navActions}>
          <Pressable onPress={showEnvironmentPicker} style={styles.envBtn}>
            <Text style={styles.envBtnText}>{environment.label}</Text>
          </Pressable>
          <Pressable onPress={showTimeRangePicker} style={styles.rangeBtn}>
            <Text style={styles.rangeBtnText}>{timeRange.shortLabel}</Text>
          </Pressable>
        </View>
      </View>

      {/* Last updated */}
      {lastUpdatedText ? (
        <View style={styles.updatedRow}>
          <View style={styles.greenDot} />
          <Text style={styles.updatedText}>{lastUpdatedText}</Text>
        </View>
      ) : null}

      {/* Content */}
      {isLoading ? (
        <View style={styles.content}>
          <AnalyticsSkeleton />
        </View>
      ) : isAnalyticsNotEnabled ? (
        <View style={styles.centerState}>
          <View style={styles.enableIconWrap}>
            <Feather name="bar-chart-2" size={36} color={Colors.textTertiary} />
          </View>
          <Text style={styles.enableTitle}>Analytics Not Enabled</Text>
          <Text style={styles.enableDesc}>
            Web Analytics is not enabled for this project. Enable it in your Vercel project settings to start tracking visitors and page views.
          </Text>
          <Pressable
            style={styles.enableBtn}
            onPress={() => Linking.openURL('https://vercel.com/dashboard')}
          >
            <Text style={styles.enableBtnText}>Open Vercel Dashboard</Text>
          </Pressable>
          <Pressable style={styles.retryBtn} onPress={() => load(timeRange, environment)}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Feather name="alert-triangle" size={28} color={Colors.red} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => load(timeRange, environment)}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => load(timeRange, environment)}
              tintColor={Colors.textSecondary}
            />
          }
        >
          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatCard
              title="Visitors"
              value={formatNumber(data.overview?.devices)}
              change={visitorsChange}
              icon={<Feather name="users" size={12} color={Colors.textTertiary} />}
              appearDelay={0}
            />
            <StatCard
              title="Page Views"
              value={formatNumber(data.overview?.total)}
              change={pageViewsChange}
              icon={<Feather name="eye" size={12} color={Colors.textTertiary} />}
              appearDelay={0.08}
            />
            <StatCard
              title="Bounce"
              value={formatPercent(data.overview?.bounceRate)}
              change={bounceRateChange}
              invertChange
              icon={<Feather name="rotate-ccw" size={12} color={Colors.textTertiary} />}
              appearDelay={0.16}
            />
          </View>

          {/* Chart */}
          <LinearGradient
            colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chartCard}
          >
            <AnalyticsChart data={data.timeseries} />
            <View style={styles.cardBorder} pointerEvents="none" />
          </LinearGradient>

          {/* Breakdown grid */}
          <View style={styles.grid}>
            <BreakdownCard icon={<Feather name="file-text" size={13} color={Colors.textTertiary} />} title="Pages" items={data.pages} />
            <BreakdownCard icon={<Feather name="shuffle" size={13} color={Colors.textTertiary} />} title="Routes" items={data.routes} />
            <BreakdownCard icon={<Feather name="globe" size={13} color={Colors.textTertiary} />} title="Countries" items={data.countries} showAsCountry showAsPercent total={totalDevices} />
            <BreakdownCard icon={<Feather name="link" size={13} color={Colors.textTertiary} />} title="Referrers" items={data.referrers} />
            <BreakdownCard icon={<Feather name="monitor" size={13} color={Colors.textTertiary} />} title="Devices" items={data.devices} showAsPercent total={totalDevices} />
            <BreakdownCard icon={<Feather name="chrome" size={13} color={Colors.textTertiary} />} title="Browsers" items={data.browsers} showAsPercent total={totalDevices} />
            <BreakdownCard icon={<Feather name="cpu" size={13} color={Colors.textTertiary} />} title="OS" items={data.os} showAsPercent total={totalDevices} />
            <BreakdownCard icon={<Feather name="home" size={13} color={Colors.textTertiary} />} title="Hostnames" items={data.hostnames} />
            <BreakdownCard icon={<Feather name="tag" size={13} color={Colors.textTertiary} />} title="UTM Parameters" items={data.utmSources} />
            <BreakdownCard icon={<Feather name="zap" size={13} color={Colors.textTertiary} />} title="Events" items={data.events} />
            <BreakdownCard icon={<Feather name="flag" size={13} color={Colors.textTertiary} />} title="Flags" items={data.flags} />
            <BreakdownCard icon={<Feather name="help-circle" size={13} color={Colors.textTertiary} />} title="Query Params" items={data.queryParams} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleArea: {
    flex: 1,
    gap: 2,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  navDomain: {
    fontSize: 12,
    color: Colors.blue,
    fontWeight: '500',
  },
  navActions: {
    flexDirection: 'row',
    gap: 6,
  },
  envBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  envBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  rangeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  rangeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  updatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green,
  },
  updatedText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chartCard: {
    borderRadius: 18,
    padding: 16,
    position: 'relative',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  grid: {
    gap: 12,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 36,
  },
  enableIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  enableTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  enableDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  enableBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  enableBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  errorText: { fontSize: 14, color: Colors.red, textAlign: 'center', fontWeight: '600' },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  retryText: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
});
