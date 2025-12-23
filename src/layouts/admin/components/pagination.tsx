import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../store/slices/userSlice";
import { AppDispatch } from "../../../store";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

// Helper function to calculate pages to show
export const calculatePagesToShow = (
  currentPage: number,
  totalPages: number
): (number | string)[] => {
  if (totalPages <= 5) {
    // If total pages <= 5, show all
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  // Always show first page
  pages.push(1);

  // Handle middle section
  if (currentPage === 1) {
    // Page 1: 1, 2, ..., totalPages
    if (nextPage <= totalPages && nextPage !== totalPages && nextPage !== 1) {
      pages.push(nextPage);
    }
    if (totalPages > 3) {
      pages.push("...");
    }
  } else if (currentPage === totalPages) {
    // Last page: 1, ..., totalPages-1, totalPages
    if (totalPages > 3) {
      pages.push("...");
    }
    if (prevPage > 1 && prevPage !== totalPages) {
      pages.push(prevPage);
    }
  } else {
    // Middle page: 1, ..., prevPage, currentPage, nextPage, ..., totalPages
    if (currentPage > 3) {
      pages.push("...");
    }

    // Add previous page if valid
    if (prevPage > 1) {
      pages.push(prevPage);
    }

    // Add current page
    pages.push(currentPage);

    // Add next page if valid
    if (nextPage < totalPages) {
      pages.push(nextPage);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
  }

  // Always show last page (if not page 1)
  if (totalPages !== 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (onPageChange) {
        // Use custom callback if provided
        onPageChange(page);
      } else {
        // Default: dispatch for users
        dispatch(fetchUsers({ page }));
      }
    }
  };

  const pagesToShow = calculatePagesToShow(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Trước
      </button>

      {pagesToShow.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-2 text-gray-500"
            >
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        return (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              pageNumber === currentPage
                ? "bg-gray-600 text-white border-gray-600"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

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
