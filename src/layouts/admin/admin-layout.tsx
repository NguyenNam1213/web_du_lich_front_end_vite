"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getNavItems } from "./constants/nav-items";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
  userAvatar?: string;
  userName?: string;
  unreadNotifications?: boolean;
}

export default function AdminLayout({
  userAvatar = "/user-avatar.jpg",
  unreadNotifications = false,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = getNavItems(unreadNotifications);

  useEffect(() => {
    document.body.style.backgroundColor = "white";
    return () => {
      document.body.style.backgroundColor = "#424040";
    };
  }, []);

  return (
    <div>
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="p-4 sm:ml-64 bg-white">
        <div style={{ paddingTop: "60px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
