import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Sparkles, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRecommendedTours } from "../../api/recommendations.service";
import { useUser } from "../../context/UserContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const RecommendedTours: React.FC = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false); // Track xem đang hiển thị recommendations hay featured
  const navigate = useNavigate();
  const { userData } = useUser();
  const allTours = useSelector((state: RootState) => state.tour.tours);

  const toursPerSlide = 4;

  useEffect(() => {
    const fetchRecommendedTours = async () => {
      // Chỉ fetch nếu user đã đăng nhập
      if (!userData) {
        setLoading(false);
        return;
      }

      try {
        const res = await getRecommendedTours(12); // Lấy 12 tours
        if (res.success && res.tours && res.tours.length > 0) {
          setTours(res.tours);
          setIsRecommended(true);
        } else {
          // Nếu không có recommendations, lấy featured tours
          const featuredTours = allTours
            .filter((tour) => tour.featured === true)
            .slice(0, 12);
          setTours(featuredTours);
          setIsRecommended(false);
        }
      } catch (err) {
        console.error("Error fetching recommended tours:", err);
        // Nếu lỗi, fallback về featured tours
        const featuredTours = allTours
          .filter((tour) => tour.featured === true)
          .slice(0, 12);
        setTours(featuredTours);
        setIsRecommended(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedTours();
  }, [userData, allTours]);

  const totalSlides = Math.ceil(tours.length / toursPerSlide);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const startIndex = currentSlide * toursPerSlide;
  const visibleTours = tours.slice(startIndex, startIndex + toursPerSlide);

  // Không hiển thị nếu user chưa đăng nhập
  if (!userData) {
    return null;
  }

  if (loading) {
    return (
      <div className="relative px-4 md:px-8 lg:px-12 mt-10 max-w-[90%] mx-auto">
        <div className="flex justify-center items-center h-64 text-gray-500">
          Đang tải tour đề xuất...
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return null;
  }

  return (
    <div className="relative px-4 md:px-8 lg:px-12 mt-10 max-w-[90%] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isRecommended ? "Tour đề xuất cho bạn" : "Tour nổi bật"}
        </h2>

        {/* ⭐ Nút xem tất cả */}
        <button
          onClick={() => navigate("/tours/all")}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Xem tất cả
        </button>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronRight size={20} />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
        {visibleTours.map((tour) => {
          const imageUrl =
            tour.images && tour.images.length > 0
              ? tour.images.find((img: any) => img.isPrimary)?.imageUrl ||
                tour.images[0].imageUrl
              : "https://via.placeholder.com/300x200?text=No+Image";

          const reviewCount = tour.reviews?.length || 0;
          const averageRating =
            reviewCount > 0
              ? tour.reviews.reduce((s: number, r: any) => s + r.rating, 0) /
                reviewCount
              : 0;

          return (
            <div
              key={tour.id}
              onClick={() => navigate(`/tours/${tour.id}`)}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={tour.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-2 left-2 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                    isRecommended
                      ? "bg-purple-600"
                      : "bg-orange-500"
                  }`}
                >
                  {isRecommended ? (
                    <>
                      <Sparkles size={12} />
                      Đề xuất
                    </>
                  ) : (
                    <>
                      <Award size={12} />
                      Nổi bật
                    </>
                  )}
                </span>
              </div>

              <div className="p-4 flex flex-col justify-between h-[140px]">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2 text-gray-800">
                    {tour.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    {averageRating > 0 && (
                      <>
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span>{averageRating.toFixed(1)}</span>
                        <span className="mx-2">•</span>
                      </>
                    )}
                    <span>
                      {tour.destination?.name || "Không rõ địa điểm"}
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-lg font-bold text-blue-600">
                    {parseFloat(tour.price || 0).toLocaleString("vi-VN")}{" "}
                    {tour.currency || "USD"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-purple-500" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default RecommendedTours;

