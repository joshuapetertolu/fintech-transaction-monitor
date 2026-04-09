import { create } from "zustand";
import { mockApiService } from "@services/mockApi.service";
import { useAuthStore } from "./useAuthStore";
import logger from "@utils/logger";

export type TransactionType = "incoming" | "outgoing";
export type TransactionStatus = "pending" | "processing" | "success" | "failed";

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  merchant?: string;
  title?: string;
  isFlagged: boolean;
  type: TransactionType;
  category?: string;
  status: TransactionStatus;
  deviceInfo?: string;
  ipAddress?: string;
  internalNotes?: string;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  searchQuery: string;
  activeStatus: TransactionStatus | "all";
  fetchTransactions: (reset?: boolean) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  clearTransactions: () => void;
  setSearchQuery: (query: string) => void;
  setActiveStatus: (status: TransactionStatus | "all") => void;
  flagTransaction: (id: string) => Promise<void>;
  updateTransactionNote: (id: string, note: string) => Promise<void>;
  addStreamedTransaction: (transaction: Transaction) => void;
  getFilteredTransactions: () => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  isFetching: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  searchQuery: "",
  activeStatus: "all",

  fetchTransactions: async (reset = false) => {
    const { currentPage, transactions, isFetching } = get();

    if (isFetching) return;

    const pageToFetch = reset ? 1 : currentPage;
    const shouldShowSkeleton = reset && transactions.length === 0;

    if (shouldShowSkeleton) set((state) => ({ ...state, isLoading: true }));
    set((state) => ({ ...state, error: null, isFetching: true }));

    try {
      const response = await mockApiService.fetchTransactions(pageToFetch);

      set((state) => {
        const rawNewTransactions = reset
          ? response.transactions
          : [...state.transactions, ...response.transactions];

        const uniqueTransactions = rawNewTransactions.filter(
          (tx, index, self) => self.findIndex((t) => t.id === tx.id) === index,
        );

        return {
          ...state,
          transactions: uniqueTransactions,
          currentPage: pageToFetch,
          hasMore: response.hasMore,
          isLoading: false,
          isFetching: false,
        };
      });
    } catch (err: any) {
      set((state) => ({
        ...state,
        error: err.message || "Failed to fetch transactions",
        isLoading: false,
        isFetching: false,
      }));
    }
  },

  fetchNextPage: async () => {
    const { hasMore, isFetching, currentPage } = get();
    if (!hasMore || isFetching) return;

    set((state) => ({ ...state, currentPage: currentPage + 1 }));
    await get().fetchTransactions(false);
  },

  clearTransactions: () => {
    set((state) => ({
      ...state,
      transactions: [],
      currentPage: 1,
      isLoading: false,
      isFetching: false,
      error: null,
      hasMore: true,
      searchQuery: "",
      activeStatus: "all",
    }));
  },

  setSearchQuery: (searchQuery: string) =>
    set((state) => ({ ...state, searchQuery })),

  setActiveStatus: (activeStatus: TransactionStatus | "all") =>
    set((state) => ({ ...state, activeStatus })),

  flagTransaction: async (id: string) => {
    const user = useAuthStore.getState().user;
    if (user?.role !== "admin") {
      const { SecurityLogger } = require("@utils/logger");
      SecurityLogger.info(
        "Unauthorized action: flagTransaction requires admin role",
        { action: "flagTransaction", role: user?.role },
      );
      throw new Error("Unauthorized");
    }

    const previousTransactions = get().transactions;
    const transaction = previousTransactions.find((tx) => tx.id === id);

    if (!transaction) return;

    const newFlagStatus = !transaction.isFlagged;

    set((state) => ({
      ...state,
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, isFlagged: newFlagStatus } : tx,
      ),
    }));

    try {
      await mockApiService.flagTransactionOnServer(id);
    } catch (error) {
      logger.warn(`Rollback triggered for flagging transaction ${id}`, error);
      set((state) => ({ ...state, transactions: previousTransactions }));
      throw error;
    }
  },

  updateTransactionNote: async (id: string, note: string) => {
    const user = useAuthStore.getState().user;
    if (user?.role !== "admin") {
      logger.warn(
        "Unauthorized action: updateTransactionNote requires admin role",
      );
      throw new Error("Unauthorized");
    }

    const previousTransactions = get().transactions;
    const transaction = previousTransactions.find((tx) => tx.id === id);

    if (!transaction) return;

    set((state) => ({
      ...state,
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, internalNotes: note } : tx,
      ),
    }));

    try {
      await mockApiService.updateInternalNote(id, note);
    } catch (error) {
      logger.warn(
        `Rollback triggered for updating note on transaction ${id}`,
        error,
      );
      set((state) => ({ ...state, transactions: previousTransactions }));
      throw error;
    }
  },

  addStreamedTransaction: (newTx: Transaction) => {
    set((state) => {
      const existingIndex = state.transactions.findIndex(
        (tx) => tx.id === newTx.id,
      );

      if (existingIndex !== -1) {
        const updatedTransactions = [...state.transactions];
        updatedTransactions[existingIndex] = {
          ...updatedTransactions[existingIndex],
          ...newTx,
        };
        return { ...state, transactions: updatedTransactions };
      }

      return {
        ...state,
        transactions: [newTx, ...state.transactions],
      };
    });
  },

  getFilteredTransactions: () => {
    const { transactions, searchQuery, activeStatus } = get();
    const query = searchQuery.toLowerCase().trim();

    return transactions.filter((tx) => {
      const matchesSearch =
        !query ||
        tx.title?.toLowerCase().includes(query) ||
        tx.merchant?.toLowerCase().includes(query);

      const matchesStatus =
        activeStatus === "all" || tx.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  },
}));
