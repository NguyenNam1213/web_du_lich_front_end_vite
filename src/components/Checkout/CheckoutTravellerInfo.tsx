import React from "react";

const CheckoutTravellerInfo: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Thông tin hành khách</h2>

      {/* Hành khách 1 */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <h3 className="font-medium mb-3">Hành khách 1</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700">Họ và tên</label>
            <input
              type="text"
              className="w-full mt-1 border rounded-lg px-3 py-2"
              placeholder="Họ và tên"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Ngày sinh</label>
            <input
              type="date"
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Quốc tịch</label>
            <input
              type="text"
              className="w-full mt-1 border rounded-lg px-3 py-2"
              placeholder="Việt Nam"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutTravellerInfo;
