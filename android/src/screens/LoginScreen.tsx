import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../auth/AuthManager';

// ─── Demo Chart ─────────────────────────────────────────────────────────────

const POINTS = [0.3, 0.5, 0.25, 0.7, 0.4, 0.85, 0.6, 0.9, 0.55, 0.95];

function DemoChart() {
  const drawProgress = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(280);
  const H = 90;

  const toX = (i: number) => (i / (POINTS.length - 1)) * containerWidth;
  const toY = (v: number) => H * (1 - v);

  const linePath = POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(p).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${containerWidth} ${H} L 0 ${H} Z`;

  useEffect(() => {
    const runLoop = () => {
      drawProgress.setValue(0);
      Animated.timing(drawProgress, { toValue: 1, duration: 2500, useNativeDriver: false }).start(() => {
        setTimeout(runLoop, 1500);
      });
    };
    runLoop();
  }, []);

  return (
    <View onLayout={e => setContainerWidth(e.nativeEvent.layout.width)} style={{ width: '100%', height: H }}>
      <Svg width={containerWidth} height={H}>
        <Defs>
          <SvgGrad id="demoArea" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
            <Stop offset="55%" stopColor="#3B82F6" stopOpacity="0.10" />
            <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </SvgGrad>
          <SvgGrad id="demoLine" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#74A8FF" />
          </SvgGrad>
        </Defs>
        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((frac, i) => (
          <Path
            key={i}
            d={`M 0 ${H * frac} L ${containerWidth} ${H * frac}`}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={0.5}
          />
        ))}
        <Path d={areaPath} fill="url(#demoArea)" />
        <Path d={linePath} stroke="url(#demoLine)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {POINTS.map((p, i) => (
          <Circle key={i} cx={toX(i)} cy={toY(p)} r={3} fill="#3B82F6" />
        ))}
      </Svg>
    </View>
  );
}

// ─── Step Row ────────────────────────────────────────────────────────────────

function StepRow({ number, text }: { number: number; text: string }) {
  return (
    <View style={stepStyles.row}>
      <View style={stepStyles.circle}>
        <Text style={stepStyles.number}>{number}</Text>
      </View>
      <Text style={stepStyles.text}>{text}</Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  circle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.06)',
  },
  number: { fontSize: 11, fontWeight: '800', color: Colors.textPrimary },
  text: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, flex: 1 },
});

// ─── Main LoginScreen ─────────────────────────────────────────────────────────

export function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
  const [showTokenField, setShowTokenField] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleLogin = async () => {
    await login(tokenInput.trim());
  };

  const openVercel = () => Linking.openURL('https://vercel.com/account/tokens');

  // ── Welcome view ──
  if (!showTokenField) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeInner}>
          <View style={{ flex: 1 }} />
          <BrandingHeader />
          <View style={{ height: 40 }} />
          <View style={{ paddingHorizontal: 40 }}>
            <DemoChart />
          </View>
          <View style={{ flex: 1 }} />
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            onPress={() => setShowTokenField(true)}
          >
            <LinearGradient colors={['#ffffff', 'rgba(255,255,255,0.92)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.primaryBtnGrad}>
              <Text style={styles.primaryBtnIcon}>▲</Text>
              <Text style={styles.primaryBtnText}>Sign in with Vercel</Text>
              <Feather name="arrow-right" size={16} color="#000" />
            </LinearGradient>
          </Pressable>
          <View style={{ height: 50 }} />
        </View>
      </View>
    );
  }

  // ── Token field view ──
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 60 }} />
        <BrandingHeader />

        {error && (
          <View style={styles.errorRow}>
            <Feather name="alert-triangle" size={15} color={Colors.red} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.tokenSection}>
          {/* Steps card */}
          <LinearGradient
            colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.stepsCard}
          >
            <Text style={styles.stepsTitle}>How to get your token</Text>
            <View style={{ gap: 12 }}>
              <StepRow number={1} text="Go to vercel.com/account/tokens" />
              <StepRow number={2} text='Tap "Create Token"' />
              <StepRow number={3} text="Name it anything (e.g. VercelLens)" />
              <StepRow number={4} text="Set scope to your account" />
              <StepRow number={5} text="Copy and paste below" />
            </View>
            <View style={styles.cardBorder} pointerEvents="none" />
          </LinearGradient>

          {/* Open Vercel button */}
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={openVercel}
          >
            <Feather name="external-link" size={13} color={Colors.textSecondary} />
            <Text style={styles.secondaryBtnText}>Open Vercel Tokens Page</Text>
          </Pressable>

          {/* Token input */}
          <TextInput
            style={[styles.tokenInput, { borderColor: isFocused ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)', borderWidth: isFocused ? 1 : 0.5 }]}
            placeholder="Paste your Vercel token"
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={tokenInput}
            onChangeText={setTokenInput}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Connect button */}
          <Pressable
            style={({ pressed }) => [{ opacity: (tokenInput.length === 0 || isLoading) ? 0.5 : pressed ? 0.88 : 1 }]}
            onPress={handleLogin}
            disabled={tokenInput.length === 0 || isLoading}
          >
            <LinearGradient
              colors={tokenInput.length > 0 ? ['#ffffff', 'rgba(255,255,255,0.92)'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.12)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.connectBtn}
            >
              {isLoading ? (
                <ActivityIndicator color="black" />
              ) : (
                <>
                  <Text style={styles.connectBtnText}>Connect</Text>
                  <Feather name="arrow-right" size={16} color={tokenInput.length > 0 ? '#000' : Colors.textTertiary} />
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function BrandingHeader() {
  return (
    <View style={styles.brandingHeader}>
      <View style={styles.logoPlaceholder}>
        <Text style={styles.logoText}>▲</Text>
      </View>
      <View style={{ gap: 6 }}>
        <Text style={styles.appTitle}>VercelLens</Text>
        <Text style={styles.appSubtitle}>Analytics for your Vercel projects</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  welcomeInner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  brandingHeader: {
    alignItems: 'center',
    gap: 20,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  logoText: {
    fontSize: 40,
    color: Colors.textPrimary,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  primaryBtn: {
    marginHorizontal: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    gap: 8,
    borderRadius: 16,
  },
  primaryBtnIcon: { fontSize: 14, fontWeight: '900', color: '#000' },
  primaryBtnText: { fontSize: 16, fontWeight: '900', color: '#000' },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    backgroundColor: 'rgba(255,107,107,0.1)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,107,107,0.3)',
  },
  errorText: { fontSize: 12, fontWeight: '600', color: Colors.red, flex: 1 },
  tokenSection: {
    gap: 16,
    marginTop: 32,
  },
  stepsCard: {
    borderRadius: 18,
    padding: 18,
    gap: 16,
    position: 'relative',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  secondaryBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  tokenInput: {
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 15,
    color: Colors.textPrimary,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  connectBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  connectBtnText: { fontSize: 16, fontWeight: '900', color: '#000' },
});
