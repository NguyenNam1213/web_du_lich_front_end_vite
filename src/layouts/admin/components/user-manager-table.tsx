"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
} from "../../../store/slices/userSlice";
import { RootState, AppDispatch } from "../../../store/index";
import { User } from "../../admin/types/user.type";
import { Trash2, Edit2, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Pagination from "../components/pagination";

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "customer":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    case "suspended":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function UserManagementTable() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users = [],
    status,
    error,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.users || {});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    role: "customer",
    status: "active",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Lấy danh sách người dùng khi component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers({ page: 1 }));
    }
  }, [dispatch, status]);

  const handleEdit = (user: User) => {
    setFormData({ ...user });
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      avatar: "",
      role: "customer",
      status: "active",
    });
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (formData) {
      if (editingUserId) {
        // Sửa người dùng
        await dispatch(
          updateUserAsync({ id: editingUserId, userData: formData })
        );
      } else {
        // Thêm người dùng
        await dispatch(createUserAsync(formData));
      }
      setIsModalOpen(false);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        avatar: "",
        role: "customer",
        status: "active",
      });
      setEditingUserId(null);
      // Tải lại trang hiện tại
      dispatch(fetchUsers({ page: currentPage }));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      await dispatch(deleteUserAsync(id));
      dispatch(fetchUsers({ page: currentPage }));
    }
  };

  return (
    <>
      {/* Nút thêm người dùng */}
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
        >
          Thêm Người Dùng
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
              <th className="px-6 py-3 text-left text-sm font-medium">Họ</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Điện thoại
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-3 text-sm">{user.id}</td>
                <td className="px-6 py-3 text-sm">{user.firstName || ""}</td>
                <td className="px-6 py-3 text-sm">{user.lastName || ""}</td>
                <td className="px-6 py-3 text-sm">{user.email}</td>
                <td className="px-6 py-3 text-sm">{user.phone || ""}</td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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

      {/* Thanh phân trang */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      {/* Modal chỉnh sửa/thêm người dùng */}
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
                    {editingUserId ? "Chỉnh sửa Người dùng" : "Thêm Người dùng"}
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
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Họ
                    </label>
                    <input
                      type="text"
                      value={formData.firstName ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={formData.lastName ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
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
                      Ảnh đại diện
                    </label>
                    <input
                      type="text"
                      value={formData.avatar ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, avatar: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Vai trò
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | "active"
                            | "inactive"
                            | "suspended",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
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
    </>
  );
}
