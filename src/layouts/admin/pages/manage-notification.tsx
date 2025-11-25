import React from "react";
import NotificationList from "../components/notification-list";

export default function ManageNotification() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <NotificationList />
    </div>
  );
}


