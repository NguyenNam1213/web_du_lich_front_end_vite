import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const UserProtectedRoute: React.FC = () => {
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default UserProtectedRoute;
