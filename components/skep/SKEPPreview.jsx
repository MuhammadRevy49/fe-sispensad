"use client";

import { useSearchParams } from "next/navigation";

export default function SKEPPreview({ formData }) {
  const searchParams = useSearchParams();
  const template = searchParams.get("template");

  /* ================= UTIL ================= */
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
    if (!dateString) return "";
    const d = new Date(dateString);
    const m = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember",
    ];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  };

  /* =====================================================
     TEMPLATE : SURAT PENGANTAR PATI (KHUSUS)
     ===================================================== */
  if (template === "skep_pengantarpati") {
    return (
      <div
        id="skep-preview"
        className="bg-white font-serif text-black p-6"
        style={{ width: "210mm", height: "297mm", fontSize: "10px", lineHeight: "1.35" }}
      >
        {/* HEADER */}
        <div className="text-center">
          <p className="font-bold">DIREKTORAT AJUDAN JENDERAL TNI AD</p>
          <p className="font-bold">SUBDIREKTORAT PEMBINAAN UMUM</p>
          <div className="border-b border-black w-2/3 mx-auto my-2" />
        </div>

        {/* NOMOR & TUJUAN */}
        <div className="flex justify-between mt-4">
          <div>
            <p>Nomor : {formData.nomorSurat || "B/Speng-        /2024"}</p>
            <p>Klasifikasi : Biasa</p>
          </div>

          <div className="text-right">
            <p>Bandung, {formData.tahunSurat || "2024"}</p>
            <p className="mt-2">Kepada</p>
            <p className="font-bold">
              Yth. {formData.namaPenerima || "Mayjen TNI Ilyas Alamsyah, S.E., M.Tr.(Han)."}
            </p>
            <p className="whitespace-pre-line">
              {formData.alamatPenerima ||
`d.a. KPAD Cijantung Jln. Dahlia Blok H
No. 26 RT. 008 RW. 004 Kel. Gedong Kec.
Pasar Rebo Kota Jakarta Timur Prov. DKI
Jakarta`}
            </p>
          </div>
        </div>

        {/* JUDUL */}
        <div className="text-center mt-6 mb-2">
          <p className="font-bold underline">SURAT PENGANTAR</p>
        </div>

        {/* TABEL */}
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black p-1 w-10">NO</th>
              <th className="border border-black p-1">ISI</th>
              <th className="border border-black p-1 w-24">BANYAKNYA</th>
              <th className="border border-black p-1 w-48">KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 text-center">1</td>
              <td className="border border-black p-1 align-top">
                Salinan Kep Kasad<br />
                Nomor {formData.nomorKep || "Kep/1161-33/X/2024"}<br />
                tanggal {formData.tanggalKep || "28 November 2024"}<br />
                tentang Pemberian Pensiun<br />
                a.n. {formData.namaPati || "Mayjen TNI Ilyas Alamsyah"}<br />
                S.E., M.Tr.(Han), NRP {formData.nrpPati || "32235"}<br />
                masing-masing terdiri dari :<br />
                a. Bahan kertas manila<br />
                b. Bahan kertas HVS
              </td>
              <td className="border border-black p-1 align-top">
                3<br /><br />
                Satu lembar<br />
                Satu lembar
              </td>
              <td className="border border-black p-1 align-top">
                1. Disampaikan dengan hormat Salinan Keputusan Kasad (Bahan kertas manila)
                Nomor Seri: A.27114688 untuk dipergunakan sebagaimana mestinya.<br /><br />
                2. Apabila terjadi mutasi/perubahan status/alamat wajib melaporkan diri
                kepada Asabri/Kowil setempat nama berdomisili.<br /><br />
                3. Demikian mohon dimaklumi.
              </td>
            </tr>
          </tbody>
        </table>

        {/* PENANDATANGAN */}
        <div className="mt-4">
          <p>a.n. Kepala Subditbinum Ditajenad</p>
          <p>Kepala Bagian Tata Usaha,</p>

          <div className="mt-6">
            <p className="font-bold">{formData.namaPenandatangan || "Lenni Marlena"}</p>
            <p>
              Letnan Kolonel Caj (K) NRP {formData.nrpPenandatangan || "2920037040672"}
            </p>
          </div>
        </div>

        {/* TEMBUSAN */}
        <div className="mt-4">
          <p className="font-bold">Tembusan :</p>
          <ol className="list-decimal list-inside">
            <li>Ketua Badan Pemeriksa Keuangan di Jakarta</li>
            <li>Dirjen Perbendaharaan Kementerian Keuangan di Jakarta</li>
            <li>Ka BP TWP AD di Jakarta</li>
            <li>Dirut PT ASABRI (Persero) di Jakarta</li>
            <li>Dirut BPJS Kesehatan di Jakarta</li>
            <li>Dandamabesad di Jakarta</li>
            <li>Kasubditbinum Ditajenad</li>
            <li>Kakanbc Utama PT ASABRI (Persero) Jakarta</li>
            <li>Perwira Keuangan Denmabesad NA.2.01.01 di Jakarta</li>
          </ol>
        </div>

        {/* CATATAN */}
        <div className="mt-3 text-justify">
          <p className="font-bold">Catatan :</p>
          <p>
            Setelah Bpk/Ibu/Sdr/i menerima Salinan Keputusan Pensiun ini agar segera
            mengurus SKPP kepada Perwira Keuangan Denmabesad NA.2.01.01 di Jakarta
            selanjutnya dikirim kepada Dirut PT ASABRI (Persero)
            Jl. Mayjen Sutoyo No. 11 Jakarta Timur - 13630
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     DEFAULT : SKEP PENSIUN (KODE LAMA)
     ===================================================== */
  return (
    <div
      id="skep-preview"
      className="w-full bg-white font-serif text-gray-900 p-6"
      style={{ height: "297mm", width: "210mm", fontSize: "10px", lineHeight: "1.35" }}
    >
      {/* Header */}
      <div className="text-center mb-3">
        {/* Logo TNI */}
        <div className="flex justify-center mb-1">
          <img
            src="/images/tni.png"
            alt="Logo TNI"
            width={50}
            height={50}
            className="h-12 w-auto"
          />
        </div>

        <p className="text-xs font-bold tracking-wide">SALINAN</p>
        <p className="text-xs font-bold mt-0.5">KEPUTUSAN KEPALA STAF ANGKATAN DARAT</p>
        <p className="text-xs mt-0.5">
          Nomor Kep/ <span className="border-b border-gray-400 inline-block w-9 mx-0.5" /> /2025
        </p>
        <p className="text-xs font-bold mt-1">tentang</p>
        <p className="text-xs font-bold mt-0.5">PEMBERIAN PENSIUN</p>
        <p className="text-xs font-bold mt-0.5">DENGAN RAHMAT TUHAN YANG MAHA ESA</p>
        <p className="text-xs font-bold mt-0.5">KEPALA STAF ANGKATAN DARAT</p>
      </div>

      {/* Content */}
      <div className="space-y-1.5 text-xs leading-tight">
        {/* Menimbang */}
        <div>
          <p>
            <span className="font-bold">Menimbang</span>
            <span className="mx-1">:</span>
            <span className="ml-1 text-justify inline">
              bahwa, dari data autentik sampai dengan akhir bulan yang bersangkutan mempunyai MDK tahun dan MKG tahun dengan GPT Rp.00 (FG TNI 2024) berbak menerima pensiun;
            </span>
          </p>
        </div>

        {/* Mengingat */}
        <div>
          <p className="font-bold">Mengingat :</p>
          <ol className="list-decimal list-inside space-y-0 ml-1 text-justify text-xs">
            <li>Undang-Undang Nomor 6 Tahun 1966;</li>
            <li>Undang-Undang RI Nomor 34 Tahun 2004;</li>
            <li>Peraturan Pemerintah Nomor. 36 Tahun 1968 yo Peraturan Pemerintah Nomor 51 Tahun 1970;</li>
            <li>Peraturan Pemerintah RI Nomor 39 Tahun 2010;</li>
            <li>Peraturan Pemerintah RI Nomor 9 Tahun 2024;</li>
            <li>Peraturan Panglima TNI Nomor Perpang/15/III/2009 tanggal 24-03-2009;</li>
            <li>Surat Diarah Bersama Menteri Keuangan RI dan Panglima ABRI Nomor SE-97/A/51/1993 tanggal 28-10-1993;</li>
            <li>Instruksi Kasad Nomor Ins/1/III/1994 tanggal 24-03-1994;</li>
          </ol>
        </div>

        {/* Memperhatikan */}
        <div>
          <p className="font-bold">Memperhatikan :</p>
          <p className="ml-2 text-justify">
            Surat Panglima TNI Nomor <span className="border-b border-gray-400 inline-block w-16 mx-0.5" /> tanggal{" "}
            <span className="border-b border-gray-400 inline-block w-16 mx-0.5" /> tentang Usul Pemberian Dengan Hormat dari Dinas Keprajuritan Tentara Nasional Indonesia a.n. NRP{" "}
            <span className="border-b border-gray-400 inline-block w-16 mx-0.5" /> terhubung, mulai tanggal karena telah memenuhi syarat pensiun:
          </p>
        </div>

        {/* Menetapkan */}
        <div className="mt-1">
          <p className="font-bold text-center">MENETAPKAN :</p>

          <div className="space-y-0.5 ml-1">
            {/* Point 1 */}
            <div>
              <p className="font-bold text-xs">
                1. Terhitung mulai bulan kepada mantan prajurit Angkatan Darat sebagai berikut:
              </p>
              <div className="ml-2 mt-0.5 space-y-0 text-xs">
                <p>a. Nama : <span className="border-b border-gray-400 inline-block w-52">{formData.nama || ""}</span></p>
                <p>b. Pangkat, NRP : <span className="border-b border-gray-400 inline-block w-44">{formData.pangkat} {formData.nrp}</span></p>
                <p>c. Tanggal lahir : <span className="border-b border-gray-400 inline-block w-44">{formatDate(formData.tanggalLahir)}</span></p>
                <p>d. Kesatuan terakhir : <span className="border-b border-gray-400 inline-block w-36">{formData.kesatuanTerakhir || ""}</span></p>
                <p>e. TMT TNI : <span className="border-b border-gray-400 inline-block w-52">{formatDate(formData.tmtTni)}</span></p>
                <p>f. No. KTPA : <span className="border-b border-gray-400 inline-block w-52">{formData.noKtpa || ""}</span></p>
                <p>g. NPWP : <span className="border-b border-gray-400 inline-block w-52">{formData.npwp || ""}</span></p>
                <p className="text-justify">
                  diberikan pensiun pokok setiap bulan sebesar{" "}
                  <span className="border-b border-gray-400 inline-block w-36">{formatCurrency(formData.jumlahPensiun)}</span>{" "}
                  menurut Peraturan Pemerintah RI Nomor 9 Tahun 2024.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="mt-0.5">
              <p className="font-bold text-xs text-justify">
                2. Terhitung mulai bulan berikutnya setelah mantan prajurit yang bersangkutan meninggal dunia, kepada istri yang namanya tercantu pada pasal 5 kolom a menerima penghasilan penuh almarhum selama bulan atau diterimakan kepada anak yang namanya tercantu pada kolom b apabila istri telah kehilangan haknya sesuai dengan ketentuan pasal 6 dan pasal 7 Peraturan Pemerintah Nomor 36 Tahun 1968.
              </p>
            </div>
          </div>
        </div>

        {/* Penutup */}
        <div className="mt-1 space-y-1">
          <p className="text-xs text-justify">Keputusan ini mulai berlaku sejak tanggal ditetapkan.</p>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            {/* Left Side - Disahkan */}
            <div>
              <p className="text-xs">Disahkan,</p>
              <p className="text-xs font-bold mt-5">Menteri Pertahanan RI</p>
            </div>

            {/* Right Side - Signature */}
            <div>
              <p className="text-xs">Jakarta, {formatDate(new Date().toISOString())}</p>
              <p className="text-xs font-bold mt-5">KEPALA STAF ANGKATAN DARAT</p>
              <p className="text-xs mt-5 border-t border-gray-400 pt-0">
                <span className="border-b border-gray-400 inline-block w-16 px-0.5" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Distribusi */}
      <div className="mt-2 pt-1 border-t border-gray-400 text-xs">
        <p className="font-bold text-xs">Distribusi :</p>
        <ol className="list-decimal list-inside ml-1 space-y-0 text-xs">
          <li>Arsip</li>
          <li>Yth Direksi Jaminan Sosial Angkatan Darat</li>
          <li>Yth Bapak/Ibu yang bersangkutan</li>
        </ol>
      </div>
    </div>
  );
}
