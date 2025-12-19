"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getNavItems } from "./constants/nav-items";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { Outlet } from "react-router-dom";
import { getUnreadNotificationsCount } from "../../services/api/notificationApi";

interface AdminLayoutProps {
  children?: React.ReactNode;
  userAvatar?: string;
  userName?: string;
  unreadNotifications?: boolean;
}

export default function AdminLayout({
  userAvatar = "/user-avatar.jpg",
  unreadNotifications = false,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(unreadNotifications);
  const navItems = getNavItems(hasUnread);

  useEffect(() => {
    document.body.style.backgroundColor = "white";
    return () => {
      document.body.style.backgroundColor = "#424040";
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getUnreadNotificationsCount();
        if (mounted) setHasUnread((res.count || 0) > 0);
      } catch {}
    };
    load();
    const id = setInterval(load, 30000);
    const handler = () => load();
    window.addEventListener('notifications:updated', handler);
    return () => {
      mounted = false;
      clearInterval(id);
      window.removeEventListener('notifications:updated', handler);
    };
  }, []);

  return (
    <div>
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} hasUnread={hasUnread} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} unreadNotifications={hasUnread} />

      <div className="p-4 sm:ml-64 bg-white">
        <div style={{ paddingTop: "60px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
