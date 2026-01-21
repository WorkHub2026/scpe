"use client";

import { Trash2 } from "lucide-react";

interface Announcement {
  announcement_id: number;
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

const AnnouncementList = ({
  data,
  handleDelete,
}: {
  data: Announcement[];
  handleDelete: (id: number) => Promise<void>;
}) => {
  return (
    <div className="flex flex-col gap-6">
      {data?.map((announcement, index) => (
        <div
          key={announcement.announcement_id ?? `doc-${index}`}
          className="p-4 border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{announcement.title}</h2>
              <button
                onClick={() => handleDelete(announcement.announcement_id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              From: Admin &nbsp;|&nbsp; Date:
              {new Date(announcement.created_at).toLocaleDateString()}
            </p>
          </div>
          <p className="text-slate-700 text-lg my-4">{announcement.content}</p>
          {announcement.image_path && (
            <img
              src={announcement.image_path}
              alt={announcement.title}
              className="max-w-full h-auto rounded-md"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementList;
