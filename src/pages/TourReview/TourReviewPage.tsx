import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Review } from "../../types/review";
import defaultAvatar from "../../assets/avatar/default-avatar.svg";

const TourReviewPage: React.FC = () => {
  const location = useLocation();
  const reviews: Review[] = location.state?.reviews || [];

  const [sortType, setSortType] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  const [isOpen, setIsOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (imgs: string[], index: number) => {
    setCurrentImages(imgs);
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImg = () =>
    setCurrentIndex((i) => (i + 1) % currentImages.length);

  const prevImg = () =>
    setCurrentIndex((i) => (i - 1 + currentImages.length) % currentImages.length);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, currentImages]);

  const processedReviews = useMemo(() => {
    let data = [...reviews];

    if (filterType === "withImages")
      data = data.filter((r) => r.images && r.images.length > 0);

    if (["1", "2", "3", "4", "5"].includes(filterType))
      data = data.filter((r) => r.rating === Number(filterType));

    switch (sortType) {
      case "newest":
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "highToLow":
        data.sort((a, b) => b.rating - a.rating);
        break;
      case "lowToHigh":
        data.sort((a, b) => a.rating - b.rating);
        break;
    }

    return data;
  }, [reviews, sortType, filterType]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Tất cả đánh giá</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        {/* SORT */}
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="highToLow">Số sao: Cao → Thấp</option>
          <option value="lowToHigh">Số sao: Thấp → Cao</option>
        </select>

        {/* FILTER */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="all">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
          <option value="withImages">Có hình ảnh</option>
        </select>
      </div>

      <div className="space-y-6">
        {processedReviews.length === 0 && (
          <p className="text-gray-500 text-sm text-center">
            Không có đánh giá phù hợp.
          </p>
        )}

        {processedReviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-6 flex flex-col gap-4"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-3">
              <img
                src={review.user?.avatar || defaultAvatar}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {review.user?.lastName || "Người dùng"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} filled={i < review.rating} />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {review.rating}/5
              </span>
            </div>

            {/* COMMENT */}
            {review.comment && (
              <p className="text-gray-800 text-sm leading-relaxed">
                {review.comment}
              </p>
            )}

            {/* IMAGES */}
            {Array.isArray(review.images) && review.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {review.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() =>
                      openGallery(review.images as string[], index)
                    }
                    className="w-full h-28 rounded-lg object-cover cursor-pointer hover:opacity-90"
                    alt=""
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ✕
          </button>

          <img
            src={currentImages[currentIndex]}
            className="max-h-[80vh] max-w-[90vw] rounded-lg"
          />

          <button
            onClick={prevImg}
            className="absolute left-6 text-white text-4xl font-bold px-3"
          >
            ‹
          </button>

          <button
            onClick={nextImg}
            className="absolute right-6 text-white text-4xl font-bold px-3"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default TourReviewPage;

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.538 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.783.57-1.838-.197-1.539-1.118l1.288-3.967a1 1 0 00-.364-1.118L1.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.951-.69l1.286-3.967z" />
  </svg>
);
