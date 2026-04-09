import { Transaction } from '@store/transactionStore';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  Home: undefined;
  TransactionDetail: { id: string; transaction: Transaction };
};
