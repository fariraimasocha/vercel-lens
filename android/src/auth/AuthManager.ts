import { create } from 'zustand';
import { VercelAccount } from '../models/VercelAccount';
import * as SecureStorage from './SecureStorage';

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface AuthState {
  accounts: VercelAccount[];
  activeAccountId: string | undefined;
  longHistoryIds: string[];
  isLoading: boolean;
  error: string | undefined;
  initialized: boolean;

  init: () => Promise<void>;
  login: (token: string) => Promise<void>;
  switchAccount: (id: string) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshAccountProfiles: () => Promise<void>;
  hasLongAnalyticsHistory: (id: string | undefined) => boolean;
  markLongAnalyticsHistoryAvailable: (id: string | undefined) => Promise<void>;
}

async function fetchAccountProfile(token: string): Promise<{
  statusCode: number;
  name?: string;
  avatarURL?: string;
}> {
  try {
    const resp = await fetch('https://api.vercel.com/v2/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statusCode = resp.status;
    if (!resp.ok) return { statusCode };
    const json = await resp.json();
    const user = json?.user;
    const name: string = user?.name ?? user?.username ?? '';
    let avatarURL: string | undefined = user?.avatar;
    if (avatarURL && !avatarURL.startsWith('http')) {
      avatarURL = `https://api.vercel.com/www/avatar/${avatarURL}`;
    }
    return { statusCode, name, avatarURL };
  } catch {
    return { statusCode: 0 };
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accounts: [],
  activeAccountId: undefined,
  longHistoryIds: [],
  isLoading: false,
  error: undefined,
  initialized: false,

  init: async () => {
    const accounts = await SecureStorage.getAccounts();
    let activeAccountId = await SecureStorage.getActiveAccountId();
    const longHistoryIds = await SecureStorage.getLongHistoryIds();

    if (!activeAccountId && accounts.length > 0) {
      activeAccountId = accounts[0].id;
      await SecureStorage.saveActiveAccountId(activeAccountId);
    }

    set({ accounts, activeAccountId, longHistoryIds, initialized: true });

    if (accounts.length > 0) {
      get().refreshAccountProfiles();
    }
  },

  login: async (token: string) => {
    set({ isLoading: true, error: undefined });
    const result = await fetchAccountProfile(token);

    if (result.statusCode === 0) {
      set({ isLoading: false, error: 'Network error. Check your connection.' });
      return;
    }
    if (result.statusCode === 401 || result.statusCode === 403) {
      set({ isLoading: false, error: 'Invalid token. Please check and try again.' });
      return;
    }
    if (result.statusCode < 200 || result.statusCode > 299) {
      set({ isLoading: false, error: `Unexpected error (${result.statusCode}).` });
      return;
    }

    const { accounts } = get();
    const existing = accounts.findIndex(a => a.token === token);
    let newAccounts: VercelAccount[];
    let newActiveId: string;

    if (existing >= 0) {
      newAccounts = accounts.map((a, i) =>
        i === existing
          ? { ...a, name: result.name ?? a.name, avatarURL: result.avatarURL }
          : a
      );
      newActiveId = accounts[existing].id;
    } else {
      const newAccount: VercelAccount = {
        id: uuid(),
        name: result.name ?? `Account ${accounts.length + 1}`,
        token,
        avatarURL: result.avatarURL,
      };
      newAccounts = [...accounts, newAccount];
      newActiveId = newAccount.id;
    }

    await SecureStorage.saveAccounts(newAccounts);
    await SecureStorage.saveActiveAccountId(newActiveId);
    set({ accounts: newAccounts, activeAccountId: newActiveId, isLoading: false, error: undefined });
  },

  switchAccount: async (id: string) => {
    if (get().accounts.some(a => a.id === id)) {
      await SecureStorage.saveActiveAccountId(id);
      set({ activeAccountId: id });
    }
  },

  removeAccount: async (id: string) => {
    const { accounts, activeAccountId, longHistoryIds } = get();
    const newAccounts = accounts.filter(a => a.id !== id);
    const newLongHistory = longHistoryIds.filter(h => h !== id);
    const newActiveId = activeAccountId === id ? newAccounts[0]?.id : activeAccountId;

    await SecureStorage.saveAccounts(newAccounts);
    await SecureStorage.saveActiveAccountId(newActiveId);
    await SecureStorage.saveLongHistoryIds(newLongHistory);
    set({ accounts: newAccounts, activeAccountId: newActiveId, longHistoryIds: newLongHistory });
  },

  logout: async () => {
    const { activeAccountId } = get();
    if (activeAccountId) await get().removeAccount(activeAccountId);
  },

  logoutAll: async () => {
    await SecureStorage.deleteEverything();
    set({ accounts: [], activeAccountId: undefined, longHistoryIds: [] });
  },

  refreshAccountProfiles: async () => {
    const { accounts } = get();
    if (accounts.length === 0) return;

    const updates = await Promise.all(
      accounts.map(async a => {
        const result = await fetchAccountProfile(a.token);
        if (result.statusCode === 200 && result.name) {
          return { id: a.id, name: result.name, avatarURL: result.avatarURL };
        }
        return null;
      })
    );

    let changed = false;
    const newAccounts = accounts.map(a => {
      const update = updates.find(u => u?.id === a.id);
      if (!update) return a;
      if (update.name !== a.name || update.avatarURL !== a.avatarURL) {
        changed = true;
        return { ...a, name: update.name, avatarURL: update.avatarURL };
      }
      return a;
    });

    if (changed) {
      await SecureStorage.saveAccounts(newAccounts);
      set({ accounts: newAccounts });
    }
  },

  hasLongAnalyticsHistory: (id: string | undefined) => {
    if (!id) return false;
    return get().longHistoryIds.includes(id);
  },

  markLongAnalyticsHistoryAvailable: async (id: string | undefined) => {
    if (!id) return;
    const { longHistoryIds } = get();
    if (!longHistoryIds.includes(id)) {
      const newIds = [...longHistoryIds, id];
      await SecureStorage.saveLongHistoryIds(newIds);
      set({ longHistoryIds: newIds });
    }
  },
}));

// Convenience selectors
export const selectIsAuthenticated = (s: AuthState) =>
  s.accounts.length > 0 && !!s.activeAccountId;

export const selectActiveAccount = (s: AuthState) =>
  s.accounts.find(a => a.id === s.activeAccountId);

export const selectToken = (s: AuthState) =>
  s.accounts.find(a => a.id === s.activeAccountId)?.token;
