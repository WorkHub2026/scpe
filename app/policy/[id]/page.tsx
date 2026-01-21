"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPolicyById } from "@/lib/services/policy.service";
import Navbar from "@/components/shared/Navbar";
import { useAuth } from "@/context/AuthContext";

const PolicyPage = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth Context
  const { user, logout }: any = useAuth();

  useEffect(() => {
    if (!id) return; // ✅ guard against undefined

    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const resp: any = await getPolicyById(Number(id));
        setPolicy(resp);
        console.log("Policy Data:", resp);
      } catch (err) {
        console.log("Error at fetching:", err);
      } finally {
        setLoading(false); // ✅ always stop loading
      }
    };

    fetchPolicy();
  }, [id]); // ✅ dependency added

  if (loading) return <p className="p-4">Loading...</p>;
  if (!policy) return <p className="p-4 text-red-600">Crisis not found</p>;
  return (
    <>
      <Navbar user={user} onLogout={logout} />

      <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen mt-10">
        {/* SECTION 1: Letter Title */}
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {policy?.title}
          </h1>
        </header>

        {/* SECTION 3: The Letter View (Paper UI) */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-8 mb-8 relative">
          {/* Date/Meta Header inside the letter */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-6">
            <div className="text-gray-400 text-sm">
              Reference: #{policy?.id || "N/A"}
            </div>
            {policy?.file_path && (
              <a
                href={policy?.file_path}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                Attachment
              </a>
            )}
          </div>

          {/* The Main Letter Content */}
          {/* Assuming policy.content or policy.body exists. If only a file exists, we display a placeholder */}
          <div className="prose prose-slate max-w-none text-gray-800 leading-relaxed">
            {policy?.content ? (
              <p>{policy?.content}</p>
            ) : (
              <div className="p-12 text-center bg-gray-50 rounded border border-dashed border-gray-300">
                {policy?.file_path ? (
                  <p>
                    This letter is an attachment. Please view the file using the
                    link above.
                  </p>
                ) : (
                  <p className="italic text-gray-400">
                    No text content available.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Signature Section */}
          <div className="mt-12 pt-8">
            <p className="text-sm text-gray-500 mb-1">Created by:</p>
            <p className="font-serif text-lg font-bold text-gray-900">
              {policy?.author.username}
            </p>
          </div>
        </div>

        {/* SECTION 4: Back Button */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-[#004225] hover:bg-[#003218] text-white rounded-lg  transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to List
          </button>
        </div>
      </div>
    </>
  );
};

export default PolicyPage;
