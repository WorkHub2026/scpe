"use client";

import { useState, DragEvent, ChangeEvent } from "react";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export default function FileDropZone({
  onFileSelect,
  accept,
}: FileDropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
      alert("Only .doc and .docx files are allowed");
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
      alert("Only .doc and .docx files are allowed");
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="fileInput"
        name="file"
        hidden
        accept={accept}
        onChange={handleFileInput}
      />
      <label htmlFor="fileInput" className="cursor-pointer block font-medium">
        {fileName ? (
          <span className="text-green-600 font-semibold">{fileName}</span>
        ) : (
          <>
            <p className="text-gray-600">Drag & drop your document here</p>
            <p className="text-sm text-gray-400">or click to browse files</p>
          </>
        )}
      </label>
    </div>
  );
}
