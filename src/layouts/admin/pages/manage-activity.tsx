import ActivityManagementTable from "../components/activity-manager-table";

export default function ManageActivity() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản Lý Hoạt Động
      </h1>
      <ActivityManagementTable />
    </div>
  );
}

