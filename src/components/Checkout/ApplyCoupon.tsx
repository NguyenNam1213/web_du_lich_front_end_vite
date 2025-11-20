import React, { useState } from "react";

const ApplyCoupon: React.FC = () => {
  const [code, setCode] = useState("");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Mã giảm giá</h2>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã..."
          className="flex-1 border px-3 py-2 rounded-lg"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default ApplyCoupon;
