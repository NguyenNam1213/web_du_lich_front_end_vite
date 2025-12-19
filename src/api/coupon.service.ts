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
}

export const CouponService = {
  apply: (code: string, amount: number) => {
    return api.post("/coupons/apply", { code, amount });
  },
  listActive: () => {
    // API: GET /coupons/active
    return api.get<Coupon[]>("/coupons/active");
  },
};

