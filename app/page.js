"use client";

import { User, File } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// dummy data untuk chart
const chartData = [
  { year: 2019, people: 120 },
  { year: 2020, people: 340 },
  { year: 2021, people: 500 },
  { year: 2022, people: 260 },
  { year: 2023, people: 710 },
  { year: 2024, people: 430 },
  { year: 2025, people: 620 },
];

// dummy data untuk cards
const cards = [
  { jumlah: 2750, label: "Letda - Kapten", sub: "Jumlah Perwira Pertama - PAMA" },
  { jumlah: 1890, label: "Mayor - Kolonel", sub: "Jumlah Perwira Menengah - PAMEN" },
  { jumlah: 920, label: "Brigjen - Jendral", sub: "Jumlah Perwira Tinggi - PATI" },
];

// dummy data untuk tabel
const activities = [
  { id: 1, user: "Administrator - Dimas", activity: "Menambahkan data warakawuri" },
  { id: 2, user: "Administrator - Sinta", activity: "Memperbarui data perwira" },
  { id: 3, user: "Administrator - Budi", activity: "Menghapus data pensiunan" },
];

export default function Beranda() {
  return (
    <div className="p-1 flex flex-col">
      {/** ini bagian atas dashboard ye */}
      <div className="flex flex-col">
        <h2>Dashboard Statistik Sispens AD</h2>
        <p className="text-sm text-[var(--textgray)]">Sistem Pensiun Angkatan Darat</p>
      </div>

      <div className="flex md:flex-row flex-col justify-center gap-3 mt-3">
        {cards.map((card, idx) => (
          <div key={idx} className="flex-1 bg-white rounded shadow p-3">
            <div>
              <div className="p-3 bg-gray-100 shadow rounded flex flex-row items-center">
                <img />
                <div>
                  <p className="text-gray-800">{card.jumlah}</p>
                  <p className="text-sm text-[var(--textgray)]">{card.label}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm p-3">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/** ini bagian bawahnya ye ges yaaa */}
      <div className="flex md:flex-row flex-col mt-3 gap-3">
        <div className="flex-1 bg-white shadow p-3 rounded flex flex-col">
          <div className="flex items-center border-b border-gray-200 pb-3">
            <User className="mr-2" />
            <p className="text-sm">Jumlah Pensiun Perwira TNI AD</p>
          </div>
          <div className="flex flex-col w-full h-[400px] p-3 space-y-3">
            <select className="flex p-2 rounded bg-gray-100">
              <option>Tahunan</option>
            </select>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis ticks={[0, 200, 400, 600, 800]} domain={[0, 800]} />
                <Tooltip />
                <Bar dataKey="people" fill="#0B4803" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 bg-white shadow p-3 rounded">
          <div className="flex items-center border-b border-gray-200 pb-3">
            <File className="mr-2" />
            <p className="text-sm">Aktivitas Terbaru</p>
          </div>
          <div className="p-3 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 rounded p-3">
                <tr className="text-gray-600 text-sm text-left">
                  <th className="py-2 px-3">No.</th>
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3">Aktivitas</th>
                  <th className="py-2 px-3">Peninjauan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((a) => (
                  <tr key={a.id} className="text-sm hover:bg-gray-50">
                    <td className="py-2 px-3">{a.id}.</td>
                    <td className="py-2 px-3">{a.user}</td>
                    <td className="py-2 px-3">{a.activity}</td>
                    <td className="py-2 px-3 text-blue-500 cursor-pointer">Lihat Detail</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
