import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAuthStore, selectIsAuthenticated } from './src/auth/AuthManager';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { Colors } from './src/constants/colors';

export type RootStackParamList = {
  Tabs: undefined;
  Analytics: {
    projectId: string;
    projectName: string;
    teamId?: string;
    domain?: string;
    framework?: string;
  };
};

export type TabParamList = {
  Projects: undefined;
  Search: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const color = focused ? Colors.white : Colors.textTertiary;
  const opacity = focused ? 1 : 0.45;
  const icons: Record<string, React.ComponentProps<typeof Feather>['name']> = {
    Projects: 'triangle',
    Search: 'search',
    About: 'info',
  };
  return (
    <Feather name={icons[label] ?? 'circle'} size={18} color={color} style={{ opacity }} />
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Projects" component={ProjectsTabScreen} />
      <Tab.Screen name="Search" component={SearchTabScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}

function ProjectsTabScreen() {
  return <ProjectsScreen startWithSearch={false} />;
}

function SearchTabScreen() {
  return <ProjectsScreen startWithSearch={true} />;
}

function AppNavigator() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const initialized = useAuthStore(s => s.initialized);

  if (!initialized) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }} />
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const init = useAuthStore(s => s.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#000000" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
