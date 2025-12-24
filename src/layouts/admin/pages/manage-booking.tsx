import BookingManagementTable from "../components/booking-manager-table";

export default function BookingManagement() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Quản Lý Booking
        </h1>
        <BookingManagementTable />
      </div>
    </main>
  );
}

