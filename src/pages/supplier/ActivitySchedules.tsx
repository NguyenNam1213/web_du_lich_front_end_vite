import { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineClose,
} from "react-icons/ai";
import { ActivityScheduleService } from "../../api/activitySchedule.service";
import { ActivityService } from "../../api/activity.service";
import { ActivitySchedule } from "../../types/activitySchedule";
import { Activity } from "../../types/activity";

function ActivitySchedules() {
  const [schedules, setSchedules] = useState<ActivitySchedule[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<ActivitySchedule | null>(null);
  const [activityId, setActivityId] = useState<number | "">("");

  // Dữ liệu form
  const [formData, setFormData] = useState<Partial<ActivitySchedule>>({
    date: "",
    timeSlot: "",
    availableSpots: 0,
    bookedSpots: 0,
    price: 0,
  });

  // Dropdown chọn activity
  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState("");

  // 🔹 Lấy danh sách activities
  const fetchActivities = async () => {
    try {
      const res = await ActivityService.getAll();
      setActivities(res.data);
    } catch (err) {
      console.error("Lỗi tải activity", err);
    }
  };

  // 🔹 Lấy danh sách schedule
  const fetchSchedules = async () => {
    if (!activityId) return;
    try {
      setLoading(true);
      const res = await ActivityScheduleService.getAll(Number(activityId));
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách lịch hoạt động");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [activityId]);

  // 🔹 Lưu form (create hoặc update)
  const handleSave = async () => {
    if (!activityId) return alert("Vui lòng chọn activity");
    if (!formData.date || !formData.availableSpots)
      return alert("Vui lòng nhập đầy đủ thông tin");

    try {
      if (selected) {
        await ActivityScheduleService.update(Number(activityId), selected.id!, {
          date: formData.date,
          timeSlot: formData.timeSlot,
          availableSpots: formData.availableSpots!,
          bookedSpots: formData.bookedSpots,
          price: formData.price,
        });
      } else {
        await ActivityScheduleService.create(Number(activityId), {
          date: formData.date!,
          timeSlot: formData.timeSlot || "",
          availableSpots: formData.availableSpots!,
          bookedSpots: formData.bookedSpots || 0,
          price: formData.price || 0,
        });
      }
      setShowForm(false);
      setSelected(null);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert("Lưu lịch hoạt động thất bại");
    }
  };

  // 🔹 Xóa lịch
  const handleDelete = async (id: number) => {
    try {
      await ActivityScheduleService.delete(Number(activityId), id);
      setShowDelete(false);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert("Xóa lịch thất bại");
    }
  };

  // Lọc activity theo search
  const filteredActivities = activities.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toString().includes(search)
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Quản lý lịch hoạt động
        </h2>

        {/* Chọn activity */}
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
              setFormData({
                date: "",
                timeSlot: "",
                availableSpots: 0,
                bookedSpots: 0,
                price: 0,
              });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <AiOutlinePlus /> Thêm lịch
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && schedules.length > 0 && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Ngày</th>
                <th className="py-3 px-4 text-left">Khung giờ</th>
                <th className="py-3 px-4 text-left">Chỗ trống</th>
                <th className="py-3 px-4 text-left">Đã đặt</th>
                <th className="py-3 px-4 text-left">Giá</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sch) => (
                <tr key={sch.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{sch.id}</td>
                  <td className="py-3 px-4">{sch.date}</td>
                  <td className="py-3 px-4">{sch.timeSlot || "-"}</td>
                  <td className="py-3 px-4">{sch.availableSpots}</td>
                  <td className="py-3 px-4">{sch.bookedSpots || 0}</td>
                  <td className="py-3 px-4">
                    {sch.price ? `${sch.price.toLocaleString()}₫` : "-"}
                  </td>
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSelected(sch);
                        setFormData({ ...sch });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelected(sch);
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

      {!loading && schedules.length === 0 && activityId && (
        <p className="text-gray-600 mt-4">
          Chưa có lịch nào cho activity ID {activityId}.
        </p>
      )}

      {/* 🔹 Form thêm/sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[420px] relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <AiOutlineClose size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {selected ? "Chỉnh sửa lịch" : "Thêm lịch"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Ngày</label>
                <input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Khung giờ
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 08:00 - 10:00"
                  value={formData.timeSlot || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, timeSlot: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Chỗ trống
                  </label>
                  <input
                    type="number"
                    value={formData.availableSpots || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableSpots: Number(e.target.value),
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Đã đặt
                  </label>
                  <input
                    type="number"
                    value={formData.bookedSpots || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bookedSpots: Number(e.target.value),
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Giá</label>
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
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

      {/* 🔹 Xác nhận xóa */}
      {showDelete && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[360px]">
            <p className="text-gray-800 mb-4">
              Bạn có chắc muốn xóa lịch #{selected.id} ({selected.date})?
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

export default ActivitySchedules;
