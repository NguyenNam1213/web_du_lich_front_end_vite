import React from "react";

const CheckoutAdditionalRequest: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Yêu cầu bổ sung</h2>

      <textarea
        rows={4}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        placeholder="Ví dụ: Tôi muốn đặt ghế cạnh cửa sổ, người lớn tuổi cần hỗ trợ..."
      ></textarea>
    </div>
  );
};

export default CheckoutAdditionalRequest;
