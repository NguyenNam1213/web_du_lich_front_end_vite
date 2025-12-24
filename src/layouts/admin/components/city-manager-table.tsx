"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCities,
  createCityAsync,
  updateCityAsync,
  deleteCityAsync,
  setCurrentPage,
} from "../../../store/slices/citySlice";
import { RootState, AppDispatch } from "../../../store/index";
import { City } from "../types/city.type";
import { Trash2, Edit2, X, Search } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toastService } from "../../../utils/toast";
import Pagination from "../components/pagination";

export default function CityManagementTable() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    cities = [],
    currentPage,
    totalPages,
    status,
    error,
  } = useSelector((state: RootState) => state.cities || {});

  const ITEMS_PER_PAGE = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCityId, setDeletingCityId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<City>>({
    name: "",
    countryCode: "",
  });
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter cities based on search term
  const filteredCities = cities.filter((city) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      city.name?.toLowerCase().includes(searchLower) ||
      city.id?.toString().includes(searchLower) ||
      city.countryCode?.toLowerCase().includes(searchLower)
    );
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCities = filteredCities.slice(startIndex, endIndex);
  const totalFilteredPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE);

  // Sample countries - in production, you'd fetch this from API
  const countries = [
    { code: "VN", name: "Vietnam" },
    { code: "US", name: "United States" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "TH", name: "Thailand" },
    { code: "SG", name: "Singapore" },
  ];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCities());
    }
  }, [dispatch, status]);

  const handleEdit = (city: City) => {
    setFormData({ ...city });
    setEditingCityId(city.id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      countryCode: "VN",
    });
    setEditingCityId(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (formData.name && formData.countryCode) {
      if (editingCityId) {
        await dispatch(
          updateCityAsync({ id: editingCityId, cityData: formData })
        );
      } else {
        await dispatch(createCityAsync(formData));
      }
      setIsModalOpen(false);
      setFormData({ name: "", countryCode: "" });
      setEditingCityId(null);
      dispatch(fetchCities());
    }
  };

  const handleDelete = (id: string) => {
    setDeletingCityId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCityId) return;
    
    try {
      await dispatch(deleteCityAsync(deletingCityId));
      dispatch(fetchCities());
      toastService.success("Đã xóa thành phố thành công!");
      setIsDeleteModalOpen(false);
      setDeletingCityId(null);
    } catch (error) {
      toastService.error("Xóa thành phố thất bại!");
    }
  };

  return (
    <>
      {/* Search Section */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên thành phố, mã quốc gia, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Nút thêm city */}
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
        >
          Thêm Thành Phố
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
                Tên Thành Phố
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Quốc Gia
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
            {paginatedCities.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? "Không tìm thấy kết quả" : "Không có thành phố nào"}
                </td>
              </tr>
            ) : (
              paginatedCities.map((city: City) => (
              <tr
                key={city.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-3 text-sm">{city.id}</td>
                <td className="px-6 py-3 text-sm font-medium">{city.name}</td>
                <td className="px-6 py-3 text-sm">
                  {city.country?.name || city.countryCode}
                </td>
                <td className="px-6 py-3 text-sm">
                  {new Date(city.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  <button
                    onClick={() => handleEdit(city)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(city.id)}
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
      {(searchTerm ? totalFilteredPages : totalPages) > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={searchTerm ? totalFilteredPages : totalPages}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      )}

      {/* Modal chỉnh sửa/thêm city */}
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
                    {editingCityId ? "Chỉnh sửa Thành Phố" : "Thêm Thành Phố"}
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
                      Tên Thành Phố
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      required
                      placeholder="Ví dụ: Hà Nội"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Quốc Gia
                    </label>
                    <select
                      value={formData.countryCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countryCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
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
                    Xóa Thành Phố
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
                    Bạn có chắc chắn muốn xóa thành phố này không? Hành động này không
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
