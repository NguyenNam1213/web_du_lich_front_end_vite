import { Link, Outlet, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Calendar, Image as ImageIcon, ShoppingBag } from "lucide-react";
import { useState } from "react";

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/supplier", icon: <LayoutDashboard size={18} /> },
    { label: "Activities", path: "/supplier/activities", icon: <Calendar size={18} /> },
    { label: "Images", path: "/supplier/image", icon: <ImageIcon size={18} /> },
    { label: "Bookings", path: "/supplier/booking", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h1 className="text-xl font-bold text-blue-600">{sidebarOpen ? "Supplier" : "S"}</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-blue-600"
          >
            ☰
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center gap-2 text-red-600 hover:text-red-800">
            <LogOut size={18} /> {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {menuItems.find((m) => location.pathname.startsWith(m.path))?.label || "Dashboard"}
          </h2>

          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-gray-700 hidden md:block">Supplier Admin</span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SupplierLayout;
