import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  invertChange?: boolean;
  icon: React.ReactNode;
  appearDelay?: number;
}

export function StatCard({ title, value, change, invertChange = false, icon, appearDelay = 0 }: StatCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: appearDelay * 1000, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay: appearDelay * 1000, useNativeDriver: true, damping: 15, stiffness: 120 }),
    ]).start();
  }, []);

  const isPositive = change == null ? true : invertChange ? change <= 0 : change >= 0;
  const changeColor = change == null ? Colors.textTertiary : isPositive ? Colors.green : Colors.red;

  let changeText: string | undefined;
  if (change != null) {
    const prefix = change >= 0 ? '+' : '';
    changeText = `${prefix}${Math.round(change)}%`;
  }

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ translateY }] }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            {icon}
            <Text style={styles.title}>{title.toUpperCase()}</Text>
          </View>

          <Text style={styles.value}>{value}</Text>

          {changeText ? (
            <View style={[styles.badge, { backgroundColor: `${changeColor}22`, borderColor: `${changeColor}33` }]}>
              <Feather name={isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={changeColor} />
              <Text style={[styles.badgeText, { color: changeColor }]}>{changeText}</Text>
            </View>
          ) : (
            <Text style={styles.dash}>—</Text>
          )}
        </View>
      </LinearGradient>
      <View style={styles.border} pointerEvents="none" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    flex: 1,
  },
  inner: {
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 1.2,
  },
  value: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    lineHeight: 34,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 0.5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  dash: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDisabled,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
  },
});
