import CountryManagementTable from "../components/country-management-table";

export default function ManageCountry() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Country Management
        </h1>
        <CountryManagementTable />
      </div>
    </main>
  );
}
