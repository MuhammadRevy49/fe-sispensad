"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { variable } from "@/lib/variable";
import PageTitle from "@/components/reusable/pageTitle";

export default function PerhitunganGaji() {
  const router = useRouter();
  const { id } = useParams();
  const [gpt, setGpt] = useState(0);
  const [mkg, setMkg] = useState("");
  const [persIstri, setPersIstri] = useState(35);
  const [numAnak, setNumAnak] = useState(1);
  const [persAnak, setPersAnak] = useState(10);
  const [lainList, setLainList] = useState([]);
  const [hasil, setHasil] = useState({ dasar: 0, tunIstri: 0, tunAnak: 0, total: 0 });
  const [perwiraData, setPerwiraData] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);

  // Helper untuk parse angka dari input
  const parseNumber = (v) => {
    if (typeof v === "number") return v;
    if (!v) return 0;
    return Number(String(v).replace(/[^0-9.-]+/g, "")) || 0;
  };

  const formatRupiah = (number) => {
    if (!number && number !== 0) return "Rp0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const capitalized = (value) => {
    if (!value || typeof value !== 'string') return value || "-";
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const hitung = () => {
    const gptNum = parseNumber(gpt);
    const mkgNum = parseNumber(mkg);
    const pi = parseNumber(persIstri);
    const pa = parseNumber(persAnak);

    const dasar = gptNum * 0.025 * mkgNum;
    const tunIstri = (gptNum * pi) / 100;
    const tunAnak = ((gptNum * pa) / 100) * numAnak;
    const tunLain = lainList.reduce(
      (acc, curr) => acc + parseNumber(curr.nominal),
      0
    );
    const total = Math.max(0, Math.round(dasar + tunIstri + tunAnak + tunLain));

    setHasil({ dasar, tunIstri, tunAnak, tunLain, total });
  };

  // Simpan perhitungan
  const simpanPerhitungan = () => {
    const history = JSON.parse(localStorage.getItem("simulasi_history")) || [];
    const entry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      input: {
        gpt: parseNumber(gpt),
        mkg: parseNumber(mkg),
        persIstri,
        numAnak,
        persAnak,
        lainList,
      },
      hasil,
    };
    history.unshift(entry);
    localStorage.setItem(
      "simulasi_history",
      JSON.stringify(history.slice(0, 50))
    );
    alert("Perhitungan berhasil disimpan (lokal)");
  };

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorData("Token autentikasi tidak ditemukan.");
      setLoadingData(false);
      return;
    }

    const fetchPerwiraData = async () => {
      try {
        setLoadingData(true);
        setErrorData(null);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.detailPersonil(id)}`, {
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
        const payload = json.data ?? json;
        setPerwiraData(payload || {});
        setMkg(payload.MKG);
      } catch (err) {
        console.error(err);
        setErrorData(err?.message || "Gagal mengambil data perwira.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchPerwiraData();
  }, [id]);

  // Auto hitung tiap kali input diubah
  useEffect(() => {
    if (!gpt || !mkg.trim()) {
      setHasil({ dasar: 0, tunIstri: 0, tunAnak: 0, tunLain: 0, total: 0 });
      return;
    }
    hitung();
  }, [gpt, mkg, persIstri, numAnak, persAnak, lainList]);

  return (
    <div className="p-1">
      <div className="flex flex-row items-center justify-between">
        <PageTitle
          title="Perhitungan Gaji Pokok Pensiun"
          desc="Sistem Pensiun Angkatan Darat"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => router.push("/perwira")}
            className="px-5 py-2 mb-3 rounded-lg bg-[var(--armycolor)] text-sm text-white hover:bg-[var(--armyhover)] transition-all"
          >
            <ArrowLeft className="inline mr-2" size={16} />
            Kembali
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* Kiri: Form kalkulator */}
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white rounded-lg p-6 shadow flex flex-col">
            <h3 className="font-semibold mb-1">
              Kalkulator Gaji Pokok Pensiun
            </h3>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-1">
                <span className="font-medium">Nama</span>
                <span>: {capitalized(perwiraData.NAMA) || "-"}</span>
                
                <span className="font-medium">Pangkat/NRP</span>
                <span>: {capitalized(perwiraData.PANGKAT) || "-"} / {perwiraData.NRP || "-"}</span>
                
                <span className="font-medium">Kesatuan</span>
                <span>: {capitalized(perwiraData.KESATUAN) || "-"}</span>
              </div>
            </div>

            <label className="text-sm text-gray-600">
              Gaji Pokok Terakhir (GPT)
            </label>
            <input
              type="text"
              value={perwiraData.GPT ? formatRupiah(perwiraData.GPT) : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setGpt(Number(raw) || 0);
              }}
              placeholder="Masukkan GPT"
              className="mt-2 mb-3 w-full border border-gray-300 rounded px-3 py-2"
            />

            <label className="text-sm text-gray-600">
              Masa Kerja Gaji (MKG)
            </label>
            <input
              type="text"
              value={mkg}
              onChange={(e) => setMkg(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Tahun"
              className="mt-2 mb-3 w-full border border-gray-300 rounded px-3 py-2"
            />

            <label className="text-sm text-gray-600">
              Persentase Tunjangan Warakawuri ({persIstri}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={persIstri}
              onChange={(e) => setPersIstri(Number(e.target.value))}
              className="w-full mt-2 mb-1"
            />
            <div className="text-xs text-gray-400 mb-3">
              berdasarkan gaji pokok terakhir
            </div>

            <label className="text-sm text-gray-600 mb-2">Jumlah Anak</label>
            <input type="number" placeholder="Jumlah anak" className="p-2 rounded border border-gray-300"/>

            <div className="flex gap-3 mt-6">
              <button
                onClick={hitung}
                className="px-4 py-2 bg-[var(--armycolor)] text-white rounded-lg hover:cursor-pointer hover:bg-[var(--armyhover)] transition-all"
              >
                Edit Data
              </button>
            </div>
          </div>
        </div>

        {/* Kanan: Hasil */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white rounded-lg p-6 shadow min-h-[420px] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-4">
                Rincian Perhitungan Gaji Pokok Pensiun
              </h3>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div>Nilai Tunjangan Bersifat Pensiun</div>
                <div className="text-right">:</div>
                <div className="text-right">
                  {hasil.dasar
                    ? formatRupiah(Math.round(hasil.dasar))
                    : "Rp..."}
                </div>

                <div>Nilai Tunjangan Warakawuri</div>
                <div className="text-right">:</div>
                <div className="text-right">
                  {hasil.tunIstri
                    ? formatRupiah(Math.round(hasil.tunIstri))
                    : "Rp..."}
                </div>

                <div>Nilai Tunjangan Anak</div>
                <div className="text-right">:</div>
                <div className="text-right">
                  {hasil.tunAnak
                    ? formatRupiah(Math.round(hasil.tunAnak))
                    : "Rp..."}
                </div>

                <div className="col-span-2 border-t pt-3">
                  Total Gaji Pokok Pensiun
                </div>
                <div className="text-right border-t pt-3 font-semibold">
                  {hasil.total ? formatRupiah(hasil.total) : "Rp..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
