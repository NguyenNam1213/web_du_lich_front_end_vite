import React from "react";

const CheckoutContactInfo: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Họ tên */}
        <div>
          <label className="text-sm text-gray-700">Họ và tên</label>
          <input
            type="text"
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Nguyễn Văn A"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="text-sm text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="0123 456 789"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutContactInfo;
