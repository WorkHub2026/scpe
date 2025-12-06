"use client";
import { useEffect, useState } from "react";
import { getCrisisById } from "@/lib/services/crisis.service";
import { useParams } from "next/navigation";
const CrisisPage = () => {
  const { id } = useParams();
  const [crisis, setCrisis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrisis = async () => {
      setLoading(true);
      try {
        const resp: any = getCrisisById(Number(id));
        setCrisis(resp);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log("Error at fetching:", err);
      }
    };

    fetchCrisis();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!crisis) return <p className="p-4 text-red-600">Crisis not found</p>;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{crisis.title}</h1>

      <p className="text-sm text-gray-500 mb-4">
        Priority: <span className="font-semibold">{crisis.priority}</span>
      </p>

      <p className="mb-6">
        <strong>Created by:</strong> {crisis.author}
      </p>

      {crisis.file_path && (
        <div className="mb-6">
          <a
            href={crisis.file_path}
            target="_blank"
            className="text-blue-600 underline"
          >
            View File
          </a>
        </div>
      )}

      <button
        onClick={() => history.back()}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Back
      </button>
    </div>
  );
};

export default CrisisPage;
