import React, { useState } from "react";

const CheckoutReviewTerms: React.FC = () => {
  const [agree, setAgree] = useState(false);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Điều khoản & Xác nhận</h2>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
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
