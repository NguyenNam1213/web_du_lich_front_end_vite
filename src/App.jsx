import React from "react";
import Home from "./pages/Home";
import SignUp from "./components/LoginSignUp/SignUp";
import Login from "./components/LoginSignUp/Login";
import Profile from "./pages/Profile/Profile";
import AdminLayout from "./layouts/admin/admin-layout";
import ManageUser from "./layouts/admin/pages/manage-user";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManageCountry from "./layouts/admin/pages/manage-country";
import ManageCity from "./layouts/admin/pages/manage-city";
import ManageDestination from "./layouts/admin/pages/manage-destination";
import ManageSupplier from "./layouts/admin/pages/manage-supplier";
import DashboardPage from "./layouts/admin/pages/dashboard";
import { Counter } from "./layouts/admin/pages/counter-test";
import ManageNotification from "./layouts/admin/pages/manage-notification";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="user" element={<ManageUser />} />
          <Route path="supplier" element={<ManageSupplier />} />
          <Route path="country" element={<ManageCountry />} />
          <Route path="city" element={<ManageCity />} />
          <Route path="destinations" element={<ManageDestination />} />
          <Route path="notification" element={<ManageNotification />} />
          <Route path="test" element={<Counter />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
