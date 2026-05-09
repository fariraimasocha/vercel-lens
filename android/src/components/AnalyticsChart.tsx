import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Line, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { TimeseriesPoint } from '../models/Analytics';
import { Colors } from '../constants/colors';

interface ChartDataPoint {
  date: Date;
  visitors: number;
}

interface AnalyticsChartProps {
  data: TimeseriesPoint[];
}

function aggregateDaily(points: ChartDataPoint[]): ChartDataPoint[] {
  const grouped: Record<string, number> = {};
  for (const p of points) {
    const key = p.date.toISOString().split('T')[0];
    grouped[key] = (grouped[key] ?? 0) + p.visitors;
  }
  return Object.entries(grouped)
    .map(([key, visitors]) => ({ date: new Date(key), visitors }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

const CHART_HEIGHT = 130;
const PADDING_LEFT = 44;
const PADDING_RIGHT = 12;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 24;

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [containerWidth, setContainerWidth] = useState(300);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lastHapticIndex = useRef<number | null>(null);

  const filteredData = useMemo<ChartDataPoint[]>(() => {
    const raw = data.flatMap(p => (p.date ? [{ date: p.date, visitors: p.devices }] : []));
    return raw.length > 48 ? aggregateDaily(raw) : raw;
  }, [data]);

  const totalVisitors = useMemo(() => filteredData.reduce((s, p) => s + p.visitors, 0), [filteredData]);
  const averageVisitors = filteredData.length > 0 ? totalVisitors / filteredData.length : 0;
  const peakPoint = filteredData.length > 0 ? filteredData.reduce((a, b) => (a.visitors >= b.visitors ? a : b)) : null;

  const drawWidth = containerWidth - PADDING_LEFT - PADDING_RIGHT;
  const drawHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const maxY = useMemo(() => Math.max(...filteredData.map(p => p.visitors), 1), [filteredData]);

  const toX = useCallback(
    (i: number) => PADDING_LEFT + (i / Math.max(filteredData.length - 1, 1)) * drawWidth,
    [filteredData.length, drawWidth]
  );
  const toY = useCallback(
    (v: number) => PADDING_TOP + (1 - v / maxY) * drawHeight,
    [maxY, drawHeight]
  );

  const linePath = useMemo(() => {
    if (filteredData.length < 2) return '';
    return filteredData
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.visitors)}`)
      .join(' ');
  }, [filteredData, toX, toY]);

  const areaPath = useMemo(() => {
    if (filteredData.length < 2) return '';
    const bottom = PADDING_TOP + drawHeight;
    const line = filteredData
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.visitors)}`)
      .join(' ');
    return `${line} L ${toX(filteredData.length - 1)} ${bottom} L ${toX(0)} ${bottom} Z`;
  }, [filteredData, toX, toY, drawHeight]);

  const avgY = toY(averageVisitors);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: e => {
          const x = e.nativeEvent.locationX;
          const idx = Math.round(((x - PADDING_LEFT) / drawWidth) * (filteredData.length - 1));
          const clamped = Math.max(0, Math.min(filteredData.length - 1, idx));
          if (lastHapticIndex.current !== clamped) {
            Haptics.selectionAsync();
            lastHapticIndex.current = clamped;
          }
          setSelectedIndex(clamped);
        },
        onPanResponderMove: e => {
          const x = e.nativeEvent.locationX;
          const idx = Math.round(((x - PADDING_LEFT) / drawWidth) * (filteredData.length - 1));
          const clamped = Math.max(0, Math.min(filteredData.length - 1, idx));
          if (lastHapticIndex.current !== clamped) {
            Haptics.selectionAsync();
            lastHapticIndex.current = clamped;
          }
          setSelectedIndex(clamped);
        },
        onPanResponderRelease: () => {
          setSelectedIndex(null);
          lastHapticIndex.current = null;
        },
        onPanResponderTerminate: () => {
          setSelectedIndex(null);
          lastHapticIndex.current = null;
        },
      }),
    [filteredData.length, drawWidth]
  );

  const selectedPoint = selectedIndex !== null ? filteredData[selectedIndex] : null;
  const selX = selectedIndex !== null ? toX(selectedIndex) : null;
  const selY = selectedPoint !== null ? toY(selectedPoint.visitors) : null;

  if (filteredData.length === 0) {
    return (
      <View style={styles.empty}>
        <Feather name="trending-up" size={36} color={Colors.textTertiary} />
        <Text style={styles.emptyText}>No visitor data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartLabel}>VISITORS</Text>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.totalText}>
            {selectedPoint ? selectedPoint.visitors.toLocaleString() : totalVisitors.toLocaleString()}
          </Text>
          {selectedPoint ? (
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>{formatShortDate(selectedPoint.date)}</Text>
            </View>
          ) : peakPoint ? (
            <View style={styles.peakBadge}>
              <Text style={styles.peakText}>↑ Peak {peakPoint.visitors.toLocaleString()}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View
        style={styles.svgContainer}
        onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <Svg width={containerWidth} height={CHART_HEIGHT}>
          <Defs>
            <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.32" />
              <Stop offset="55%" stopColor="#3B82F6" stopOpacity="0.10" />
              <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </SvgGradient>
            <SvgGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#3B82F6" />
              <Stop offset="100%" stopColor="#74A8FF" />
            </SvgGradient>
          </Defs>

          {/* Average reference line */}
          {averageVisitors > 0 && (
            <Line
              x1={PADDING_LEFT}
              y1={avgY}
              x2={containerWidth - PADDING_RIGHT}
              y2={avgY}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          )}

          {/* Area fill */}
          <Path d={areaPath} fill="url(#areaGrad)" />

          {/* Line */}
          <Path d={linePath} stroke="url(#lineGrad)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Selected vertical rule */}
          {selX !== null && (
            <Line
              x1={selX}
              y1={PADDING_TOP}
              x2={selX}
              y2={PADDING_TOP + drawHeight}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1}
            />
          )}

          {/* Selected point glow + dot */}
          {selX !== null && selY !== null && (
            <>
              <Circle cx={selX} cy={selY} r={10} fill="rgba(59,130,246,0.18)" />
              <Circle cx={selX} cy={selY} r={4} fill="white" />
            </>
          )}

          {/* Y axis grid lines */}
          {[0, 0.5, 1].map((frac, i) => {
            const v = Math.round(maxY * frac);
            const y = toY(v);
            return (
              <Line
                key={i}
                x1={PADDING_LEFT}
                y1={y}
                x2={containerWidth - PADDING_RIGHT}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={0.5}
              />
            );
          })}
        </Svg>

        {/* Y axis labels overlay (SVG text is hard to style) */}
        {[0, 0.5, 1].map((frac, i) => {
          if (i === 0) return null;
          const v = Math.round(maxY * frac);
          const y = toY(v);
          return (
            <Text key={i} style={[styles.axisLabel, { position: 'absolute', left: 2, top: y - 7 }]}>
              {formatNumber(v)}
            </Text>
          );
        })}

        {/* X axis labels */}
        {filteredData.length >= 2 &&
          [0, Math.floor(filteredData.length / 2), filteredData.length - 1].map((idx, i) => {
            const p = filteredData[idx];
            if (!p) return null;
            const x = toX(idx);
            return (
              <Text
                key={i}
                style={[
                  styles.axisLabel,
                  {
                    position: 'absolute',
                    bottom: 2,
                    left: x - 20,
                    width: 40,
                    textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center',
                  },
                ]}
              >
                {formatShortDate(p.date)}
              </Text>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  chartHeader: {
    gap: 4,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.4,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  dateBadge: {
    backgroundColor: 'rgba(59,130,246,0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  dateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.blue,
  },
  peakBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  peakText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  svgContainer: {
    width: '100%',
    height: CHART_HEIGHT,
    position: 'relative',
  },
  axisLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
  },
});
