import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SupplierLayout from "../layouts/supplier/SupplierLayout";

const Dashboard = lazy(() => import("../pages/supplier/Dashboard"));
const Activities = lazy(() => import("../pages/supplier/Activities"));
const Image = lazy(() => import("../pages/supplier/Image"));
const Booking = lazy(() => import("../pages/supplier/Booking"));

export const routeSupplier: RouteObject[] = [
    {
        path: "/supplier",
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
                element: <Image />,
            },
            {
                path: "booking",
                element: <Booking />,
            },
        ],
    },
];