"use client";

import { RefreshCw } from "lucide-react";

export default function SKEPForm({
  formData,
  onFormChange,
  isEditing,
  selectedSoldier,
  onRefresh,
}) {
  const fields = [
    { key: "nama", label: "Nama Lengkap", type: "text" },
    { key: "pangkat", label: "Pangkat", type: "text" },
    { key: "nrp", label: "NRP", type: "text" },
    { key: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
    { key: "kesatuanTerakhir", label: "Kesatuan Terakhir", type: "text" },
    { key: "tmtTni", label: "TMT TNI", type: "date" },
    { key: "noKtpa", label: "No. KTPA", type: "text" },
    { key: "npwp", label: "NPWP", type: "text" },
    { key: "jumlahPensiun", label: "Jumlah Pensiun (Rp)", type: "number" },
  ];

  return (
    <div>
      {/* Refresh Button */}
      {!isEditing && (
        <button
          onClick={onRefresh}
          className="w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-xs font-semibold"
        >
          <RefreshCw size={14} />
          Refresh Data
        </button>
      )}

      {/* Form Fields */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              {field.label}
            </label>
            {isEditing ? (
              // Edit Mode - Input
              <input
                type={field.type}
                value={formData[field.key] || ""}
                onChange={(e) => onFormChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] focus:border-transparent text-xs bg-white"
                placeholder={`Masukkan ${field.label.toLowerCase()}`}
              />
            ) : (
              // Read-only Mode - Display
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs text-gray-700 font-medium break-words">
                {formData[field.key] || "—"}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          <span className="font-semibold block mb-1">Informasi:</span>
          Klik "Edit" untuk mengubah data jika ada kesalahan dari database.
        </p>
      </div>
    </div>
  );
}
