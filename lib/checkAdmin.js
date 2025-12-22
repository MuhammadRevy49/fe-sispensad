"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/reusable/modal";
import { useRouter } from "next/navigation";

export default function RequireAdminModal({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    if (role?.toLowerCase() === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return (
      <ConfirmModal
        isOpen={true}
        onClose={() => router.push("/")}
        title="Akses Ditolak"
        message="Anda tidak memiliki akses ke halaman ini."
        confirmText="Kembali"
        type="error"
        onConfirm={() => router.push("/")}
      />
    );
  }

  return <>{children}</>;
}
