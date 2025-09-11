import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-6xl font-bold text-[var(--armycolor)]">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Halaman Tidak Ditemukan</h2>
      <p className="mt-2 text-gray-600">
        Maaf, halaman yang kamu cari tidak tersedia.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-[var(--armycolor)] text-white rounded-lg hover:bg-[var(--armycolor)]/90 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
