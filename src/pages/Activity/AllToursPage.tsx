import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState } from "../../store";
import TourListItem from "../../components/Activity/TourListItem";

const AllToursPage = () => {
  const [searchParams] = useSearchParams();
  const tours = useSelector((state: RootState) => state.tour.tours);

  const filter = searchParams.get("filter"); // featured | top-rated | sale...
  const destinationId = searchParams.get("destination");
  const categoryId = searchParams.get("category");

  let filteredTours = [...tours];

  // ----------- FILTER LOGIC -----------
  if (filter === "featured") {
    filteredTours = filteredTours.filter(t => t.featured === true);
  }

  if (filter === "top-rated") {
    filteredTours = tours
      .map((tour) => {
        const reviewCount = tour.reviews?.length || 0;
        const averageRating =
          reviewCount > 0
            ? tour.reviews!.reduce((s, r) => s + (r.rating || 0), 0) / reviewCount
            : 0;
        return { ...tour, averageRating };
      })
      .filter((tour) => (tour as any).averageRating >= 4)
      .sort((a, b) => (b as any).averageRating - (a as any).averageRating);
  }

  if (destinationId) {
    filteredTours = filteredTours.filter(
      t => String(t.destinationId) === destinationId
    );
  }

  if (categoryId) {
    filteredTours = filteredTours.filter(
      t => String(t.categoryId) === categoryId
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {filter === "featured" && "Tất cả tour nổi bật"}
        {filter === "top-rated" && "Tất cả tour được đánh giá cao"}
        {!filter && "Tất cả tour"}
      </h1>

      <div className="flex flex-col gap-4">
        {filteredTours.map(tour => (
          <TourListItem key={tour.id} activity={tour} />
        ))}
      </div>
    </div>
  );
};

export default AllToursPage;
