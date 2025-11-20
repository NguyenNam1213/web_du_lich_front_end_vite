import React, { useState } from "react";

const CheckoutPaymentMethod: React.FC = () => {
  const [method, setMethod] = useState<string>("credit");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

      <div className="space-y-3">

        {/* Thẻ tín dụng */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            checked={method === "credit"}
            onChange={() => setMethod("credit")}
          />
          <span>Thẻ tín dụng / Ghi nợ</span>
        </label>

        {/* Chuyển khoản */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            checked={method === "bank"}
            onChange={() => setMethod("bank")}
          />
          <span>Chuyển khoản ngân hàng</span>
        </label>

        {/* Ví điện tử */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            checked={method === "wallet"}
            onChange={() => setMethod("wallet")}
          />
          <span>Ví điện tử (Momo, ZaloPay, ShopeePay)</span>
        </label>
      </div>
    </div>
  );
};

export default CheckoutPaymentMethod;
