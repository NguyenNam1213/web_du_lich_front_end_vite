import React, { useEffect, useState } from "react";
import { ActivityImage } from "../../types/activityImage";

interface TourGalleryProps {
  images?: ActivityImage[];
}

const TourGallery: React.FC<TourGalleryProps> = ({ images }) => {
  const [showViewer, setShowViewer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Không có hình ảnh
      </div>
    );
  }

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setShowViewer(true);
  };

  const closeViewer = () => setShowViewer(false);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    if (!showViewer) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showViewer, currentIndex]);

  return (
    <>
      {/* Hiển thị ảnh preview */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <img
            src={images[0].imageUrl}
            className="w-full h-[400px] object-cover rounded-2xl cursor-pointer"
            onClick={() => openViewer(0)}
          />
        </div>

        <div className="grid grid-rows-2 gap-2">
          {images.slice(1, 3).map((img, idx) => (
            <img
              key={idx}
              src={img.imageUrl}
              className="w-full h-[195px] object-cover rounded-2xl cursor-pointer"
              onClick={() => openViewer(idx + 1)}
            />
          ))}
        </div>
      </div>

      {/* Modal Viewer */}
      {showViewer && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeViewer}
        >
          <button
            onClick={closeViewer}
            className="absolute top-5 right-5 text-white text-5xl font-thin hover:text-gray-300 transition z-10"
          >
            ×
          </button>

          <div 
            className="relative w-[900px] h-[600px] bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          >
            <img
              src={images[currentIndex].imageUrl}
              alt={`Tour image ${currentIndex + 1}`}
              className="w-full h-full object-cover" 
              loading="eager"
            />

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center
                        bg-white/10 hover:bg-white/30 text-white text-3xl rounded-full transition-all"
            >
              {"<"}
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center
                        bg-white/10 hover:bg-white/30 text-white text-3xl rounded-full transition-all"
            >
              {">"}
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TourGallery;
