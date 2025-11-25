import UserManagementTable from "../components/user-manager-table";

export default function UserManagement() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          User Management
        </h1>
        <UserManagementTable />
      </div>
    </main>
  );
}
