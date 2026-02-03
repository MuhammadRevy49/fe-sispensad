"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { variable } from "@/lib/variable";
import PageTitle from "@/components/reusable/pageTitle";
import {
  PENETAPAN_PERWIRA,
  PENETAPAN_WARAKAWURI,
  PENETAPAN_ANAKYOP1ANAK,
  PENETAPAN_ANAKYOP2ANAK,
  PENETAPAN_ANAKYT1ANAK,
  PENETAPAN_ANAKYT2ANAK,
} from "@/data/penetapan";

export function getPenetapanPerwira(gajiSementara) {
  const result = PENETAPAN_PERWIRA.find(
    item =>
      gajiSementara >= item.min &&
      gajiSementara <= item.max
  );

  if (!result) return null;

  return {
    level: result.level,
    finalSalary: result.fix
  };
}

export function getPenetapanWarakawuri(gajiSementara) {
  const result = PENETAPAN_WARAKAWURI.find(
    item =>
      gajiSementara >= item.min &&
      gajiSementara <= item.max
  );

  if (!result) return null;

  return {
    level: result.level,
    finalSalary: result.fix
  };
}

export function getPenetapanYatimOrPiatu1Anak(gajiSementara) {
  const result = PENETAPAN_ANAKYOP1ANAK.find(
    item =>
      gajiSementara >= item.min &&
      gajiSementara <= item.max
  );

  if (!result) return null;

  return {
    level: result.level,
    finalSalary: result.fix
  };
}

export function getPenetapanYatimOrPiatu2Anak(gajiSementara) {
  const result = PENETAPAN_ANAKYOP2ANAK.find(
    item =>
      gajiSementara >= item.min &&
      gajiSementara <= item.max
  );

  if (!result) return null;

  return {
    level: result.level,
    finalSalary: result.fix
  };
}

export function getPenetapanYatimPiatu1Anak(gajiSementara) {
  const result = PENETAPAN_ANAKYT1ANAK.find(
    item =>
      gajiSementara >= item.min &&
      gajiSementara <= item.max
  );

  if (!result) return null;

  return {
    level: result.level,
    finalSalary: result.fix
  };
}

export function getPenetapanYatimPiatu2Anak(gajiSementara) {
  const result = PENETAPAN_ANAKYT2ANAK.find(
    item =>
      gajiSementara >= item.min &&
      gajiSementara <= item.max
  );

  if (!result) return null;

  return {
    level: result.level,
    finalSalary: result.fix
  };
}

