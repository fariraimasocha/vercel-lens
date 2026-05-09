import * as SecureStore from 'expo-secure-store';
import { VercelAccount } from '../models/VercelAccount';

const ACCOUNTS_KEY = 'verceltics_accounts';
const ACTIVE_ID_KEY = 'verceltics_active_account_id';
const LONG_HISTORY_KEY = 'verceltics_long_analytics_history';

export async function saveAccounts(accounts: VercelAccount[]): Promise<void> {
  await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function getAccounts(): Promise<VercelAccount[]> {
  const raw = await SecureStore.getItemAsync(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as VercelAccount[];
  } catch {
    return [];
  }
}

export async function saveActiveAccountId(id: string | undefined): Promise<void> {
  if (id) {
    await SecureStore.setItemAsync(ACTIVE_ID_KEY, id);
  } else {
    await SecureStore.deleteItemAsync(ACTIVE_ID_KEY);
  }
}

export async function getActiveAccountId(): Promise<string | undefined> {
  const val = await SecureStore.getItemAsync(ACTIVE_ID_KEY);
  return val ?? undefined;
}

export async function saveLongHistoryIds(ids: string[]): Promise<void> {
  await SecureStore.setItemAsync(LONG_HISTORY_KEY, JSON.stringify(ids));
}

export async function getLongHistoryIds(): Promise<string[]> {
  const raw = await SecureStore.getItemAsync(LONG_HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function deleteEverything(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCOUNTS_KEY);
  await SecureStore.deleteItemAsync(ACTIVE_ID_KEY);
  await SecureStore.deleteItemAsync(LONG_HISTORY_KEY);
}
