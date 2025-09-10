"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/reusable/modal";
import { variable } from "@/lib/variable";
import { useRouter } from "next/navigation";

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
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        {/* Animasi bouncing dots */}
        <div className="flex space-x-3 mb-4">
          <span
            className="w-6 h-6 bg-[var(--armycolor)] rounded-full bounce-dot"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="w-6 h-6 bg-[var(--armycolor)] rounded-full bounce-dot"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="w-6 h-6 bg-[var(--armycolor)] rounded-full bounce-dot"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
        <p className="text-gray-600 text-lg font-medium">Memeriksa akses...</p>

        <style jsx>{`
          .bounce-dot {
            display: inline-block;
            animation: bounce 0.6s infinite;
          }
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-0.5rem);
            } /* tinggi lompat */
          }
        `}</style>
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
        onConfirm={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      />
    );
  }

  return <>{children}</>;
}
