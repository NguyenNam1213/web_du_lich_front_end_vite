export interface Coupon {
  id: number;
  code: string;
  name: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minAmount: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  userId?: number | null;
  createdAt: string;
}

export interface CouponState {
  coupons: Coupon[];
  currentPage: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

