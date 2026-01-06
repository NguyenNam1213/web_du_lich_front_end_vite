import DestinationManagementTable from "../components/destination-manager-table";

export default function ManageDestination() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Quản Lý Điểm Đến
      </h1>
      <DestinationManagementTable />
    </div>
  );
}
