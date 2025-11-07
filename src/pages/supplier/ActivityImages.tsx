import { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineClose,
} from "react-icons/ai";
import { ActivityImageService } from "../../api/activityImage.service";
import { ActivityService } from "../../api/activity.service";
import { ActivityImage } from "../../types/activityImage";
import { Activity } from "../../types/activity";

function ActivityImages() {
  const [images, setImages] = useState<ActivityImage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<ActivityImage | null>(null);
  const [formData, setFormData] = useState<Partial<ActivityImage>>({
    imageUrl: "",
  });
  const [activityId, setActivityId] = useState<number | "">("");

  // Dropdown
  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState("");

  // 🔹 Lấy danh sách activity và ảnh
  const fetchImages = async () => {
    if (!activityId) return;
    try {
      setLoading(true);
      const res = await ActivityImageService.getAll(Number(activityId));
      setImages(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách hình ảnh");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await ActivityService.getAll();
      setActivities(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách activity", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [activityId]);

  // 🔹 Lưu form
  const handleSave = async () => {
    if (!activityId) return alert("Vui lòng chọn Activity ID");
    if (!formData.imageUrl) return alert("Vui lòng nhập URL hình ảnh");

    try {
      if (selected) {
        await ActivityImageService.update(
          Number(activityId),
          selected.id!,
          formData
        );
      } else {
        await ActivityImageService.create(Number(activityId), formData);
      }
      setShowForm(false);
      setSelected(null);
      setFormData({ imageUrl: "" });
      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Lưu hình ảnh thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ActivityImageService.delete(Number(activityId), id);
      setShowDelete(false);
      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Xóa hình ảnh thất bại");
    }
  };

  // 🔹 Lọc activity theo input
  const filteredActivities = activities.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toString().includes(search)
  );

  return (
    <div className="p-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách hình ảnh hoạt động
        </h2>

        {/* Ô chọn activityId */}
        <div className="flex gap-3 items-center relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Chọn hoặc tìm Activity..."
              value={
                activityId
                  ? `#${activityId} - ${
                      activities.find((a) => a.id === activityId)?.name || ""
                    }`
                  : search
              }
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenDropdown(true);
                setActivityId("");
              }}
              onFocus={() => setOpenDropdown(true)}
              className="border rounded px-3 py-2 w-56"
            />
            {openDropdown && (
              <div
                className="absolute z-10 bg-white border rounded shadow-lg mt-1 w-full max-h-60 overflow-y-auto"
                onMouseLeave={() => setOpenDropdown(false)}
              >
                {filteredActivities.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500">Không tìm thấy</div>
                ) : (
                  filteredActivities.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setActivityId(a.id);
                        setSearch("");
                        setOpenDropdown(false);
                      }}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      #{a.id} - {a.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (!activityId) return alert("Chọn activity trước");
              setSelected(null);
              setFormData({ imageUrl: "" });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <AiOutlinePlus /> Thêm hình ảnh
          </button>
        </div>
      </div>

      {/* Bảng danh sách ảnh */}
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && images.length > 0 && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Ảnh</th>
                <th className="text-left py-3 px-4">URL</th>
                <th className="text-center py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr
                  key={img.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium">{img.id}</td>
                  <td className="py-3 px-4">
                    <img
                      src={img.imageUrl}
                      alt={`Activity ${img.activityId}`}
                      className="w-16 h-16 object-cover rounded-md border"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/100?text=No+Image")
                      }
                    />
                  </td>
                  <td className="py-3 px-4 text-blue-600 truncate max-w-xs">
                    {img.imageUrl}
                  </td>
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSelected(img);
                        setFormData({ imageUrl: img.imageUrl });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelected(img);
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

      {!loading && images.length === 0 && activityId && (
        <p className="text-gray-600 mt-4">
          Chưa có hình ảnh nào cho activity ID {activityId}.
        </p>
      )}

      {/* 🔹 Dialog thêm / sửa hình ảnh */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <AiOutlineClose size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {selected ? "Chỉnh sửa hình ảnh" : "Thêm hình ảnh"}
            </h3>

            <label className="block mb-2 text-sm text-gray-700">
              URL hình ảnh
            </label>
            <input
              type="text"
              value={formData.imageUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="border rounded px-3 py-2 w-full mb-4"
              placeholder="https://..."
            />

            {/* 🔹 Preview ảnh */}
            {formData.imageUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-md border"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/150?text=No+Preview")
                  }
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Dialog xác nhận xóa */}
      {showDelete && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[360px]">
            <p className="text-gray-800 mb-4">
              Bạn có chắc chắn muốn xóa hình ảnh #{selected.id}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(selected.id!)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
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

export default ActivityImages;
