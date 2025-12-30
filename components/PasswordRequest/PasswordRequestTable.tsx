"use client";

import { useState } from "react";
import {
  reviewResetRequest,
  adminResetsUserPassword,
} from "@/lib/services/passwordRequest.service";
import { Check, X, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RequestsTable({ requests }: { requests: any[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [resetId, setResetId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const { user } = useAuth();

  const userId = Number(user?.user_id);
  const handleApprove = async (id: number) => {
    setLoadingId(id);
    await reviewResetRequest(
      id,
      "APPROVED",
      userId,
      "Admin has approved the request"
    );
    setLoadingId(null);
  };

  const handleReject = async (id: number) => {
    setLoadingId(id);
    await reviewResetRequest(
      id,
      "REJECTED",
      userId,
      "Admin has rejected the request"
    );
    setLoadingId(null);
  };

  const submitReset = async () => {
    try {
      await adminResetsUserPassword(resetId!, newPassword);
      setSaving(true);
      setResetId(null);
      setNewPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Requested</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r: any) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{r.user.username}</td>
                <td className="p-3 text-gray-600">{r.user.email}</td>
                <td className="p-3">{r.reason}</td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        r.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* Requested */}
                <td className="p-3 text-gray-500">
                  {new Date(r.createdAt).toLocaleString()}
                </td>

                {/* Action Column */}
                <td className="p-3 flex gap-2 justify-end">
                  {/* Pending: approve / reject */}
                  {r.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => {
                          setLoadingId(r.id);
                          handleApprove(r.id).finally(() => setLoadingId(null));
                        }}
                        disabled={loadingId === r.id}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60"
                      >
                        {loadingId === r.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          setLoadingId(r.id);
                          handleReject(r.id).finally(() => setLoadingId(null));
                        }}
                        disabled={loadingId === r.id}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {/* Approved: Change Key */}
                  {r.status === "APPROVED" && (
                    <button
                      onClick={() => setResetId(r.user.user_id)}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      Change Key
                    </button>
                  )}

                  {/* Rejected */}
                  {r.status === "REJECTED" && (
                    <span className="text-sm text-gray-500 italic">
                      Rejected
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset Password Modal */}
      {resetId && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[380px] shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Change User Password</h2>

            <p className="text-sm text-gray-500 mb-4">
              Enter the new password for this user.
            </p>

            <input
              type="password"
              placeholder="New password"
              className="border p-2 rounded w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setResetId(null)}>Cancel</button>

              <button
                disabled={saving}
                onClick={submitReset}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
