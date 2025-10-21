"use client";

import { X } from "lucide-react";
import { getNavItems } from "../constants/nav-items";
import { Link, NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <h2 className="font-bold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {getNavItems(false).map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group
       ${
         isActive
           ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
           : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
       }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
