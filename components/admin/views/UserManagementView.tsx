"use client";

import UserList from "@/components/UserList";
import { createUser, listUsers } from "@/lib/services/userService";
import { Edit2, Plus, Trash2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserManagementView() {
  const [users, setUsers] = useState<
    Array<{
      user_id: number;
      username: string;
      ministry: string;
      email: string;
      role: string;
      status: boolean;
    }>
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp: any = await listUsers();
        setUsers(resp);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ministry: "",
    email: "",
    password: "",
    role: "",
  });

  const handleAddUser = async () => {
    if (formData.name && formData.ministry && formData.email && formData.role) {
      if (editingId) {
      } else {
        const newUser: any = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };
        await createUser(newUser);
      }
      setFormData({
        name: "",
        ministry: "",
        email: "",
        role: "",
        password: "",
      });
      setIsAddingUser(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.user_id !== id));
  };

  const handleEditUser = (user: any) => {
    setFormData({
      name: user.name,
      ministry: user.ministry,
      email: user.email,
      role: user.role,
      password: user.password,
    });
    setEditingId(user.id);
    setIsAddingUser(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          User Management
        </h2>
        <p className="text-gray-600 mt-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" />
          Manage minister users and their platform access
        </p>
      </div>

      <button
        onClick={() => {
          setIsAddingUser(true);
          setFormData({
            name: "",
            ministry: "",
            email: "",
            role: "",
            password: "",
          });
          setEditingId(null);
        }}
        className="flex items-center gap-2 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-[#004225]/30"
      >
        <Plus className="w-5 h-5" />
        Add New User
      </button>

      {isAddingUser && (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-[#004225]/30 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingId ? "Edit User" : "Add New User"}
            </h3>
            <button
              onClick={() => {
                setIsAddingUser(false);
                setFormData({
                  name: "",
                  ministry: "",
                  email: "",
                  role: "",
                  password: "",
                });
                setEditingId(null);
              }}
              className="p-2 hover:bg-red-50/80 rounded-lg transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
            />
            <select
              value={formData.ministry}
              onChange={(e) =>
                setFormData({ ...formData, ministry: e.target.value })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
            >
              <option value="">Select Ministry</option>
              <option value="Ministry of Health">Ministry of Health</option>
              <option value="Ministry of Education">
                Ministry of Education
              </option>
              <option value="Ministry of Finance">Ministry of Finance</option>
            </select>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Ministry Lead">Ministry Lead</option>
              <option value="Communications Officer">
                Communications Officer
              </option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              // onClick={handleAddUser}
              className="flex-1 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300"
            >
              {editingId ? "Update User" : "Add User"}
            </button>
            <button
              onClick={() => {
                setIsAddingUser(false);
                setFormData({
                  name: "",
                  ministry: "",
                  email: "",
                  role: "",
                  password: "",
                });
                setEditingId(null);
              }}
              className="flex-1 px-6 py-3 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50/80 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
