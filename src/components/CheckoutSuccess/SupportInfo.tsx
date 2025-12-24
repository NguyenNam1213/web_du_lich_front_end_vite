import React from "react";

const SupportInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-gray-700">
      <p>
        📞 Hotline hỗ trợ: <strong>1900 1234</strong>
      </p>
      <p>
        📧 Email: <strong>support@tourbooking.vn</strong>
      </p>
      <p className="mt-2 text-gray-500">
        Chúng tôi luôn sẵn sàng hỗ trợ bạn.
      </p>
    </div>
  );
};

export default SupportInfo;
