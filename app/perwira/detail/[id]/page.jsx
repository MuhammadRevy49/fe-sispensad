"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageTitle from "@/components/reusable/pageTitle";
import { variable } from "@/lib/variable";
import Link from "next/link";
import LoadingDots from "@/components/reusable/loading";

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

  return (
    <div className="p-1">
      <PageTitle
        title="Detail Data Perwira"
        desc="Sistem Pensiun Angkatan Darat"
      />

      <div className="bg-white rounded-2xl shadow p-6">
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
              className="mt-auto px-5 py-2 rounded-full w-full bg-gray-300 text-gray-800 text-xs md:text-sm hover:bg-gray-400 transition"
            >
              Upload Pas Foto
            </button>
          </div>

          {/* Kanan: Detail Prajurit */}
          <div className="flex-col">
            <h3 className="text-lg font-semibold text-left mb-4">
              Detail Prajurit
            </h3>

            <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] gap-y-1 text-sm">
              {fields.map((f) => {
                const raw = data[f.key];
                const value = f.formatter
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

        {/* tombol kembali */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/perwira"
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
