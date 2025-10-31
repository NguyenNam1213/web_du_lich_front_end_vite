import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    email: string;
  } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Kiểm tra token khi vào trang
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    // Nếu chưa đăng nhập → chuyển hướng về trang login
    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.email) {
        setUser(parsedUser);
      } else {
        throw new Error("Invalid user object");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 🔹 Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { label: "Dashboard", path: "/supplier", icon: <LayoutDashboard size={18} /> },
    { label: "Activities", path: "/supplier/activities", icon: <Calendar size={18} /> },
    { label: "Images", path: "/supplier/image", icon: <ImageIcon size={18} /> },
    { label: "Schedules", path: "/supplier/schedules", icon: <Calendar size={18} /> },
    { label: "Bookings", path: "/supplier/booking", icon: <ShoppingBag size={18} /> },
  ];

  // Nếu chưa có user thì không render layout (tránh lỗi flash khi redirect)
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h1 className="text-xl font-bold text-blue-600">
            {sidebarOpen ? "Supplier" : "S"}
          </h1>
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {menuItems.find((m) => location.pathname.startsWith(m.path))?.label ||
              "Dashboard"}
          </h2>

          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-gray-700 hidden md:block">
              {`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email}
            </span>
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
