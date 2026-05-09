import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet, BottomSheetOption } from '../components/BottomSheet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { fetchProjects } from '../network/VercelAPI';
import { useAuthStore, selectActiveAccount } from '../auth/AuthManager';
import { Project, getPrimaryDomain, getTeamId } from '../models/Project';
import { ProjectCard } from '../components/ProjectCard';
import { Shimmer } from '../components/Shimmer';
import { Colors } from '../constants/colors';
import type { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function ProjectsSkeleton() {
  return (
    <View style={skeletonStyles.container}>
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={skeletonStyles.card}>
          <View style={skeletonStyles.header}>
            <Shimmer width={40} height={40} borderRadius={10} />
            <View style={{ gap: 6, flex: 1 }}>
              <Shimmer width="70%" height={14} borderRadius={6} />
              <Shimmer width="50%" height={11} borderRadius={4} />
            </View>
          </View>
          <Shimmer width="90%" height={11} borderRadius={4} />
          <Shimmer width="60%" height={11} borderRadius={4} />
        </View>
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: { gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  header: { flexDirection: 'row', gap: 12 },
});

export function ProjectsScreen({ startWithSearch = false }: { startWithSearch?: boolean }) {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const activeAccount = useAuthStore(selectActiveAccount);
  const accounts = useAuthStore(s => s.accounts);
  const activeAccountId = useAuthStore(s => s.activeAccountId);
  const switchAccount = useAuthStore(s => s.switchAccount);
  const removeAccount = useAuthStore(s => s.removeAccount);
  const logoutAll = useAuthStore(s => s.logoutAll);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [_showAddAccount, setShowAddAccount] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTitle, setSheetTitle] = useState('');
  const [sheetOptions, setSheetOptions] = useState<BottomSheetOption[]>([]);

  const loadProjects = useCallback(
    async (refresh = false) => {
      if (!activeAccount) return;
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(undefined);
      try {
        const data = await fetchProjects(activeAccount.token);
        setProjects(data);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load projects.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeAccount]
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    if (!q) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            (getPrimaryDomain(p) ?? '').toLowerCase().includes(q) ||
            (p.framework ?? '').toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, projects]);

  const showAccountMenu = () => {
    setSheetTitle('Accounts');
    setSheetOptions([
      ...accounts.map(a => ({
        label: a.name,
        checked: a.id === activeAccountId,
        onPress: () => switchAccount(a.id),
      })),
      { label: 'Add Account', onPress: () => setShowAddAccount(true) },
      { label: 'Sign Out', destructive: true, onPress: () => removeAccount(activeAccountId!) },
      { label: 'Sign Out All', destructive: true, onPress: logoutAll },
    ]);
    setSheetVisible(true);
  };

  const showProjectActions = (project: Project) => {
    const domain = getPrimaryDomain(project);
    const websiteUrl = domain ? `https://${domain}` : undefined;
    const vercelUrl = `https://vercel.com/${project.name}`;

    const opts: BottomSheetOption[] = [
      ...(websiteUrl ? [{ label: 'Open Website', onPress: () => Linking.openURL(websiteUrl) }] : []),
      ...(domain ? [{ label: 'Copy URL', onPress: () => Clipboard.setStringAsync(`https://${domain}`) }] : []),
      { label: 'View on Vercel', onPress: () => Linking.openURL(vercelUrl) },
      { label: 'View Analytics', onPress: () => navigateToAnalytics(project) },
    ];

    setSheetTitle(project.name);
    setSheetOptions(opts);
    setSheetVisible(true);
  };

  const navigateToAnalytics = (project: Project) => {
    navigation.navigate('Analytics', {
      projectId: project.id,
      projectName: project.name,
      teamId: getTeamId(project),
      domain: getPrimaryDomain(project),
      framework: project.framework,
    });
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        visible={sheetVisible}
        title={sheetTitle}
        options={sheetOptions}
        onClose={() => setSheetVisible(false)}
      />
      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 8 }]}>
        <Pressable onPress={showAccountMenu} style={styles.accountBtn}>
          {activeAccount?.avatarURL ? (
            <Image source={{ uri: activeAccount.avatarURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarLetter}>
                {(activeAccount?.name ?? '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </Pressable>
        <Text style={styles.headerTitle}>Projects</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color="rgba(255,255,255,0.35)" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={startWithSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Feather name="x" size={16} color="rgba(255,255,255,0.45)" />
          </Pressable>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.listContent}>
          <ProjectsSkeleton />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => loadProjects()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : filteredProjects.length === 0 && searchQuery ? (
        <View style={styles.centerState}>
          <View style={styles.emptyIconWrap}>
            <Feather name="search" size={40} color={Colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptySubtitle}>No projects match "{searchQuery}"</Text>
        </View>
      ) : filteredProjects.length === 0 ? (
        <View style={styles.centerState}>
          <View style={styles.emptyIconWrap}>
            <Feather name="package" size={40} color={Colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>No projects</Text>
          <Text style={styles.emptySubtitle}>Your Vercel projects will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={p => p.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadProjects(true)}
              tintColor={Colors.textSecondary}
            />
          }
          renderItem={({ item, index }) => (
            <ProjectCard
              project={item}
              index={index}
              onPress={() => navigateToAnalytics(item)}
              onLongPress={() => showProjectActions(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  accountBtn: {},
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  avatarLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  searchIcon: { marginRight: -2 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    height: '100%',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyIconWrap: { marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  emptySubtitle: { fontSize: 13, color: Colors.textTertiary, textAlign: 'center' },
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
