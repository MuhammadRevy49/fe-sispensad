"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function EditCardPerwira({ initialData = {}, onSave, onCancel }) {
  // kiri 23, kanan 23 (total 46)
  const leftNames = useMemo(
    () => [
      "nama",
      "pangkat",
      "email",
      ...Array.from({ length: 20 }, (_, i) => `field${i + 4}`),
    ],
    []
  );

  const rightNames = useMemo(
    () => [
      "telepon",
      "alamat",
      "catatan",
      ...Array.from({ length: 20 }, (_, i) => `field${i + 24}`),
    ],
    []
  );

  const allNames = useMemo(() => [...leftNames, ...rightNames], [leftNames, rightNames]);

  const [form, setForm] = useState(() => {
    const base = {};
    allNames.forEach((name) => {
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
      if (onSave) await onSave(form);
    } catch (err) {
      setError(err?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full mx-auto max-w-[98%]">
      {/* form height => full-ish screen; header & actions fixed, fields scroll */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[calc(100vh-140px)]"
      >
        {/* Header (tetap di atas) */}
        <div className="flex items-center justify-between mb-3 flex-none">
          <h3 className="text-lg font-semibold">Edit Data Perwira</h3>
          <p className="text-sm text-gray-500">Ubah data lalu tekan Simpan</p>
        </div>

        {/* Fields container: scrollable */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-3">
              {leftNames.map((name, idx) => {
                const id = `input-${name}`;
                const label =
                  name === "nama" ? "Nama" : name === "pangkat" ? "Pangkat" : name === "email" ? "Email" : `Field ${idx + 1}`;
                return (
                  <label className="block" key={name} htmlFor={id}>
                    <span className="text-sm text-gray-700">{label}</span>
                    <input
                      id={id}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 border focus:ring-2 focus:ring-opacity-50 focus:ring-green-800 p-2"
                      placeholder={
                        name === "nama" ? "Masukkan nama" : name === "email" ? "email@contoh.com" : `Isi ${name}`
                      }
                    />
                  </label>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-3">
              {rightNames.map((name, idx) => {
                const id = `input-${name}`;
                const label =
                  name === "telepon" ? "Telepon" : name === "alamat" ? "Alamat" : name === "catatan" ? "Catatan" : `Field ${idx + 24}`;
                return (
                  <label className="block" key={name} htmlFor={id}>
                    <span className="text-sm text-gray-700">{label}</span>
                    <input
                      id={id}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 border focus:ring-2 focus:ring-opacity-50 focus:ring-green-800 p-2"
                      placeholder={name === "telepon" ? "0812xxxx" : `Isi ${name}`}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        {/* Actions (sticky bottom) */}
        <div className="mt-4 flex items-center justify-end gap-3 flex-none sticky bottom-0 bg-white py-3">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCancel && onCancel();
            }}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-sm hover:bg-gray-300 focus:outline-none hover:cursor-pointer transition-all"
          >
            Batal
          </Link>

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
