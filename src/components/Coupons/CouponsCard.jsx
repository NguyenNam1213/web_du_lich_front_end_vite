const CouponCard = ({ coupon, onApply, disabled = false }) => {
  const isPercentage = coupon.discountType === "percentage";
  // Kiểm tra xem đây có phải là mã quà tặng riêng không
  const isGift = coupon.code.startsWith("GIFT") || coupon.userId;

  return (
    <div
      className={`flex flex-col w-full max-w-md rounded-xl shadow-sm border overflow-hidden mb-4 transition
        ${
          disabled
            ? "bg-gray-50 border-gray-200 opacity-60 grayscale"
            : isGift
            ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-50" // Card quà tặng nổi bật hơn
            : "bg-white border-gray-100"
        }
      `}
    >
      {/* Header */}
      <div
        className={`p-5 text-white relative ${
          disabled
            ? "bg-gray-400"
            : isGift
            ? "bg-gradient-to-r from-blue-600 to-indigo-600" // Màu Gradient cho quà tặng
            : "bg-emerald-500" // Màu xanh lục cho coupon thường
        }`}
      >
        {/* Nhãn Quà tặng */}
        {isGift && !disabled && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase">
            Quà tặng riêng
          </div>
        )}

        <h3 className="text-2xl font-bold italic">
          {isPercentage
            ? `Giảm ${coupon.discountValue}%`
            : `Giảm ${Number(coupon.discountValue).toLocaleString()}$`}
        </h3>

        <p className="text-sm mt-1 opacity-90">{coupon.name}</p>

        <p className="text-xs mt-2 italic">
          Hết hạn: {new Date(coupon.validTo).toLocaleDateString("vi-VN")} 23:59
        </p>

        <p className="text-xs opacity-80">
          Đơn tối thiếu: {Number(coupon.minAmount).toLocaleString()}$
          {coupon.maxDiscount ? ` • Giảm tối đa ${coupon.maxDiscount}$` : ""}
        </p>

        {/* Răng cưa trang trí */}
        <div className="absolute bottom-[-8px] left-0 w-full h-4 flex gap-1 justify-around overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`w-4 h-4 bg-white rounded-full`}></div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div
        className={`p-5 pt-6 uppercase ${
          isGift ? "bg-blue-50/30" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center">
          <p
            className={`text-xs tracking-wider font-bold ${
              isGift ? "text-blue-700" : "text-gray-400"
            }`}
          >
            {coupon.code}
          </p>
          {isGift && !disabled && (
            <span className="text-[10px] text-blue-500 font-semibold lowercase italic">
              Dành riêng cho bạn
            </span>
          )}
        </div>
        <p className="text-gray-600 text-[11px] mt-1 normal-case leading-tight">
          {disabled
            ? "Mã khuyến mãi đang bị tạm ngưng"
            : isGift
            ? "Ưu đãi đặc biệt từ hệ thống dành cho khách hàng thân thiết"
            : "Áp dụng cho đơn hàng đủ điều kiện"}
        </p>
      </div>
    </div>
  );
};

export default CouponCard;
