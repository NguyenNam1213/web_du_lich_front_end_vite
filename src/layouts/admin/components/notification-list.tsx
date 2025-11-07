"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationItem,
} from "../../../services/api/notificationApi";
import Pagination from "./pagination";

type StatusFilter = "all" | "unread" | "read";

export default function NotificationList() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const LIMIT = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getNotifications(currentPage, LIMIT, status);
      setItems(res.notifications || []);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      setError("Không tải được thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, status]);

  const unreadCount = useMemo(
    () => items.filter((i) => !i.isRead).length,
    [items]
  );

  const handleMarkRead = async (id: string) => {
    const prev = [...items];
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, isRead: true } : i)));
    try {
      await markNotificationRead(id);
      window.dispatchEvent(new Event('notifications:updated'));
    } catch (e) {
      setItems(prev);
      alert("Đánh dấu đã đọc thất bại");
    }
  };

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);
      const prev = [...items];
      setItems((arr) => arr.map((i) => ({ ...i, isRead: true })));
      await markAllNotificationsRead();
      window.dispatchEvent(new Event('notifications:updated'));
    } catch (e) {
      alert("Đánh dấu tất cả đã đọc thất bại");
      fetchData();
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCurrentPage(1);
              setStatus("all");
            }}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              status === "all"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => {
              setCurrentPage(1);
              setStatus("unread");
            }}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              status === "unread"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Chưa đọc{unreadCount ? ` (${unreadCount})` : ""}
          </button>
          <button
            onClick={() => {
              setCurrentPage(1);
              setStatus("read");
            }}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              status === "read"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Đã đọc
          </button>
        </div>
        <button
          onClick={handleMarkAll}
          disabled={markingAll || items.length === 0}
          className={`px-3 py-1.5 text-sm rounded-md border ${
            markingAll
              ? "text-gray-400 bg-white border-gray-200 cursor-not-allowed"
              : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          {markingAll ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
        </button>
      </div>

      {loading && <div className="p-4">Đang tải...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="p-6 text-gray-500">Không có thông báo</div>
      )}

      <ul className="divide-y">
        {items.map((n) => (
          <li key={n.id} className="p-4 flex items-start gap-3">
            <div className={`mt-1 w-2 h-2 rounded-full ${n.isRead ? "bg-gray-300" : "bg-red-500"}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{n.title}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{n.message}</p>
              <div className="mt-2 flex items-center gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="px-2.5 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                  {n.type}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="p-3 border-t">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}


