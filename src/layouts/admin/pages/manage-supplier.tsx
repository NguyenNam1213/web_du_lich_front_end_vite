import SupplierManagementTable from "../components/supplier-manager-table";

export default function SupplierAdmin() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Quản lý Supplier
        </h1>
        <SupplierManagementTable />
      </div>
    </main>
  );
}
