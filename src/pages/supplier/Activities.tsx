import { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { Activity } from "../../types/activity";
import { ActivityService } from "../../api/activity.service";
import ActivityModal from "../../components/Activity/ActivityModal";
import Pagination from "../../components/Supplier/Pagination";

function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Activity | null>(null);
  const [data, setFormData] = useState<Partial<Activity>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; 

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

  useEffect(() => {
    setCurrentPage(1);
  }, [activities]);

  const handleOpenForm = (activity?: Activity) => {
    setSelected(activity || null);
    setFormData(activity || {});
    setShowForm(true);
  };

  const handleSave = async (data: Partial<Activity>) => {
    try {
      if (selected) {
        await ActivityService.update(selected.id!, data);
      } else {
        await ActivityService.create(data as Activity);
      }
      setShowForm(false);
      fetchActivities();
    } catch (err) {
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

  const totalPages = Math.ceil(activities.length / pageSize);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
              {paginatedActivities.map((a) => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {!loading && activities.length === 0 && (
        <p className="text-gray-600 mt-4">Chưa có hoạt động nào.</p>
      )}

      <ActivityModal
        open={showForm}
        activity={selected}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />      

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
