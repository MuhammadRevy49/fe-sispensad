"use client";

import { useState, useEffect } from "react";
import PageTitle from "@/components/reusable/pageTitle";
import { Search } from "lucide-react";

export default function PerhitunganGaji() {
  // Input utama
  const [search, setSearch] = useState("");
  const [gpt, setGpt] = useState(0); // Gaji Pokok Terakhir
  const [mkg, setMkg] = useState(0); // Masa Kerja Gaji (tahun)
  const [persIstri, setPersIstri] = useState(10); // persen default 10%
  const [numAnak, setNumAnak] = useState(1);
  const [persAnak, setPersAnak] = useState(5); // persen per anak
  const [lainList, setLainList] = useState([]); // daftar tunjangan lain {label, persen, nominal}
  const [newLainLabel, setNewLainLabel] = useState("");
  const [newLainValue, setNewLainValue] = useState(0);

  // Hasil
  const [hasil, setHasil] = useState({
    dasar: 0,
    tunIstri: 0,
    tunAnak: 0,
    tunLain: 0,
    total: 0,
  });

  // Helper untuk parse angka dari input (menghilangkan comma/dots)
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

  // Logika perhitungan:
  // - Gaji pokok pensiun dasar diasumsikan = GPT x (2.5% x MKG)
  //   => dasar = GPT * 0.025 * MKG
  // - Tunjangan istri = GPT * (persIstri / 100)
  // - Tunjangan anak = GPT * (persAnak / 100) * numAnak
  // - Tunjangan lain: jika dimasukkan sebagai nominal, langsung dijumlahkan
  // Catatan: formula ini bersifat contoh/estimasi sesuai permintaan UI.
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

  const handleReset = () => {
    setGpt(0);
    setMkg(0);
    setPersIstri(10);
    setNumAnak(1);
    setPersAnak(5);
    setLainList([]);
    setNewLainLabel("");
    setNewLainValue(0);
    setHasil({ dasar: 0, tunIstri: 0, tunAnak: 0, tunLain: 0, total: 0 });
  };

  const addLain = () => {
    const nominal = parseNumber(newLainValue);
    if (!newLainLabel) return alert("Isi label tunjangan lain terlebih dahulu");
    if (nominal <= 0)
      return alert("Masukkan nominal yang valid (lebih dari 0)");

    setLainList((prev) => [...prev, { label: newLainLabel, nominal }]);
    setNewLainLabel("");
    setNewLainValue(0);
  };

  const removeLain = (idx) => {
    setLainList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Simpan perhitungan (mock) - menyimpan ke localStorage sebagai history
  const simpanPerhitungan = () => {
    const history = JSON.parse(localStorage.getItem("simulasi_history")) || [];
    const entry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      search,
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

  // Auto hitung tiap kali input diubah (opsional)
  useEffect(() => {
    // jangan otomatis kalau GPT atau MKG belum diisi
    if (!gpt || !mkg) {
      setHasil({ dasar: 0, tunIstri: 0, tunAnak: 0, tunLain: 0, total: 0 });
      return;
    }
    hitung();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpt, mkg, persIstri, numAnak, persAnak, lainList]);

  return (
    <div className="p-1">
      <PageTitle
        title="Perhitungan Gaji Pokok Pensiun"
        desc="Sistem Pensiun Angkatan Darat"
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Masukan Nama / NRP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm outline-none"
          />
          <div className="absolute left-3 top-3.5 text-gray-400"><Search size={16}/></div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-gray-500"
            >
              ✖
            </button>
          )}
        </div>

        <button
          onClick={() => alert("Fungsi pencarian belum terhubung ke backend")}
          className="bg-[var(--armycolor)] text-white p-2 rounded-lg"
        >
          Submit
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Kiri: Form kalkulator */}
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white rounded-lg p-6 shadow flex flex-col">
            <h3 className="font-semibold mb-4">
              Kalkulator Gaji Pokok Pensiun
            </h3>

            <label className="text-sm text-gray-600">
              Masukan Gaji Pokok Terakhir (GPT)
            </label>
            <input
              type="text"
              value={gpt}
              onChange={(e) => setGpt(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Rp"
              className="mt-2 mb-3 w-full border border-gray-300 rounded px-3 py-2"
            />

            <label className="text-sm text-gray-600">
              Masukan Masa Kerja Gaji (MKG)
            </label>
            <input
              type="number"
              value={mkg}
              onChange={(e) => setMkg(Number(e.target.value))}
              placeholder="Tahun"
              className="mt-2 mb-3 w-full border border-gray-300 rounded px-3 py-2"
            />

            <label className="text-sm text-gray-600">
              Persentase Tunjangan Istri ({persIstri}%)
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

            <label className="text-sm text-gray-600 mb-2">Masukkan Jumlah Anak</label>
            <input type="number" className="p-2 rounded border border-gray-300"/>

            <label className="text-sm text-gray-600">
              Persentase Tunjangan Anak ({persAnak}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={persAnak}
              onChange={(e) => setPersAnak(Number(e.target.value))}
              className="w-full mt-2 mb-1"
            />
            <div className="text-xs text-gray-400 mb-3">
              berdasarkan gaji pokok terakhir
            </div>

            <div className="border-t pt-3 mt-3">
              <h4 className="text-sm font-medium mb-2">Tunjangan Lain</h4>
              {lainList.length === 0 && (
                <div className="text-xs text-gray-400 mb-2">
                  Belum ada tunjangan lain
                </div>
              )}
              <div className="space-y-2">
                {lainList.map((l, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <div className="text-sm">{l.label}</div>
                      <div className="text-xs text-gray-500">
                        {formatRupiah(l.nominal)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeLain(idx)}
                      className="text-red-500 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3 flex-col">
                <input
                  type="text"
                  placeholder="Masukkan Nama Tunjangan Lain"
                  value={newLainLabel}
                  onChange={(e) => setNewLainLabel(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Nominal"
                  value={newLainValue}
                  onChange={(e) =>
                    setNewLainValue(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-36 border border-gray-300 rounded px-3 py-2 w-full"
                />
                <button onClick={addLain} className="bg-gray-100 p-2 rounded">
                  + Tambah
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Reset
              </button>
              <button
                onClick={hitung}
                className="px-4 py-2 bg-[var(--armycolor)] text-white rounded"
              >
                Hitung
              </button>
            </div>
          </div>
        </div>

        {/* Kanan: Hasil */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white rounded-lg p-6 shadow min-h-[420px] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-4">
                Hasil Simulasi Perhitungan Gaji Pokok Pensiun
              </h3>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div>Nilai Tunjangan Bersifat Pensiun</div>
                <div className="text-right">:</div>
                <div className="text-right">
                  {hasil.dasar
                    ? formatRupiah(Math.round(hasil.dasar))
                    : "Rp..."}
                </div>

                <div>Nilai Tunjangan Istri</div>
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

                <div>Nilai Tunjangan Lain</div>
                <div className="text-right">:</div>
                <div className="text-right">
                  {hasil.tunLain
                    ? formatRupiah(Math.round(hasil.tunLain))
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

            <div className="flex justify-end mt-6">
              <button
                onClick={simpanPerhitungan}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Simpan Perhitungan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
