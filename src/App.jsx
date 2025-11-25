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
