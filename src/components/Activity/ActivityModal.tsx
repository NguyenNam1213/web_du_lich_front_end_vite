import { useEffect, useState } from "react";
import { Activity } from "../../types/activity";
import { Destination } from "../../layouts/admin/types/destination.type";
import { getDestinations } from "../../services/api/destinationApi";
import { Category } from "../../types/category";
import { getCategories } from "../../api/categories.service";

interface ActivityModalProps {
  open: boolean;
  activity?: Activity | null;
  onClose: () => void;
  onSave: (data: Partial<Activity>) => void;
}

function ActivityModal({ open, activity, onClose, onSave }: ActivityModalProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Activity>>(
    activity || {}
  );

  useEffect(() => {
    if(open){
        getDestinations()
        .then((data) => setDestinations(data))
        .catch((err) => console.error("Failed to fetch destinations", err));
    }
  }, [open]);

  useEffect(() => {
    if(open){
      getCategories()
        .then((data) => setCategories(data))
        .catch((err) => console.error("Failed to fetch categories", err));
    }
  }, [open]);

  useEffect(() => {
    setFormData(activity || {});
  }, [activity]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4">
          {activity ? "Chỉnh sửa hoạt động" : "Thêm hoạt động"}
        </h3>

        <div className="space-y-3">
          {/* Destination + Category */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.destinationId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationId: Number(e.target.value),
                  })
                }
              >
                <option value="">-- Chọn destination --</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* categories */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.categoryId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: Number(e.target.value),
                  })
                }
              >
                <option value="">-- Chọn category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <input
            type="text"
            placeholder="Tên hoạt động"
            className="w-full border rounded px-3 py-2"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Slug"
            className="w-full border rounded px-3 py-2"
            value={formData.slug || ""}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value })
            }
          />

          <textarea
            placeholder="Mô tả"
            className="w-full border rounded px-3 py-2 h-24"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <textarea
            placeholder="Điểm nổi bật"
            className="w-full border rounded px-3 py-2 h-20"
            value={formData.highlights?.join(", ") || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                highlights: e.target.value
                  .split(",")
                  .map((h) => h.trim())
                  .filter(Boolean),
              })
            }
          />

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Giá"
              className="w-full border rounded px-3 py-2"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: +e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Tiền tệ"
              className="w-full border rounded px-3 py-2"
              value={formData.currency || ""}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
            />
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

          <input
            type="number"
            placeholder="Số người tối đa"
            className="w-full border rounded px-3 py-2"
            value={formData.maxParticipants || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxParticipants: +e.target.value,
              })
            }
          />

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

          <div className="grid grid-cols-2 gap-3">
            <label className="flex gap-2 items-center">
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

            <label className="flex gap-2 items-center">
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

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured: e.target.checked,
                  })
                }
              />
              Nổi bật
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => onSave(formData)}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;
