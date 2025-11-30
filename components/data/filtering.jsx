"use client";

import { useState, useEffect } from "react";
import Dropdown from "@/components/reusable/dropdown";
import { Download, Upload, Plus } from "lucide-react";

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
  // Hanya pangkat Pati (plus opsi 'Semua' untuk reset)
  const pangkatOptions = ["Semua", "Brigjen", "Letjen", "Mayjen", "Jenderal"];

  const [localSearch, setLocalSearch] = useState(search);
  const [localFilter, setLocalFilter] = useState(pangkatOptions[0]);

  useEffect(() => {
    // Jika nilai luar berubah (mis. dari parent), sinkronkan lokal
    setLocalSearch(search);
    setLocalFilter(filterPangkat || pangkatOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterPangkat]);

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
