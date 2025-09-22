export type PaymentParams = {
  q?: string;
  page: number;
  limit: number;
  sort: "newest" | "oldest" | "available_rooms";
  status?: "PENDING" | "PAID" | "FAILED" | "ALL";
};

type User = {
  id: string;
  name: string;
  email: string;
};

export type Payment = {
  id: string;
  invoiceNo: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  paymentMethod: string;
  paymentUrl: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
};
