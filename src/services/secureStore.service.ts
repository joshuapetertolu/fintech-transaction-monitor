import * as SecureStore from 'expo-secure-store';
import logger from '@utils/logger';

const SENSITIVE_KEYS = [
  'shct_access_token',
  'shct_refresh_token',
  'shct_user'
];

export const SecureStorageService = {
  async getItem(key: string): Promise<string | null> {
    try {
      const result = await SecureStore.getItemAsync(key);
      return result;
    } catch (error) {
      logger.error(`SecureStore getItem error for key ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error(`SecureStore setItem error for key ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error(`SecureStore removeItem error for key ${key}:`, error);
    }
  },

  async clearAll(): Promise<void> {
    const results = await Promise.allSettled(
      SENSITIVE_KEYS.map(key => SecureStore.deleteItemAsync(key))
    );

    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      logger.error(`[SecureStorageService] Storage wipe failed for ${failures.length} keys.`);
    }
  }
};
