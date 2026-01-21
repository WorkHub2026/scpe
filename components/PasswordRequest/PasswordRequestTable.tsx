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
    await reviewResetRequest(id, "APPROVED", userId);
    setLoadingId(null);
  };

  const handleReject = async (id: number) => {
    setLoadingId(id);
    await reviewResetRequest(id, "REJECTED", userId);
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
              <th className="p-3 text-left">Adeegsade </th>
              <th className="p-3 text-left">Dhambaal</th>
              <th className="p-3 text-left">Xaalad</th>
              <th className="p-3 text-left">Codsi</th>
              <th className="p-3 text-right">Tallaabo </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r: any) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{r.ministry}</td>
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
                        Ansax
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
                        Diidmo
                      </button>
                    </>
                  )}

                  {/* Approved: Change Key */}
                  {r.status === "APPROVED" && (
                    <p className="text-gray-400">Ansax</p>
                  )}

                  {/* Rejected */}
                  {r.status === "REJECTED" && (
                    <span className="text-sm text-gray-500 italic">Diidmo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
