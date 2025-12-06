import { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import imageCompression from "browser-image-compression";
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

  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState("");

  // 🆕 States cho upload
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);

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

  useEffect(() => {
    if (activities.length > 0 && !activityId) {
      setActivityId(activities[0].id);
    }
  }, [activities]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 10MB");
      return;
    }

    try {
      setCompressing(true);

      // Cấu hình nén ảnh
      const options = {
        maxSizeMB: 1, 
        maxWidthOrHeight: 1920, 
        useWebWorker: true, 
        fileType: file.type, 
      };

      const compressedFile = await imageCompression(file, options);
      
      console.log(`Kích thước gốc: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Kích thước sau nén: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      setSelectedFile(compressedFile);
      
      // Tạo preview URL từ file đã nén
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Lỗi nén ảnh:", error);
      alert("Không thể xử lý ảnh. Vui lòng thử ảnh khác.");
    } finally {
      setCompressing(false);
    }
  };

  // 🆕 Upload ảnh lên server
  const handleUpload = async () => {
    if (!selectedFile || !activityId) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const res = await ActivityImageService.upload(
        Number(activityId), 
        selectedFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploadProgress(percentCompleted);
        }
      );
      
      const uploadedUrl = res.data.url;
      setFormData({ imageUrl: uploadedUrl });
      setPreviewUrl(uploadedUrl);
      
      alert("✅ Tải ảnh lên thành công!");
    } catch (err: any) {
      console.error(err);
      
      // Xử lý các loại lỗi khác nhau
      if (err.code === 'ECONNABORTED') {
        alert(
          "⏱️ Upload quá lâu (>60s). Vui lòng:\n" +
          "1. Chọn ảnh có kích thước nhỏ hơn\n" +
          "2. Kiểm tra kết nối mạng\n" +
          "3. Thử lại sau"
        );
      } else if (err.response?.status === 413) {
        alert("❌ File quá lớn. Vui lòng chọn ảnh nhỏ hơn.");
      } else if (err.response?.status === 500) {
        alert("❌ Lỗi server. Vui lòng liên hệ quản trị viên.");
      } else {
        alert("❌ Tải ảnh lên thất bại. Vui lòng thử lại.");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    if (!activityId) return alert("Vui lòng chọn Activity ID");
    if (!formData.imageUrl) return alert("Vui lòng tải ảnh lên trước khi lưu");

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
      setSelectedFile(null);
      setPreviewUrl("");
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

  const openFormDialog = (image?: ActivityImage) => {
    if (image) {
      setSelected(image);
      setFormData({ imageUrl: image.imageUrl });
      setPreviewUrl(image.imageUrl);
    } else {
      setSelected(null);
      setFormData({ imageUrl: "" });
      setPreviewUrl("");
      setSelectedFile(null);
    }
    setShowForm(true);
  };

  const closeFormDialog = () => {
    setShowForm(false);
    setSelected(null);
    setFormData({ imageUrl: "" });
    setSelectedFile(null);
    setPreviewUrl("");
  };

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
              openFormDialog();
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
                      onClick={() => openFormDialog(img)}
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

      {/* 🔹 Dialog thêm / sửa hình ảnh - CẬP NHẬT */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[480px] relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeFormDialog}
            >
              <AiOutlineClose size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {selected ? "Chỉnh sửa hình ảnh" : "Thêm hình ảnh"}
            </h3>

            {/* 🆕 Upload section */}
            {!selected && (
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-700 font-medium">
                  Chọn ảnh từ máy
                </label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg transition ${
                    compressing 
                      ? "border-yellow-400 bg-yellow-50 cursor-wait" 
                      : "border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                  }`}>
                    <AiOutlineCloudUpload size={20} className="mr-2" />
                    <span className="text-sm text-gray-600">
                      {compressing 
                        ? "Đang nén ảnh..." 
                        : selectedFile 
                          ? selectedFile.name 
                          : "Chọn file ảnh..."}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={compressing || uploading}
                    />
                  </label>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading || compressing}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !selectedFile || uploading || compressing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {uploading ? "Đang tải..." : "Tải lên"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: JPG, PNG, GIF. Tối đa 10MB (sẽ tự động nén xuống 1MB)
                </p>
              </div>
            )}

            {/* URL field - chỉ hiển thị sau khi upload hoặc khi edit */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-700 font-medium">
                URL hình ảnh
              </label>
              <input
                type="text"
                value={formData.imageUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="border rounded px-3 py-2 w-full bg-gray-50"
                placeholder="URL sẽ tự động điền sau khi upload..."
                readOnly={!selected}
              />
            </div>

            {/* 🔹 Preview ảnh */}
            {previewUrl && (
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-64 h-64 object-cover rounded-md border-2 border-gray-200"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/250?text=Lỗi+tải+ảnh")
                    }
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-md">
                      <div className="text-white text-sm mb-2">Đang tải lên...</div>
                      <div className="w-48 bg-gray-300 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-green-500 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="text-white text-xs mt-1">{uploadProgress}%</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeFormDialog}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.imageUrl}
                className={`px-4 py-2 rounded ${
                  !formData.imageUrl
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Dialog xác nhận xóa */}
      {showDelete && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
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