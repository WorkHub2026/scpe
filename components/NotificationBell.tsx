"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/lib/services/notification.service";

export default function NotificationBell({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  async function loadData() {
    const list: any = await getNotifications(userId);
    setNotifications(list.resp);
    setUnread(list?.filter((n: any) => !n.is_read).length);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function markRead() {
    await markNotificationAsRead(userId);
    setUnread(0);
    setOpen(true);
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (!open) markRead();
          setOpen(!open);
        }}
        className="relative text-white flex items-center justify-center w-10 h-10 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 transition"
      >
        <Bell className="w-6 h-6" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-lg border p-3 z-50">
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {notifications?.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No notifications
              </p>
            )}

            {notifications?.map((n: any) => (
              <div
                key={n.id}
                className={`p-3 rounded-lg border ${
                  n.is_read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
