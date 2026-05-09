import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as StoreReview from 'expo-store-review';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface RowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  url?: string;
  onPress?: () => void;
}

function AboutRow({ icon, title, subtitle, url, onPress }: RowProps) {
  const handlePress = () => {
    if (onPress) { onPress(); return; }
    if (url) Linking.openURL(url);
  };
  const isInteractive = !!url || !!onPress;

  return (
    <Pressable
      onPress={isInteractive ? handlePress : undefined}
      style={({ pressed }) => [styles.row, { opacity: isInteractive && pressed ? 0.7 : 1 }]}
    >
      <View style={styles.iconBox}>
        {icon}
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
      {isInteractive && <Feather name="chevron-right" size={16} color={Colors.textTertiary} />}
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <LinearGradient
        colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sectionCard}
      >
        {children}
        <View style={styles.sectionBorder} pointerEvents="none" />
      </LinearGradient>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

export function AboutScreen() {
  const { top } = useSafeAreaInsets();
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'VercelLens — Vercel Web Analytics on your phone. Open source, no ads.\n\nhttps://verceltics.com',
      });
    } catch {}
  };

  const handleRate = async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + 8 }]}>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* SUPPORT */}
        <Section title="SUPPORT">
          <AboutRow icon={<Feather name="star" size={18} color={Colors.textSecondary} />} title="Rate VercelLens" subtitle="Tap a star in the Play Store" onPress={handleRate} />
          <Divider />
          <AboutRow icon={<Feather name="share-2" size={18} color={Colors.textSecondary} />} title="Share VercelLens" subtitle="Tell others about the app" onPress={handleShare} />
          <Divider />
          <AboutRow icon={<Feather name="github" size={18} color={Colors.textSecondary} />} title="Star on GitHub" subtitle="github.com/fariraimasocha/vercel-lens" url="https://github.com/fariraimasocha/vercel-lens" />
        </Section>

        {/* APP */}
        <Section title="APP">
          <AboutRow icon={<Feather name="refresh-cw" size={18} color={Colors.textSecondary} />} title="Check for Updates" subtitle="Stay on the latest version" url="https://play.google.com/store/apps/details?id=com.verceltics.app" />
        </Section>

        {/* LINKS */}
        <Section title="LINKS">
          <AboutRow icon={<Feather name="globe" size={18} color={Colors.textSecondary} />} title="Website" subtitle="vercellense.fariraimasocha.co.zw" url="https://vercellense.fariraimasocha.co.zw" />
          <Divider />
          <AboutRow icon={<Feather name="code" size={18} color={Colors.textSecondary} />} title="Source Code" subtitle="github.com/fariraimasocha/vercel-lens" url="https://github.com/fariraimasocha/vercel-lens" />
          <Divider />
          <AboutRow icon={<Feather name="linkedin" size={18} color={Colors.textSecondary} />} title="Follow on LinkedIn" subtitle="linkedin.com/in/fariraimasocha" url="https://www.linkedin.com/in/fariraimasocha/" />
          <Divider />
          <AboutRow icon={<Feather name="twitter" size={18} color={Colors.textSecondary} />} title="Follow on X" subtitle="@fariraijames" url="https://x.com/fariraijames" />
        </Section>

        {/* HELP */}
        <Section title="HELP">
          <AboutRow icon={<Feather name="mail" size={18} color={Colors.textSecondary} />} title="Contact" subtitle="fariraimasocha@gmail.com" url="mailto:fariraimasocha@gmail.com" />
          <Divider />
          <AboutRow icon={<Feather name="alert-circle" size={18} color={Colors.textSecondary} />} title="Report an Issue" subtitle="Open a GitHub issue" url="https://github.com/fariraimasocha/vercel-lens/issues" />
        </Section>

        {/* LEGAL */}
        <Section title="LEGAL">
          <AboutRow icon={<Feather name="shield" size={18} color={Colors.textSecondary} />} title="Privacy Policy" subtitle="verceltics.com/privacy" url="https://verceltics.com/privacy" />
          <Divider />
          <AboutRow icon={<Feather name="file-text" size={18} color={Colors.textSecondary} />} title="Terms of Service" subtitle="verceltics.com/terms" url="https://verceltics.com/terms" />
          <Divider />
          <AboutRow icon={<Feather name="check-circle" size={18} color={Colors.textSecondary} />} title="License" subtitle="MIT License" url="https://github.com/fariraimasocha/vercel-lens/blob/main/LICENSE" />
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerBuiltRow}>
            <Text style={styles.footerBuilt}>Built with </Text>
            <Feather name="heart" size={12} color="rgba(255,255,255,0.4)" />
            <Text style={styles.footerBuilt}> by Farirai Masocha</Text>
          </View>
          <Text style={styles.footerDisclaimer}>
            VercelLens is not affiliated with, endorsed by, or sponsored by Vercel Inc.
            Vercel and the Vercel logo are trademarks of Vercel Inc.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  content: {
    paddingBottom: 40,
    gap: 24,
  },
  section: {
    gap: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.4,
    paddingHorizontal: 6,
  },
  sectionCard: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  sectionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 62,
  },
  footer: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 1,
  },
  footerBuiltRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBuilt: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  footerDisclaimer: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.22)',
    textAlign: 'center',
    lineHeight: 17,
  },
});
