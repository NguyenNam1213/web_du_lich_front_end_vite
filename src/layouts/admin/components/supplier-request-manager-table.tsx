"use client";

import { useEffect, useState } from "react";
import {
  SupplierRequestService,
  SupplierRequest,
  RequestType,
  RequestStatus,
} from "../../../api/supplierRequest.service";
import { CheckCircle2, XCircle, Trash2, Eye, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";
import Pagination from "../components/pagination";

export default function SupplierRequestManagerTable() {
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SupplierRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filters, setFilters] = useState<{
    type?: RequestType;
    status?: RequestStatus;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchRequests();
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await SupplierRequestService.getAll({
        ...filters,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: SupplierRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      await SupplierRequestService.approve(selectedRequest.id, adminNotes || undefined);
      toastService.success("Đã chấp nhận request thành công!");
      setIsActionModalOpen(false);
      setAdminNotes("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err: any) {
      toastService.error(err.response?.data?.message || "Chấp nhận request thất bại!");
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      await SupplierRequestService.reject(selectedRequest.id, adminNotes || undefined);
      toastService.success("Đã từ chối request!");
      setIsActionModalOpen(false);
      setAdminNotes("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err: any) {
      toastService.error(err.response?.data?.message || "Từ chối request thất bại!");
      console.error("Error rejecting request:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;

    try {
      await SupplierRequestService.delete(selectedRequest.id);
      toastService.success("Đã xóa request thành công!");
      setIsActionModalOpen(false);
      setAdminNotes("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err: any) {
      toastService.error(err.response?.data?.message || "Xóa request thất bại!");
      console.error("Error deleting request:", err);
    }
  };

  const openActionModal = (request: SupplierRequest, type: "approve" | "reject" | "delete") => {
    setSelectedRequest(request);
    setActionType(type);
    setAdminNotes("");
    setIsActionModalOpen(true);
  };

  const getTypeLabel = (type: RequestType) => {
    const labels: Record<RequestType, string> = {
      [RequestType.BECOME_SUPPLIER]: "Đăng ký Supplier",
      [RequestType.ADD_COUNTRY]: "Thêm Quốc gia",
      [RequestType.ADD_CITY]: "Thêm Thành phố",
      [RequestType.ADD_DESTINATION]: "Thêm Điểm đến",
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: RequestStatus) => {
    const styles: Record<RequestStatus, string> = {
      [RequestStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [RequestStatus.APPROVED]: "bg-green-100 text-green-800",
      [RequestStatus.REJECTED]: "bg-red-100 text-red-800",
    };
    const labels: Record<RequestStatus, string> = {
      [RequestStatus.PENDING]: "Đang chờ",
      [RequestStatus.APPROVED]: "Đã chấp nhận",
      [RequestStatus.REJECTED]: "Đã từ chối",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };


  return (
    <>
      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          value={filters.type || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              type: e.target.value ? (e.target.value as RequestType) : undefined,
            })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
        >
          <option value="">Tất cả loại</option>
          <option value={RequestType.BECOME_SUPPLIER}>Đăng ký Supplier</option>
          <option value={RequestType.ADD_COUNTRY}>Thêm Quốc gia</option>
          <option value={RequestType.ADD_CITY}>Thêm Thành phố</option>
          <option value={RequestType.ADD_DESTINATION}>Thêm Điểm đến</option>
        </select>

        <select
          value={filters.status || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value ? (e.target.value as RequestStatus) : undefined,
            })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value={RequestStatus.PENDING}>Đang chờ</option>
          <option value={RequestStatus.APPROVED}>Đã chấp nhận</option>
          <option value={RequestStatus.REJECTED}>Đã từ chối</option>
        </select>
      </div>

      {/* Loading/Error */}
      {loading && <p className="mb-4">Đang tải...</p>}
      {error && <p className="mb-4 text-red-500">Lỗi: {error}</p>}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Loại</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Ngày tạo</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-3 text-sm">{request.id}</td>
                <td className="px-6 py-3 text-sm">
                  {request.user
                    ? `${request.user.firstName || ""} ${
                        request.user.lastName || ""
                      } (${request.user.email})`
                    : `User ID: ${request.userId}`}
                </td>
                <td className="px-6 py-3 text-sm">{getTypeLabel(request.type)}</td>
                <td className="px-6 py-3 text-sm">{getStatusBadge(request.status)}</td>
                <td className="px-6 py-3 text-sm">
                  {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewDetails(request)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                    {request.status === RequestStatus.PENDING && (
                      <>
                        <button
                          type="button"
                          onClick={() => openActionModal(request, "approve")}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Chấp nhận"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openActionModal(request, "reject")}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Từ chối"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => openActionModal(request, "delete")}
                      className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Không có request nào
                </td>
              </tr>
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

      {/* Detail Modal */}
      <Transition appear show={isDetailModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDetailModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                <Dialog.Title className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Chi tiết Request
                  </h3>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {selectedRequest && (
                  <div className="px-6 py-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.id}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRequest.user
                          ? `${selectedRequest.user.firstName || ""} ${
                              selectedRequest.user.lastName || ""
                            } (${selectedRequest.user.email})`
                          : `User ID: ${selectedRequest.userId}`}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loại Request
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {getTypeLabel(selectedRequest.type)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Trạng thái
                      </label>
                      <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dữ liệu Request
                      </label>
                      <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs overflow-x-auto">
                        {JSON.stringify(selectedRequest.requestData, null, 2)}
                      </pre>
                    </div>

                    {selectedRequest.adminNotes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ghi chú Admin
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedRequest.adminNotes}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày tạo
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedRequest.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    {selectedRequest.processedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ngày xử lý
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedRequest.processedAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  >
                    Đóng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Action Modal (Approve/Reject/Delete) */}
      <Transition appear show={isActionModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsActionModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200">
                <Dialog.Title className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {actionType === "approve"
                      ? "Chấp nhận Request"
                      : actionType === "reject"
                      ? "Từ chối Request"
                      : "Xóa Request"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsActionModalOpen(false)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="px-6 py-4 space-y-4">
                  {actionType !== "delete" && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Ghi chú (tùy chọn)
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        rows={3}
                        placeholder="Nhập ghi chú cho request này..."
                      />
                    </div>
                  )}

                  {actionType === "delete" && (
                    <p className="text-sm text-gray-700">
                      Bạn có chắc chắn muốn xóa request này không? Hành động này không
                      thể hoàn tác.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsActionModalOpen(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (actionType === "approve") handleApprove();
                      else if (actionType === "reject") handleReject();
                      else if (actionType === "delete") handleDelete();
                    }}
                    className={`px-4 py-2 text-sm text-white rounded-lg transition-colors shadow-sm ${
                      actionType === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : actionType === "reject"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {actionType === "approve"
                      ? "Chấp nhận"
                      : actionType === "reject"
                      ? "Từ chối"
                      : "Xóa"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

