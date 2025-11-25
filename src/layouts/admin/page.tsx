import AdminLayout from "./admin-layout";

export default function AdminHome() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600">
          Select an option from the sidebar to get started.
        </p>
      </div>
    </AdminLayout>
  );
}
