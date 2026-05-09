import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FrameworkColors } from '../constants/colors';
import { Project, getPrimaryDomain, getLastDeployment, getTeamId } from '../models/Project';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onLongPress: () => void;
  index?: number;
}

function timeAgo(date: Date): string {
  const secs = (Date.now() - date.getTime()) / 1000;
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function isLiveDeployment(date: Date | undefined): boolean {
  if (!date) return false;
  return Date.now() - date.getTime() < 30 * 60 * 1000;
}

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function frameworkColor(framework?: string): string {
  if (!framework) return 'rgba(255,255,255,0.3)';
  return FrameworkColors[framework.toLowerCase()] ?? 'rgba(255,255,255,0.3)';
}

export function ProjectCard({ project, onPress, onLongPress, index = 0 }: ProjectCardProps) {
  const domain = getPrimaryDomain(project);
  const lastDeploy = getLastDeployment(project);
  const deployDate = lastDeploy?.createdAt ? new Date(lastDeploy.createdAt) : undefined;
  const isLive = isLiveDeployment(deployDate);
  const commitMsg = lastDeploy?.meta?.githubCommitMessage;
  const gitOrg = project.link?.org;
  const gitRepo = project.link?.repo;

  const [faviconUri, setFaviconUri] = useState<string | undefined>(undefined);
  const dotAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay: index * 60, useNativeDriver: true, damping: 14, stiffness: 100 }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
          Animated.timing(dotAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isLive]);

  useEffect(() => {
    if (domain) {
      setFaviconUri(getFaviconUrl(domain));
    }
  }, [domain]);

  const fwColor = frameworkColor(project.framework);

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ translateY }] }]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, damping: 12, stiffness: 200 }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200 }).start()}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LinearGradient
            colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.faviconWrapper}>
                {faviconUri ? (
                  <Image source={{ uri: faviconUri }} style={styles.favicon} onError={() => setFaviconUri(undefined)} />
                ) : (
                  <View style={[styles.faviconFallback, { backgroundColor: fwColor + '33' }]}>
                    <Text style={[styles.faviconLetter, { color: fwColor }]}>
                      {project.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.headerInfo}>
                <Text style={styles.projectName} numberOfLines={1}>{project.name}</Text>
                {domain && <Text style={styles.domain} numberOfLines={1}>{domain}</Text>}
              </View>

              <View style={styles.indicators}>
                {isLive && (
                  <Animated.View style={[styles.liveDot, { opacity: dotAnim }]} />
                )}
                <View style={[styles.frameworkDot, { backgroundColor: fwColor }]} />
              </View>
            </View>

            {/* Git info */}
            {(gitOrg || gitRepo) && (
              <View style={styles.gitRow}>
                <Text style={styles.gitText} numberOfLines={1}>
                  {gitOrg && gitRepo ? `${gitOrg}/${gitRepo}` : gitRepo ?? gitOrg}
                </Text>
              </View>
            )}

            {/* Commit message */}
            {commitMsg && (
              <Text style={styles.commitMsg} numberOfLines={2}>{commitMsg}</Text>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              {project.framework && (
                <View style={[styles.frameworkBadge, { borderColor: fwColor + '44' }]}>
                  <Text style={[styles.frameworkText, { color: fwColor }]}>{project.framework}</Text>
                </View>
              )}
              {deployDate && (
                <Text style={styles.deployTime}>{timeAgo(deployDate)}</Text>
              )}
            </View>
          </LinearGradient>
          <View style={styles.border} pointerEvents="none" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faviconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  favicon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  faviconFallback: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faviconLetter: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  domain: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  frameworkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gitText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '400',
  },
  commitMsg: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  frameworkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  frameworkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deployTime: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
