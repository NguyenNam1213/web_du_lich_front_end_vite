import React from "react";
import { Calendar, Users } from "lucide-react";
import { Activity } from "../../types/activity";
import { useDispatch } from "react-redux";
import { setBookingDate, setParticipants, setTourId, setTourImage, setTourName } from "../../store/slices/checkoutSlice";

interface Props {
  tour: Activity;
  date: string;
  participants: number;
}

const OrderSummaryCard: React.FC<Props> = ({ tour, date, participants }) => {
  const dispatch = useDispatch();
  dispatch(setTourId(tour.id));
  dispatch(setTourName(tour.name));
  dispatch(setTourImage(tour.images?.[0]?.imageUrl));
  dispatch(setBookingDate(date));
  dispatch(setParticipants(participants));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

      {/* Ảnh */}
      <img
        src={tour.images?.[0]?.imageUrl}
        alt={tour.name}
        className="w-full h-40 rounded-xl object-cover mb-3"
      />

      {/* Tên */}
      <p className="font-medium text-gray-800 mb-2">{tour.name}</p>

      {/* Ngày */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Calendar className="w-4 h-4" />
        <span>Ngày tham quan: {date ? date : "Chưa chọn"}</span>
      </div>

      {/* Số lượng */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="w-4 h-4" />
        <span>Số lượng: {participants} người</span>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
