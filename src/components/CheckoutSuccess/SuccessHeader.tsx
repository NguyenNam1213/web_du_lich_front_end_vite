import React from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  paymentMethod: "cash" | "bank_transfer";
}

const SuccessHeader: React.FC<Props> = ({ paymentMethod }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
      <h1 className="text-2xl font-bold text-green-700">
        Đặt tour thành công!
      </h1>
      <p className="text-gray-600 mt-2">
        {paymentMethod === "cash"
          ? "Thanh toán bằng tiền mặt tại điểm hẹn."
          : "Vui lòng hoàn tất chuyển khoản để xác nhận đơn hàng."}
      </p>
    </div>
  );
};

export default SuccessHeader;
