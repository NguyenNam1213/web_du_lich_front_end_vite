"use client";

import { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { UserMenu } from "./user-menu";
import defaultAvatar from "../../../assets/avatar/default-avatar.svg";

interface NavbarProps {
  onMenuToggle: () => void;
  hasUnread?: boolean;
}

export function Navbar({ onMenuToggle, hasUnread = false }: NavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(defaultAvatar);

  useEffect(() => {
    // Lấy avatar từ user info trong localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.avatar && user.avatar.trim() !== "") {
          setUserAvatar(user.avatar);
        } else {
          setUserAvatar(defaultAvatar);
        }
      } catch (error) {
        console.error("Lỗi khi parse user info:", error);
        setUserAvatar(defaultAvatar);
      }
    }
  }, []);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button> */}

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <img
                src={userAvatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  // Nếu ảnh lỗi, dùng default avatar
                  e.currentTarget.src = defaultAvatar;
                }}
              />
            </button>
            <UserMenu
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
