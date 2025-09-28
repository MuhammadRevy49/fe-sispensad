"use client";

import { useState, useEffect, useRef } from "react";
import ActionDropdown from "./ActionDropdown";
import Filtering from "./filtering";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { variable } from "@/lib/variable";

function TableActionCell({ soldier, menuOpenId, setMenuOpenId, handleEdit, handleDelete }) {
  const btnRef = useRef(null);
  return (
    <td className="px-4 py-3 border-t border-gray-300 relative" style={{ minWidth: '60px' }}>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpenId(menuOpenId === soldier.id ? null : soldier.id);
        }}
        className="px-2 py-1 text-sm font-bold"
        style={{ position: 'relative', zIndex: 2 }}
      >
        ⋮
      </button>
      <ActionDropdown
        open={menuOpenId === soldier.id}
        anchorRef={btnRef}
        onClose={() => setMenuOpenId(null)}
        actions={[
          {
            label: "Edit",
            onClick: (e) => {
              e.stopPropagation();
              handleEdit(soldier);
              setMenuOpenId(null);
            },
            color: "text-[var(--armycolor)]",
            hover: "hover:bg-[var(--armycolor)]/10",
            rounded: "rounded-t-lg"
          },
          {
            label: "Hapus",
            onClick: (e) => {
              e.stopPropagation();
              handleDelete(soldier);
              setMenuOpenId(null);
            },
            color: "text-red-600",
            hover: "hover:bg-red-100",
            rounded: "rounded-b-lg"
          }
        ]}
      />
    </td>
  );
}

export default function TableSection({
  page,
  setPage,
  limit = 50,
  category,
  setIsImporting,
  setIsExporting,
  setConfirmMessage,
  setConfirmOpen,
  setConfirmType,
  setDeleteTarget,
  refreshTrigger, // Terima trigger dari parent
}) {
  const router = useRouter();
  const [dataTable, setDataTable] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [filterPangkat, setFilterPangkat] = useState("Semua");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const group = category || "all";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("group", group);
      params.append("page", page);
      params.append("limit", limit);
      if (filterPangkat !== "Semua") params.append("pangkat", filterPangkat);
      if (search) {
        // cek apakah input hanya digit
        const isNumericString = /^\d+$/.test(search);

        if (isNumericString) {
          // kirim sebagai string, bukan number
          params.append("nrp", search);
        } else {
          params.append("nama", search);
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${variable.personil}?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      setDataTable(result.data || []);
      setTotalData(result.total || 0);
    } catch (error) {
      console.error("Error fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, filterPangkat, group, search, refreshTrigger]); // Tambahkan refreshTrigger ke dependency array

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleAdd = () => router.push(`/perwira/add`);

  const handleImport = async (file) => {
    if (!file) return;
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.import}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(`Import failed: ${res.status}`);

      setConfirmMessage("File berhasil diimpor!");
      setConfirmType("success");
      setConfirmOpen(true);
      fetchData(); // Refresh data setelah import berhasil
    } catch (error) {
      console.error("Error import file:", error);
      setConfirmMessage("Terjadi kesalahan saat impor.");
      setConfirmType("error");
      setConfirmOpen(true);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem("token");

      // Tambahkan parameter filter ke ekspor
      const params = new URLSearchParams();
      params.append("group", group);
      if (filterPangkat !== "Semua") params.append("pangkat", filterPangkat);
      if (search) {
        params.append("nama", search);
        params.append("NRP", search);
      }


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${variable.export}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`Export failed: ${res.status}`);

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `data_perwira_${group}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error exporting data:", error);
      setConfirmMessage("Gagal mengekspor data. Silakan coba lagi.");
      setConfirmType("error");
      setConfirmOpen(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEdit = (soldier) => router.push(`/perwira/${soldier.id}/edit`);

  const handleDelete = (soldier) => {
    setDeleteTarget(soldier);
    setConfirmMessage(`Apakah yakin ingin menghapus ${soldier.NAMA}?`);
    setConfirmType("question");
    setConfirmOpen(true);
  };

  const displayData = dataTable.map((item, index) => ({
    ...item,
    no: (page - 1) * limit + index + 1,
    TTL: item.TTL ? new Date(item.TTL).toLocaleDateString("id-ID") : "-",
  }));

  const totalPages = Math.ceil(totalData / limit);

  return (
    <div className="relative">
      <Filtering
        search={search}
        setSearch={setSearch}
        filterPangkat={filterPangkat}
        setFilterPangkat={setFilterPangkat}
        setPage={setPage}
        onImport={handleImport}
        onExport={handleExport}
        onAdd={handleAdd}
        onSearch={handleSearch}
      />

      <div
        className={`overflow-x-auto bg-white rounded-lg shadow relative ${displayData.length > 10 ? 'overflow-y-auto' : ''}`}
        style={displayData.length > 10 ? { maxHeight: '600px' } : {}}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="divide-y divide-gray-300">
              {[
                "No",
                "Nama Prajurit",
                "Pangkat",
                "NRP",
                "TTL",
                "TMT TNI",
                "Kesatuan",
                "",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-3 py-3 text-xs text-gray-700 border-b border-gray-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-3 text-center text-gray-500 border-t border-gray-300">
                  {search ? "Tidak ada data yang sesuai dengan pencarian" : "Tidak ada data"}
                </td>
              </tr>
            ) : (
              displayData.map((soldier) => (
                <tr key={soldier.id} className="hover:bg-gray-50 relative text-sm">
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.no}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.NAMA}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.PANGKAT}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.NRP}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.TTL}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.TMT_TNI}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.KESATUAN}</td>
                  <TableActionCell
                    soldier={soldier}
                    menuOpenId={menuOpenId}
                    setMenuOpenId={setMenuOpenId}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-3">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center justify-center px-3 py-2 bg-white border rounded-full shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
        </button>

        <span className="px-4 py-2 border rounded-full bg-gray-50 shadow text-sm font-medium">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center justify-center px-3 py-2 bg-white border rounded-full shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}