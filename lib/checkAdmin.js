"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/reusable/modal";
import { variable } from "@/lib/variable";
import { useRouter } from "next/navigation";
import LoadingDots from "@/components/reusable/loading";

export default function RequireAdminModal({ children }) {
  const [authorized, setAuthorized] = useState(null); // null = loading, true = admin, false = no access
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthorized(false);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}` + variable.getMe,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );

        if (!res.ok) {
          setAuthorized(false);
          return;
        }

        const data = await res.json();
        const role = data?.role || data?.user?.role;
        if (role === "ADMIN") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error("Cek admin error:", err);
        setAuthorized(false);
      }
    }

    checkAdmin();
  }, []);

  if (authorized === null) {
    return (
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
          <LoadingDots color="var(--armycolor)" />
          <p className="text-[var(--textgray)] font-medium text-center">
            Mohon tunggu...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <ConfirmModal
        isOpen={true}
        onClose={() => {
          router.push("/");
        }}
        title="Akses Ditolak"
        message="Anda tidak memiliki izin untuk membuka halaman ini. Silakan login ulang dengan akun admin."
        confirmText="Login Ulang"
        cancelText="Tutup"
        confirmColor="bg-[var(--armycolor)]"
        type="warning"
        onConfirm={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      />
    );
  }

  return <>{children}</>;
}
