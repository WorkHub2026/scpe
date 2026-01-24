"use client";

import { Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import AnnouncementForm from "./AnnouncementForm";
import AnnouncementList from "./AnnouncementList";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
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
    image: null as File | null,
  });

  const { user } = useAuth();

  // Fetch announcements from server
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res: any = await getAnnouncements();
      if (res.success) {
        setAnnouncements(res.announcements);
      } else {
        setError("Failed to load announcements");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteAnnouncement(id);
    await fetchAnnouncements();
  };

  // Handle form submission
  const handleAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert File to a data URL string if an image file was selected
      let imageUrl: string | null = null;
      if (formData.image) {
        imageUrl = await new Promise<string | null>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(typeof reader.result === "string" ? reader.result : null);
          };
          reader.onerror = () => {
            reject(new Error("Failed to read image file"));
          };
          reader.readAsDataURL(formData.image as File);
        });
      }

      await createAnnouncement(
        formData.title,
        formData.content,
        imageUrl,
        user?.user_id ?? 0,
      );

      setUpload(false);
      setFormData({ title: "", content: "", image: null });
      await fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setError("Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl text-slate-800 font-bold">FARRIIN</h1>
        <p className="flex items-center gap-1 text-gray-600">
          <Mail className="w-4 h-4" />
       Farriin ama wargelin u dir hay’adaha oo dhan
        </p>
      </div>

      {/* Post Announcement Button */}
      <button
        onClick={() => setUpload(true)}
        className="flex justify-center items-center w-64 px-4 gap-2 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-semibold transition"
      >
        <Send className="w-5 h-5" />
        Baahinta farriinta
      </button>

      {/* Announcement Form */}
      {upload && (
        <AnnouncementForm
          onSubmit={handleAnnouncement}
          formData={formData}
          setFormData={setFormData as any}
          setUpload={setUpload}
          setOnFileSelect={(file: File) =>
            setFormData((prev) => ({ ...prev, image: file }))
          }
        />
      )}

      {/* Status Feedback */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-center text-red-600 mt-4">{error}</p>}

      {/* Announcement List */}
      {!loading && announcements.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No announcements available.
        </p>
      ) : (
        <AnnouncementList data={announcements} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default Announcements;
