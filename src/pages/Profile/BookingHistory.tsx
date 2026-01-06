import { useEffect, useState } from "react";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar"
import { BookingService } from "../../api/booking.service";
import { useNavigate } from "react-router-dom";
import { ActivityImageService } from "../../api/activityImage.service";
import { createReview, getReviewByBooking, updateReview, deleteReview } from "../../api/review.service";
import Pagination from "../../components/Supplier/Pagination";

const BookingHistory = () => {
  const [bookingList, setBookingList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // "add" | "view" | "edit"
  const [dialogMode, setDialogMode] = useState("add");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(bookingList.length / pageSize);
  const paginatedBookingList = bookingList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusInVietnamese = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'cancelled': 'Đã hủy',
      'completed': 'Hoàn thành'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  useEffect(() => {
      setCurrentPage(1);
    }, [bookingList]);

  useEffect(() => {
    const fetchBooking = async() => {
      try {
        const res = await BookingService.getMyBooking();
        const data = res.data;

        console.log("📦 Tất cả bookings:", data);
        
        // Fetch all reviews in parallel
        const bookingsWithReviews = await Promise.all(
          data.map(async (item) => {
            const review = await getReviewByBooking(item.id);
            console.log(`📦 Review for booking ${item.id}:`, review);
            return {
              ...item,
               review: Array.isArray(review) 
                ? (review[0] || null) 
                : (review?.id ? review : null)
            };
          })
        );
        
        setBookingList(bookingsWithReviews);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
    };
    fetchBooking();
  }, []);

  const handleOpenDialog = async (booking) => {
    setSelectedBooking(booking);
    if (booking.review) {
      setDialogMode("view");
      setRating(booking.review.rating);
      setComment(booking.review.comment || "");
      setImages(booking.review.images || []);
    } else {
      setDialogMode("add");
      setRating(0);
      setComment("");
      setImages([]);
    }
    setOpenDialog(true);
  };

  const handleUploadImage = async (file) => {
    if (!file || !selectedBooking) return;

    setUploading(true);
    try {
      console.log("Uploading image...");

      const activityId = selectedBooking.activity.id;

      const res = await ActivityImageService.upload(
        activityId,
        file,
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      );

      const imageUrl = res.data.url;

      console.log("Uploaded Image URL:", imageUrl);

      // Thêm URL vào danh sách preview
      setImages((prev) => [...prev, imageUrl]);
    } catch (error) {
      console.log("Upload image error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }
    
    if (!comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    const payload = {
        bookingId: Number(selectedBooking.id),
        activityId: Number(selectedBooking.activity.id),
        rating,
        comment,
        images,    // danh sách URL ảnh đã upload
      };

    try {
      setSubmitting(true);
      const res = await createReview(payload);

      setBookingList((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id ? { ...b, review: res } : b
        )
      );
      setOpenDialog(false);

    } catch (error) {
      console.log("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async () => {
    if (!selectedBooking.review) return;

    try {
      setSubmitting(true);

      const payload = {
        bookingId: Number(selectedBooking.id),
        activityId: Number(selectedBooking.activity.id),
        rating,
        comment,
        images,
      };

      // TODO
      const updated = await updateReview(selectedBooking.review.id, payload);

      setBookingList((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id ? { ...b, review: updated } : b
        )
      );

      setDialogMode("view"); // quay lại view
    } catch (err) {
      console.log("Error update review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedBooking.review) return;

    if (!window.confirm("Bạn chắc chắn muốn xóa đánh giá?")) return;

    try {
      // TODO
      await deleteReview(selectedBooking.review.id);

      setRating(0);
      setComment("");
      setImages([]);

      setBookingList((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id ? { ...b, review: null } : b
        )
      );

      setOpenDialog(false);
    } catch (err) {
      console.log("Error delete review:", err);
    }
  };

  return (
      <div className="flex gap-[40px] p-[40px_80px] bg-[#f9f9fb] font-[Segoe_UI,sans-serif]">
        <ProfileSidebar />

        {/* Booking History Section */}
        <div className="flex-1 bg-white rounded-[10px] p-[30px_40px] shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <p className="text-xl">Lịch sử đặt tour</p>
          <div className="mt-6 flex flex-col gap-6">

            {bookingList.length === 0 && (
              <p className="text-gray-500">Bạn chưa có lịch sử đặt tour nào.</p>
            )}

            {paginatedBookingList.map((item) => {
              const firstImage = item.activity?.images?.[0]?.imageUrl;
              const tourName = item.activity?.name;
              const bookingDate = new Date(item.bookingDate).toLocaleDateString("vi-VN");
              return (
                <div
                  key={item.id}
                  className="flex gap-5 bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                >
                  {/* Ảnh */}
                  <img
                    src={firstImage}
                    alt={tourName}
                    className="w-40 h-28 object-cover rounded-lg"
                  />

                  {/* Thông tin */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {tourName}
                      </h3>

                      <p className="text-sm text-gray-600">
                        Mã booking: <span className="font-medium">{item.bookingRef}</span>
                      </p>

                      <p className="text-sm text-gray-600">
                        Ngày đặt: <span className="font-medium">{bookingDate}</span>
                      </p>

                      <p className="text-sm text-gray-600">
                        Số lượng khách:{" "}
                        <span className="font-medium">{item.participants}</span>
                      </p>

                      <p className="text-sm text-gray-600">
                        Tổng tiền:{" "}
                        <span className="font-semibold text-green-600">
                          {item.total} {item.currency}
                        </span>
                      </p>

                      <p className="text-sm text-gray-600">
                        Trạng thái:{" "}
                        <span className="font-medium capitalize text-blue-600">
                          {getStatusInVietnamese(item.status)}
                        </span>
                      </p>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 mt-3">
                      <button
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg"
                        onClick={() => navigate(`/tours/${item.activity.id}`)}
                      >
                        Đặt lại
                      </button>

                      {item.review ? (
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm rounded-lg flex items-center gap-2 shadow-sm"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-300">★</span>
                            <span className="font-semibold">{item.review.rating}</span>
                          </div>
                          <span>Xem đánh giá</span>
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center gap-2 shadow-sm"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <span>Viết đánh giá</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* ======================= [THÊM] DIALOG REVIEW ======================= */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-[500px] p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {dialogMode === "add" && "Thêm đánh giá"}
                {dialogMode === "view" && "Xem đánh giá"}
                {dialogMode === "edit" && "Chỉnh sửa đánh giá"}
              </h2>

              {/* Ô nhập nội dung */}
              <textarea
                className="w-full p-3 border rounded-lg outline-none"
                disabled={dialogMode === "view"}
                rows={3}
                placeholder="Nhập đánh giá..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              {/* Chọn rating bằng ngôi sao */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-3xl cursor-pointer ${
                      star <= (hoverStar || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => dialogMode !== "view" && setHoverStar(star)}
                    onMouseLeave={() => dialogMode !== "view" && setHoverStar(0)}
                    onClick={() => dialogMode !== "view" && setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Upload ảnh */}
              {dialogMode !== "view" && (
                <div className="mt-5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />

                  <button 
                    className="ml-3 px-3 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
                    onClick={() => handleUploadImage(selectedFile)}
                    disabled={!selectedFile || uploading}
                  >
                    {uploading ? "Đang tải..." : "Tải lên"}
                  </button>
                </div>
              )}

              {/* Preview ảnh */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      {/* Ảnh */}
                      <img
                        src={url}
                        alt="preview"
                        className="w-24 h-24 rounded object-cover border"
                      />

                      {/* Nút X xóa ảnh */}
                      {dialogMode !== "view" && (
                        <button
                          onClick={() => {
                            setImages((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="
                            absolute top-0 right-0 bg-black bg-opacity-60 text-white w-6 h-6 rounded-full 
                            flex items-center justify-center 
                            text-sm 
                            opacity-0 group-hover:opacity-100 
                            transition
                            hover:bg-red-600
                          "
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  onClick={() => setOpenDialog(false)}
                >
                  Hủy
                </button>

                {dialogMode === "add" && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    disabled={submitting}
                    onClick={handleSubmitReview}
                  >
                    {submitting ? "Đang gửi..." : "Xác nhận"}
                  </button>
                )}

                {dialogMode === "edit" && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    onClick={handleUpdateReview}
                  >
                    Cập nhật
                  </button>
                )}

                {dialogMode === "view" && (
                  <>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      onClick={() => setDialogMode("edit")}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg"
                      onClick={handleDeleteReview}
                    >
                      Xóa đánh giá
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default BookingHistory;