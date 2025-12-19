import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SupplierLayout from "../layouts/supplier/SupplierLayout";
import SupplierProtectedRoute from "../components/Supplier/SupplierProtectedRoute";

const Dashboard = lazy(() => import("../pages/supplier/Dashboard"));
const Activities = lazy(() => import("../pages/supplier/Activities"));
const ActivityImages = lazy(() => import("../pages/supplier/ActivityImages"));
const ActivitySchedules = lazy(() => import("../pages/supplier/ActivitySchedules"));
const Booking = lazy(() => import("../pages/supplier/Booking"));
const LoginSupplier = lazy(() => import("../components/Supplier/LoginSupplier"));

export const routeSupplier: RouteObject[] = [
  {
    path: "/supplier",
    element: <SupplierProtectedRoute />, 
    children: [
      {
        element: <SupplierLayout />, 
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "activities",
            element: <Activities />,
          },
          {
            path: "image",
            element: <ActivityImages />,
          },
          {
            path: "schedules",
            element: <ActivitySchedules />,
          },
          {
            path: "booking",
            element: <Booking />,
          },
        ],
      },
    ],
  },
  {
    path: "/supplier/login",
    element: <LoginSupplier />,
  },
];
