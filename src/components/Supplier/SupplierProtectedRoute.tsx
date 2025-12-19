import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../api/user";

const SupplierProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAllow, setIsAllow] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        const user = res.data;

        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "supplier") {
          setIsAllow(true);
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAllow) {
    return <Navigate to="/supplier/login" replace />;
  }

  return <Outlet />;
};

export default SupplierProtectedRoute;
