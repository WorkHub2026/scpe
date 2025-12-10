import { useAuth } from "@/context/AuthContext";
import {
  fetchNotifications,
  markNotificationRead,
} from "@/lib/services/notification.service";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NotificationBell = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // -----------------------------
  // 2. Close dropdown on outside click
  // -----------------------------

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { user } = useAuth();

  const getAllNotifications = async () => {
    try {
      if (!user?.user_id) return;
      const resp: any = await fetchNotifications(user.user_id);
      if (resp?.success && resp.notifications) {
        setNotifications(resp.notifications);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllNotifications();
  }, [user]);

  // -----------------------------
  // 3. Mark notification as read
  // -----------------------------
  async function handleMarkRead(id: number) {
    await markNotificationRead(id);
  }
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition"
      >
        <Bell className="w-5 h-5 text-white" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs rounded-full shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="px-4 py-3 bg-gray-100 border-b text-sm font-semibold flex justify-between items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-md">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* If empty */}
          {notifications.length === 0 && (
            <p className="text-center text-gray-500 py-6 text-sm">
              No notifications available
            </p>
          )}

          {/* List */}
          <ul className="max-h-80 overflow-y-auto">
            {notifications.map((n: any) => (
              <li
                key={n.id}
                className={`px-4 py-3 text-sm border-b last:border-none transition cursor-pointer ${
                  !n.read
                    ? "bg-emerald-50 hover:bg-emerald-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{n.title}</p>
                    <p className="text-gray-600 text-xs">{n.message}</p>
                    <p className="text-gray-400 text-[10px] mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Mark as read */}
                  {!n.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(n.id);
                      }}
                      className="text-[10px] text-emerald-700 hover:underline"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
