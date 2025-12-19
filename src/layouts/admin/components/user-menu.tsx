"use client";

import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { userMenuItems } from "../constants/nav-items";

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserInfo({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("Lỗi khi parse user info:", error);
      }
    }
  }, [isOpen]); // Reload khi menu mở

  const handleLogout = () => {
    // Xóa token và thông tin user khỏi localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // Đóng menu
    onClose();

    // Redirect về trang đăng nhập admin
    navigate("/admin/login", { replace: true });
  };

  if (!isOpen) return null;

  const displayName = userInfo
    ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() || "Admin"
    : "Admin";
  const displayEmail = userInfo?.email || "admin@example.com";

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {displayName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {displayEmail}
        </p>
      </div>

      <div className="py-2">
        {/* {userMenuItems.map((item) => ( 
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {item.label === "Profile" && <User size={16} />}
            {item.label === "Settings" && <Settings size={16} />}
            {item.label === "Help" && <HelpCircle size={16} />}
            {item.label}
          </a>
         ))}  */}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
