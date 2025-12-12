import { useNavigate } from "react-router-dom";
import { Activity } from "../../types/activity";
import { Star } from "lucide-react";

const TourListItem = ({ activity }: { activity: Activity }) => {
  const navigate = useNavigate();
  const img = activity.images?.[0]?.imageUrl ?? "/default.jpg";

  const rating = activity.reviews?.length
    ? (
        activity.reviews.reduce((s, r) => s + r.rating, 0) /
        activity.reviews.length
      ).toFixed(1)
    : null;

  const reviewCount = activity.reviews?.length || 0;

  return (
    <div
      className="flex group rounded-xl p-3 gap-3 shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer"
      onClick={() => navigate(`/tours/${activity.id}`)}
    >
      {/* IMAGE */}
      <div className="relative w-40 h-28 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={img}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1">
        {/* LOCATION */}
        {activity.destination && (
          <p className="text-xs text-gray-500">{activity.destination.name}</p>
        )}

        {/* TITLE */}
        <h3 className="text-lg font-semibold line-clamp-2">
          {activity.name}
        </h3>

        {/* RATING */}
        {rating && (
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Star size={14} className="text-yellow-400 mr-1" />
            <span className="font-medium">{rating}</span>
            <span className="ml-1 text-gray-500">({reviewCount} đánh giá)</span>
          </div>
        )}

        <p className="text-gray-600 text-sm line-clamp-2"> {activity.description} </p>

        {/* BADGES */}
        <div className="flex gap-2 mt-2">
          {activity.instantConfirmation && (
            <span className="text-green-700 bg-green-100 text-xs px-2 py-1 rounded-md">
              Xác nhận ngay
            </span>
          )}

          {activity.freeCancellation && (
            <span className="text-blue-700 bg-blue-100 text-xs px-2 py-1 rounded-md">
              Hủy miễn phí
            </span>
          )}
        </div>

        {/* PRICE */}
        <div className="text-right">
          <p className="text-gray-600 text-xs">Từ</p>
          <p className="text-red-600 font-bold text-xl">
            {activity.price.toLocaleString()}₫
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourListItem;
