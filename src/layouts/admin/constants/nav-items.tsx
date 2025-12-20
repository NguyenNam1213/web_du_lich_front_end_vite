import {
  Film,
  User,
  Bug,
  MessageSquare,
  BookOpen,
  Bell,
  Flag,
  MapPin,
  Building2,
  Star,
  CreditCard,
  Clock,
} from "lucide-react";
import type React from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const userMenuItems = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Help", href: "/help" },
];

export const getDashboardIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 22 21"
  >
    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
  </svg>
);

export const getUsersIcon = () => (
  <svg
    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 18"
  >
    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
  </svg>
);

export const getNavItems = (unreadNotifications: boolean): NavItem[] => [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: getDashboardIcon(),
  },
  {
    label: "Users",
    href: "/admin/user",
    icon: getUsersIcon(),
  },
  {
    label: "Supplier",
    href: "/admin/supplier",
    icon: <User className="text-gray-700 w-5 h-5" />,
  },
  {
    label: "Request Supplier",
    href: "/admin/request-supplier",
    icon: <MessageSquare className="text-gray-700 w-5 h-5" />,
  },
  {
    label: "Country",
    href: "/admin/country",
    icon: <Flag className="text-gray-700 w-5 h-5" />,
  },
  {
    label: "City",
    href: "/admin/city",
    icon: <Building2 className="text-gray-700 w-5 h-5" />,
  },
  {
    label: "Destination",
    href: "/admin/destinations",
    icon: <MapPin className="text-gray-700 w-5 h-5" />,
  },
  // {
  //   label: "Report Bug",
  //   href: "/admin/bug",
  //   icon: <Bug className="text-gray-700 w-5 h-5" />,
  // },

  {
    label: "Ratings & Recommendations",
    href: "/admin/ratings",
    icon: <Star className="text-gray-700 w-5 h-5" />,
  },
  {
    label: "Scheduler",
    href: "/admin/scheduler",
    icon: <Clock className="text-gray-700 w-5 h-5" />,
  },
  // {
  //   label: "Notifications",
  //   href: "/admin/notification",
  //   icon: (
  //     <div className="relative">
  //       <Bell className="text-gray-700 w-5 h-5" />
  //       {unreadNotifications && (
  //         <span className="absolute top-1/2 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
  //       )}
  //     </div>
  //   ),
  // },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: <CreditCard className="text-gray-700 w-5 h-5" />,
  },
];
