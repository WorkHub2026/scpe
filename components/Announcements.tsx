"use client";

import { Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import AnnouncementForm from "./AnnouncementForm";
import AnnouncementList from "./AnnouncementList";
import {
  createAnnouncement,
  getAnnouncements,
} from "@/lib/services/notificationService";
import { useAuth } from "@/context/AuthContext";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_path: "",
  });

  const { user } = useAuth();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data: any = await getAnnouncements();
      setAnnouncements(data.announcements);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAnnouncement = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await createAnnouncement(
        formData.title,
        formData.content,
        formData.image_path,
        user?.user_id ?? 0
      );
      setUpload(false);
      await fetchAnnouncements();
    } catch (error) {
      console.log(error);
      setError("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl text-slate-800 font-bold">
          Broadcast Announcements
        </h1>
        <p className="flex items-center gap-1 text-gray-600">
          <Mail className="w-4 h-4" />
          Send messages and announcements to all ministry users
        </p>
      </div>

      {/* Create Announcement Button */}
      <button
        onClick={() => setUpload(true)}
        className="flex justify-center items-center w-62 px-3  gap-2  py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-semibold transition"
      >
        <Send className="w-5 h-5" />
        Post Announcement
      </button>

      {/* Announcement Form Modal */}
      {upload && (
        <AnnouncementForm
          onSubmit={handleAnnouncement}
          formData={formData}
          setFormData={setFormData}
          setUpload={setUpload}
          setOnFileSelect={(file: File) => console.log("Selected File:", file)}
        />
      )}

      {/* Status Feedback */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
      {error && (
        <p className="text-center text-red-600 font-medium mt-4">{error}</p>
      )}

      {/* Announcement List */}
      {!loading && announcements.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No announcements available.
        </p>
      ) : (
        <AnnouncementList data={announcements} />
      )}
    </div>
  );
};

export default Announcements;
