import api from "./auth";

export interface Coupon {
  id: number;
  code: string;
  name: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minAmount: number;
  maxDiscount?: number;
  validTo: string;
  userId?: number | null; // null = public coupon, có userId = coupon riêng cho user đó
}

export interface CouponAdmin {
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

export interface CreateCouponDto {
  code: string;
  name: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
  userId?: number | null;
}

export const CouponService = {
  apply: (code: string, amount: number) => {
    return api.post("/coupons/apply", { code, amount });
  },
  listActive: () => {
    // API: GET /coupons/active
    return api.get<Coupon[]>("/coupons/active");
  },
  // Admin APIs with pagination
  list: (active?: boolean, page?: number, limit?: number) => {
    const params: any = {};
    if (active !== undefined) params.active = String(active);
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    return api.get<{
      coupons: CouponAdmin[];
      total: number;
      totalPages: number;
      currentPage: number;
    }>(`/coupons`, { params });
  },
  create: (data: CreateCouponDto) => {
    return api.post<CouponAdmin>("/coupons", data);
  },
  delete: (code: string) => {
    return api.delete(`/coupons/${code}`);
  },
  getByCode: (code: string) => {
    return api.get<CouponAdmin>(`/coupons/${code}`);
  },
};

