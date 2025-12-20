import CouponManagementTable from "../components/coupon-management-table";

export default function ManageCoupon() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Coupon Management
        </h1>
        <CouponManagementTable />
      </div>
    </main>
  );
}

