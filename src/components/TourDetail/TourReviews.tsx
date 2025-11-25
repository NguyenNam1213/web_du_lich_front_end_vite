import React, { useState, useEffect } from "react";
import { Review } from "../../types/review";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/avatar/default-avatar.svg";
import TourHeader from "./TourHeader";

interface TourReviewsProps {
  reviews?: Review[];
}

export const TourReviews: React.FC<TourReviewsProps> = ({
  reviews = []
}) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activityId = reviews.length > 0 ? reviews[0].activityId : null;

  const openGallery = (images: string[], index: number) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImg = () =>
    setCurrentIndex((prev) => (prev + 1) % currentImages.length);

  const prevImg = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + currentImages.length) % currentImages.length
    );

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, currentImages]);

  const displayedReviews = reviews.slice(0, 3);

  return (
    <div className="w-full space-y-6">
      {reviews.length === 0 && (
        <p className="text-gray-500 text-sm text-center">
          Chưa có đánh giá nào cho hoạt động này.
        </p>
      )}

      {displayedReviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-gray-200 pb-6 flex flex-col gap-4"
        >
          {/* USER INFO */}
          <div className="flex items-center gap-3">
            <img
              src={review.user?.avatar || defaultAvatar}
              alt={review.user?.lastName}
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
          <div className="flex items-center">
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

          {/* IMAGES GRID */}
          {Array.isArray(review.images) && review.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {review.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => openGallery(review.images!, index)}
                  className="w-full h-24 rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
                  alt="review-img"
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {reviews.length > 3 && activityId && (
        <div className="text-center mt-4">
          <button
            onClick={() => navigate(`/tours/${activityId}/reviews`, { state: { reviews } })}
            className="text-blue-600 font-medium hover:underline"
          >
            Xem tất cả đánh giá ({reviews.length})
          </button>
        </div>
      )}

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

/* ⭐ STAR COMPONENT */
const Star = ({ filled }: { filled: boolean }) => {
  return (
    <svg
      className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.538 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.783.57-1.838-.197-1.539-1.118l1.288-3.967a1 1 0 00-.364-1.118L1.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.951-.69l1.286-3.967z" />
    </svg>
  );
};
