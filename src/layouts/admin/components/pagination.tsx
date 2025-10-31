import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../store/slices/userSlice";
import { AppDispatch } from "../../../store";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(fetchUsers({ page }));
    }
  };

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Trước
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            page === currentPage
              ? "bg-gray-600 text-white border-gray-600"
              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Sau
      </button>
    </div>
  );
}
