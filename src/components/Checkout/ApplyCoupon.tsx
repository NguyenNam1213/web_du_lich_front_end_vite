import React, { useState } from "react";
import { CouponService } from "../../api/coupon.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setAmount,
  setCouponCode,
  setDiscount,
} from "../../store/slices/checkoutSlice";

const ApplyCoupon: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const checkout = useSelector((state: RootState) => state.checkout);

  const handleApply = async () => {
    if (!checkout.amount) {
      setError("Không tìm thấy tổng tiền để áp dụng mã.");
      return;
    }

    try {
      setLoading(true);
      
      const res = await CouponService.apply(code, checkout.amount);

     
      const discountValue = res.data.discount; 
      const finalTotal = res.data.finalAmount; 

      // Update Redux
      dispatch(setCouponCode(code));
      dispatch(setDiscount(discountValue ?? 0)); // ✅ Lấy giá trị giảm giá
      dispatch(setAmount(finalTotal)); // ✅ Lấy tổng cuối cùng

      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Mã không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Mã giảm giá</h2>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã..."
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={handleApply}
          disabled={loading}
        >
          {loading ? "Đang kiểm tra..." : "Áp dụng"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {checkout.discount ? (
        <p className="text-green-600 mt-2">
          Giảm giá: -{checkout.discount.toLocaleString("vi-VN")}{" "}
          {checkout.currency}
        </p>
      ) : null}
    </div>
  );
};

export default ApplyCoupon;
