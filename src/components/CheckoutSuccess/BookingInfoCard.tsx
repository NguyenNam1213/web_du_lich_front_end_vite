import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Calendar, Users, CreditCard, Hash } from "lucide-react";

const BookingInfoCard: React.FC = () => {
  const {
    bookingId,
    tourName,
    tourImage,
    bookingDate,
    participants,
    amount,
    currency,
  } = useSelector((state: RootState) => state.checkout);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Ảnh tour */}
      {tourImage && (
        <img
          src={tourImage}
          alt={tourName}
          className="w-full h-44 object-cover"
        />
      )}

      <div className="p-6 space-y-4">
        {/* Tên tour */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {tourName}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Hash className="w-4 h-4" />
            Mã booking: <span className="font-medium">#{bookingId}</span>
          </div>
        </div>

        <hr />

        {/* Thông tin chi tiết */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>Ngày tham quan:</span>
            <span className="font-medium">{bookingDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>Số người:</span>
            <span className="font-medium">{participants}</span>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <span>Tổng tiền:</span>
            <span className="font-semibold text-blue-600">
              {amount?.toLocaleString("vi-VN")} {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfoCard;
