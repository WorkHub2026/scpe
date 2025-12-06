"use client";
import { useEffect, useState } from "react";

const PolicyPage = ({ params }: any) => {
  const { id } = params;
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!policy) return <p className="p-4 text-red-600">Crisis not found</p>;
  return <div>PolicyPage</div>;
};

export default PolicyPage;
