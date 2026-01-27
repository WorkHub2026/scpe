"use client";

import { createMinistry, listMinistries } from "@/lib/services/ministryService";
import { Edit2, FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function MinistryProfilesView() {
  const [ministries, setMinistries] = useState<any>([]);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const resp: any = await listMinistries();
        setMinistries(resp);
      } catch (error) {
        console.log("Error at getting ministries", error);
      }
    };

    fetchMinistries();
  }, []);
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
  });

  const handleEditMinistry = (ministry: any) => {
    setSelectedMinistry(ministry);
    setFormData(ministry);
    setIsEditing(true);
    setIsAddingNew(false);
  };

  const handleAddNewMinistry = () => {
    setFormData({
      name: "",
      description: "",
      contact_email: "",
      contact_phone: "",
    });
    setSelectedMinistry({
      id: Math.max(...ministries.map((m: any) => m.id), 0) + 1,
    });
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleSaveNewMinistry = async () => {
    try {
      setFormData({
        name: "",
        description: "",
        contact_email: "",
        contact_phone: "",
      });
      const newMinistry = {
        name: formData.name,
        contact_email: formData.contact_email,
        description: formData.description,
        contact_phone: formData.contact_phone,
      };
      await createMinistry(newMinistry);
    } catch (error) {
      console.log("Error at creating a ministry");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            XOGTA HAY’ADDA
          </h2>
          <p className="text-gray-600 mt-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#004225]" />
            Xogta hay’adda
          </p>
        </div>
        <button
          onClick={handleAddNewMinistry}
          className="flex items-center gap-2 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Diiwaangeli Hay’ad cusub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {ministries.map((ministry: any) => (
            <div
              key={ministry.ministry_id}
              onClick={() => {
                setSelectedMinistry(ministry);
                setIsEditing(false);
                setIsAddingNew(false);
              }}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                selectedMinistry?.ministry_id === ministry.ministry_id
                  ? "bg-linear-to-br from-[#004225]/20 to-[#004225]/10 border-[#004225]/60 shadow-lg"
                  : "bg-white/70 border-[#004225]/30 hover:border-[#004225]/60"
              }`}
            >
              <h3 className="font-bold text-gray-900">{ministry.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {ministry.description}
              </p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedMinistry ? (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-[#004225]/30 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isAddingNew ? "Add New Ministry" : selectedMinistry.name}
                </h3>
                {!isAddingNew && (
                  <button
                    onClick={() => handleEditMinistry(selectedMinistry)}
                    className="p-2 text-[#004225] hover:bg-[#004225]/10 rounded-lg transition-colors duration-300"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-5">
                  <input
                    type="text"
                    placeholder="Ministry Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50"
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 resize-none h-20"
                  />

                  <div className="space-y-4 pt-5 border-t border-[#004225]/30">
                    <p className="font-bold text-gray-900">Contacts</p>
                    <input
                      type="email"
                      placeholder="Email Contact"
                      value={formData.contact_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50"
                    />
                    <input
                      type="text"
                      placeholder="Phone Contact"
                      value={formData.contact_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50"
                    />
                  </div>

                  <div className="flex gap-4 pt-5">
                    <button
                      onClick={handleSaveNewMinistry}
                      className="flex-1 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300"
                    >
                      {isAddingNew ? "Create Ministry" : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setIsAddingNew(false);
                        setSelectedMinistry(null);
                      }}
                      className="flex-1 px-6 py-3 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50/80 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">
                      Description
                    </p>
                    <p className="text-gray-900 mt-3">
                      {selectedMinistry.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">
                      Email
                    </p>
                    <span className="text-[#004225] hover:text-[#003218] font-semibold mt-2 inline-flex items-center gap-2 transition-colors duration-300">
                      {selectedMinistry.contact_email}
                    </span>
                  </div>
                  <div className="pt-6 border-t border-[#004225]/30">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-4">
                      Contact Phone
                    </p>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700 p-3 bg-[#004225]/10 rounded-lg border border-[#004225]/30">
                        <strong>Contact:</strong>{" "}
                        {selectedMinistry.contact_phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl border border-[#004225]/30 h-full flex items-center justify-center min-h-[400px]">
              <p className="text-gray-500">Select a ministry to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
