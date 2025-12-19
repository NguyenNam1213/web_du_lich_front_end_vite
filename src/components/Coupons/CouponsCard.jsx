const CouponCard = ({ coupon, onApply, disabled = false }) => {
  const isPercentage = coupon.discountType === "percentage";

  return (
    <div
      className={`flex flex-col w-full max-w-md rounded-xl shadow-sm border overflow-hidden mb-4 transition
        ${
          disabled
            ? "bg-gray-50 border-gray-200 opacity-60 grayscale"
            : "bg-white border-gray-100"
        }
      `}
    >
      {/* Header */}
      <div
        className={`p-5 text-white relative ${
          disabled ? "bg-gray-400" : "bg-emerald-500"
        }`}
      >
        <h3 className="text-2xl font-bold italic">
          {isPercentage
            ? `Giảm ${coupon.discountValue}%`
            : `Giảm ${coupon.discountValue}$`}
        </h3>

        <p className="text-sm mt-1 opacity-90">{coupon.name}</p>

        <p className="text-xs mt-2 italic">
          Hết hạn: {new Date(coupon.validTo).toLocaleDateString("vi-VN")} 23:59
        </p>

        <p className="text-xs opacity-80">
          Đơn tối thiểu: {coupon.minAmount}$
          {coupon.maxDiscount ? ` • Giảm tối đa ${coupon.maxDiscount}$` : ""}
        </p>
        <div className="absolute bottom-[-8px] left-0 w-full h-4 flex gap-1 justify-around overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-white rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="p-5 pt-6 bg-white uppercase">
        <p className="text-gray-400 text-xs tracking-wider">{coupon.code}</p>
        <p className="text-gray-600 text-[11px] mt-1 normal-case leading-tight">
          {disabled
            ? "Mã khuyến mãi đang bị tạm ngưng"
            : "Áp dụng cho đơn hàng đủ điều kiện"}
        </p>
      </div>
    </div>
  );
};

export default CouponCard;
