
export type PaymentMethod = "credit_card" | "paypal" | "bank_transfer";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface CreatePaymentDto {
  bookingId: number;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

export interface UpdatePaymentDto {
  method?: PaymentMethod;
  amount?: number;
  currency?: string;
  status?: PaymentStatus;
}

export interface Payment {
  id: number;
  userId: number;
  bookingId: number;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface BankInfo {
  id: number;
  bankName: string;
  accountNo: string;
  ownerName: string;
  qrCode?: string | null;
  isActive: boolean;
  createdAt: string;
}
