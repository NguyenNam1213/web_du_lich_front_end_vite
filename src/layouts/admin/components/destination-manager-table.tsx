"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDestinations,
  createDestinationAsync,
  updateDestinationAsync,
  deleteDestinationAsync,
  setCurrentPage,
} from "../../../store/slices/destinationSlice";
import { fetchCities } from "../../../store/slices/citySlice";
import { RootState, AppDispatch } from "../../../store/index";
import { Destination } from "../types/destination.type";
import { Trash2, Edit2, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";
import Pagination from "../components/pagination";

export default function DestinationManagementTable() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    destinations = [],
    currentPage,
    totalPages,
    status,
    error,
  } = useSelector((state: RootState) => state.destinations || {});

  const { cities = [] } = useSelector((state: RootState) => state.cities || {});

  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDestinations = destinations.slice(startIndex, endIndex);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDestinationId, setDeletingDestinationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: "",
    slug: "",
    cityId: "",
    imageUrl: "",
  });
  const [editingDestinationId, setEditingDestinationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDestinations());
    }
    dispatch(fetchCities());
  }, [dispatch, status]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleEdit = (destination: Destination) => {
    setFormData({ ...destination });
    setEditingDestinationId(destination.id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      slug: "",
      cityId: cities[0]?.id || "",
      imageUrl: "",
    });
    setEditingDestinationId(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (formData.name && formData.slug && formData.cityId) {
      if (editingDestinationId) {
        await dispatch(
          updateDestinationAsync({
            id: editingDestinationId,
            destinationData: formData,
          })
        );
      } else {
        await dispatch(createDestinationAsync(formData));
      }
      setIsModalOpen(false);
      setFormData({ name: "", slug: "", cityId: "", imageUrl: "" });
      setEditingDestinationId(null);
      dispatch(fetchDestinations());
    }
  };

  const handleDelete = (id: string) => {
    setDeletingDestinationId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDestinationId) return;
    
    try {
      await dispatch(deleteDestinationAsync(deletingDestinationId));
      dispatch(fetchDestinations());
      toastService.success("Đã xóa điểm đến thành công!");
      setIsDeleteModalOpen(false);
      setDeletingDestinationId(null);
    } catch (error) {
      toastService.error("Xóa điểm đến thất bại!");
    }
  };

  return (
    <>
      {/* Nút thêm destination */}
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
        >
          Thêm Điểm Đến
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
                Tên Điểm Đến
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Slug</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Thành Phố
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
            {paginatedDestinations.map((destination: Destination) => (
              <tr
                key={destination.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-3 text-sm">{destination.id}</td>
                <td className="px-6 py-3 text-sm font-medium">
                  {destination.name}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {destination.slug}
                </td>
                <td className="px-6 py-3 text-sm">
                  {destination.city?.name || "-"}
                </td>
                <td className="px-6 py-3 text-sm">
                  {new Date(destination.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  <button
                    onClick={() => handleEdit(destination)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(destination.id)}
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      )}

      {/* Modal chỉnh sửa/thêm destination */}
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
                    {editingDestinationId
                      ? "Chỉnh sửa Điểm Đến"
                      : "Thêm Điểm Đến"}
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
                      Tên Điểm Đến
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({
                          ...formData,
                          name,
                          slug: generateSlug(name),
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      required
                      placeholder="Ví dụ: Vịnh Hạ Long"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors font-mono text-sm"
                      required
                      placeholder="vinh-ha-long"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Thành Phố
                    </label>
                    <select
                      value={formData.cityId}
                      onChange={(e) =>
                        setFormData({ ...formData, cityId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
                    >
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name} ({city.country?.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      URL Hình Ảnh (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      placeholder="https://example.com/image.jpg"
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
                    Xóa Điểm Đến
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
                    Bạn có chắc chắn muốn xóa điểm đến này không? Hành động này không
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
