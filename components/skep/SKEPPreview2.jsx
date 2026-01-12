"use client";

import { useSearchParams } from "next/navigation";

export default function SKEPPreviewPage2({ formData }) {
  const searchParams = useSearchParams();
  const template = searchParams.get("template");

  if (template === "skep_pengantarpati") {
    return null;
  }

  /* Util */

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    const m = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember",
    ];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatCurrency = (num) => {
    if (!num) return "Rp0,00";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(num);
  };

  /* ================= TEMPLATE RULE ================= */

  const TEMPLATE_ANAK_MAP = {
    skep_anak1: 1,
    skep_anak2: 2,
    skep_piagam: 0,
    skep_tanpaanak: 0,
    skep_pengantarpati: 0,
  };

  const jumlahAnakDitampilkan = TEMPLATE_ANAK_MAP[template] ?? 0;

  const anakList = Array.isArray(formData.anak)
    ? formData.anak.slice(0, jumlahAnakDitampilkan)
    : [];

  const tampilkanAnak = jumlahAnakDitampilkan > 0;

  /* ================= RENDER ================= */

  return (
    <div
      className="w-full bg-white font-serif text-gray-900 p-6"
      style={{ width: "210mm", height: "297mm", fontSize: "10px", lineHeight: "1.35" }}
    >
      {/* Nomor Halaman */}
      <div className="text-center mb-2">2</div>

      {/* Pasal 3 - 5 */}
      <ol start={3} className="list-decimal list-inside text-justify space-y-1">
        <li>
          Terhitung mulai bulan berikutnya setelah penerimaan penghasilan penuh tersebut
          pada pasal 2 dihentikan, kepada istri yang namanya tercantum pada pasal 5 kolom a
          diberikan pensiun kawakawuri dan tunjangan anak yatim/piatu seperti yang tercantum
          pada kolom c dan d, atau kepada anak yang tercantum pada kolom e apabila istri
          telah kehilangan haknya sesuai dengan ketentuan pasal 6 dan pasal 7 Peraturan
          Pemerintah Nomor 36 Tahun 1968.
        </li>

        <li>
          Penyesuaian mutasi mantan prajurit Angkatan Darat tersebut di atas dilaksanakan
          oleh PT ASABRI (Persero) selaku kantor bayar.
        </li>

        <li>Daftar keluarga dan penerimaan.</li>
      </ol>

      {/* ================= TABEL ================= */}
      <div className="mt-2 border border-black">
        <table className="w-full border-collapse">
          <tbody>
            {/* a. Istri */}
            <tr>
              <td className="border p-1 w-6">a.</td>
              <td className="border p-1">
                Nama istri : {formData.namaIstri || "......................"}
              </td>
              <td className="border p-1">
                Tanggal lahir : {formatDate(formData.tglLahirIstri)}
              </td>
            </tr>

            {/* b. Anak (OPTIONAL) */}
            {tampilkanAnak && (
              <>
                <tr>
                  <td className="border p-1">b.</td>
                  <td className="border p-1">Nama anak</td>
                  <td className="border p-1">Tanggal lahir / Hub. keluarga</td>
                </tr>

                {anakList.map((a, i) => (
                  <tr key={i}>
                    <td className="border p-1" />
                    <td className="border p-1">{a.nama || "-"}</td>
                    <td className="border p-1">
                      {formatDate(a.tanggalLahir)} / {a.hubungan || "Anak"}
                    </td>
                  </tr>
                ))}
              </>
            )}

            {/* c. Kawakawuri */}
            <tr>
              <td className="border p-1">{tampilkanAnak ? "c." : "b."}</td>
              <td className="border p-1">Pensiun pokok kawakawuri</td>
              <td className="border p-1">
                {formatCurrency(formData.pensiunKawakawuri)}
              </td>
            </tr>

            {/* d & e. Tunjangan anak (OPTIONAL) */}
            {tampilkanAnak && (
              <>
                <tr>
                  <td className="border p-1" rowSpan={2}>d.</td>
                  <td className="border p-1">Tunj. anak yatim/piatu</td>
                  <td className="border p-1">Besarnya</td>
                </tr>
                <tr>
                  <td className="border p-1">
                    {jumlahAnakDitampilkan} orang anak
                  </td>
                  <td className="border p-1">
                    {formatCurrency(formData.tunjanganAnak)}
                  </td>
                </tr>
              </>
            )}

            {/* f. Bintang Jasa */}
            <tr>
              <td className="border p-1 align-top">
                {tampilkanAnak ? "f." : "c."}
              </td>
              <td colSpan={2} className="border p-1">
                <p>Bintang Jasa :</p>
                <ol className="list-decimal list-inside ml-2">
                  {(formData.bintangJasa || []).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Catatan */}
      <div className="mt-2">
        <p><b>Dengan catatan:</b></p>
        <p>
          Apabila di kemudian hari ternyata terdapat kekeliruan dalam keputusan ini,
          akan diadakan pembetulan sebagaimana mestinya.
        </p>
      </div>

      {/* Distribusi */}
      <div className="mt-2">
        <p>Salinan keputusan ini disampaikan kepada :</p>
        <ol className="list-decimal list-inside ml-2">
          <li>Ketua Badan Pemeriksa Keuangan di Jakarta</li>
          <li>Kepala RSPAD Gatot Soebroto di Jakarta</li>
          <li>Dirjen Perbendaharaan Kementerian Keuangan di Jakarta</li>
          <li>Ka BP TWP AD di Jakarta</li>
          <li>Dirut PT ASABRI (Persero) di Jakarta</li>
          <li>Dirut BPJS Kesehatan di Jakarta</li>
          <li>Dandamabesad di Jakarta</li>
          <li>Kakanbc PT ASABRI (Persero) Semarang</li>
          <li>Perwira Keuangan RSPAD Gatot Soebroto</li>
          <li>Mayjen TNI Dr. dr. Sukirman, S.H., Sp.KK, M.Kes., FINSDV., FAADV.</li>
        </ol>
      </div>

      {/* TTD */}
      <div className="mt-6 text-right">
        <p>Ditetapkan di Bandung</p>
        <p>pada tanggal ........ 2025</p>
        <p className="mt-4">a.n. KEPALA STAF ANGKATAN DARAT</p>
        <p>DIREKTUR AJUDAN JENDERAL</p>
        <p className="mt-6 font-bold">KRIS DONI INDRIARTO, S.I.P.</p>
        <p>BRIGADIR JENDERAL TNI</p>
      </div>
    </div>
  );
}
