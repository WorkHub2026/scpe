"use client";

import { useState, useEffect } from "react";
import AnnouncementList from "@/components/AnnouncementList";
import { Mail } from "lucide-react";
import { getAnnouncements } from "@/lib/services/notificationService";

interface Announcement {
  id: number;
  title: string;
  content: string;
  image_path?: string;
  created_at: string;
  created_by: number;
  creator: {
    user_id: number;
    name: string;
  };
}

const AnnouncementView = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const res: any = await getAnnouncements();
      if (res.success) {
        setAnnouncements(res.announcements);
      } else {
        setError("Failed to load announcements");
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <h1 className="text-4xl text-slate-800 font-semibold">Inbox</h1>
      <p className="flex items-center gap-1 text-gray-600">
        <Mail className="w-4 h-4" />
        View announcements and messages from the communications team
      </p>

      {/* Status Feedback */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-center text-red-600 mt-4">{error}</p>}

      {/* Announcement List */}
      {!loading && announcements.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-10">
          No announcements available.
        </p>
      )}

      {!loading && announcements.length > 0 && (
        <AnnouncementList data={announcements} />
      )}
    </div>
  );
};

export default AnnouncementView;
