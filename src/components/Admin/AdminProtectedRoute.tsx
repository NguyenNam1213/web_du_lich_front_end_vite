import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../../api/auth";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        const user = res.data;
        
        // Kiểm tra role admin
        if (user.role && user.role.toLowerCase() === "admin") {
          setIsAdmin(true);
          // Lưu user vào localStorage để dùng sau
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền admin:", error);
        setIsAdmin(false);
        // Xóa token nếu không hợp lệ
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px"
      }}>
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect đến trang đăng nhập admin
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;

