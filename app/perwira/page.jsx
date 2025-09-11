"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import CardsSection from "@/components/data/card";
import TableSection from "@/components/data/table";
import LoadingDots from "@/components/reusable/loading";
import ConfirmModal from "@/components/reusable/modal";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get("category") || "all";

  const [loading, setLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmType, setConfirmType] = useState("success"); // tambahkan state untuk type modal

  const limit = 50;

  useEffect(() => {
    setPage(1);
  }, [category]);

  // Fungsi untuk dipanggil saat import berhasil
  const handleImportSuccess = () => {
    setConfirmMessage("File berhasil diimpor!");
    setConfirmType("success"); // set type
    setConfirmOpen(true);
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Section Cards */}
      <CardsSection loading={loading} setLoading={setLoading} category={category} />

      {/* Section Table */}
      <TableSection
        page={page}
        setPage={setPage}
        limit={limit}
        category={category}
        setIsImporting={setIsImporting}
        setIsExporting={setIsExporting}
        setConfirmMessage={setConfirmMessage}
        setConfirmOpen={setConfirmOpen}
        setConfirmType={setConfirmType} // teruskan setter ke TableSection
      />

      {/* Global Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
            <LoadingDots color="var(--armycolor)" />
            <div className="text-[var(--textgray)] font-medium text-center">Memuat data...</div>
          </div>
        </div>
      )}

      {/* Global Importing overlay */}
      {isImporting && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
            <LoadingDots color="var(--armycolor)" />
            <p className="text-[var(--textgray)] font-medium text-center">
              Sedang mengimpor data, mohon tunggu...
            </p>
          </div>
        </div>
      )}

      {/* Global Exporting overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
            <LoadingDots color="var(--armycolor)" />
            <p className="text-[var(--textgray)] font-medium text-center">
              Sedang mengekspor data, mohon tunggu...
            </p>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmType === "success" ? "Berhasil" : "Peringatan"}
        message={confirmMessage}
        type={confirmType} // gunakan state string, bukan setter
        confirmText="Tutup"
      />
    </div>
  );
}
