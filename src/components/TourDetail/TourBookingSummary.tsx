import React, { use, useState } from "react";
import { Calendar, Users, Check } from "lucide-react";
import { Activity } from "../../types/activity";
import { useNavigate } from "react-router-dom";
import { BookingService } from "../../api/booking.service";

interface TourBookingSummaryProps {
  tour?: Activity;
}

export const TourBookingSummary: React.FC<TourBookingSummaryProps> = ({ tour }) => {
  const [date, setDate] = useState<string>("");
  const [participants, setParticipants] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  if (!tour)
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
        Đang tải thông tin đặt tour...
      </div>
    );
  
  const handleBooking = async () => {
    if(!date) {
      setError("Vui lòng chọn ngày tham quan.");
      return;
    }
    if(participants < 1) {
      setError("Số lượng người tham gia phải lớn hơn hoặc bằng 1.");
      return;
    }
    setError("");

    try {
      const payLoad = {
        activityId: Number(tour.id),
        supplierId: Number(tour.supplier?.id),
        scheduleId: Number(tour.schedules?.[0]?.id || 1), // Tùy vào design, tạm lấy lịch đầu tiên

        customerName: "User Name", // bạn có thể lấy từ Profile API
        customerEmail: "user@gmail.com",
        customerPhone: "0123456789",

        bookingDate: date,
        participants: participants,

        subtotal: tour.price * participants,
        discount: 0,
        total: tour.price * participants,
        currency: tour.currency,
      };

      console.log("📦 Payload trước khi gọi API:", payLoad);
    
      const res = await BookingService.createBooking(payLoad);
      console.log("📌 DATA SEND TO PRISMA:", res.data);

      navigate(`/checkout/${res.data.id}`, {
        state: {
          tour,
          date,
          participants,
      }});

    } catch(err){
      console.log("❌ Booking error:", err.response?.data);
      setError("Có lỗi xảy ra khi đặt tour. Vui lòng thử lại!");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
      {/* Giá */}
      <div className="text-2xl font-bold text-rose-600">
        {tour.price.toLocaleString("vi-VN")} {tour.currency}
      </div>
      <p className="text-sm text-gray-500 mb-4">/ người</p>

      {/* Chọn ngày */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Chọn ngày tham quan
        </label>
        <input
          type="date"
          className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Số lượng người */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <Users className="w-4 h-4" />
          Số lượng người tham gia
        </label>
        <div className="flex items-center gap-2 mt-1">
          <button
            className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setParticipants((p) => Math.max(1, p - 1))}
          >
            -
          </button>
          <span className="text-gray-800 font-medium">{participants}</span>
          <button
            className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setParticipants((p) => p + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

      {/* Tổng cộng */}
      <div className="border-t border-gray-200 my-4 pt-4 flex justify-between text-gray-700">
        <span>Tổng cộng:</span>
        <span className="font-semibold text-blue-600">
          {(tour.price * participants).toLocaleString("vi-VN")} {tour.currency}
        </span>
      </div>

      {/* Nút đặt */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        onClick={handleBooking}
      >
        Đặt ngay
      </button>

      {/* Ưu đãi / chính sách */}
      <div className="mt-5 space-y-2 text-sm text-gray-600">
        {tour.instantConfirmation && (
          <div className="flex items-center gap-2">
            <Check className="text-green-500 w-4 h-4" />
            Xác nhận ngay lập tức
          </div>
        )}
        {tour.freeCancellation && (
          <div className="flex items-center gap-2">
            <Check className="text-green-500 w-4 h-4" />
            Hủy miễn phí trước ngày tham quan
          </div>
        )}
      </div>
    </div>
  );
};

export default TourBookingSummary;