"use client";

import { useState, useEffect } from "react";
import SKEPPreview from "@/components/skep/SKEPPreview";
import SKEPPreviewPage2 from "@/components/skep/SKEPPreview2";
import SKEPForm from "@/components/skep/SKEPForm";
import PageTitle from "@/components/reusable/pageTitle";
import LoadingDots from "@/components/reusable/loading";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { variable } from "@/lib/variable";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

export default function GenerateSKEPPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    nama: "",
    pangkat: "",
    nrp: "",
    tanggalLahir: "",
    kesatuanTerakhir: "",
    tmtTni: "",
    noKtpa: "",
    npwp: "",
    jumlahPensiun: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSoldier, setSelectedSoldier] = useState(null);

  const template = searchParams.get("template");

  const TEMPLATE_TITLE_MAP = {
    skep_anak1: "Anak 1",
    skep_anak2: "Anak 2",
    skep_tanpaanak: "Tanpa Anak",
    skep_piagam: "Piagam",
    skep_pengantarpati: "Pengantar Pati",
  };

  const judulTemplate = TEMPLATE_TITLE_MAP[template] ?? "";

  // Fetch data perwira dari database (saat pertama kali load atau saat memilih perwira)
  useEffect(() => {
    fetchSoldierData();
  }, []);

  const fetchSoldierData = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.personil}`);
      
      if (!res.ok) {
        throw new Error("Gagal mengambil data perwira");
      }

      const data = await res.json();
      
      // Jika ada data, set yang pertama sebagai default
      if (data && data.length > 0) {
        const soldier = data[0];
        setFormData({
          nama: soldier.nama || "",
          pangkat: soldier.pangkat || "",
          nrp: soldier.nrp || "",
          tanggalLahir: soldier.tanggalLahir || "",
          kesatuanTerakhir: soldier.kesatuan || "",
          tmtTni: soldier.tmtTni || "",
          noKtpa: soldier.noKtpa || "",
          npwp: soldier.npwp || "",
          jumlahPensiun: soldier.jumlahPensiun || "",
        });
        setSelectedSoldier(soldier);
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeneratePDF = async () => {
    try {
      // Import dynamically untuk menghindari error build
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      const element = document.getElementById("skep-preview");
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 10;

      if (imgHeight > pageHeight) {
        // Multi-page PDF
        const pages = Math.ceil(imgHeight / (pageHeight - 20));
        for (let i = 0; i < pages; i++) {
          if (i > 0) pdf.addPage();
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            10,
            yPosition - i * (pageHeight - 20),
            imgWidth,
            imgHeight
          );
        }
      } else {
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          10,
          yPosition,
          imgWidth,
          imgHeight
        );
      }

      const fileName = `SKEP_${formData.nrp}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Gagal generate PDF. Pastikan semua field sudah diisi.");
    }
  };

  const handleGenerateWord = async () => {
    try {
      const { Document, Packer, Paragraph, Table, TableCell, TableRow, BorderStyle, VerticalAlign, AlignmentType, TextRun, convertInchesToTwip } = await import("docx");

      const formatCurrency = (num) => {
        if (!num) return "Rp0,00";
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num);
      };

      const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const months = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      };

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header
              new Paragraph({
                text: "SALINAN",
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "KEPUTUSAN KEPALA STAF ANGKATAN DARAT",
                alignment: AlignmentType.CENTER,
                bold: true,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "Nomor Kep/ _____ /2025",
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "tentang",
                alignment: AlignmentType.CENTER,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: "PEMBERIAN PENSIUN",
                alignment: AlignmentType.CENTER,
                bold: true,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: "DENGAN RAHMAT TUHAN YANG MAHA ESA",
                alignment: AlignmentType.CENTER,
                bold: true,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: "KEPALA STAF ANGKATAN DARAT",
                alignment: AlignmentType.CENTER,
                bold: true,
                spacing: { after: 200 },
              }),

              // Menimbang
              new Paragraph({
                text: "Menimbang:",
                bold: true,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "bahwa, dari data autentik sampai dengan akhir bulan yang bersangkutan mempunyai MDK tahun dan MKG tahun dengan GPT Rp.00 (FG TNI 2024) berbak menerima pensiun;",
                spacing: { after: 200 },
              }),

              // Mengingat
              new Paragraph({
                text: "Mengingat:",
                bold: true,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "1. Undang-Undang Nomor 6 Tahun 1966;",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "2. Undang-Undang RI Nomor 34 Tahun 2004;",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "3. Peraturan Pemerintah Nomor. 36 Tahun 1968 yo Peraturan Pemerintah Nomor 51 Tahun 1970;",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "4. Peraturan Pemerintah RI Nomor 39 Tahun 2010;",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "5. Peraturan Pemerintah RI Nomor 9 Tahun 2024;",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "6. Peraturan Panglima TNI Nomor Perpang/15/III/2009 tanggal 24-03-2009;",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "7. Surat Diarah Bersama Menteri Keuangan RI dan Panglima ABRI Nomor SE-97/A/51/1993 tanggal 28-10-1993;",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "8. Instruksi Kasad Nomor Ins/1/III/1994 tanggal 24-03-1994;",
                spacing: { after: 200 },
              }),

              // Memperhatikan
              new Paragraph({
                text: "Memperhatikan:",
                bold: true,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "Surat Panglima TNI Nomor _______ tanggal _______ tentang Usul Pemberian Dengan Hormat dari Dinas Keprajuritan Tentara Nasional Indonesia a.n. NRP _______ terhubung, mulai tanggal karena telah memenuhi syarat pensiun:",
                spacing: { after: 200 },
              }),

              // Menetapkan
              new Paragraph({
                text: "MENETAPKAN:",
                alignment: AlignmentType.CENTER,
                bold: true,
                spacing: { after: 200 },
              }),

              new Paragraph({
                text: "1. Terhitung mulai bulan kepada mantan prajurit Angkatan Darat sebagai berikut:",
                bold: true,
                spacing: { after: 100 },
              }),

              new Paragraph({
                text: `a. Nama : ${formData.nama || "-"}`,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: `b. Pangkat, NRP : ${formData.pangkat} ${formData.nrp}`,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: `c. Tanggal lahir : ${formatDate(formData.tanggalLahir)}`,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: `d. Kesatuan terakhir : ${formData.kesatuanTerakhir || "-"}`,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: `e. TMT TNI : ${formatDate(formData.tmtTni)}`,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: `f. No. KTPA : ${formData.noKtpa || "-"}`,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: `g. NPWP : ${formData.npwp || "-"}`,
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: `diberikan pensiun pokok setiap bulan sebesar ${formatCurrency(formData.jumlahPensiun)} menurut Peraturan Pemerintah RI Nomor 9 Tahun 2024.`,
                spacing: { after: 200 },
              }),

              new Paragraph({
                text: "2. Terhitung mulai bulan berikutnya setelah mantan prajurit yang bersangkutan meninggal dunia, kepada istri yang namanya tercantu pada pasal 5 kolom a menerima penghasilan penuh almarhum selama bulan atau diterimakan kepada anak yang namanya tercantu pada kolom b apabila istri telah kehilangan haknya sesuai dengan ketentuan pasal 6 dan pasal 7 Peraturan Pemerintah Nomor 36 Tahun 1968.",
                spacing: { after: 300 },
              }),

              new Paragraph({
                text: "Keputusan ini mulai berlaku sejak tanggal ditetapkan.",
                spacing: { after: 400 },
              }),

              // Signature
              new Paragraph({
                text: `Jakarta, ${formatDate(new Date().toISOString())}`,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: "KEPALA STAF ANGKATAN DARAT",
                bold: true,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: " ",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "_____________________",
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
              }),

              // Distribusi
              new Paragraph({
                text: "Distribusi:",
                bold: true,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                text: "1. Arsip",
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: "2. Yth Direksi Jaminan Sosial Angkatan Darat",
                spacing: { after: 50 },
              }),
              new Paragraph({
                text: "3. Yth Bapak/Ibu yang bersangkutan",
                spacing: { after: 50 },
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `SKEP_${formData.nrp}_${new Date().getTime()}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error("Error generating Word:", err);
      alert("Gagal generate Word. Pastikan semua field sudah diisi.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-1 space-y-6 relative">
        <PageTitle
          title={`Generate Surat Keputusan ${judulTemplate ? `${judulTemplate}` : ""}`}
          desc="Sistem Pensiun Angkatan Darat"
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <LoadingDots color="var(--armycolor)" />
            <p className="text-[var(--textgray)] mt-4">Mengambil data perwira...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 space-y-3 relative flex flex-col h-[calc(100vh-120px)]">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <PageTitle
          title={`Generate Surat Keputusan ${judulTemplate ? `${judulTemplate}` : ""}`}
          desc="Sistem Pensiun Angkatan Darat"
        />
        <Link href={`/perwira/generate_skep/${id}`} className="flex items-center p-2 bg-[var(--armycolor)] text-white rounded-lg hover:bg-[var(--armyhover)] hover:cursor-pointer transition-all">
          <ArrowLeft size={18} className="mr-1"/>
          <p>Kembali</p>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-red-800 font-semibold text-sm">Error</p>
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content - Fullpage Layout */}
      <div className="flex gap-3 flex-1 overflow-hidden">
        {/* Preview (Left) - Fixed A4 like print preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6 flex flex-col items-center gap-8">
          {/* PAGE 1 */}
          <div
            className="bg-white shadow-lg"
            style={{ width: "210mm", minHeight: "297mm" }}
          >
            <SKEPPreview formData={formData} />
          </div>

          {/* PAGE 2 */}
          <div
            className="bg-white shadow-lg"
            style={{ width: "210mm", minHeight: "297mm" }}
          >
            <SKEPPreviewPage2 formData={formData} />
          </div>
        </div>
        {/* Form (Right) - Fixed width sidebar */}
        <div className="w-96 flex flex-col overflow-hidden">
          <div className="bg-white rounded-lg shadow flex flex-col flex-1 overflow-hidden border border-gray-200">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[var(--armycolor)] to-green-700 px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Data Perwira</h2>
                  <p className="text-xs text-green-100">Informasi pensiun</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition whitespace-nowrap ${
                    isEditing
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-white text-[var(--armycolor)] hover:bg-gray-100"
                  }`}
                >
                  {isEditing ? "Selesai" : "Edit"}
                </button>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <SKEPForm
                formData={formData}
                onFormChange={handleFormChange}
                isEditing={isEditing}
                selectedSoldier={selectedSoldier}
                onRefresh={fetchSoldierData}
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 space-y-2">
              <button
                onClick={handleGeneratePDF}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2.5 px-4 rounded-lg transition duration-200 text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <span>PDF</span>
              </button>
              <button
                onClick={handleGenerateWord}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg transition duration-200 text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Word</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
