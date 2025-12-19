import React, { useState, useEffect } from "react";
import { CouponService, Coupon } from "../../api/coupon.service";
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
  const [couponList, setCouponList] = useState<Coupon[]>([]); 
  const [listLoading, setListLoading] = useState(true);

  const dispatch = useDispatch();
  const checkout = useSelector((state: RootState) => state.checkout);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await CouponService.listActive();
        setCouponList(res.data); 
      } catch (e) {
        console.error("Failed to fetch coupons:", e);
      } finally {
        setListLoading(false);
      }
    };
    fetchCoupons();
  }, []);


  const formatDiscount = (coupon: Coupon): string => {
    const value = coupon.discountValue
      ? Number(coupon.discountValue).toLocaleString("vi-VN")
      : "0";
    if (coupon.discountType === "percentage") {
      return `Giảm ${value}%`;
    }
    return `Giảm ${value} ${checkout.currency || "VND"}`;
  };

  const handleApply = async (couponCode = code) => {
    if (!checkout.amount) {
      setError("Không tìm thấy tổng tiền để áp dụng mã.");
      return;
    }

    try {
      setLoading(true);
      const res = await CouponService.apply(couponCode, checkout.amount);

      const discountValue = res.data.discount;
      const finalTotal = res.data.finalAmount;

      dispatch(setCouponCode(couponCode));
      dispatch(setDiscount(discountValue ?? 0));
      dispatch(setAmount(finalTotal));

      if (couponCode !== code) setCode(couponCode);

      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Mã không hợp lệ hoặc đã hết hiệu lực"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Mã giảm giá</h2>

      {/* KHU VỰC HIỂN THỊ DANH SÁCH COUPON */}
      <div className="mb-4 space-y-2 max-h-60 overflow-y-auto border p-2 rounded-lg">
        {listLoading ? (
          <p className="text-sm text-gray-500">Đang tải mã giảm giá...</p>
        ) : couponList.length === 0 ? (
          <p className="text-sm text-gray-500">
            Hiện không có mã giảm giá nào.
          </p>
        ) : (
          couponList.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-3 border rounded-lg cursor-pointer transition 
                ${
                  checkout.couponCode === coupon.code
                    ? "border-green-500 bg-green-50"
                    : "hover:border-blue-400"
                }`}
              onClick={() => {
                if (checkout.couponCode !== coupon.code) {
                  handleApply(coupon.code);
                }
              }}
            >
              <p className="font-medium text-blue-700">
                {coupon.name} - {coupon.code}
              </p>
              <p className="text-sm text-gray-600">{formatDiscount(coupon)}</p>
              <p className="text-xs text-gray-500">
                Áp dụng cho đơn từ{" "}
                {Number(coupon.minAmount).toLocaleString("vi-VN")}{" "}
                {checkout.currency}
              </p>
              {checkout.couponCode === coupon.code && (
                <p className="text-xs text-green-600 mt-1">Đã áp dụng!</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* KHU VỰC NHẬP MÃ THỦ CÔNG */}
      <div className="flex gap-2 mt-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Hoặc nhập mã thủ công..."
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => handleApply()}
          disabled={loading || code === checkout.couponCode}
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
