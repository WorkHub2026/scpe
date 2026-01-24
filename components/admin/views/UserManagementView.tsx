"use client";

import UserList from "@/components/UserList";
import { listMinistries } from "@/lib/services/ministryService";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "@/lib/services/userService";
import { Plus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// Types for form (optional but recommended)
interface UserForm {
  name: string;
  ministry_id: string; // store as string in form
  email: string;
  password: string;
  role: string;
}

export default function UserManagementView() {
  const [users, setUsers] = useState<
    Array<{
      user_id: number;
      username: string;
      ministry: {
        name: string;
        ministry_id: number;
      };
      email: string;
      role: string;
      status: boolean;
    }>
  >([]);

  const [ministry, setMinistry] = useState<any>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp: any = await listUsers();
        setUsers(resp);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchMinistry = async () => {
      try {
        const resp: any = await listMinistries();
        setMinistry(resp);
      } catch (error) {
        console.error("Error fetching ministry:", error);
      }
    };
    fetchMinistry();
    fetchUsers();
  }, []);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    ministry_id: "",
    email: "",
    password: "",
    role: "",
  });

  const handleAddUser = async () => {
    try {
      // Convert ministry_id to a number before sending
      const newUser = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as "Admin" | "MinistryUser",
        ministry_id: formData.ministry_id ? Number(formData.ministry_id) : null, // convert safely
      };

      await createUser(newUser);

      // Reset form
      setFormData({
        name: "",
        ministry_id: "",
        email: "",
        role: "",
        password: "",
      });

      setIsAddingUser(false);
      toast.success("User created successfully ✅");
    } catch (error) {
      console.log("Error at creating user:", error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          DIIWAANKA ADEEGSADAHA
        </h2>
        <p className="text-gray-600 mt-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" />
          Maaraynta adeegsadayaasha
        </p>
      </div>
      <button
        onClick={() => {
          setIsAddingUser(true);
          setEditingId(null);
        }}
        className="flex items-center gap-2 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-[#004225]/30"
      >
        <Plus className="w-5 h-5" />
        Ku dar maamule cusub
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
                  ministry_id: "",
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
              placeholder="Username"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
            />
            <select
              value={formData.ministry_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ministry_id: e.target.value,
                })
              }
              className="px-4 py-3 border border-[#004225]/30 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-[#004225]/50 
    bg-white/50 backdrop-blur-sm transition-all duration-300"
            >
              <option value="">Select Ministry</option>
              {ministry?.map((min: any) => (
                <option value={min.ministry_id} key={min.ministry_id}>
                  {min.name}
                </option>
              ))}
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
              <option value="MinistryUser">Ministry User</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddUser}
              className="flex-1 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg font-bold transition-all duration-300"
            >
              {editingId ? "Update User" : "Add User"}
            </button>
            <button
              onClick={() => {
                setIsAddingUser(false);
                setEditingId(null);
              }}
              className="flex-1 px-6 py-3 border border-[#004225]/30 text-gray-700 rounded-lg font-bold hover:bg-gray-50/80 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <UserList users={users} onDelete={handleDeleteUser} />
    </div>
  );
}
