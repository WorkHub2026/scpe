"use client";

import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import MinistryDashboard from "@/components/admin/MinistryDashboard";
import LoginPage from "@/components/LoginPage";
import UnAuthorized from "@/components/UnAuthorized";

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === "Admin") {
    return <AdminDashboard user={user} onLogout={logout} />;
  }

  if (user.role === "MinistryUser") {
    return <MinistryDashboard user={user} onLogout={logout} />;
  }

  // fallback if role is unknown
  return <UnAuthorized />;
}
