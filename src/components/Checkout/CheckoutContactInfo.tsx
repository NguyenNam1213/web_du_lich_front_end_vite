import React from "react";
import { useUser } from "../../context/UserContext";

const CheckoutContactInfo: React.FC = () => {
  const {userData} = useUser();
  const fullName = `${userData?.lastName || ""} ${userData?.firstName || ""}`.trim();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Họ tên */}
        <div>
          <label className="text-sm text-gray-700">Họ và tên</label>
          <input
            type="text"
            value={fullName}
            readOnly
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            value={userData?.email || ""}
            readOnly
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="text-sm text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            value={userData?.phone || ""}
            readOnly
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutContactInfo;
