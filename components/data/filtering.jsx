"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Dropdown from "@/components/reusable/dropdown";
import { Download, Upload, Plus } from "lucide-react";

const pangkatOptionsMap = {
  pati: ["Semua", "Brigjen", "Letjen", "Mayjen", "Jenderal"],
  pamen: ["Semua", "Mayor", "Letkol", "Kolonel"],
  pama: ["Semua", "Letda", "Lettu", "Kapten"],
  all: [
    "Semua",
    "Brigjen",
    "Letjen",
    "Mayjen",
    "Jenderal",
    "Mayor",
    "Letkol",
    "Kolonel",
    "Letda",
    "Lettu",
    "Kapten",
  ],
};

export default function Filtering({
  search,
  setSearch,
  filterPangkat,
  setFilterPangkat,
  setPage,
  onImport,
  onExport,
  onAdd,
  showActions = true,
  showBup = true,
}) {
  const searchParams = useSearchParams();
  const rawGroup = searchParams.get("category") || "all";
  const group = rawGroup.replace(/"/g, "");

  const pangkatOptions = pangkatOptionsMap[group] || [
    "Semua",
    "Letnan",
    "Kapten",
    "Mayor",
  ];

  const [localSearch, setLocalSearch] = useState(search);
  const [localFilter, setLocalFilter] = useState(pangkatOptions[0] || "Semua");

  useEffect(() => {
    setLocalFilter(pangkatOptions[0] || "Semua");
  }, [group]);

  const handleSearchSubmit = () => {
    setSearch(localSearch);
    setFilterPangkat(localFilter);
    setPage(1);
  };

  return (
    <div className="flex justify-between gap-3 mb-3">
      {/* Bagian Search + Filter + Submit */}
      <div className="flex items-center gap-3">
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="text-sm p-2 bg-white border border-gray-300 rounded-lg w-80 focus:outline-2 focus:outline-green-800 focus:ring-1 focus:ring-green-500 transition-all"
          type="text"
          placeholder="Cari Nama / Nrp disini..."
        />

        <Dropdown
          options={pangkatOptions}
          selected={localFilter}
          onSelect={(value) => setLocalFilter(value)}
          placeholder="Filter Pangkat"
        />

        <button
          type="button"
          onClick={handleSearchSubmit}
          className="text-sm px-4 py-2 bg-[var(--armycolor)] text-white rounded-lg flex items-center hover:opacity-50 transition-all hover:cursor-pointer"
        >
          Submit
        </button>
      </div>

      {showBup && (
      <div>
        <div className="bg-white p-2 rounded-lg border border-gray-300 shadow">
          <p className="text-sm">Jumlah Perwira Mencapai BUP : 0</p>
        </div>
      </div>
      )}

      {/* Bagian tombol Import, Export, Tambah (opsional) */}
      {showActions && (
        <div className="flex items-center gap-3">
          <label className="text-sm p-2 border border-green-800 text-green-800 rounded-lg flex items-center hover:opacity-50 transition-all cursor-pointer">
            <Download size={18} className="mr-1" /> Import
            <input
              type="file"
              className="hidden"
              onChange={(e) => onImport && onImport(e.target.files[0])}
            />
          </label>

          <button
            onClick={onExport}
            className="text-sm p-2 border border-green-800 text-green-800 rounded-lg flex items-center hover:opacity-50 hover:cursor-pointer transition-all"
          >
            <Upload size={18} className="mr-1" /> Export
          </button>

          <button
            onClick={onAdd}
            className="text-sm p-2 bg-[var(--armycolor)] text-white rounded-lg flex items-center hover:opacity-50 hover:cursor-pointer transition-all"
          >
            <Plus size={18} className="mr-1" /> Tambahkan Data
          </button>
        </div>
      )}
    </div>
  );
}
