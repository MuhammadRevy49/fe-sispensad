"use client";

import { useState, useEffect } from "react";
import Filtering from "./filtering";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { variable } from "@/lib/variable";
import AddDataModal from "./modalAddData";

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
  refreshTrigger,
  showActions = true,
}) {
  const router = useRouter();
  const [dataTable, setDataTable] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [filterPangkat, setFilterPangkat] = useState("Semua");
  const [modalAdd, setModalAdd] = useState(false);

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
        const isNumericString = /^\d+$/.test(search);
        if (isNumericString) params.append("nrp", search);
        else params.append("nama", search);
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
  }, [page, limit, filterPangkat, group, search, refreshTrigger]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleAdd = () => {
    setModalAdd(true);
  };

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
      fetchData();
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

      const params = new URLSearchParams();
      params.append("group", group);
      if (filterPangkat !== "Semua") params.append("pangkat", filterPangkat);
      if (search) {
        params.append("nama", search);
        params.append("NRP", search);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${variable.export}?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleEdit = (soldier) => router.push(`/perwira/edit/${soldier.id}`);

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
        showActions={showActions}
      />

      <div
        className={`overflow-x-auto bg-white rounded-lg shadow relative ${
          displayData.length > 10 ? "overflow-y-auto" : ""
        }`}
        style={displayData.length > 10 ? { maxHeight: "600px" } : {}}
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
                "Aksi",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-3 py-3 text-xs text-gray-700 border-b border-gray-300 bg-white sticky top-0 z-10"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-3 text-center text-gray-500 border-t border-gray-300"
                >
                  {search
                    ? "Tidak ada data yang sesuai dengan pencarian"
                    : "Tidak ada data"}
                </td>
              </tr>
            ) : (
              displayData.map((soldier) => (
                <tr
                  key={soldier.id}
                  className="hover:bg-gray-50 relative text-sm transition-colors"
                >
                  <td className="px-4 py-3 border-t border-gray-300">
                    {soldier.no}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-300">
                    {soldier.NAMA}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-300">
                    {soldier.PANGKAT}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-300">
                    {soldier.NRP}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-300">
                    {soldier.TTL}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-300">
                    {soldier.TMT_TNI}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-300">
                    {soldier.KESATUAN}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-300 flex gap-2">
                    <button
                      onClick={() => handleEdit(soldier)}
                      className="flex items-center px-1 py-1 text-xs rounded-md text-yellow-600 hover:opacity-50 hover:cursor-pointer transition-all"
                    >
                      <Pencil size={12} className="mr-1"/>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(soldier)}
                      className="flex items-center px-1 py-1 text-xs rounded-md text-red-500 hover:opacity-50 hover:cursor-pointer transition-all"
                    >
                      <Trash2 size={12} className="mr-1"/>
                      Hapus
                    </button>
                    <button
                      onClick={() => handleDelete(soldier)}
                      className="flex items-center px-1 py-1 text-xs rounded-md text-blue-700 hover:opacity-50 hover:cursor-pointer transition-all"
                    >
                      <Eye size={12} className="mr-1"/>
                      Detail
                    </button>
                  </td>
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
      <AddDataModal open={modalAdd} onClose={() => setModalAdd(false)} />
    </div>
  );
}
