"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  createSupplierAsync,
  updateSupplierAsync,
  deleteSupplierAsync,
} from "../../../store/slices/supplierSlice";
import { RootState, AppDispatch } from "../../../store/index";
import { Supplier } from "../../admin/types/supplier.type";
import { Trash2, Edit2, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function SupplierManagementTable() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    suppliers = [],
    status,
    error,
  } = useSelector((state: RootState) => state.suppliers || {});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    companyName: "",
    businessEmail: "",
    phone: "",
    address: "",
    commissionRate: 15,
    userId: "",
  });
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(
    null
  );

  // Lấy danh sách suppliers khi component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSuppliers());
    }
  }, [dispatch, status]);

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      ...supplier,
      userId: supplier.userId.toString(),
    });
    setEditingSupplierId(supplier.id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      companyName: "",
      businessEmail: "",
      phone: "",
      address: "",
      commissionRate: 15,
      userId: "",
    });
    setEditingSupplierId(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (formData && formData.companyName && formData.userId) {
      const dataToSend = {
        ...formData,
        userId: Number(formData.userId),
      };

      if (editingSupplierId) {
        // Sửa supplier
        await dispatch(
          updateSupplierAsync({
            id: editingSupplierId,
            supplierData: dataToSend,
          })
        );
      } else {
        // Thêm supplier
        await dispatch(createSupplierAsync(dataToSend));
      }
      setIsModalOpen(false);
      setFormData({
        companyName: "",
        businessEmail: "",
        phone: "",
        address: "",
        commissionRate: 15,
        userId: "",
      });
      setEditingSupplierId(null);
      // Tải lại danh sách
      dispatch(fetchSuppliers());
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa supplier này không?")) {
      await dispatch(deleteSupplierAsync(id));
      dispatch(fetchSuppliers());
    }
  };

  return (
    <>
      {/* Nút thêm supplier */}
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
        >
          Thêm Supplier
        </button>
      </div>

      {/* Hiển thị trạng thái */}
      {status === "loading" && <p className="mb-4">Đang tải...</p>}
      {status === "failed" && <p className="mb-4 text-red-500">Lỗi: {error}</p>}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Tên công ty
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Điện thoại
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Hoa hồng (%)
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Người dùng
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier: Supplier) => (
              <tr
                key={supplier.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-3 text-sm">{supplier.id}</td>
                <td className="px-6 py-3 text-sm font-medium">
                  {supplier.companyName}
                </td>
                <td className="px-6 py-3 text-sm">
                  {supplier.businessEmail || "-"}
                </td>
                <td className="px-6 py-3 text-sm">{supplier.phone || "-"}</td>
                <td className="px-6 py-3 text-sm max-w-xs truncate">
                  {supplier.address || "-"}
                </td>
                <td className="px-6 py-3 text-sm">
                  {supplier.commissionRate}%
                </td>
                <td className="px-6 py-3 text-sm">
                  {supplier.user
                    ? `${supplier.user.firstName || ""} ${
                        supplier.user.lastName || ""
                      } (${supplier.user.email})`
                    : `User ID: ${supplier.userId}`}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chỉnh sửa/thêm supplier */}
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
                    {editingSupplierId ? "Chỉnh sửa Supplier" : "Thêm Supplier"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Tên công ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Email công ty
                    </label>
                    <input
                      type="email"
                      value={formData.businessEmail ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Điện thoại
                    </label>
                    <input
                      type="text"
                      value={formData.phone ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Địa chỉ
                    </label>
                    <textarea
                      value={formData.address ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Hoa hồng (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.commissionRate ?? 15}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commissionRate: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.userId ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      required
                    />
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
    </>
  );
}
