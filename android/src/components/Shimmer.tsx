import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ShimmerProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Shimmer({ width, height, borderRadius = 8, style }: ShimmerProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      })
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: 'rgba(255,255,255,0.05)',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
