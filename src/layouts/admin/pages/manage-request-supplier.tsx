import SupplierRequestManagerTable from "../components/supplier-request-manager-table";

export default function ManageRequestSupplier() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Yêu cầu từ người dùng
        </h1>
        <SupplierRequestManagerTable />
      </div>
    </main>
  );
}
