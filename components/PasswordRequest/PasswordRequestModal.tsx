import React, { useState } from "react";
import { submitPasswordRequest } from "@/lib/services/passwordRequest.service";
type Toast = { type: "success" | "error"; message: string } | null;

const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    width="20"
    height="20"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    width="20"
    height="20"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 8v4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const PasswordRequestModal = ({
  setModalOpen,
}: {
  setModalOpen?: (v: boolean) => void;
}) => {
  const [requestMessage, setRequestMessage] = useState("");
  const [ministryUsername, setMinistryUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const handleSubmitRequest = async () => {
    if (!requestMessage.trim()) return;
    try {
      setIsSubmitting(true);
      const resp: any = await submitPasswordRequest(
        ministryUsername,
        requestMessage
      );
      if (resp?.status === "PENDING") {
        setToast({
          type: "error",
          message: "You already have a pending request.",
        });
      } else {
        setToast({
          type: "success",
          message: "Your password change request has been sent to the admin.",
        });
      }
      setRequestMessage("");
      setModalOpen?.(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg mb-4">Ministry Username</h2>
          <input
            value={ministryUsername}
            onChange={(e) => setMinistryUsername(e.target.value)}
            type="text"
            placeholder="Enter Your Ministry Username"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <h2 className="text-lg mb-4">Request Password Change</h2>
          <textarea
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Enter message for admin..."
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModalOpen?.(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRequest}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white
      ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}
    `}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}

          <span>{toast.message}</span>

          <button
            onClick={() => setToast(null)}
            className="ml-3 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default PasswordRequestModal;
