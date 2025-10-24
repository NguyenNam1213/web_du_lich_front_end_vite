import CityManagementTable from "../components/city-manager-table";

export default function ManageCity() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản Lý Thành Phố
      </h1>
      <CityManagementTable />
    </div>
  );
}
