"use client";

import { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "../../../api/review.service";
import { Review } from "../../../types/review";
import { Trash2, Star } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";
import Pagination from "../components/pagination";

export default function ReviewManagementTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadReviews();
  }, [currentPage]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews(currentPage, ITEMS_PER_PAGE);
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
    } catch (error) {
      toastService.error("Không thể tải danh sách đánh giá");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingReviewId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReviewId) return;
    
    try {
      await deleteReview(deletingReviewId);
      toastService.success("Đã xóa đánh giá thành công!");
      setIsDeleteModalOpen(false);
      setDeletingReviewId(null);
      loadReviews();
    } catch (error) {
      toastService.error("Xóa đánh giá thất bại!");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={loadReviews}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          Làm mới
        </button>
      </div>

      {loading && <p className="mb-4">Đang tải...</p>}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Người dùng</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Hoạt động</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Đánh giá</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Bình luận</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Ngày tạo</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Không có đánh giá nào
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-3 text-sm">{review.id}</td>
                  <td className="px-6 py-3 text-sm">
                    {review.user?.lastName || `User #${review.userId}`}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {review.activity?.name ? (
                      <>
                        <div>{review.activity.name}</div>
                        <div className="text-xs text-gray-500">ID: {review.activityId}</div>
                      </>
                    ) : (
                      `Activity #${review.activityId}`
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-1 text-gray-600">({review.rating})</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm max-w-xs truncate">
                    {review.comment || "-"}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-3 text-sm text-center">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      )}

      {/* Delete Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Xác nhận xóa
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                      onClick={handleDeleteConfirm}
                    >
                      Xóa
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

