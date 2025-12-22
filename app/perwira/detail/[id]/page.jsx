"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageTitle from "@/components/reusable/pageTitle";
import { variable } from "@/lib/variable";
import Link from "next/link";
import LoadingDots from "@/components/reusable/loading";
import { ArrowLeft } from "lucide-react";

export default function DetailCardPerwira({ initialData = {}, onCancel }) {
  const router = useRouter();
  const params = useParams();
  const perwiraId = params?.id;

  const [data, setData] = useState(initialData || {});
  const [loading, setLoading] = useState(!initialData || !initialData.id);
  const [error, setError] = useState(null);

  // helper format tampilan
  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd} - ${mm} - ${yyyy}`;
  };

  const formatRupiah = (value) => {
    if (value == null || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // mapping label ↔ key API
  const fields = [
    { label: "Nama", key: "NAMA" },
    { label: "Pangkat", key: "PANGKAT" },
    { label: "NRP", key: "NRP" },
    { label: "Tanggal Lahir", key: "TTL", formatter: formatDate },
    { label: "Kesatuan Terakhir", key: "KESATUAN" },
    { label: "TMT TNI", key: "TMT_TNI", formatter: formatDate },
    { label: "No KTPA", key: "NKTPA" },
    { label: "No NPWP", key: "NPWP" },
    { label: "Masa Dinas Kerja", key: "MDK", suffix: " Tahun" },
    { label: "Masa Dinas Keprjuritan", key: "MKG", suffix: " Tahun" },
    { label: "Gaji Pokok Terakhir", key: "GPT", formatter: formatRupiah },
  ];

  // fetch data detail perwira dari API
  useEffect(() => {
    if (!perwiraId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token autentikasi tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.detailPersonil(perwiraId)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data (${res.status})`);
        }

        const json = await res.json();
        // support bentuk { data: {...} } ataupun langsung {...}
        const payload = json.data ?? json;

        setData(payload || {});
      } catch (err) {
        console.error(err);
        setError(err?.message || "Gagal mengambil data perwira.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [perwiraId]);

  // tampilan loading
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

  // helper ambil nilai pasangan / anak dengan fallback
  const pasanganName = data?.PASANGAN || data?.NAMA_PASANGAN || "-";
  const pasanganTTL = data?.TTL_PASANGAN || "-";
  const penspokWari = data?.PENSPOK_WARI || "-";

  const anakList = [1, 2, 3, 4].map((i) => {
    return {
      nama: data?.[`ANAK_${i}`] || "",
      ttl: data?.[`TTL_ANAK_${i}`] || "",
      status: data?.[`STS_ANAK_${i}`] || "",
    };
  }).filter((a) => a.nama || a.ttl || a.status);

  return (
    <div className="p-1">
      <div className="flex flex-row items-center justify-between">
      <PageTitle
        title="Detail Data Perwira"
        desc="Sistem Pensiun Angkatan Darat"
      />
        {/* tombol kembali */}
        <div className="mt-2 flex justify-end">
          <Link
            href="/perwira"
            className="px-5 py-2 mb-3 rounded-lg bg-[var(--armycolor)] text-sm text-white hover:bg-[var(--armyhover)] transition-all"
          >
            <ArrowLeft className="inline mr-2" size={16} />
            Kembali
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {error && (
          <p className="mb-4 text-sm text-red-600">
            Error memuat data: {error}
          </p>
        )}

        <div className="flex flex-row gap-8">
          {/* Kiri: Foto + tombol upload */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-60 h-60 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Pas Foto</span>
            </div>
            <button
              type="button"
              className="mt-auto px-5 py-2 rounded-full w-full bg-gray-200 text-gray-800 text-xs md:text-sm hover:bg-gray-400 transition"
            >
              Upload Pas Foto
            </button>
          </div>

          {/* Kanan: Detail Prajurit */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-left mb-4">
              Detail Prajurit
            </h3>

            <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] gap-y-1 text-sm">
              {fields.map((f) => {
                const raw = data[f.key];
                const value =
                  f.formatter
                    ? f.formatter(raw)
                    : raw || raw === 0
                    ? `${raw}${f.suffix ?? ""}`
                    : "-";

                return (
                  <React.Fragment key={f.key}>
                    <div className="pr-2">{f.label}</div>
                    <div className="px-1">:</div>
                    <div className="font-medium">{value}</div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Kartu Pasangan & Anak */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* Card Keluarga */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-semibold">Detail Keluarga</h4>
            </div>
            <div className="grid grid-cols-[180px_12px_1fr] gap-y-2 text-sm">
                <div className="text-gray-800">Nama Istri</div>
                <div>:</div>
                <div className="font-medium">{pasanganName || "-"}</div>

                <div className="text-gray-800">Tanggal Lahir</div>
                <div>:</div>
                <div className="font-medium">
                  {pasanganTTL ? formatDate(pasanganTTL) : "-"}
                </div>

                <div className="text-gray-800">Penspok Wari</div>
                <div>:</div>
                <div className="font-medium">{penspokWari || "-"}</div>
            </div>
            <div className="text-sm mt-2">
            {anakList.length === 0 ? (
              <div className="text-gray-500">Tidak ada anak terdaftar.</div>
            ) : (
              <div className="grid grid-cols-[180px_12px_1fr] gap-y-2">
                {anakList.map((anak, idx) => (
                  <React.Fragment key={idx}>
                    {/* Nama Anak */}
                    <div className="text-gray-800">Anak {idx + 1}</div>
                    <div>:</div>
                    <div className="font-medium">{anak.nama || "-"}</div>

                    {/* TTL Anak */}
                    <div className="text-gray-800">TTL Anak {idx + 1}</div>
                    <div>:</div>
                    <div className="font-medium">
                      {anak.ttl ? formatDate(anak.ttl) : "-"}
                    </div>

                    {/* Status Anak */}
                    <div className="text-gray-800">Status Anak {idx + 1}</div>
                    <div>:</div>
                    <div className="font-medium">{anak.status || "-"}</div>
                  </React.Fragment>
                ))}
              </div>
            )}
            </div>
          </div>
          {/* Card Perhitungan Gaji */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold">Noname</h4>
            </div>

            <div className="text-sm">
              Belum ada apa apa.
            </div>
          </div>
        </div>
    </div>
  );
}
