"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import CardsSection from "@/components/data/card";
import TableSection from "@/components/data/table";
import LoadingDots from "@/components/reusable/loading";
import ConfirmModal from "@/components/reusable/modal";
import { variable } from "@/lib/variable";
import PageTitle from "@/components/reusable/pageTitle";

export default function DashboardPage() {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmType, setConfirmType] = useState("success");

  const limit = 50;

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${variable.personil}/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConfirmMessage("Data berhasil dihapus!");
      setConfirmType("success");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
      setConfirmMessage("Terjadi kesalahan saat delete.");
      setConfirmType("error");
    } finally {
      setDeleteTarget(null);
      setConfirmOpen(true);
    }
  };

  return (
    <div className="p-1 space-y-6 relative">
      {/* Page Title */}
      <PageTitle title={`Peninjauan Pensiun`} desc="Sistem Pensiun Angkatan Darat" />
      {/* Section Cards */}
      <CardsSection
        loading={loading}
        setLoading={setLoading}
        refreshTrigger={refreshTrigger}
      />

      {/* Section Table */}
      <TableSection
        page={page}
        setPage={setPage}
        limit={limit}
        setConfirmMessage={setConfirmMessage}
        setConfirmOpen={setConfirmOpen}
        setConfirmType={setConfirmType}
        setDeleteTarget={setDeleteTarget}
        refreshTrigger={refreshTrigger}
        showActions={false}
        showBpu={true}
        mode="peninjauan"
      />

      {/* Global Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
            <LoadingDots color="var(--armycolor)" />
            <div className="text-[var(--textgray)] font-medium text-center">
              Memuat data...
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        title={
          confirmType === "success"
            ? "Berhasil"
            : confirmType === "error"
              ? "Error"
              : "Konfirmasi"
        }
        message={confirmMessage}
        type={confirmType}
        confirmText={deleteTarget ? "Hapus" : "Tutup"}
        onConfirm={deleteTarget ? confirmDelete : undefined}
      />
    </div>
  );
}