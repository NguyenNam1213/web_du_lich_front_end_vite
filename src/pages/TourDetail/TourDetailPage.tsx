import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Activity } from "../../types/activity";
import { ActivityService } from "../../api/activity.service";
import TourHeader from "../../components/TourDetail/TourHeader";
import TourBookingSummary from "../../components/TourDetail/TourBookingSummary";
import TourGallery from "../../components/TourDetail/TourGallery";
import TourOverview from "../../components/TourDetail/TourOverview";
import TourSchedules from "../../components/TourDetail/TourSchedules";
import TourSupplierInfo from "../../components/TourDetail/TourSupplierInfo";
import { TourReviews } from "../../components/TourDetail/TourReviews";

const TourDetailPage = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await ActivityService.getTourById(Number(id));
        setTour(res.data);
      } catch (err) {
        console.error("❌ Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Không tìm thấy tour
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-3 text-sm text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer">Trang chủ</span> /{" "}
          <span className="hover:text-blue-600 cursor-pointer">Tour</span> /{" "}
          <span className="text-gray-800 font-medium">{tour.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        {/* Header + Gallery */}
        <div className="mb-8">
          <TourHeader tour={tour} />
          <div className="mt-5">
            <TourGallery images={tour?.images} />
          </div>
        </div>

        {/* Grid */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cột trái: nội dung chi tiết */}
          <div className="flex-1 space-y-10">
            <TourOverview tour={tour} />
            <TourSchedules schedules={tour?.schedules} />
            <TourReviews reviews={tour?.reviews} />
            <TourSupplierInfo supplier={tour?.supplier} />
          </div>

          {/* Cột phải: box đặt tour (sticky) */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="sticky top-28">
              <TourBookingSummary tour={tour} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
