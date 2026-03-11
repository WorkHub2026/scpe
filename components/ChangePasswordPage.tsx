"use client";

import { useAuth } from "@/context/AuthContext";
import { changeUserPassword } from "@/lib/services/userService";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const { user, login, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user?.user_id) return null;

  const mustChange = Boolean(user.must_change_password);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const updatedUser = await changeUserPassword({
        user_id: Number(user.user_id),
        currentPassword,
        newPassword,
      });

      login({ ...(user as any), ...(updatedUser as any), must_change_password: false });
      toast.success("Password updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-emerald-200/50 shadow-xl shadow-emerald-500/10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#004225]">Change password</h1>
          {mustChange && (
            <p className="text-sm text-gray-600">
              Your password was reset by an admin. Please set a new password to
              continue.
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white/50 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white/50 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white/50 transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white rounded-lg font-bold shadow-lg shadow-emerald-500/30"
          >
            {saving ? "Saving..." : "Update password"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => logout()}
          className="w-full px-6 py-3 border border-emerald-200/80 text-gray-700 rounded-lg font-bold hover:bg-gray-50/80 transition-all duration-300"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

