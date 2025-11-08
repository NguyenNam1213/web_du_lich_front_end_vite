import { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { Activity } from "../../types/activity";
import { ActivityService } from "../../api/activity.service";

function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<Partial<Activity>>({});

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await ActivityService.getAll();
      setActivities(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách hoạt động");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleOpenForm = (activity?: Activity) => {
    setSelected(activity || null);
    setFormData(activity || {});
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (selected) {
        await ActivityService.update(selected.id!, formData);
      } else {
        await ActivityService.create(formData as Activity);
      }
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      console.error(err);
      alert("Lưu hoạt động thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ActivityService.delete(id);
      setShowDelete(false);
      fetchActivities();
    } catch (err) {
      console.error(err);
      alert("Xóa hoạt động thất bại");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách hoạt động
        </h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          <AiOutlinePlus /> Thêm hoạt động
        </button>
      </div>

      {/* Loading + Error */}
      {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Bảng danh sách */}
      {!loading && activities.length > 0 && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Tên</th>
                <th className="text-left py-3 px-4">Giá</th>
                <th className="text-left py-3 px-4">Thời lượng</th>
                <th className="text-left py-3 px-4">Số người tối đa</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-center py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr
                  key={a.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium">{a.id}</td>
                  <td className="py-3 px-4">{a.name}</td>
                  <td className="py-3 px-4">
                    {a.price} {a.currency}
                  </td>
                  <td className="py-3 px-4">{a.duration} giờ</td>
                  <td className="py-3 px-4">{a.maxParticipants}</td>
                  <td className="py-3 px-4 capitalize">{a.status}</td>
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => handleOpenForm(a)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelected(a);
                        setShowDelete(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activities.length === 0 && (
        <p className="text-gray-600 mt-4">Chưa có hoạt động nào.</p>
      )}

      {/* Dialog thêm/sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {selected ? "Chỉnh sửa hoạt động" : "Thêm hoạt động"}
            </h3>
            
            <div className="space-y-3">
              {/* ID đích và danh mục */}
              <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination ID
                    </label>
                    <input
                      type="number"
                      placeholder="Destination ID"
                      className="w-full border rounded px-3 py-2"
                      value={formData.destinationId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, destinationId: +e.target.value })
                      }
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category ID
                    </label>
                    <input
                      type="number"
                      placeholder="Category ID"
                      className="w-full border rounded px-3 py-2"
                      value={formData.categoryId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: +e.target.value })
                      }
                    />
                  </div>
              </div>

              {/* Tên */}
              <label className="block text-sm font-medium text-gray-700 mb-1" >
                Tên hoạt động
              </label>
              <input
                type="text"
                placeholder="Tên hoạt động"
                className="w-full border rounded px-3 py-2"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              {/* Slug */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                placeholder="Slug"
                className="w-full border rounded px-3 py-2"
                value={formData.slug || ""}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />

              {/* Mô tả */}
              <label className="text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                placeholder="Nhập mô tả"
                className="w-full border rounded px-3 py-2 h-24"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              {/* Điểm nổi bật */}
              <label className="text-sm font-medium text-gray-700">
                Điểm nổi bật
              </label>
              <textarea
                placeholder="Nhập điểm nổi bật"
                className="w-full border rounded px-3 py-2 h-20"
                value={formData.highlights?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    highlights: e.target.value
                      .split(",")
                      .map((h) => h.trim())
                      .filter((h) => h !== ""),
                  })
                }
              />

              {/* Giá + Tiền tệ + Thời lượng */}
              <div className="flex gap-3">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập giá"
                    className="w-full border rounded px-3 py-2"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: +e.target.value })
                    }
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị tiền tệ
                  </label>
                  <input
                    type="text"
                    placeholder="VD: VND, USD"
                    className="w-full border rounded px-3 py-2"
                    value={formData.currency || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                  />
                </div>
                
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời lượng (giờ)
                  </label>  
                  <input
                    type="number"
                    placeholder="Thời lượng (giờ)"
                    className="w-full border rounded px-3 py-2"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: +e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Số người tối đa */}
              <label className="text-sm font-medium text-gray-700">
                Số người tối đa
              </label>
              <input
                type="number"
                placeholder="Số người tối đa"
                className="w-full border rounded px-3 py-2"
                value={formData.maxParticipants || ""}
                onChange={(e) =>
                  setFormData({ ...formData, maxParticipants: +e.target.value })
                }
              />

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Trạng thái
                </label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formData.status || "draft"}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Các tùy chọn boolean */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.instantConfirmation || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instantConfirmation: e.target.checked,
                      })
                    }
                  />
                  Xác nhận ngay
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.freeCancellation || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        freeCancellation: e.target.checked,
                      })
                    }
                  />
                  Hủy miễn phí
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  Nổi bật
                </label>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end mt-6 gap-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Dialog xác nhận xóa */}
      {showDelete && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa hoạt động "{selected.name}"?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                onClick={() => setShowDelete(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={() => handleDelete(selected.id!)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;
