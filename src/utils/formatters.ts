import { COLORS } from '@theme/index';
import { TransactionStatus } from '@store/transactionStore';

export const maskCardNumber = (number: string): string => {
  const cleanNumber = number.replace(/\s?/g, '');
  if (cleanNumber.length < 4) return cleanNumber;
  const lastFour = cleanNumber.slice(-4);
  return `•••• ${lastFour}`;
};

export const formatCurrency = (amount: string | number, currency: string = '$'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  if (isNaN(num)) return `${currency}0.00`;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num).replace('USD', currency).trim();
};

export const maskIpAddress = (ip: string) => {
  if (!ip) return '***.***.***.***';
  return ip.replace(/\d{1,3}\.\d{1,3}$/, '***.***');
};

export const getTransactionStatusConfig = (status: TransactionStatus) => {
  switch (status) {
    case 'success':
      return { color: COLORS.success, label: 'Success' };
    case 'failed':
      return { color: COLORS.error, label: 'Failed' };
    case 'processing':
      return { color: COLORS.primary, label: 'Processing' };
    case 'pending':
      return { color: COLORS.textSecondary, label: 'Pending' };
    default:
      return { color: COLORS.textSecondary, label: status };
  }
};
