import React from "react";
import Home from "./pages/Home";
import SignUp from "./components/LoginSignUp/SignUp";
import Login from "./components/LoginSignUp/Login";
import Profile from "./pages/Profile/Profile";
import LoginSuccess from "./components/LoginSignUp/LoginSuccess"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AccountSettings from "./pages/Profile/AccountSettings";
import GiftCard from "./pages/Profile/GiftCard";
import { UserProvider, useUser } from "./context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!userData) return <Navigate to="/" replace />;

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login-success" element={<LoginSuccess />} />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/account-settings"
      element={
        <ProtectedRoute>
          <AccountSettings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/gift-cards"
      element={
        <ProtectedRoute>
          <GiftCard />
        </ProtectedRoute>
      }
    />
  </Routes>
);
import AdminLayout from "./layouts/admin/admin-layout";
import UserLayout from "./layouts/user/UserLayout";
import ManageUser from "./layouts/admin/pages/manage-user";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AllRouter from "./components/AllRouter/AllRouter";

import ManageCountry from "./layouts/admin/pages/manage-country";
import ManageCity from "./layouts/admin/pages/manage-city";
import ManageDestination from "./layouts/admin/pages/manage-destination";
import ManageSupplier from "./layouts/admin/pages/manage-supplier";
import DashboardPage from "./layouts/admin/pages/dashboard";
import { Counter } from "./layouts/admin/pages/counter-test";
import ManageNotification from "./layouts/admin/pages/manage-notification";
import TourDetailPage from "./pages/TourDetail/TourDetailPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import TourReviewPage from "./pages/TourReview/TourReviewPage";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;
