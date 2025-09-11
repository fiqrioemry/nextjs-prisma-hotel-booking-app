export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export type PaymentQuery = {
  sort: string;
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "";
  page?: number;
  limit?: number;
};

export type TransactionQuery = {
  q?: string;
  sort: string;
  transactionType?: "GRANTED" | "USAGE" | "TOPUP" | "";
  page?: number;
  limit?: number;
};
