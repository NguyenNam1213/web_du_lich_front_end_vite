import { Star, MapPin, Heart } from "lucide-react";
import { Activity } from "../../types/activity";
import WishlistService from "../../api/wishlist.service";
import { useEffect, useState } from "react";

interface TourHeaderProps {
  tour: Activity;
}

const TourHeader: React.FC<TourHeaderProps> = ({ tour }) => {
  const reviewCount = tour.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? (
          tour.reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        ).toFixed(1)
      : "0.0";

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await WishlistService.getMyWishlist();
        const existed = res.data.some((i: any) => i.activityId === tour.id);
        setIsLiked(existed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWishlistStatus();
  }, [tour.id]);

  const handleAddWishlist = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào wishlist!");
      return;
    }

    try {
      if(!isLiked) {
        await WishlistService.addToWishlist(tour.id);
        setIsLiked(true); 
      }
      else {
        await WishlistService.removeFromWishlist(tour.id);
        setIsLiked(false);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể thêm vào wishlist!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        {/* LEFT */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{tour.name}</h1>

          <div className="flex flex-wrap items-center text-gray-600 text-sm mb-3">
            <div className="flex items-center mr-4">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-medium">{averageRating}</span>
              {tour.reviewCount && (
                <span className="ml-1">({tour.reviewCount} đánh giá)</span>
              )}
            </div>

            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-blue-500" />
              <span>{tour.destination?.name || "Địa điểm không xác định"}</span>
            </div>
          </div>

          {tour.featured && (
            <div className="mt-3">
              <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Nổi bật
              </span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <button
          onClick={handleAddWishlist}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition
                     border-red-300 hover:border-red-400"
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? "text-red-600 fill-red-600" : "text-red-500"
            }`}
          />
          <span className="text-red-600 font-medium">
            {isLiked ? "Đã yêu thích" : "Thêm vào wishlist"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TourHeader;
