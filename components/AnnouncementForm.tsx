"use client";

import { UploadCloud, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface AnnouncementFormProps {
  setUpload: React.Dispatch<React.SetStateAction<boolean>>;
  setOnFileSelect: (file: File) => void;
  formData: {
    title: string;
    content: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      content: string;
    }>
  >;

  onSubmit: React.Dispatch<React.SetStateAction<any>>;
}

const AnnouncementForm = ({
  setUpload,
  setOnFileSelect,
  formData,
  setFormData,
  onSubmit,
}: AnnouncementFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setOnFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) setOnFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 flex flex-col gap-6 p-6 border border-gray-300 rounded-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">New Announcement</h2>
        <X
          className="cursor-pointer hover:bg-green-100 hover:rounded-md p-1"
          onClick={() => setUpload(false)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col space-y-2">
          <label
            className="block text-sm font-bold text-gray-700"
            htmlFor="title"
          >
            Title:
          </label>
          <input
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            type="text"
            id="title"
            name="title"
            className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:ring-2 focus:ring-[#004225]/50"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            className="block text-sm font-bold text-gray-700"
            htmlFor="content"
          >
            Message Content:
          </label>
          <input
            value={formData.content}
            onChange={(e) =>
              setFormData({
                ...formData,
                content: e.target.value,
              })
            }
            type="text"
            id="content"
            name="content"
            className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:ring-2 focus:ring-[#004225]/50"
          />
        </div>

        {/* Upload Box */}
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            Add Image (optional):
          </label>

          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed
            h-36 rounded-lg cursor-pointer transition
            ${
              isDragging ? "bg-green-100 border-green-800" : "border-green-700"
            }`}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadCloud className="w-10 h-10 text-green-700/70 mb-1" />

            <p className="text-green-700 text-sm font-medium">
              {isDragging ? "Drop here..." : "Click to upload or drag file"}
            </p>

            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <button
          type="submit"
          className="w-full py-3 bg-[#004225] text-white rounded-lg font-semibold hover:bg-[#00361d] transition-all"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={() => setUpload(false)}
          className="w-full h-12 rounded-lg border border-[#004225] text-[#004225] font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
