"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Filtering from "./filtering";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
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
  mode = "default",
}) {
  const router = useRouter();
  const [dataTable, setDataTable] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [filterPangkat, setFilterPangkat] = useState("Semua");
  const [modalAdd, setModalAdd] = useState(false);

  // open dropdown id + position for portal menu
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null); // { top, left }

  const tableContainerRef = useRef(null);

  const group = category || "all";
  const isPeninjauan = mode === "peninjauan";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      params.append("group", group);
      if (filterPangkat !== "Semua") params.append("pangkat", filterPangkat);

      if (search) {
        const isNumericString = /^\d+$/.test(search);
        if (isNumericString) params.append("nrp", search);
        else params.append("nama", search);
      }

      let res;

      if (isPeninjauan) {
        // peninjauan
        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.personilBup}?${params.toString()}`);
      } else {
        // default
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${variable.personil}?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const result = await res.json();
      setDataTable(result.data || []);
      setTotalData(result.total || 0);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, filterPangkat, group, search, refreshTrigger, mode]);

  useEffect(() => {
    const handleDocClick = (e) => {
      const target = e.target;
      if (!target.closest?.(".row-action-toggle") && !target.closest?.(".row-action-dropdown-portal")) {
        setOpenDropdownId(null);
        setDropdownPos(null);
      }
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  // close dropdown when user scrolls the table container or the window
  useEffect(() => {
    const onScroll = () => {
      if (openDropdownId !== null) {
        setOpenDropdownId(null);
        setDropdownPos(null);
      }
    };

    const container = tableContainerRef.current;
    if (container) container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (container) container.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [openDropdownId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleAdd = () => {
    setModalAdd(true);
  };

  const handleImport = async (file) => {
    if (!file || !setIsImporting) return;
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${variable.import}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`Import failed: ${res.status}`);

      setConfirmMessage("File berhasil diimpor!");
      setConfirmType("success");
      setConfirmOpen(true);
      fetchData();
    } catch (error) {
      setConfirmMessage("Terjadi kesalahan saat impor.");
      setConfirmType("error");
      setConfirmOpen(true);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    if (!setIsExporting) return;
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
  const handleDetail = (soldier) => {
    router.push(`/perwira/detail/${soldier.id}`);
  };

  const displayData = dataTable.map((item, index) => ({
    ...item,
    no: (page - 1) * limit + index + 1,
    TTL: item.TTL ? new Date(item.TTL).toLocaleDateString("id-ID") : "-",
  }));

  const totalPages = Math.ceil(totalData / limit);
  const headers = [
    "No",
    "Nama Prajurit",
    "Pangkat",
    "NRP",
    "TTL",
    "Status",
    "Aksi",
  ];

  const openRowDropdown = (e, soldierId) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const MENU_WIDTH = 144;
    const MENU_HEIGHT = 120;
    const GAP = 8;

    let top = rect.bottom + window.scrollY + GAP;
    let left = rect.right - MENU_WIDTH + window.scrollX;

    // if not enough space below, place above the button
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < MENU_HEIGHT + GAP) {
      top = rect.top + window.scrollY - MENU_HEIGHT - GAP;
    }

    // clamp left so menu won't overflow viewport
    if (left < 8) left = 8;
    const maxLeft = window.innerWidth - MENU_WIDTH - 8;
    if (left > maxLeft) left = maxLeft;

    setDropdownPos({ left, top });
    setOpenDropdownId((prev) => (prev === soldierId ? null : soldierId));

    // if closing, clear pos
    if (openDropdownId === soldierId) {
      setDropdownPos(null);
    }
  };

  // portal menu renderer
  const renderPortalMenu = (soldier) => {
    if (!dropdownPos) return null;
    const menu = (
      <div
        className="row-action-dropdown-portal"
        style={{
          position: "absolute",
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: 144,
          zIndex: 9999,
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border border-gray-200 rounded-lg py-1">
          <button
            onClick={() => {
              setOpenDropdownId(null);
              setDropdownPos(null);
              handleEdit(soldier);
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50"
          >
            <Pencil size={14} className="mr-1 text-yellow-600" />
            <span className="text-yellow-600">Edit</span>
          </button>

          <button
            onClick={() => {
              setOpenDropdownId(null);
              setDropdownPos(null);
              handleDelete(soldier);
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50"
          >
            <Trash2 size={14} className="mr-1 text-red-500" />
            <span className="text-red-500">Hapus</span>
          </button>

          <button
            onClick={() => {
              setOpenDropdownId(null);
              setDropdownPos(null);
              handleDetail(soldier);
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50"
          >
            <Eye size={14} className="mr-1 text-blue-700" />
            <span className="text-blue-700">Detail</span>
          </button>
        </div>
      </div>
    );

    return typeof document !== "undefined" ? createPortal(menu, document.body) : null;
  };

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
        ref={tableContainerRef}
        className={`overflow-x-auto bg-white rounded-lg shadow relative ${displayData.length > 10 ? "overflow-y-auto" : ""}`}
        style={displayData.length > 10 ? { maxHeight: "600px" } : {}}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="divide-y divide-gray-300">
              {headers.map((header, idx) => (
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
                  colSpan={7}
                  className="px-4 py-3 text-center text-gray-500 border-t border-gray-300"
                >
                  {search ? "Tidak ada data yang sesuai dengan pencarian" : "Tidak ada data"}
                </td>
              </tr>
            ) : (
              displayData.map((soldier) => (
                <tr
                  key={soldier.id}
                  className="hover:bg-gray-50 relative text-sm transition-colors"
                >
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.no}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.NAMA}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.PANGKAT}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.NRP}</td>
                  <td className="px-4 py-3 border-t border-gray-300">{soldier.TTL}</td>

                  <td className="px-4 py-3 border-t border-gray-300">
                    {(() => {
                      const raw = String(soldier.status_bup || soldier.STATUS || "");
                      const key = raw.trim().toLowerCase();
                      let cls = "text-gray-500 border-gray-300";
                      if (key.includes("mencapai bup")) cls = "text-green-600 border-green-600";
                      else if (key.includes("belum")) cls = "text-red-600 border-red-400";
                      else if (key.includes("akan")) cls = "text-yellow-600 border-yellow-600";
                      const label = raw || "-";
                      return (
                        <span className={`inline-block px-2 py-1 text-xs rounded-full border ${cls} text-center`}>
                          {label}
                        </span>
                      );
                    })()}
                  </td>

                  <td className="px-4 py-3 border-t border-gray-300 relative">
                    {/* action: three-dot toggle (we capture rect and render portal menu) */}
                    <div className="inline-block relative">
                      <button
                        type="button"
                        className="row-action-toggle flex items-center p-1 rounded hover:bg-gray-100"
                        onClick={(e) => openRowDropdown(e, soldier.id)}
                        aria-haspopup="true"
                        aria-expanded={openDropdownId === soldier.id}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* If this row is open, render portal menu */}
                      {openDropdownId === soldier.id && renderPortalMenu(soldier)}
                    </div>
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

      {showActions && !isPeninjauan && (
        <AddDataModal open={modalAdd} onClose={() => setModalAdd(false)} />
      )}
    </div>
  );
}
