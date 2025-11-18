"use client";
import { useState, useEffect } from "react";
import AnnouncementList from "@/components/AnnouncementList";
import { Mail } from "lucide-react";
import { getAnnouncements } from "@/lib/services/notificationService";

const AnnouncementView = () => {
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    const data: any = await getAnnouncements();
    setAnnouncements(data.announcements);
  };
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-4xl text-slate-800 font-semibold">Inbox</h1>
      <p className="flex items-center gap-1 text-gray-600">
        <Mail className="w-4 h-4" />
        View announcements and messages from the communications team
      </p>
      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No announcements available.
        </p>
      ) : (
        <AnnouncementList data={announcements} />
      )}
    </div>
  );
};

export default AnnouncementView;
