import React, { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ActivityService } from "../../api/activity.service";
import { Activity } from "../../types/activity";
import { useNavigate } from "react-router-dom";

const TourList: React.FC = () => {
  const [tours, setTours] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const toursPerSlide = 3; 

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await ActivityService.getAllTour();
        setTours(res.data);
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const totalSlides = Math.ceil(tours.length / toursPerSlide);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Đang tải danh sách tour...
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không có tour nào được tìm thấy.
      </div>
    );
  }

  const startIndex = currentSlide * toursPerSlide;
  const visibleTours = tours.slice(startIndex, startIndex + toursPerSlide);

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Tour du lịch đặc sắc
      </h2>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
        {visibleTours.map((tour) => {
          const imageUrl =
            tour.images && tour.images.length > 0
              ? tour.images.find((img) => img.isPrimary)?.imageUrl ||
                tour.images[0].imageUrl
              : "https://via.placeholder.com/300x200?text=No+Image";

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
                {tour.featured && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2 text-gray-800">
                    {tour.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span>{tour.rating || "Chưa có đánh giá"}</span>
                    <span className="mx-2">•</span>
                    <span>{tour.destination?.name || "Không rõ địa điểm"}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-lg font-bold text-blue-600">
                    {parseFloat(tour.price).toLocaleString("vi-VN")} {tour.currency}
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
              index === currentSlide ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TourList;
