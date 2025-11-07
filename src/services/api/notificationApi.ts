import axios from "axios";
import { API_URL } from "../api-config";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface PaginatedNotifications {
  notifications: NotificationItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getNotifications = async (
  page: number = 1,
  limit: number = 10,
  status?: "all" | "unread" | "read"
): Promise<PaginatedNotifications> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (status && status !== "all") params.set("status", status);
  const res = await api.get<PaginatedNotifications>(`/notifications/admin?${params.toString()}`);
  return res.data;
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch(`/notifications/read-all`);
};

export const getUnreadNotificationsCount = async (): Promise<{ count: number }> => {
  const res = await api.get<{ count: number }>(`/notifications/admin/unread-count`);
  return res.data;
};


