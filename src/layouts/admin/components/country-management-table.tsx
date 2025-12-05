"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCountries,
  createCountryAsync,
  updateCountryAsync,
  deleteCountryAsync,
  setCurrentPage,
} from "../../../store/slices/countrySlice";
import { RootState, AppDispatch } from "../../../store/index";
import { Country } from "../types/country.type";
import { Trash2, Edit2, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";

export default function CountryManagementTable() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    countries = [],
    currentPage,
    totalPages,
    status,
    error,
  } = useSelector((state: RootState) => state.countries || {});

  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCountries = countries.slice(startIndex, endIndex);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCountryCode, setDeletingCountryCode] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Country>>({
    code: "",
    name: "",
  });
  const [editingCountryCode, setEditingCountryCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCountries());
    }
  }, [dispatch, status]);

  const handleEdit = (country: Country) => {
    setFormData({ ...country });
    setEditingCountryCode(country.code);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      code: "",
      name: "",
    });
    setEditingCountryCode(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (formData.code && formData.name) {
      if (editingCountryCode) {
        await dispatch(
          updateCountryAsync({
            code: editingCountryCode,
            countryData: formData,
          })
        );
      } else {
        await dispatch(createCountryAsync(formData));
      }
      setIsModalOpen(false);
      setFormData({ code: "", name: "" });
      setEditingCountryCode(null);
      dispatch(fetchCountries());
    }
  };

  const handleDelete = (code: string) => {
    setDeletingCountryCode(code);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCountryCode) return;
    
    try {
      await dispatch(deleteCountryAsync(deletingCountryCode));
      dispatch(fetchCountries());
      toastService.success("Đã xóa quốc gia thành công!");
      setIsDeleteModalOpen(false);
      setDeletingCountryCode(null);
    } catch (error) {
      toastService.error("Xóa quốc gia thất bại!");
    }
  };

  return (
    <>
      {/* Nút thêm country */}
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
        >
          Thêm Quốc Gia
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
              <th className="px-6 py-3 text-left text-sm font-medium">
                Mã Quốc Gia
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Tên Quốc Gia
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Ngày Tạo
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCountries.map((country: Country) => (
              <tr
                key={country.code}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-3 text-sm font-mono">{country.code}</td>
                <td className="px-6 py-3 text-sm font-medium">
                  {country.name}
                </td>
                <td className="px-6 py-3 text-sm">
                  {new Date(country.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  <button
                    onClick={() => handleEdit(country)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(country.code)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => dispatch(setCurrentPage(page))}
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
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal chỉnh sửa/thêm country */}
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
                    {editingCountryCode
                      ? "Chỉnh sửa Quốc Gia"
                      : "Thêm Quốc Gia"}
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
                      Mã Quốc Gia (ISO 2 ký tự)
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors font-mono"
                      required
                      maxLength={2}
                      placeholder="VD: VN"
                      disabled={!!editingCountryCode}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Tên Quốc Gia
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      required
                      placeholder="Ví dụ: Vietnam"
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
                  <h3 className="text-lg font-semibold text-gray-800">
                    Xóa Quốc Gia
                  </h3>
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
                    Bạn có chắc chắn muốn xóa quốc gia này không? Hành động này không
                    thể hoàn tác.
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
                    className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
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
