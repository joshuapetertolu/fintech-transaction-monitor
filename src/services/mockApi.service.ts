import logger from "@utils/logger";
import { SecurityLogger } from "@utils/logger";
import { Transaction } from "@store/transactionStore";
export type UserRole = "admin" | "analyst";

export interface User {
  id: string;
  role: UserRole;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

class MockApiService {
  private static instance: MockApiService;

  private constructor() {}

  private forceNext401 = false;

  public static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  public simulateTokenExpiration(): void {
    logger.warn("[MockAPI] Forcing next API call to return 401 Unauthorized.");
    this.forceNext401 = true;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    SecurityLogger.info("[MockAPI] Login attempt:", { email, password });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "admin@sohcahtoa.io" && password === "admin123") {
      return {
        accessToken: "mock_access_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
        expiresIn: 3600,
        user: { id: "usr_01", role: "admin", email: "admin@sohcahtoa.io" },
      };
    } else if (email === "analyst@sohcahtoa.io" && password === "analyst123") {
      return {
        accessToken: "mock_access_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
        expiresIn: 3600,
        user: { id: "usr_02", role: "analyst", email: "analyst@sohcahtoa.io" },
      };
    }

    throw new Error("Invalid credentials");
  }

  public async refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info("[MockAPI] Refreshing token...");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!token) {
      throw new Error("No refresh token provided");
    }

    return {
      accessToken: "mock_access_token_" + Date.now(),
      refreshToken: "mock_refresh_token_" + Date.now(),
    };
  }

  public async fetchTransactions(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ transactions: any[]; hasMore: boolean }> {
    logger.info(
      `[MockAPI] Fetching transactions (Page: ${page}, Limit: ${limit})...`,
    );

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (this.forceNext401 || Math.random() < 0.15) {
      this.forceNext401 = false; 
      logger.warn("[MockAPI] Simulated 401 Unauthorized Error!");
      const error: any = new Error("Unauthorized");
      error.status = 401;
      error.response = { status: 401 };
      throw error;
    }

    const mockData = [
      {
        id: "tx_1",
        title: "Adobe Creative Cloud",
        amount: -52.99,
        status: "success",
        category: "Software",
        date: "2026-04-08",
        type: "outgoing",
      },
      {
        id: "tx_2",
        title: "Apple Store Refund",
        amount: 1200.0,
        status: "success",
        category: "Gadgets",
        date: "2026-04-07",
        type: "incoming",
      },
      {
        id: "tx_3",
        title: "Starbucks Coffee",
        amount: -6.5,
        status: "pending",
        category: "Food",
        date: "2026-04-07",
        type: "outgoing",
      },
      {
        id: "tx_4",
        title: "Salary Deposit",
        amount: 8500.0,
        status: "success",
        category: "Income",
        date: "2026-04-01",
        type: "incoming",
      },
      {
        id: "tx_5",
        title: "Amazon.co.uk",
        amount: -124.99,
        status: "success",
        category: "Shopping",
        date: "2026-04-05",
        type: "outgoing",
      },
      {
        id: "tx_6",
        title: "Uber Trip",
        amount: -22.4,
        status: "success",
        category: "Transport",
        date: "2026-04-05",
        type: "outgoing",
      },
      {
        id: "tx_7",
        title: "Netflix Subscription",
        amount: -15.99,
        status: "failed",
        category: "Entertainment",
        date: "2026-04-04",
        type: "outgoing",
      },
      {
        id: "tx_8",
        title: "Gym Membership",
        amount: -45.0,
        status: "success",
        category: "Health",
        date: "2026-04-02",
        type: "outgoing",
      },
      {
        id: "tx_9",
        title: "Electricity Bill",
        amount: -85.2,
        status: "pending",
        category: "Utilities",
        date: "2026-04-01",
        type: "outgoing",
      },
      {
        id: "tx_10",
        title: "SohCahToa Bonus",
        amount: 500.0,
        status: "success",
        category: "Bonus",
        date: "2026-03-31",
        type: "incoming",
      },
    ];

    const paginatedData = mockData.map((tx) => ({
      ...tx,
      id: `${tx.id}_p${page}`,
      deviceInfo: "iPhone 15,1 (iOS 17.4)",
      ipAddress: "192.168.1.45",
      internalNotes: "",
    }));

    return {
      transactions: paginatedData,
      hasMore: page < 5,
    };
  }

  public async flagTransactionOnServer(id: string): Promise<void> {
    logger.info("[MockAPI] Flagging transaction:", id);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.05) {
          reject(new Error("Network error during flagging"));
        } else {
          resolve();
        }
      }, 1000);
    });
  }

  public async updateInternalNote(id: string, note: string): Promise<void> {
    logger.info(
      `[MockAPI] Updating internal note for transaction ${id}:`,
      note,
    );
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.05) {
          reject(new Error("Network error during note update"));
        } else {
          resolve();
        }
      }, 1000);
    });
  }

  public async getTransactionById(id: string): Promise<any> {
    logger.info(`[MockAPI] Fetching transaction by ID: ${id}`);

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id,
      title: "Detailed Transaction",
      amount: -52.99,
      status: "success",
      category: "Software",
      date: new Date().toISOString().split("T")[0],
      type: "outgoing",
      deviceInfo: "iPhone 15,1 (iOS 17.4)",
      ipAddress: "192.168.1.45",
      internalNotes: "",
    };
  }

  public generateMockTransaction(): Transaction {
    const isIncoming = Math.random() > 0.5;
    const txType = isIncoming ? "incoming" : "outgoing";

    const incomingMerchants = [
      "Salary Deposit",
      "Dividend Pay",
      "Zelle Transfer",
      "Refund: Amazon",
      "Internal Transfer",
    ];
    const outgoingMerchants = [
      "Starbucks",
      "Amazon",
      "Uber",
      "Apple Store",
      "Netflix",
      "Airbnb",
      "Spotify",
      "Whole Foods",
      "Gym",
    ];
    const merchants = isIncoming ? incomingMerchants : outgoingMerchants;
    const randomMerchant =
      merchants[Math.floor(Math.random() * merchants.length)];

    const incomingTitles = [
      "Credit Transfer",
      "Inbound Payment",
      "Account Credit",
      "Received Funds",
      "Deposit",
    ];
    const outgoingTitles = [
      "Debit Payment",
      "Outbound Transfer",
      "Account Debit",
      "Payment Sent",
      "Purchase",
    ];
    const titles = isIncoming ? incomingTitles : outgoingTitles;
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];

    return {
      id: `tx_stream_${Date.now()}`,
      title: randomTitle,
      merchant: randomMerchant,
      amount: isIncoming
        ? Math.floor(Math.random() * 2000) + 100
        : Math.floor(Math.random() * 500) + 10,
      status: "pending",
      category: isIncoming ? "Income" : "Shopping", 
      date: new Date().toISOString().split("T")[0],
      type: txType,
      isFlagged: false,
    };
  }

  public simulateStatusUpdate(target: Transaction): Transaction {
    return {
      ...target,
      status: "success",
    };
  }
}

export const mockApiService = MockApiService.getInstance();
