"use client";

import { useEffect, useState } from "react";
import { ActivityService } from "../../../api/activity.service";
import { Activity } from "../../../types/activity";
import { Trash2, Edit2 } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";
import Pagination from "../components/pagination";

export default function ActivityManagementTable() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingActivityId, setDeletingActivityId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadActivities();
  }, [currentPage]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await ActivityService.getAllForAdmin(currentPage, ITEMS_PER_PAGE);
      setActivities(response.data.activities);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toastService.error("Không thể tải danh sách hoạt động");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingActivityId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingActivityId) return;
    
    try {
      await ActivityService.delete(deletingActivityId);
      toastService.success("Đã xóa hoạt động thành công!");
      setIsDeleteModalOpen(false);
      setDeletingActivityId(null);
      loadActivities();
    } catch (error) {
      toastService.error("Xóa hoạt động thất bại!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={loadActivities}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          Làm mới
        </button>
      </div>

      {loading && <p className="mb-4">Đang tải...</p>}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Tên</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Nhà cung cấp</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Điểm đến</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Giá</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Đánh giá</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Số lượt đặt</th>
                <th className="px-6 py-3 text-center text-sm font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Không có hoạt động nào
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 text-sm">{activity.id}</td>
                    <td className="px-6 py-3 text-sm max-w-xs">
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-xs text-gray-500">{activity.slug}</div>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {activity.supplier?.companyName || `Supplier #${activity.supplierId}`}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {activity.destination?.name || `Destination #${activity.destinationId}`}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: activity.currency || "VND",
                      }).format(Number(activity.price))}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {activity.rating ? `${activity.rating}/5` : "-"}
                      {activity.reviewCount !== undefined && activity.reviewCount > 0 && (
                        <div className="text-xs text-gray-500">
                          ({activity.reviewCount} đánh giá)
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {activity.bookings?.length || activity._count?.bookings || 0}
                    </td>
                    <td className="px-6 py-3 text-sm text-center">
                      <button
                        onClick={() => handleDelete(activity.id!)}
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
                      Bạn có chắc chắn muốn xóa hoạt động này không? Hành động này không thể hoàn tác.
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

