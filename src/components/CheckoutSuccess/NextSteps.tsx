import React from "react";

interface Props {
  paymentMethod: "cash" | "bank_transfer";
}

const NextSteps: React.FC<Props> = ({ paymentMethod }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-3">
        Hướng dẫn tiếp theo
      </h2>

      {paymentMethod === "cash" ? (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Có mặt đúng điểm hẹn</li>
          <li>Thanh toán tiền mặt cho hướng dẫn viên</li>
        </ul>
      ) : (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Thực hiện chuyển khoản theo hướng dẫn</li>
          <li>Đơn hàng sẽ được xác nhận sau 1 vài phút</li>
        </ul>
      )}
    </div>
  );
};

export default NextSteps;
