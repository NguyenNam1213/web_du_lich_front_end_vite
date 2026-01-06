import CityManagementTable from "../components/city-manager-table";

export default function ManageCity() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Quản Lý Thành Phố
      </h1>
      <CityManagementTable />
    </div>
  );
}
