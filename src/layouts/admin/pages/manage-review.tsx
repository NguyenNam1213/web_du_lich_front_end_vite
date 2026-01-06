import ReviewManagementTable from "../components/review-manager-table";

export default function ManageReview() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Quản Lý Đánh Giá
      </h1>
      <ReviewManagementTable />
    </div>
  );
}
