"use client";

import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import { userMenuItems } from "../constants/nav-items";

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const handleLogout = () => {
    console.log("Logging out...");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Admin User
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          admin@example.com
        </p>
      </div>

      <div className="py-2">
        {userMenuItems.map((item) => (
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
        ))}
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
