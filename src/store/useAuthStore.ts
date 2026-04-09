import { create } from 'zustand';
import { SecureStorageService } from '@services/secureStore.service';
import { User } from '@services/mockApi.service';
import logger from '@utils/logger';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  refreshSession: () => Promise<string>;
  setTokens: (access: string, refresh: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  initializeAuth: async () => {
    try {
      const accessToken = await SecureStorageService.getItem('shct_access_token');
      const refreshToken = await SecureStorageService.getItem('shct_refresh_token');
      const userJson = await SecureStorageService.getItem('shct_user');

      if (accessToken && refreshToken && userJson) {
        set({
          accessToken,
          refreshToken,
          user: JSON.parse(userJson),
          isAuthenticated: true,
        });
      }
    } catch (error) {
      logger.error('[AuthStore] Initialization failed:', error);
      set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
    } finally {
      set({ isHydrated: true });
    }
  },

  setTokens: async (accessToken, refreshToken) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
    
    await SecureStorageService.setItem('shct_access_token', accessToken);
    await SecureStorageService.setItem('shct_refresh_token', refreshToken);
  },

  refreshSession: async () => {
    try {
      const currentRefresh = get().refreshToken;
      if (!currentRefresh) throw new Error('No refresh token available');
      
      const { mockApiService } = require('@services/mockApi.service');
      const response = await mockApiService.refreshToken(currentRefresh);
      
      await get().setTokens(response.accessToken, response.refreshToken);
      return response.accessToken;
    } catch (error) {
      logger.error('[AuthStore] Token refresh failed:', error);
      await get().logout();
      throw error;
    }
  },

  setUser: async (user) => {
    set({ user });
    await SecureStorageService.setItem('shct_user', JSON.stringify(user));
  },

  login: async (email, password) => {
    const { mockApiService } = require('@services/mockApi.service');
    const response = await mockApiService.login(email, password);
    
    await get().setTokens(response.accessToken, response.refreshToken);
    await get().setUser(response.user);
  },

  logout: async () => {
    set({ 
      user: null, 
      accessToken: null, 
      refreshToken: null, 
      isAuthenticated: false 
    });

    try {
      const { useTransactionStore } = require('./transactionStore');
      useTransactionStore.getState().clearTransactions();
      await SecureStorageService.clearAll();
    } catch (error) {
      logger.error('[AuthStore] Physical SecureStore wipe failed:', error);
    }
  },
}));
