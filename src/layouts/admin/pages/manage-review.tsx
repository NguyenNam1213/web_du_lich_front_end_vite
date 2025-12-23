import ReviewManagementTable from "../components/review-manager-table";

export default function ManageReview() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản Lý Đánh Giá
      </h1>
      <ReviewManagementTable />
    </div>
  );
}

