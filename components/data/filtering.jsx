"use client";

import { useSearchParams } from "next/navigation";
import Dropdown from "@/components/reusable/dropdown";
import { Download, Upload, Plus } from "lucide-react";

// Mapping group -> pangkat options
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

  return (
    <div className="flex gap-3 mb-3 justify-between flex-wrap">
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="text-sm p-2 bg-white border border-gray-300 rounded-lg w-80"
          type="text"
          placeholder="Masukkan Nama Perwira"
        />
        <div className="w-48">
          <Dropdown
            options={pangkatOptions}
            selected={filterPangkat}
            onSelect={(value) => {
              setFilterPangkat(value);
              setPage(1);
            }}
            placeholder="Filter Pangkat"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <label className="text-sm p-2 border border-green-800 text-green-800 rounded-lg flex items-center hover:opacity-50 transition-all cursor-pointer">
          <Download size={18} className="mr-1" /> Import
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              console.log("File dipilih:", e.target.files[0]);
              onImport(e.target.files[0]);
            }}
          />
        </label>

        <button
          onClick={onExport}
          className="text-sm p-2 border border-green-800 text-green-800 rounded-lg flex items-center hover:opacity-50 transition-all"
        >
          <Upload size={18} className="mr-1" /> Export
        </button>

        <button
          onClick={onAdd}
          className="text-sm p-2 bg-[var(--armycolor)] text-white rounded-lg flex items-center hover:opacity-50 transition-all"
        >
          <Plus size={18} className="mr-1" /> Tambahkan Data
        </button>
      </div>
    </div>
  );
}
