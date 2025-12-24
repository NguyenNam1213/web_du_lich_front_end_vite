"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  updateBookingStatusAsync,
  deleteBookingAsync,
  setFilters,
  clearFilters,
  setCurrentPage,
} from "../../../store/slices/bookingSlice";
import { RootState, AppDispatch } from "../../../store/index";
import { Booking, FilterBookingDto, UpdateBookingStatusDto } from "../types/booking.type";
import { Trash2, Edit2, X, Eye, Search } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";
import Pagination from "../components/pagination";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "refunded":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function BookingManagementTable() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    bookings = [],
    currentPage,
    totalPages,
    status,
    error,
    filters,
  } = useSelector((state: RootState) => state.bookings || {});

  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = bookings.slice(startIndex, endIndex);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFormData, setStatusFormData] = useState<UpdateBookingStatusDto>({
    status: undefined,
    paymentStatus: undefined,
  });
  const [localFilters, setLocalFilters] = useState<FilterBookingDto>(filters || {});

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBookings(filters));
    }
  }, [dispatch, status, filters]);

  const handleSearch = () => {
    dispatch(setFilters(localFilters));
    dispatch(fetchBookings(localFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    dispatch(clearFilters());
    dispatch(fetchBookings());
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleEditStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusFormData({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedBooking) return;

    try {
      await dispatch(
        updateBookingStatusAsync({
          id: selectedBooking.id,
          data: statusFormData,
        })
      ).unwrap();
      toastService.success("Cập nhật trạng thái thành công!");
      setIsStatusModalOpen(false);
      setSelectedBooking(null);
      dispatch(fetchBookings(filters));
    } catch (error: any) {
      toastService.error(error.message || "Cập nhật trạng thái thất bại!");
    }
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return;

    try {
      await dispatch(deleteBookingAsync(selectedBooking.id)).unwrap();
      toastService.success("Xóa booking thành công!");
      setIsDeleteModalOpen(false);
      setSelectedBooking(null);
      dispatch(fetchBookings(filters));
    } catch (error: any) {
      toastService.error(error.message || "Xóa booking thất bại!");
    }
  };

  const formatCurrency = (amount: number, currency: string = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <>
      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái Booking
            </label>
            <select
              value={localFilters.status || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  status: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tất cả</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái Thanh toán
            </label>
            <select
              value={localFilters.paymentStatus || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  paymentStatus: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tất cả</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              value={localFilters.dateFrom || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, dateFrom: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={localFilters.dateTo || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, dateTo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Mã booking, tên, email..."
              value={localFilters.search || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, search: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Search size={16} />
              Tìm kiếm
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      {status === "loading" && <p className="mb-4">Đang tải...</p>}
      {status === "failed" && (
        <p className="mb-4 text-red-500">Lỗi: {error}</p>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium">Mã Booking</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Khách hàng</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Hoạt động</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Ngày booking</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Số người</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Thanh toán</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  Không có booking nào
                </td>
              </tr>
            ) : (
              paginatedBookings.map((booking: Booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-3 text-sm font-medium">{booking.bookingRef}</td>
                  <td className="px-6 py-3 text-sm">
                    <div>{booking.customerName}</div>
                    <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {booking.activity?.name || `Activity #${booking.activityId}`}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-3 text-sm">{booking.participants}</td>
                  <td className="px-6 py-3 text-sm font-medium">
                    {formatCurrency(Number(booking.total), booking.currency)}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditStatus(booking)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Cập nhật trạng thái"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(booking)}
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
            dispatch(setCurrentPage(page));
          }}
        />
      )}

      {/* Detail Modal */}
      <Transition appear show={isDetailModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDetailModalOpen(false)}
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Chi tiết Booking
                    </h3>
                    <button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Title>

                  {selectedBooking && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Mã Booking
                          </label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingRef}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Ngày tạo
                          </label>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedBooking.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Tên khách hàng
                          </label>
                          <p className="text-sm text-gray-900">{selectedBooking.customerName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="text-sm text-gray-900">{selectedBooking.customerEmail}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Số điện thoại
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedBooking.customerPhone || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Ngày booking
                          </label>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedBooking.bookingDate).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Số người tham gia
                          </label>
                          <p className="text-sm text-gray-900">{selectedBooking.participants}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Hoạt động
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedBooking.activity?.name || `Activity #${selectedBooking.activityId}`}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Nhà cung cấp
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedBooking.supplier?.companyName || `Supplier #${selectedBooking.supplierId}`}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Tổng tiền
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {formatCurrency(Number(selectedBooking.total), selectedBooking.currency)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Giảm giá
                          </label>
                          <p className="text-sm text-gray-900">
                            {formatCurrency(Number(selectedBooking.discount), selectedBooking.currency)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Mã coupon
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedBooking.couponCode || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Trạng thái Booking
                          </label>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                              selectedBooking.status
                            )}`}
                          >
                            {selectedBooking.status}
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Trạng thái Thanh toán
                          </label>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                              selectedBooking.paymentStatus
                            )}`}
                          >
                            {selectedBooking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {selectedBooking.payments && selectedBooking.payments.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Lịch sử thanh toán
                          </label>
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left">Phương thức</th>
                                  <th className="px-4 py-2 text-left">Số tiền</th>
                                  <th className="px-4 py-2 text-left">Trạng thái</th>
                                  <th className="px-4 py-2 text-left">Ngày</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedBooking.payments.map((payment) => (
                                  <tr key={payment.id} className="border-t">
                                    <td className="px-4 py-2">{payment.method}</td>
                                    <td className="px-4 py-2">
                                      {formatCurrency(Number(payment.amount), payment.currency)}
                                    </td>
                                    <td className="px-4 py-2">
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                                          payment.status
                                        )}`}
                                      >
                                        {payment.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2">
                                      {new Date(payment.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Đóng
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Status Update Modal */}
      <Transition appear show={isStatusModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsStatusModalOpen(false)}
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
            <div className="flex min-h-full items-center justify-center p-4">
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
                  <Dialog.Title className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cập nhật trạng thái
                    </h3>
                    <button
                      onClick={() => setIsStatusModalOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái Booking
                      </label>
                      <select
                        value={statusFormData.status || ""}
                        onChange={(e) =>
                          setStatusFormData({
                            ...statusFormData,
                            status: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Giữ nguyên</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái Thanh toán
                      </label>
                      <select
                        value={statusFormData.paymentStatus || ""}
                        onChange={(e) =>
                          setStatusFormData({
                            ...statusFormData,
                            paymentStatus: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Giữ nguyên</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsStatusModalOpen(false)}
                      className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveStatus}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Lưu
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
            <div className="flex min-h-full items-center justify-center p-4">
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
                  <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                    Xác nhận xóa
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa booking này không? Hành động này không thể hoàn tác.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Xóa
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

