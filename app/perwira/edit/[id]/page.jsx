"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/reusable/pageTitle";

export default function EditCardPerwira({ initialData = {}, onSave, onCancel }) {
  // fields sesuai payload API (menggunakan nama kunci sama persis)
  const fieldNames = useMemo(
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
      "TMT SKEP",
      "TMT_MULAI",
      "Penspok",
      "Selama",
      "Pasangan",
      "TTL Pasangan",
      "Anak 1",
      "TTL Anak 1",
      "STS Anak 1",
      "Anak 2",
      "TTL Anak 2",
      "STS Anak 2",
      "Anak 3",
      "TTL Anak 3",
      "STS Anak 3",
      "Anak 4",
      "TTL Anak 4",
      "STS Anak 4",
      "Penspok Wari",
      "RP1",
      "BRP1",
      "RP2",
      "BRP2",
      "TMB PN",
      "Alamat",
      "Alamat Asabri",
      "Utama",
      "No Seri",
      "NO SKEP2",
      "TGL SKEP2",
    ],
    []
  );

  const router = useRouter();

  const [form, setForm] = useState(() => {
    const base = {};
    fieldNames.forEach((name) => {
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

  const left = fieldNames.slice(0, Math.ceil(fieldNames.length / 2));
  const right = fieldNames.slice(Math.ceil(fieldNames.length / 2));

  function renderInput(name) {
    const value = form[name] ?? "";

    const isDate = /TGL|TTL|TMT|createdAt/i.test(name);
    const isNumber = /^(MDK|MKG|GPT|PENSPOK|PENSPOK_WARI|RP1|BRP1|RP2|BRP2)$/i.test(name);

    if (name === "id") {
      return (
        <input
          readOnly
          name={name}
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 border bg-gray-50 p-2 text-sm"
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
          className="mt-1 block w-full rounded-lg border-gray-300 border p-2"
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
          className="mt-1 block w-full rounded-lg border-gray-300 border p-2"
        />
      );
    }

    if (name === "ALAMAT" || name === "ALAMAT_ASABRI" || name === "SELAMA" || name === "PASANGAN") {
      return (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 border p-2 resize-y"
          rows={3}
        />
      );
    }

    // default text input
    return (
      <input
        name={name}
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full rounded-lg border-gray-300 border p-2"
      />
    );
  }

  return (
    <div className="w-full mx-auto max-w-[98%]">
      <PageTitle title={`Edit Data Perwira`} desc="Sistem Pensiun Angkatan Darat" />
      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[calc(100vh-140px)]">
        {/* Judul */}
        <div className="flex items-center justify-between mb-3 flex-none">
          <h3 className="text-lg font-semibold">Edit Data Perwira</h3>
          <p className="text-sm text-gray-500">Ubah data lalu tekan Simpan</p>
        </div>

        {/* Scroll Form */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {left.map((name) => (
                <label className="block" key={name} htmlFor={`input-${name}`}>
                  <span className="text-sm text-gray-700">{name}</span>
                  {renderInput(name)}
                </label>
              ))}
            </div>

            <div className="space-y-3">
              {right.map((name) => (
                <label className="block" key={name} htmlFor={`input-${name}`}>
                  <span className="text-sm text-gray-700">{name}</span>
                  {renderInput(name)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Jika error ygy */}
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        {/* Aksi */}
        <div className="mt-4 flex items-center justify-end gap-3 flex-none">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-sm hover:bg-gray-300 focus:outline-none hover:cursor-pointer transition-all"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-800 text-white text-sm font-medium shadow hover:bg-green-900 hover:cursor-pointer focus:outline-none transition-all"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
