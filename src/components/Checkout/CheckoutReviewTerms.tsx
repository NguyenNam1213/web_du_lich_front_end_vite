import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setAgreeTerms } from "../../store/slices/checkoutSlice";

const CheckoutReviewTerms: React.FC = () => {
  const dispatch = useDispatch();
  const agree = useSelector(
    (state: RootState) => state.checkout.agreeTerms
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Điều khoản & Xác nhận</h2>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => dispatch(setAgreeTerms(e.target.checked))}
          className="mt-1"
        />
        <span className="text-gray-700 text-sm">
          Tôi xác nhận tất cả thông tin đã cung cấp là chính xác và tôi đồng ý
          với các điều khoản & chính sách hủy của tour.
        </span>
      </label>
    </div>
  );
};

export default CheckoutReviewTerms;
