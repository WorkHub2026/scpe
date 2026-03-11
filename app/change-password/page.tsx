"use client";

import ChangePasswordPage from "@/components/ChangePasswordPage";
import LoginPage from "@/components/LoginPage";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <LoginPage />;
  return <ChangePasswordPage />;
}

