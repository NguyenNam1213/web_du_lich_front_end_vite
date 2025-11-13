import React from "react";
import { Activity } from "../../types/activity";
import { MapPin, Clock, Star, CheckCircle, XCircle } from "lucide-react";

interface TourOverviewProps {
  tour?: Activity;
}

export const TourOverview: React.FC<TourOverviewProps> = ({ tour }) => {
  if (!tour)
    return (
      <div className="text-center text-gray-500 py-8">
        Đang tải thông tin tour...
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      {/* Tên tour */}
      <h1 className="text-2xl font-semibold text-gray-900">{tour.name}</h1>

      {/* Đánh giá + Địa điểm */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600">
        <div className="flex items-center gap-1">
          <Star className="text-yellow-500 w-5 h-5" />
          <span className="font-medium text-gray-800">{tour.rating}</span>
          <span>({tour.reviewCount} đánh giá)</span>
        </div>

        <div className="flex items-center gap-1">
          <MapPin className="w-5 h-5 text-blue-500" />
          <span>{tour.destination?.name}</span>
        </div>
      </div>

      {/* Giá + thời lượng */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-5 h-5 text-gray-500" />
          <span>Thời lượng: {tour.duration} giờ</span>
        </div>

        <div className="text-2xl font-bold text-rose-600">
          {tour.price.toLocaleString()} {tour.currency}
        </div>
      </div>

      {/* Tiện ích */}
      <div className="flex flex-wrap gap-3 mt-2">
        {tour.instantConfirmation ? (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Xác nhận ngay lập tức
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <XCircle className="w-4 h-4" />
            Xác nhận thủ công
          </div>
        )}

        {tour.freeCancellation ? (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Hủy miễn phí
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <XCircle className="w-4 h-4" />
            Không hoàn hủy
          </div>
        )}
      </div>

      {/* Mô tả */}
      <div className="mt-4 text-gray-700 leading-relaxed">
        {tour.description || "Chưa có mô tả cho tour này."}
      </div>

      {/* Highlights */}
      {tour.highlights && tour.highlights.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Điểm nổi bật
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {tour.highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TourOverview;