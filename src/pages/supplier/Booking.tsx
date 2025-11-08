import { useEffect, useState } from "react";
import { BookingService } from "../../api/booking.service";
import { Booking } from "../../types/booking";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const BookingTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editValues, setEditValues] = useState({
    status: "" as Booking["status"],
    paymentStatus: "" as Booking["paymentStatus"],
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await BookingService.getAll();
      setBookings(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa booking này không?")) return;
    try {
      await BookingService.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa booking:", error);
    }
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditValues({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedBooking) return;
    try {
      await BookingService.updateStatus(selectedBooking.id, editValues);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, ...editValues }
            : b
        )
      );
      setIsDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };

  if (loading)
    return (
      <div className="text-center py-6 text-gray-600">
        Đang tải danh sách booking...
      </div>
    );

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách Booking
        </h2>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm"
        >
          🔄 Làm mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Khách hàng</th>
              <th className="py-3 px-4 text-left">Hoạt động</th>
              <th className="py-3 px-4 text-left">Ngày đặt</th>
              <th className="py-3 px-4 text-center">Tổng tiền</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Thanh toán</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="py-3 px-4">{b.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{b.customerName}</div>
                    <div className="text-xs text-gray-500">
                      {b.customerEmail}
                    </div>
                  </td>
                  <td className="py-3 px-4">{b.activity?.name || "-"}</td>
                  <td className="py-3 px-4">
                    {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {Number(b.total).toLocaleString()} {b.currency}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            b.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : b.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            b.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : b.paymentStatus === "refunded"
                            ? "bg-purple-100 text-purple-700"
                            : b.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        title="Sửa"
                        onClick={() => handleEdit(b)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <AiOutlineEdit size={18} />
                      </button>
                      <button
                        title="Xóa"
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <AiOutlineDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500 italic">
                  Không có booking nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog chỉnh sửa */}
      {isDialogOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Cập nhật trạng thái Booking #{selectedBooking.id}
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Khách hàng:</span>{" "}
                {selectedBooking.customerName}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {selectedBooking.customerEmail}
              </div>
              <div>
                <span className="font-semibold">Hoạt động:</span>{" "}
                {selectedBooking.activity?.name || "-"}
              </div>
              <div>
                <span className="font-semibold">Ngày đặt:</span>{" "}
                {new Date(selectedBooking.bookingDate).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <span className="font-semibold">Tổng tiền:</span>{" "}
                {Number(selectedBooking.total).toLocaleString()}{" "}
                {selectedBooking.currency}
              </div>

              {/* Editable fields */}
              <div className="mt-4">
                <label className="block font-semibold mb-1">
                  Trạng thái booking:
                </label>
                <select
                  value={editValues.status}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      status: e.target.value as Booking["status"],
                    }))
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mt-2">
                <label className="block font-semibold mb-1">
                  Trạng thái thanh toán:
                </label>
                <select
                  value={editValues.paymentStatus}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      paymentStatus: e.target.value as Booking["paymentStatus"],
                    }))
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
