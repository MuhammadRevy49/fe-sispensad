"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AddDataModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const get = searchParams.get("category") || "null";
  var getParam = "";
  if (get === "pama") {
    getParam = "Perwira Pertama";
  } else if (get === "pamen") {
    getParam = "Perwira Menengah";
  } else if (get === "pati") {
    getParam = "Perwira Tinggi";
  }

  const [formData, setFormData] = useState({
    nama: "",
    pangkat: "",
    nrp: "",
    tanggalLahir: "",
    kesatuanTerakhir: "",
    tmtTni: "",
    noKtpa: "",
    noNpwp: "",
    mdk: "",
    mkg: "",
    namaWari: "",
    tanggalLahirWari: "",
    jumlahAnak: 0,
    anak: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJumlahAnakChange = (e) => {
    const jumlah = parseInt(e.target.value) || 0;
    const anakBaru = Array.from({ length: jumlah }, (_, i) => ({
      nama: formData.anak[i]?.nama || "",
      tanggalLahir: formData.anak[i]?.tanggalLahir || "",
    }));
    setFormData({ ...formData, jumlahAnak: jumlah, anak: anakBaru });
  };

  const handleAnakChange = (index, field, value) => {
    const updatedAnak = [...formData.anak];
    updatedAnak[index][field] = value;
    setFormData({ ...formData, anak: updatedAnak });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg p-5 relative max-h-[90vh] flex flex-col">
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:opacity-50 hover:cursor-pointer transition-all"
        >
          <X size={20} />
        </button>

        {/* Judul Modal */}
        <h1 className="text-xl font-bold text-gray-800 text-center mb-4">
          Tambah Data {getParam}
        </h1>

        {/* Step indicator */}
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center space-x-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold ${
                    step === s
                      ? "border-[var(--armycolor)] text-white bg-[var(--armycolor)]"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-[2px] ${
                      step > s ? "bg-[var(--armycolor)]" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form container scrollable */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {/* Kolom kiri */}
              <div className="space-y-3">
                <InputField label="Nama" name="nama" value={formData.nama} onChange={handleChange} />
                <InputField label="Pangkat" name="pangkat" value={formData.pangkat} onChange={handleChange} />
                <InputField label="NRP" name="nrp" value={formData.nrp} onChange={handleChange} />
                <InputField label="Tanggal Lahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleChange} />
                <InputField label="Kesatuan Terakhir" name="kesatuanTerakhir" value={formData.kesatuanTerakhir} onChange={handleChange} />
              </div>

              {/* Kolom kanan */}
              <div className="space-y-3">
                <InputField label="TMT TNI" name="tmtTni" type="date" value={formData.tmtTni} onChange={handleChange} />
                <InputField label="No. KTPA" name="noKtpa" value={formData.noKtpa} onChange={handleChange} />
                <InputField label="No. NPWP" name="noNpwp" value={formData.noNpwp} onChange={handleChange} />
                <InputField label="Masa Dinas Kerja (MDK)" name="mdk" value={formData.mdk} onChange={handleChange} />
                <InputField label="Masa Kerja Gaji (MKG)" name="mkg" value={formData.mkg} onChange={handleChange} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <InputField label="Nama Wari/Istri" name="namaWari" value={formData.namaWari} onChange={handleChange} />
              <InputField label="Tanggal Lahir" name="tanggalLahirWari" type="date" value={formData.tanggalLahirWari} onChange={handleChange} />
              <InputField label="Jumlah Anak" name="jumlahAnak" type="number" value={formData.jumlahAnak} onChange={handleJumlahAnakChange} />

              {/* Anak dinamis */}
              {formData.anak.map((anak, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <InputField
                    label={`Nama Anak ${i + 1}`}
                    value={anak.nama}
                    onChange={(e) => handleAnakChange(i, "nama", e.target.value)}
                  />
                  <InputField
                    label={`Tanggal Lahir Anak ${i + 1}`}
                    type="date"
                    value={anak.tanggalLahir}
                    onChange={(e) => handleAnakChange(i, "tanggalLahir", e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tombol nav */}
        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
          >
            Batalkan
          </button>

          <div className="space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Kembali
              </button>
            )}
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-lg bg-[var(--armycolor)] text-white hover:opacity-90"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log("Submit data:", formData);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-[var(--armycolor)] text-white hover:opacity-90"
              >
                Simpan Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen InputField Reusable
function InputField({ label, type = "text", name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] transition-all"
      />
    </div>
  );
}
