"use client";

import { useEffect, useState } from "react";
import { CouponService, CreateCouponDto, CouponAdmin } from "../../../api/coupon.service";
import { Trash2, Edit2, X, Plus } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";
import Pagination from "../components/pagination";

export default function CouponManagementTable() {
  const [coupons, setCoupons] = useState<CouponAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCouponCode, setDeletingCouponCode] = useState<string | null>(null);
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCouponDto>({
    code: "",
    name: "",
    discountType: "percentage",
    discountValue: 0,
    minAmount: 0,
    maxDiscount: null,
    usageLimit: null,
    validFrom: "",
    validTo: "",
    isActive: true,
    userId: null,
  });

  useEffect(() => {
    fetchCoupons();
  }, [currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await CouponService.list(undefined, currentPage, ITEMS_PER_PAGE);
      setCoupons(res.data.coupons);
      setTotalPages(res.data.totalPages);
    } catch (error: any) {
      toastService.error("Lỗi khi tải danh sách coupon!");
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      code: "",
      name: "",
      discountType: "percentage",
      discountValue: 0,
      minAmount: 0,
      maxDiscount: null,
      usageLimit: null,
      validFrom: "",
      validTo: "",
      isActive: true,
      userId: null,
    });
    setEditingCouponCode(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: CouponAdmin) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      minAmount: Number(coupon.minAmount),
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
      usageLimit: coupon.usageLimit ? Number(coupon.usageLimit) : null,
      validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
      validTo: new Date(coupon.validTo).toISOString().split("T")[0],
      isActive: coupon.isActive,
      userId: coupon.userId ? Number(coupon.userId) : null,
    });
    setEditingCouponCode(coupon.code);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name || !formData.validFrom || !formData.validTo) {
      toastService.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (editingCouponCode) {
        // Edit mode - delete old and create new (vì backend không có update endpoint)
        await CouponService.delete(editingCouponCode);
        await CouponService.create(formData);
        toastService.success("Cập nhật coupon thành công!");
      } else {
        await CouponService.create(formData);
        toastService.success("Tạo coupon thành công!");
      }
      setIsModalOpen(false);
      setFormData({
        code: "",
        name: "",
        discountType: "percentage",
        discountValue: 0,
        minAmount: 0,
        maxDiscount: null,
        usageLimit: null,
        validFrom: "",
        validTo: "",
        isActive: true,
        userId: null,
      });
      setEditingCouponCode(null);
      fetchCoupons();
    } catch (error: any) {
      toastService.error(
        error.response?.data?.message || "Lỗi khi lưu coupon!"
      );
    }
  };

  const handleDelete = (code: string) => {
    setDeletingCouponCode(code);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCouponCode) return;

    try {
      await CouponService.delete(deletingCouponCode);
      toastService.success("Đã xóa coupon thành công!");
      setIsDeleteModalOpen(false);
      setDeletingCouponCode(null);
      fetchCoupons();
    } catch (error: any) {
      toastService.error(
        error.response?.data?.message || "Xóa coupon thất bại!"
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDiscount = (coupon: CouponAdmin) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%${coupon.maxDiscount ? ` (tối đa ${coupon.maxDiscount})` : ""}`;
    }
    return `${coupon.discountValue} VND`;
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Quản lý Coupon</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm Coupon
        </button>
      </div>

      {loading && <p className="mb-4">Đang tải...</p>}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium">Mã</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Tên</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Loại giảm</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Giá trị</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Đơn tối thiểu</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Đã dùng</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Hạn sử dụng</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Loại</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                <th className="px-6 py-3 text-center text-sm font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    Chưa có coupon nào
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon.code}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 text-sm font-mono font-semibold">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-3 text-sm">{coupon.name}</td>
                    <td className="px-6 py-3 text-sm">
                      {coupon.discountType === "percentage" ? "Phần trăm" : "Cố định"}
                    </td>
                    <td className="px-6 py-3 text-sm">{formatDiscount(coupon)}</td>
                    <td className="px-6 py-3 text-sm">
                      {Number(coupon.minAmount).toLocaleString("vi-VN")} VND
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {coupon.usedCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                    </td>
                    <td className="px-6 py-3 text-sm">{formatDate(coupon.validTo)}</td>
                    <td className="px-6 py-3 text-sm">
                      {coupon.userId ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Riêng tư
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Công khai
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {coupon.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          Tắt
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-center">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.code)}
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

      {/* Modal tạo/chỉnh sửa coupon */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
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

          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 my-8">
                <Dialog.Title className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {editingCouponCode ? "Chỉnh sửa Coupon" : "Thêm Coupon"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Mã Coupon *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value.toUpperCase() })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors font-mono"
                        required
                        placeholder="VD: SALE10"
                        disabled={!!editingCouponCode}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Tên Coupon *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        required
                        placeholder="VD: Giảm 10%"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Loại giảm giá *
                      </label>
                      <select
                        value={formData.discountType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountType: e.target.value as "percentage" | "fixed",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      >
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Cố định (VND)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Giá trị giảm *
                      </label>
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountValue: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Đơn tối thiểu (VND)
                      </label>
                      <input
                        type="number"
                        value={formData.minAmount || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minAmount: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Giảm tối đa (VND) - chỉ cho phần trăm
                      </label>
                      <input
                        type="number"
                        value={formData.maxDiscount || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxDiscount: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        min="0"
                        placeholder="Không giới hạn"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Số lần sử dụng tối đa
                      </label>
                      <input
                        type="number"
                        value={formData.usageLimit || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            usageLimit: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        min="1"
                        placeholder="Không giới hạn"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        User ID (để trống = công khai)
                      </label>
                      <input
                        type="number"
                        value={formData.userId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            userId: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        placeholder="Để trống = công khai"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Ngày bắt đầu *
                      </label>
                      <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) =>
                          setFormData({ ...formData, validFrom: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Ngày kết thúc *
                      </label>
                      <input
                        type="date"
                        value={formData.validTo}
                        onChange={(e) =>
                          setFormData({ ...formData, validTo: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Kích hoạt coupon
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    Lưu
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Modal xác nhận xóa */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
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
                  <h3 className="text-lg font-semibold text-gray-800">Xóa Coupon</h3>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="px-6 py-4 space-y-4">
                  <p className="text-sm text-gray-700">
                    Bạn có chắc chắn muốn xóa coupon <strong>{deletingCouponCode}</strong> không? Hành động này không thể hoàn tác.
                  </p>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Xóa
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

