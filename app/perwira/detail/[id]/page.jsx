"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/reusable/pageTitle";

export default function DetailCardPerwira({ initialData = {}, onSave, onCancel }) {
  // Daftar Field yang Anda berikan
  const prajuritFieldNames = useMemo(
    () => [
      "Nama Perwira",
      "Pangkat",
      "NRP",
      "Kesatuan",
      "TTL",
      "TMT TNI",
      "NKTPA",
      "NPWP",
      "Autentik",
      "MDK",
      "MKG",
      "GPT",
      "NO SKEP",
      "TGL SKEP",
      // Tambahkan field yang sudah ada di initialData tetapi tidak ada di daftar ini jika diperlukan
    ],
    []
  );

  // Field Placeholder untuk Kolom Keluarga (agar layout 3 kolom tetap terpenuhi seperti di gambar)
  const keluargaPlaceholderNames = useMemo(
    () => [
      "Nama Pasangan",
      "TTL Pasangan",
      "Anak 1",
      "TTL Anak 1",
      "STS Anak 1",
    ],
    []
  );

  const allFieldNames = useMemo(() => prajuritFieldNames.concat(keluargaPlaceholderNames), [prajuritFieldNames, keluargaPlaceholderNames]);

  const router = useRouter();

  const [form, setForm] = useState(() => {
    const base = {};
    allFieldNames.forEach((name) => {
      base[name] = initialData[name] ?? "";
    });
    return base;
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      if (onSave) {
        await onSave(form);
      }
    } catch (err) {
      setError(err?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  function handleBack(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (onCancel) return onCancel();

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/perwira");
  }

  function renderInput(name) {
    const value = form[name] ?? "";

    // Memperbarui regex berdasarkan fieldNames yang tersedia
    const isDate = /TGL|TTL|TMT|createdAt/i.test(name);
    const isNumber = /^(MDK|MKG|GPT)$/i.test(name); // MDK, MKG, GPT adalah angka

    const baseClasses = "mt-1 block w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-green-500 focus:border-green-500 transition-all";

    if (name === "id") {
      return (
        <input
          readOnly
          name={name}
          value={value}
          onChange={handleChange}
          className={`${baseClasses} bg-gray-50 text-gray-500`}
        />
      );
    }

    if (isDate) {
      let dateVal = value;
      try {
        const d = new Date(value);
        if (!Number.isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          dateVal = `${yyyy}-${mm}-${dd}`;
        }
      } catch (e) {}

      return (
        <input
          type="date"
          name={name}
          value={dateVal}
          onChange={handleChange}
          className={baseClasses}
        />
      );
    }

    if (isNumber) {
      return (
        <input
          type="number"
          name={name}
          value={value}
          onChange={handleChange}
          className={baseClasses}
        />
      );
    }
    
    // default text input
    return (
      <input
        name={name}
        value={value}
        onChange={handleChange}
        className={baseClasses}
      />
    );
  }
  
  // Fungsi untuk merender detail row di kolom keluarga (untuk field sederhana)
  function renderFamilyInput(name) {
      const isHeader = name.includes("Pasangan") || name.includes("Anak");
      return (
          <div className="space-y-1">
              {isHeader ? (
                  <p className="font-semibold text-sm text-gray-800 pt-2">{name.includes("Pasangan") ? "Pasangan (Istri)" : name}</p>
              ) : (
                  <label className="block" key={name} htmlFor={`input-${name}`}>
                      <span className="text-xs text-gray-600">{name}</span>
                      {renderInput(name)}
                  </label>
              )}
          </div>
      )
  }

  return (
    <div className="w-full mx-auto max-w-full md:max-w-[98%]">
      {/* PageTitle dipertahankan di luar card utama */}
      <PageTitle title={`Detail Data Perwira`} desc="Sistem Pensiun Angkatan Darat" />
      
      {/* Card Utama (Mirip Modal/Form) */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[calc(100vh-140px)]">
        
        {/* Header/Judul Card */}
        <div className="flex items-center mb-6 pb-2 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Detail Perwira</h3>
        </div>

        {/* Bagian Utama (3 Kolom Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* KOLOM 1: Foto Profil */}
            <div className="col-span-1 border-r border-gray-200 pr-6 flex flex-col items-start">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Foto Profil</h3>
                
                {/* Placeholder Foto */}
                <div className="w-56 h-56 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-4 border border-gray-300 shadow-inner">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                </div>
                
                <button type="button" className="w-56 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors text-sm font-medium shadow">
                    Upload Foto
                </button>
            </div>
            
            {/* KOLOM 2: Detail Prajurit (Field dari daftar Anda) */}
            <div className="col-span-1 pr-6 border-r border-gray-200">
              <h3 className="text-lg font-semibold text-green-700 mb-4 pb-1">Detail Prajurit</h3>
              <div className="space-y-3">
                {prajuritFieldNames.map((name) => (
                  <label className="block" key={name} htmlFor={`input-${name}`}>
                    <span className="text-sm text-gray-700 font-medium">{name}</span>
                    {renderInput(name)}
                  </label>
                ))}
              </div>
            </div>

            {/* KOLOM 3: Detail Keluarga (Placeholder untuk simulasi layout) */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-green-700 mb-4 pb-1">Detail Keluarga</h3>
              <div className="space-y-4">
                
                {/* Grup Pasangan */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-bold text-sm text-green-800 mb-2">Istri 1</p>
                    <div className="space-y-2">
                        <label className="block" htmlFor="input-Nama Pasangan">
                            <span className="text-xs text-gray-600">Nama Pasangan</span>
                            {renderInput("Nama Pasangan")}
                        </label>
                        <label className="block" htmlFor="input-TTL Pasangan">
                            <span className="text-xs text-gray-600">TTL Pasangan</span>
                            {renderInput("TTL Pasangan")}
                        </label>
                    </div>
                </div>

                {/* Grup Anak 1 */}
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-bold text-sm text-gray-800 mb-2">Anak 1</p>
                    <div className="space-y-2">
                        <label className="block" htmlFor="input-Anak 1">
                            <span className="text-xs text-gray-600">Nama Anak 1</span>
                            {renderInput("Anak 1")}
                        </label>
                        <label className="block" htmlFor="input-TTL Anak 1">
                            <span className="text-xs text-gray-600">TTL Anak 1</span>
                            {renderInput("TTL Anak 1")}
                        </label>
                        <label className="block" htmlFor="input-STS Anak 1">
                            <span className="text-xs text-gray-600">Status Anak 1</span>
                            {renderInput("STS Anak 1")}
                        </label>
                    </div>
                </div>
                {/* Anda dapat menambahkan Anak 2, 3, dst. di sini */}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Aksi */}
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3 flex-none">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-green-700 text-white text-sm font-medium shadow-md hover:bg-green-800 transition-all"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Edit Detail Perwira"}
          </button>
        </div>
      </form>
    </div>
  );
}