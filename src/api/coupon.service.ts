import api from "./auth";

export const CouponService = {
  apply: (code: string, amount: number) => {
    return api.post("/coupons/apply", { code, amount });
  },
};
