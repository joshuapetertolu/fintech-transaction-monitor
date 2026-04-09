import { useEffect, useRef } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { mockApiService } from "@/services/mockApi.service";
import logger from "@/utils/logger";

export const useTransactionStream = () => {
  const { addStreamedTransaction, transactions } = useTransactionStore();
  const { isAuthenticated } = useAuthStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const type = Math.random() > 0.7 ? "update" : "new";

      if (type === "update" && transactions.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * Math.min(transactions.length, 20),
        );
        const target = transactions[randomIndex];

        if (target.status === "success") return;

        logger.info("[Stream] Simulating status update for:", target.id);
        const updatedTx = mockApiService.simulateStatusUpdate(target);
        addStreamedTransaction(updatedTx);
      } else {
        const newTx = mockApiService.generateMockTransaction();
        logger.info(`[Stream] Pushing new transaction: ${newTx.merchant}`);
        addStreamedTransaction(newTx);
      }
    }, 7000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, transactions.length, addStreamedTransaction]);
};
