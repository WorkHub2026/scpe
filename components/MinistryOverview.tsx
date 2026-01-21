"use client";
import {
  ArrowRight,
  FileText,
  Mail,
  MapPin,
  Phone,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";

export default function MinistryOverview() {
  // 1. State to track which ministry is currently selected (null = none selected)
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const ministries = [
    {
      name: "Ministry of Health",
      icon: "🏥",
      files: 5,
      socials: 3,
      phone: "123-456-7890",
    },
    {
      name: "Ministry of Education",
      icon: "📚",
      files: 8,
      socials: 4,
      phone: "123-456-7891",
    },
    {
      name: "Ministry of Finance",
      icon: "💰",
      files: 3,
      socials: 2,
      phone: "123-456-7892",
    },
    {
      name: "Ministry of Transportation",
      icon: "🚗",
      files: 6,
      socials: 5,
      phone: "123-456-7893",
    },
    {
      name: "Ministry of Agriculture & Environment",
      icon: "🌾",
      files: 4,
      socials: 1,
      phone: "123-456-7894",
    },
    {
      name: "Ministry of Climate Change",
      icon: "🌡️",
      files: 7,
      socials: 3,
      phone: "123-456-7895",
    },
    {
      name: "Ministry of Culture",
      icon: "🎭",
      files: 2,
      socials: 2,
      phone: "123-456-7896",
    },
    {
      name: "Ministry of Technology",
      icon: "💻",
      files: 9,
      socials: 6,
      phone: "123-456-7897",
    },
    {
      name: "Ministry of Tourism",
      icon: "🏖️",
      files: 4,
      socials: 4,
      phone: "123-456-7898",
    },
    {
      name: "Ministry of Defense",
      icon: "🛡️",
      files: 5,
      socials: 2,
      phone: "123-456-7899",
    },
    {
      name: "Ministry of Internal Affairs",
      icon: "⚙️",
      files: 3,
      socials: 1,
      phone: "123-456-7900",
    },
    {
      name: "Ministry of Foreign Affairs",
      icon: "🌐",
      files: 6,
      socials: 5,
      phone: "123-456-7901",
    },
    {
      name: "Ministry of Sports",
      icon: "⚽",
      files: 2,
      socials: 2,
      phone: "123-456-7902",
    },
  ];

  return (
    <div className="relative min-h-screen p-8 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ministries.map((m) => (
          <div
            key={m.name}
            className="bg-white/70 p-6 rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all"
          >
            <div className="text-5xl mb-4">{m.icon}</div>
            <h3 className="font-bold text-gray-900">{m.name}</h3>
            <div className="mt-4 text-sm space-y-2">
              <div className="flex justify-between bg-emerald-50/60 p-2 rounded-lg">
                <span>Files</span> <span>{m.files}</span>
              </div>
              <div className="flex justify-between bg-emerald-50/60 p-2 rounded-lg">
                <span>Social Links</span> <span>{m.socials}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedMinistry(m)}
              className="w-full mt-4 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              View Profile <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 3. THE PROFILE MODAL (Only shows when selectedMinistry is not null) */}
      {selectedMinistry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          {/* Modal Card */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-emerald-600 p-6 relative">
              <button
                onClick={() => setSelectedMinistry(null)}
                className="absolute top-4 right-4 text-emerald-100 hover:text-white hover:bg-emerald-500 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center mt-2">
                <div className="text-6xl bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg mb-4">
                  {selectedMinistry.icon}
                </div>
                <h2 className="text-2xl font-bold text-white text-center">
                  {selectedMinistry.name}
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  Official Government Profile
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <FileText className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {selectedMinistry.files}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Documents
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <Share2 className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {selectedMinistry.socials}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Connected Accounts
                  </div>
                </div>
              </div>

              {/* Contact Info (Placeholder Data for visual) */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Contact Information
                </h4>

                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <span>Government Complex, Building B</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  <span>{selectedMinistry.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  <span>
                    info@
                    {selectedMinistry.name
                      .toLowerCase()
                      .replace(/ /g, "")
                      .replace(/&/g, "")}
                    .gov.so
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedMinistry(null)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
