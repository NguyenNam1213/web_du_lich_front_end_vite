import React from "react";
import Home from "./pages/Home";
import SignUp from "./components/LoginSignUp/SignUp";
import Login from "./components/LoginSignUp/Login";
import Profile from "./pages/Profile/Profile";
import AdminLayout from "./layouts/admin/admin-layout";
import ManageUser from "./layouts/admin/pages/manage-user";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="user" element={<ManageUser />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