export default function PerhitunganGaji() {
  const router = useRouter();
  const { id } = useParams();
  const [gpt, setGpt] = useState("");
  const [mkg, setMkg] = useState("");
  const [mdk, setMdk] = useState("");
  const [persIstri, setPersIstri] = useState(35);
  const [jmlAnakPerwira, setJmlAnakPerwira] = useState("");
  const [numAnak, setNumAnak] = useState(1);
  const [persAnakYatimOrPiatu, setPersAnakYatimOrPiatu] = useState(10);
  const [lainList, setLainList] = useState([]);
  const [hasil, setHasil] = useState({ dasar: 0, tunIstri: 0, tunAnak: 0, total: 0 });
  const [perwiraData, setPerwiraData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("PENSIUN");

  // helper props
  const inputClass = (editable) =>
  `mt-2 mb-3 w-full border rounded px-3 py-2 ${
    editable
      ? "border-gray-300 bg-white"
      : "border-gray-200 bg-gray-50 cursor-not-allowed"
  }`;

  // helper active button
  const tabButtonClass = (isActive) =>
  `p-2 rounded-lg border transition-all hover:cursor-pointer ${
    isActive
      ? "bg-green-100 text-green-700 border-green-300"
      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-green-100 hover:text-green-700"
  }`;

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
    const pa = parseNumber(persAnakYatimOrPiatu);

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
        persAnakYatimOrPiatu,
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
        setMdk(payload.MDK);
        setGpt(payload.GPT);
        setJmlAnakPerwira(payload.jml_anak);
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
    if (!gpt || !mkg) {
      setHasil({ dasar: 0, tunIstri: 0, tunAnak: 0, tunLain: 0, total: 0 });
      return;
    }
    hitung();
  }, [gpt, mkg, persIstri, numAnak, persAnakYatimOrPiatu, lainList
  ]);

  // jml anak keperluan readonly
  let jmlAnak = 0;
  if (jmlAnakPerwira >= 2) {
    jmlAnak = 2;
  } else {
    jmlAnak = jmlAnakPerwira;
  }

  // hitung hitung gaji pensiun perwira
  const ntbpdiatas30 = parseNumber(gpt) * 0.75;
  const ntbpdibawah30 = parseNumber(gpt) * 0.025 * parseNumber(mdk);
  // hitung tun. warakawuri
  const tunwarakawuri = parseNumber(gpt) * persIstri / 100;
  // anak
  const tunanakyatimorpiatu = parseNumber(gpt) * persAnakYatimOrPiatu / 100;
  const tunanakyatimpiatuAnak1 = parseNumber(gpt) * 0.225;
  const tunanakyatimpiatuAnak2 = parseNumber(gpt) * 0.30;
  const tunanakyatimpiatu = jmlAnakPerwira >= 2 ? parseNumber(gpt) * 0.30 : parseNumber(gpt) * 0.225;

  const penetapan = mkg >= 30 ? getPenetapanPerwira(ntbpdiatas30) : getPenetapanPerwira(ntbpdibawah30);
  const penetapanWari = getPenetapanWarakawuri(tunwarakawuri);
  const penetapanAnakYOP1 = getPenetapanYatimOrPiatu1Anak(tunanakyatimorpiatu);
  const penetapanAnakYOP2 = getPenetapanYatimOrPiatu2Anak(tunanakyatimorpiatu);
  const penetapanAnakYT1 = getPenetapanYatimPiatu1Anak(tunanakyatimpiatuAnak1);
  const penetapanAnakYT2 = getPenetapanYatimPiatu2Anak(tunanakyatimpiatu);

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

            <div className="mt-3 bg-white rounded-lg mb-3 border border-gray-300 p-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] text-gray-700 gap-1">
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
              value={formatRupiah(gpt)}
              readOnly={!isEditing}
              onChange={(e) => {
                if (!isEditing) return;
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setGpt(raw);
              }}
              placeholder="Masukkan GPT"
              className={inputClass(isEditing)}
            />

            <label className="text-sm text-gray-600">
              Masa Kerja Gaji (MKG)
            </label>
            <input
              type="text"
              value={mkg}
              readOnly={!isEditing}
              onChange={(e) => {
                if (!isEditing) return;
                setMkg(e.target.value.replace(/[^0-9]/g, ""));
              }}
              placeholder="Tahun"
              className={inputClass(isEditing)}
            />

            <label className="text-sm text-gray-600">
              Persentase Tunjangan Warakawuri ({persIstri}%)
            </label>
            <input
            type="number"
            readOnly={!isEditing}
            value={persIstri}
            onChange={(e) => {
              if (!isEditing) return;
              setPersIstri(e.target.value.replace(/[^0-9]/g, ""));
            }}
            className={inputClass(isEditing)}
            />
            <div className="text-xs text-gray-400 mb-3">
              berdasarkan gaji pokok terakhir
            </div>
            
            {jmlAnakPerwira > 0 && (
              <>
                <label className="text-sm text-gray-600">
                  Jumlah Anak
                </label>
                <input
                type="number"
                value={jmlAnak}
                readOnly
                className={inputClass(isEditing)}
                />
            </>
            )}

            <div className="flex gap-3">
              <button
              onClick={() => {
                if (isEditing) {
                  hitung();
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-lg transition-all bg-[var(--armycolor)] text-white hover:bg-[var(--armyhover)]`}
            >
              {isEditing ? "Simpan Perubahan" : "Edit Data"}
            </button>
            </div>
          </div>
        </div>

        {/* Kanan: Hasil */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white rounded-lg p-6 shadow justify-between">
            <p className="mb-2 font-semibold">Pilih Rincian Perhitungan</p>
            <div className="flex flex-row gap-3">
            <button
              onClick={() => setActiveTab("PENSIUN")}
              className={tabButtonClass(activeTab === "PENSIUN")}
            >
              Gaji Pensiun
            </button>
            <button
              onClick={() => setActiveTab("WARAKAWURI")}
              className={tabButtonClass(activeTab === "WARAKAWURI")}
            >
              Tun. Warakawuri
            </button>
            {jmlAnakPerwira > 0 && (
              <button
                onClick={() => setActiveTab("ANAK")}
                className={tabButtonClass(activeTab === "ANAK")}
              >
                Tun. Anak
              </button>
            )}
          </div>
          </div>
          {/** Gaji Pensiun */}
          {activeTab === "PENSIUN" && (
          <div className="bg-white mt-6 rounded-lg p-6 shadow min-h-[420px] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-4">
                Rincian Gaji Pokok Pensiun
              </h3>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div>Nilai Tunjangan Bersifat Pensiun</div>
                <div className="text-right">:</div>
                <div className="text-left pl-6">
                  {mkg >= 30 ? "75% x GPT" : "2,5% x MDK x GPT"}
                </div>

                <div></div>
                <div className="text-right">:</div>
                <div className="text-left pl-6">
                  {mkg >= 30 ? "75% x " + (gpt ? formatRupiah(Math.round(parseNumber(gpt))) : "Rp...") : "2,5% x " + mdk + " x " + (gpt ? formatRupiah(Math.round(parseNumber(gpt))) : "Rp...")}
                </div>

                <div></div>
                <div className="text-right">:</div>
                <div className="text-left pl-6">
                  {mkg >= 30
                    ? formatRupiah(ntbpdiatas30)
                    : formatRupiah(ntbpdibawah30)}
                </div>

                <div className="col-span-2 border-t border-gray-400 pt-3 flex items-center">
                  Total Gaji Pokok Pensiun <p className="italic ml-1 text-gray-500 text-sm">(sudah ditetapkan)</p>
                </div>
                <div className="text-left pl-6 border-t border-gray-400 pt-3 font-semibold">
                  {penetapan ? formatRupiah(penetapan.finalSalary) : "-"}
                </div>
              </div>
            </div>
          </div>
          )}
          {/** Wari */}
          {activeTab === "WARAKAWURI" && (
          <div className="bg-white mt-6 rounded-lg p-6 shadow min-h-[420px] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-4">
                Rincian Tunjangan Warakawuri
              </h3>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div>Nilai Tunjangan Warakawuri</div>
                <div className="text-right">:</div>
                <div className="text-left pl-6">
                  {persIstri}% x GPT
                </div>

                <div></div>
                <div className="text-right">:</div>
                <div className="text-left pl-6">
                  {persIstri}% x {gpt ? formatRupiah(Math.round(parseNumber(gpt))) : "Rp..."}
                </div>

                <div></div>
                <div className="text-right">:</div>
                <div className="text-left pl-6">
                  {formatRupiah(tunwarakawuri)}
                </div>

                <div className="col-span-2 border-t border-gray-400 pt-3 flex items-center">
                  Total Tunjangan Warakawuri <p className="italic ml-1 text-gray-500 text-sm">(sudah ditetapkan)</p>
                </div>
                <div className="text-left pl-6 border-t border-gray-400 pt-3 font-semibold">
                  {penetapanWari ? formatRupiah(penetapanWari.finalSalary) : "-"}
                </div>
              </div>
            </div>
          </div>
          )}
          {/** Anak */}
          {activeTab === "ANAK" && (
          <div className="bg-white mt-6 rounded-lg p-6 shadow min-h-[420px] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-4 mr-12">
                Rincian Tunjangan Anak
              </h3>

              {jmlAnakPerwira >= 2 ? (
                <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                  {/* Header */}
                  <div></div>
                  <div></div>
                  <div className="font-semibold text-center">Anak 1</div>
                  <div className="font-semibold text-center">Anak 2</div>

                  {/* Yatim / Piatu */}
                  <div className="whitespace-nowrap">Nilai Tunjangan Anak Yatim/Piatu</div>
                  <div className="text-right">:</div>
                  <div>10% x GPT</div>
                  <div>10% x GPT</div>

                  <div></div>
                  <div className="text-right">:</div>
                  <div>10% x {formatRupiah(gpt)}</div>
                  <div>10% x {formatRupiah(gpt)}</div>

                  <div></div>
                  <div className="text-right">:</div>
                  <div>{formatRupiah(tunanakyatimorpiatu)}</div>
                  <div>{formatRupiah(tunanakyatimorpiatu)}</div>

                  {/* Yatim-Piatu */}
                  <div className="whitespace-nowrap">Nilai Tunjangan Anak Yatim-Piatu</div>
                  <div className="text-right">:</div>
                  <div>22,5% x GPT</div>
                  <div>30% x GPT</div>

                  <div></div>
                  <div className="text-right">:</div>
                  <div>22,5% x {formatRupiah(gpt)}</div>
                  <div>30% x {formatRupiah(gpt)}</div>

                  <div></div>
                  <div className="text-right">:</div>
                  <div>{formatRupiah(tunanakyatimpiatuAnak1)}</div>
                  <div>{formatRupiah(tunanakyatimpiatuAnak2)}</div>

                  {/* Total */}
                  <div className="col-span-2 border-t pt-3">
                    Total Tunjangan Anak Yatim/Piatu
                    <span className="italic text-gray-500 ml-1">(sudah ditetapkan)</span>
                  </div>
                  <div className="border-t pt-3 font-semibold">
                    {formatRupiah(penetapanAnakYOP1.finalSalary)}
                  </div>
                  <div className="border-t pt-3 font-semibold">
                    {formatRupiah(penetapanAnakYOP2.finalSalary)}
                  </div>
                  <div className="col-span-2">
                    Total Tunjangan Anak Yatim-Piatu
                    <span className="italic text-gray-500 ml-1">(sudah ditetapkan)</span>
                  </div>
                  <div className="font-semibold">
                    {penetapanAnakYT1 ? formatRupiah(penetapanAnakYT1.finalSalary) : "-"}
                  </div>
                  <div className="font-semibold">
                    {penetapanAnakYT2 ? formatRupiah(penetapanAnakYT2.finalSalary) : "-"}
                  </div>
                </div>
              ) : (
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>Nilai Tunjangan Anak Yatim/Piatu</div>
                      <div className="text-right">:</div>
                      <div className="text-left pl-6">
                        {persAnakYatimOrPiatu}% x GPT
                      </div>

                      <div></div>
                      <div className="text-right">:</div>
                      <div className="text-left pl-6">
                        {persAnakYatimOrPiatu}% x {gpt ? formatRupiah(Math.round(parseNumber(gpt))) : "Rp..."}
                      </div>

                      <div></div>
                      <div className="text-right">:</div>
                      <div className="text-left pl-6">
                        {formatRupiah(tunanakyatimorpiatu)}
                      </div>

                      <div>Nilai Tunjangan Anak Yatim-Piatu</div>
                      <div className="text-right">:</div>
                      <div className="text-left pl-6">
                        22,5% x GPT
                      </div>

                      <div></div>
                      <div className="text-right">:</div>
                      <div className="text-left pl-6">
                        22,5% x {gpt ? formatRupiah(Math.round(parseNumber(gpt))) : "Rp..."}
                      </div>

                      <div></div>
                      <div className="text-right">:</div>
                      <div className="text-left pl-6">
                        {formatRupiah(tunanakyatimpiatu)}
                      </div>

                      <div className="col-span-2 border-t border-gray-400 pt-3 flex items-center">
                        Total Tunjangan Anak Yatim/Piatu<p className="italic ml-1 text-gray-500 text-sm">(sudah ditetapkan)</p>
                      </div>
                      <div className="text-left pl-6 border-t border-gray-400 pt-3 font-semibold">
                        {jmlAnakPerwira >= 2 ? (penetapanAnakYOP2 ? formatRupiah(penetapanAnakYOP2.finalSalary) : "-") : (penetapanAnakYOP1 ? formatRupiah(penetapanAnakYOP1.finalSalary) : "-")}
                      </div>
                      <div className="col-span-2 flex items-center">
                        Total Tunjangan Anak Yatim-Piatu<p className="italic ml-1 text-gray-500 text-sm">(sudah ditetapkan)</p>
                      </div>
                      <div className="text-left pl-6 font-semibold">
                        {jmlAnakPerwira >= 2 ? (penetapanAnakYT2 ? formatRupiah(penetapanAnakYT2.finalSalary) : "-") : (penetapanAnakYT1 ? formatRupiah(penetapanAnakYT1.finalSalary) : "-")}
                      </div>
                    </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
