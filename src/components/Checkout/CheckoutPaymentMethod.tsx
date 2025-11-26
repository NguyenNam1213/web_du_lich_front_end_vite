import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setMethod as setMethodAction } from "../../store/slices/checkoutSlice";

const CheckoutPaymentMethod: React.FC = () => {
  const [method, setMethod] = useState<"bank_transfer" | "credit_card" | "paypal">("credit_card");
  const dispatch = useDispatch();

  const handleChange = (value: "bank_transfer" | "credit_card" | "paypal") => {
    setMethod(value);               
    dispatch(setMethodAction(value));  
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

      <div className="space-y-3">

        {/* Thẻ tín dụng */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            checked={method === "credit_card"}
            onChange={() => handleChange("credit_card")}
          />
          <span>Thẻ tín dụng / Ghi nợ</span>
        </label>

        {/* Chuyển khoản */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            checked={method === "bank_transfer"}
            onChange={() => handleChange("bank_transfer")}
          />
          <span>Chuyển khoản ngân hàng</span>
        </label>

        {/* PayPal */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            checked={method === "paypal"}
            onChange={() => handleChange("paypal")}
          />
          <span>Paypal</span>
        </label>

      </div>
    </div>
  );
};

export default CheckoutPaymentMethod;
