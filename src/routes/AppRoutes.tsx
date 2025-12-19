import Home from "../pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "../components/LoginSignUp/SignUp";
import Login from "../components/LoginSignUp/Login";
import LoginSuccess from "../components/LoginSignUp/LoginSuccess";
import { useUser } from "../context/UserContext";
import AccountSettings from "../pages/Profile/AccountSettings";
import GiftCard from "../pages/Profile/GiftCard";
import Profile from "../pages/Profile/Profile";
import SupplierRequest from "../pages/Profile/SupplierRequest";
import AllRouter from "../components/AllRouter/AllRouter";
import AdminLayout from "../layouts/admin/admin-layout";
import { Counter } from "../layouts/admin/pages/counter-test";
import DashboardPage from "../layouts/admin/pages/dashboard";
import ManageCity from "../layouts/admin/pages/manage-city";
import ManageCountry from "../layouts/admin/pages/manage-country";
import ManageDestination from "../layouts/admin/pages/manage-destination";
import ManageNotification from "../layouts/admin/pages/manage-notification";
import ManageSupplier from "../layouts/admin/pages/manage-supplier";
import ManageRequestSupplier from "../layouts/admin/pages/manage-request-supplier";
import ManageUser from "../layouts/admin/pages/manage-user";
import ManageRatings from "../layouts/admin/pages/manage-ratings";
import UserLayout from "../layouts/user/UserLayout";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import TourDetailPage from "../pages/TourDetail/TourDetailPage";
import TourReviewPage from "../pages/TourReview/TourReviewPage";
import WishList from "../pages/Profile/WishList";
import BookingHistory from "../pages/Profile/BookingHistory";
import CouponsPage from "../pages/Profile/CouponsPage";

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!userData) return (
    alert("You must be logged in to access this page."),
    <Navigate to="/login" replace />
  );

  return children;
};

const AppRoutes = () => (
  <Routes>
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
    <Route
      path="/profile/wishlist"
      element={
        <ProtectedRoute>
          <WishList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile/coupons"
      element={
        <ProtectedRoute>
          <CouponsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile/booking-history"
      element={
        <ProtectedRoute>
          <BookingHistory />
        </ProtectedRoute>
      }
    />
    <Route
      path="/supplier-request"
      element={
        <ProtectedRoute>
          <SupplierRequest />
        </ProtectedRoute>
      }
    />

    <Route element={<UserLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/tours/:id" element={<TourDetailPage />} />
      <Route path="/tours/:id/reviews" element={<TourReviewPage />} />
      <Route path="/checkout/:id" element={<CheckoutPage />} />
    </Route>

    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="user" element={<ManageUser />} />
      <Route path="supplier" element={<ManageSupplier />} />
      <Route path="request-supplier" element={<ManageRequestSupplier />} />
      <Route path="country" element={<ManageCountry />} />
      <Route path="city" element={<ManageCity />} />
      <Route path="destinations" element={<ManageDestination />} />
      <Route path="notification" element={<ManageNotification />} />
      <Route path="ratings" element={<ManageRatings />} />
      <Route path="test" element={<Counter />} />
    </Route>
    <Route path="/*" element={<AllRouter />} />
  </Routes>
);

export default AppRoutes;