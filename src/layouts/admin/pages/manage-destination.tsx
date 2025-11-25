import DestinationManagementTable from "../components/destination-manager-table";

export default function ManageDestination() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản Lý Điểm Đến
      </h1>
      <DestinationManagementTable />
    </div>
  );
}

