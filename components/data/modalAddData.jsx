"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ConfirmModal from "@/components/reusable/modal";
import Dropdown from "@/components/reusable/dropdown";
import { variable } from "@/lib/variable";
import { useRouter } from "next/navigation";

export default function AddDataModal({ open, onClose, onSuccess }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
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
    jumlahAnak: "",
    anak: [],
  });

  const pangkatOptions = ["Brigjen", "Mayjen", "Letjen", "Jenderal"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJumlahAnakChange = (e) => {
    let raw = e.target.value;
    if (raw === "") {
      setFormData(prev => ({ ...prev, jumlahAnak: "", anak: [] }));
      return;
    }

    let jumlah = Math.max(0, parseInt(raw) || 0);
    if (jumlah > 15) jumlah = 15;

    const anakBaru = Array.from({ length: jumlah }, (_, i) => ({
      nama: formData.anak[i]?.nama || "",
      tanggalLahir: formData.anak[i]?.tanggalLahir || "",
    }));

    setFormData(prev => ({
      ...prev,
      jumlahAnak: jumlah,
      anak: anakBaru
    }));
  };

  const handleAnakChange = (idx, field, value) => {
    const updated = [...formData.anak];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData(prev => ({ ...prev, anak: updated }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSuccessMsg("Akses tidak valid. Token tidak ditemukan.");
        setSuccessOpen(true);
        return;
      }

      const anakPayload = {};
      const anakMax = 4;

      formData.anak.slice(0, anakMax).forEach((anak, index) => {
        const num = index + 1;

        anakPayload[`ANAK_${num}`] = anak.nama || "";
        anakPayload[`TTL_ANAK_${num}`] = anak.tanggalLahir || "";
        anakPayload[`STS_ANAK_${num}`] = anak.status || "";
      });

      const payload = {
        NAMA: formData.nama,
        PANGKAT: formData.pangkat,
        NRP: formData.nrp,
        TTL: formData.tanggalLahir,
        KESATUAN: formData.kesatuanTerakhir,
        TMT_TNI: formData.tmtTni,
        NKTPA: formData.noKtpa,
        NPWP: formData.noNpwp,
        MDK: Number(formData.mdk),
        MKG: Number(formData.mkg),
        PASANGAN: formData.namaWari,
        TTL_PASANGAN: formData.tanggalLahirWari,
        ...anakPayload,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.personil}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menambahkan data");

      setSuccessMsg("Data berhasil ditambahkan.");
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      setSuccessMsg("Terjadi kesalahan saat menyimpan data");
      setSuccessOpen(true);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg p-5 relative max-h-[90vh] flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:opacity-50 hover:cursor-pointer transition-all"
          >
            <X size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 text-center mb-4">
            Tambah Data Perwira Tinggi
          </h1>
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Nama" name="nama" value={formData.nama} onChange={handleChange} />
                {/* Pangkat: dropdown */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Pangkat</label>
                  <Dropdown
                    options={pangkatOptions}
                    selected={formData.pangkat || null}
                    onSelect={(value) => setFormData(prev => ({ ...prev, pangkat: value }))}
                    placeholder="Pilih Pangkat"
                    className="w-full"
                    bgColor="white"
                  />
                </div>

                <InputField label="NRP" name="nrp" value={formData.nrp} onChange={handleChange} />
                <InputField label="Tanggal Lahir" type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} />
                <InputField label="Kesatuan Terakhir" name="kesatuanTerakhir" value={formData.kesatuanTerakhir} onChange={handleChange} />
                <InputField label="TMT TNI" type="date" name="tmtTni" value={formData.tmtTni} onChange={handleChange} />
                <InputField label="No KTPA" name="noKtpa" value={formData.noKtpa} onChange={handleChange} />
                <InputField label="No NPWP" name="noNpwp" value={formData.noNpwp} onChange={handleChange} />
                <InputField label="MDK" name="mdk" value={formData.mdk} onChange={handleChange} />
                <InputField label="MKG" name="mkg" value={formData.mkg} onChange={handleChange} />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <InputField label="Nama Istri" name="namaWari" value={formData.namaWari} onChange={handleChange} />
                <InputField label="Tanggal Lahir Istri" type="date" name="tanggalLahirWari" value={formData.tanggalLahirWari} onChange={handleChange} />
                
                <InputField
                  label="Jumlah Anak (max 15)"
                  type="number"
                  name="jumlahAnak"
                  value={formData.jumlahAnak}
                  onChange={handleJumlahAnakChange}
                />
                {formData.anak.map((anak, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
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
          <div className="flex justify-between mt-4">
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
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-[var(--armycolor)] text-white hover:opacity-90"
                >
                  Simpan Data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal Success */}
      <ConfirmModal
        isOpen={successOpen}
        title="Berhasil"
        message={successMsg}
        type="success"
        confirmText="OK"
        onClose={() => setSuccessOpen(false)}
        onConfirm={() => {
          setSuccessOpen(false);
          window.location.href = "/perwira?refresh=1";
        }}
      />
    </>
  );
}

// Komponen InputField Reusable
function InputField({ label, name, value, onChange, type = "text" }) {
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
