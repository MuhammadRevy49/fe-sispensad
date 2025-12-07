"use client";

import { React, useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageTitle from "@/components/reusable/pageTitle";
import { variable } from "@/lib/variable";
import LoadingDots from "@/components/reusable/loading";

export default function EditCardPerwira({ initialData = {}, onSave, onCancel }) {
  // Mapping antara label di UI dan key di API
  const fields = useMemo(
    () => [
      { label: "Nama Perwira", key: "NAMA" },
      { label: "Pangkat", key: "PANGKAT" },
      { label: "NRP", key: "NRP" },
      { label: "Kesatuan", key: "KESATUAN" },
      { label: "TTL", key: "TTL" },
      { label: "TMT TNI", key: "TMT_TNI" },
      { label: "NKTPA", key: "NKTPA" },
      { label: "NPWP", key: "NPWP" },
      { label: "Autentik", key: "AUTENTIK" },
      { label: "MDK", key: "MDK" },
      { label: "MKG", key: "MKG" },
      { label: "GPT", key: "GPT" },
      { label: "NO SKEP", key: "NO_SKEP" },
      { label: "TGL SKEP", key: "TGL_SKEP" },
      { label: "TMT SKEP", key: "TMT_SKEP" },
      { label: "TMT_MULAI", key: "TMT_MULAI" },
      { label: "Penspok", key: "PENSPOK" },
      { label: "Selama", key: "SELAMA" },
      { label: "Pasangan", key: "PASANGAN" },
      { label: "TTL Pasangan", key: "TTL_PASANGAN" },
      { label: "Anak 1", key: "ANAK_1" },
      { label: "TTL Anak 1", key: "TTL_ANAK_1" },
      { label: "STS Anak 1", key: "STS_ANAK_1" },
      { label: "Anak 2", key: "ANAK_2" },
      { label: "TTL Anak 2", key: "TTL_ANAK_2" },
      { label: "STS Anak 2", key: "STS_ANAK_2" },
      { label: "Anak 3", key: "ANAK_3" },
      { label: "TTL Anak 3", key: "TTL_ANAK_3" },
      { label: "STS Anak 3", key: "STS_ANAK_3" },
      { label: "Anak 4", key: "ANAK_4" },
      { label: "TTL Anak 4", key: "TTL_ANAK_4" },
      { label: "STS Anak 4", key: "STS_ANAK_4" },
      { label: "Penspok Wari", key: "PENSPOK_WARI" },
      { label: "RP1", key: "RP1" },
      { label: "BRP1", key: "BRP1" },
      { label: "RP2", key: "RP2" },
      { label: "BRP2", key: "BRP2" },
      { label: "TMB PN", key: "TMB_PN" },
      { label: "Alamat", key: "ALAMAT" },
      { label: "Alamat Asabri", key: "ALAMAT_ASABRI" },
      { label: "Utama", key: "UTAMA" },
      { label: "No Seri", key: "NO_SERI" },
      { label: "NO SKEP2", key: "NO_SKEP2" },
      { label: "TGL SKEP2", key: "TGL_SKEP2" },
      // kalau mau tambahin PENSIUN, status_bup, createdAt, bisa di sini
      // { label: "Pensiun", key: "PENSIUN" },
      // { label: "Status BUP", key: "status_bup" },
      // { label: "Dibuat Pada", key: "createdAt" },
    ],
    []
  );

  const router = useRouter();
  const params = useParams();
  const perwiraId = params.id;

  // state form disimpan pakai key API (NAMA, PANGKAT, dst.)
  const [form, setForm] = useState(() => {
    const base = {};
    fields.forEach((f) => {
      base[f.key] = initialData[f.key] ?? "";
    });
    return base;
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!perwiraId) return;

    const fetchPerwiraData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token autentikasi tidak ditemukan.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${variable.detailPersonil(perwiraId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }

        const json = await response.json();
        // API Anda: { data: { ... } }
        const data = json.data ?? json;

        setForm((prev) => {
          const newForm = { ...prev };
          fields.forEach((f) => {
            newForm[f.key] = data[f.key] ?? prev[f.key] ?? "";
          });
          return newForm;
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err?.message || "Gagal mengambil data perwira.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerwiraData();
  }, [perwiraId, fields]);

  function handleChange(e) {
    const { name, value } = e.target; // name = key API (mis. "NAMA")
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    // di sini nanti tinggal kirim `form` langsung ke API (key-nya sudah sama)
    // contoh:
    // setSaving(true);
    // try {
    //   await fetch(..., { method: "PUT", body: JSON.stringify(form) })
    //   ...
    // } finally { setSaving(false); }
  }

  function handleBack() {
    if (onCancel) return onCancel();
    router.back();
  }

  const middle = Math.ceil(fields.length / 2);
  const left = fields.slice(0, middle);
  const right = fields.slice(middle);

  function renderInput(field) {
    const rawValue = form[field.key] ?? "";

    // Deteksi field tanggal & angka berdasarkan key API
    const dateKeys = [
      "TTL",
      "TGL_SKEP",
      "TMT_SKEP",
      "TTL_PASANGAN",
      "TTL_ANAK_1",
      "TTL_ANAK_2",
      "TTL_ANAK_3",
      "TTL_ANAK_4",
    ];
    const isDate = dateKeys.includes(field.key);
    // const isDate = /(TGL|TTL|TMT|PENSIUN|createdAt)/i.test(field.key);
    const isNumber = /^(MDK|MKG|GPT|PENSPOK(_WARI)?|RP[12]|BRP[12])$/i.test(field.key);

    // Normalisasi value tanggal yang formatnya ISO (contoh: 1966-05-27T00:00:00.000Z)
    let value = rawValue;
    if (isDate && typeof rawValue === "string" && rawValue.length >= 10) {
      value = rawValue.substring(0, 10);
    }

    return (
      <input
        id={`input-${field.key}`}
        type={isNumber ? "number" : isDate ? "date" : "text"}
        name={field.key} // penting: pakai key API
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full rounded-lg border-gray-300 border p-2"
        readOnly={field.key === "id"}
      />
    );
  }

  if (loading) {
  return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
          <LoadingDots color="var(--armycolor)" />
          <div className="text-[var(--textgray)] font-medium text-center">
            Memuat data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-[98%]">
      <PageTitle
        title={`Edit Data Perwira`}
        desc="Sistem Pensiun Angkatan Darat"
      />
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[calc(100vh-140px)]"
      >
        {/* Judul */}
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">Edit Data Perwira</h3>
        </div>

        {/* Scroll Form */}
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Tampilkan error jika gagal fetch data */}
          {error && (
            <p className="text-sm text-red-500 mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <strong>Error memuat data:</strong> {error}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {left.map((field) => (
                <label
                  className="block"
                  key={field.key}
                  htmlFor={`input-${field.key}`}
                >
                  <span className="text-sm text-gray-700">{field.label}</span>
                  {renderInput(field)}
                </label>
              ))}
            </div>

            <div className="space-y-3">
              {right.map((field) => (
                <label
                  className="block"
                  key={field.key}
                  htmlFor={`input-${field.key}`}
                >
                  <span className="text-sm text-gray-700">{field.label}</span>
                  {renderInput(field)}
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
            disabled={saving || loading}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
