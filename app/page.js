"use client";

import { useEffect, useState } from "react";
import { User, File } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Beranda() {
  const [chartData, setChartData] = useState([]);
  const [cards, setCards] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/dashboard.json"); // nanti tinggal ganti ke API
        const json = await res.json();
        setChartData(json.chartData);
        setCards(json.cards);
        setActivities(json.activities);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-1 flex flex-col">
      {/** ini bagian atas dashboard ye */}
      <div className="flex flex-col">
        <h2 className="text-gray-800">Dashboard Statistik Sispens AD</h2>
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
              <p className="text-sm p-3 text-gray-800">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/** ini bagian bawahnya ye ges yaaa */}
      <div className="flex md:flex-row flex-col mt-3 gap-3">
        <div className="flex-1 bg-white shadow p-3 rounded flex flex-col">
          <div className="flex items-center border-b border-gray-200 pb-3">
            <User className="mr-2 text-gray-800" />
            <p className="text-sm text-gray-800">Jumlah Pensiun Perwira TNI AD</p>
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
            <File className="mr-2 text-gray-800" />
            <p className="text-sm text-gray-800">Aktivitas Terbaru</p>
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
                  <tr key={a.id} className="text-sm hover:bg-gray-50 text-gray-800">
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
