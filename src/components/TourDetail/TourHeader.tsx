import { Star, MapPin } from "lucide-react";
import { Activity } from "../../types/activity";

interface TourHeaderProps {
  tour: Activity;
}

const TourHeader: React.FC<TourHeaderProps> = ({ tour }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* 🔹 Tiêu đề */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{tour.name}</h1>

      {/* 🔹 Đánh giá + địa điểm */}
      <div className="flex flex-wrap items-center text-gray-600 text-sm mb-3">
        <div className="flex items-center mr-4">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="font-medium">{tour.rating || "Chưa có đánh giá"}</span>
          {tour.reviewCount && (
            <span className="ml-1">({tour.reviewCount} đánh giá)</span>
          )}
        </div>

        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
          <span>{tour.destination?.name || "Địa điểm không xác định"}</span>
        </div>
      </div>

      {/* 🔹 Tag nổi bật (nếu có) */}
      {tour.featured && (
        <div className="mt-3">
          <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Nổi bật
          </span>
        </div>
      )}
    </div>
  );
};

export default TourHeader;
