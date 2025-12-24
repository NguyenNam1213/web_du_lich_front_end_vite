import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setMethod as setMethodAction } from "../../store/slices/checkoutSlice";

type PaymentMethod = "cash" | "bank_transfer";

const CheckoutPaymentMethod: React.FC = () => {
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const dispatch = useDispatch();

  const handleChange = (value: PaymentMethod) => {
    setMethod(value);
    dispatch(setMethodAction(value));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">

        {/* Tiền mặt */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            checked={method === "cash"}
            onChange={() => handleChange("cash")}
          />
          <span>Thanh toán bằng tiền mặt</span>
        </label>

        {/* Chuyển khoản ngân hàng */}
        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment_method"
            checked={method === "bank_transfer"}
            onChange={() => handleChange("bank_transfer")}
          />
          <span>Chuyển khoản ngân hàng</span>
        </label>

      </div>
    </div>
  );
};

export default CheckoutPaymentMethod;
