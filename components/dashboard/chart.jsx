"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { File } from "lucide-react";
import Dropdown from "@/components/reusable/dropdown";

// Custom Tooltip
function CustomTooltip({ active, payload, selectedYear }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white py-2 min-w-[140px] border border-gray-100 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow duration-300">
        <p className="text-sm text-gray-400 uppercase tracking-wide">{selectedYear}</p>
        <p className="text-2xl font-extrabold text-green-600 my-1">{payload[0].value}</p>
        <p className="text-lg font-semibold text-gray-800 capitalize">{data.fullMonth}</p>
      </div>
    );
  }
  return null;
}

export default function Chart({ chartData }) {
  const [years, setYears] = useState([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyData, setMonthlyData] = useState([]);

  const monthNames = [
    { key: "januari", label: "Jan" },
    { key: "februari", label: "Feb" },
    { key: "maret", label: "Mar" },
    { key: "april", label: "Apr" },
    { key: "mei", label: "Mei" },
    { key: "juni", label: "Jun" },
    { key: "juli", label: "Jul" },
    { key: "agustus", label: "Agu" },
    { key: "september", label: "Sep" },
    { key: "oktober", label: "Okt" },
    { key: "november", label: "Nov" },
    { key: "desember", label: "Des" },
  ];

  // Set available years
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const availableYears = chartData.map((item) => item.year);
      setYears(availableYears);
      if (!selectedYear) setSelectedYear(Math.max(...availableYears));
    }
  }, [chartData, selectedYear]);

  // Set monthly data
  useEffect(() => {
    if (!selectedYear || !chartData) return;
    const selectedYearData = chartData.find((item) => item.year === selectedYear);
    if (selectedYearData) {
      const data = monthNames.map((m) => ({
        month: m.label,
        people: selectedYearData[m.key] || 0,
        fullMonth: m.key,
      }));
      setMonthlyData(data);
    }
  }, [selectedYear, chartData]);

  const maxValue = monthlyData.length
    ? Math.max(...monthlyData.map((item) => item.people))
    : 0;
  const yDomain = [0, Math.ceil((maxValue + 10) / 10) * 10];

  return (
    <div className="flex-1 bg-white shadow-lg p-4 rounded-xl flex flex-col border border-gray-100">
      {/* Header */}
      <div className="flex items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <p className="text-lg font-semibold text-gray-800">
            Jumlah Pensiun Perwira TNI AD
          </p>
          <p className="text-sm text-gray-500">
            Data per bulan tahun {selectedYear || "..."}
          </p>
        </div>
      </div>

      {/* Dropdown & Chart */}
      <div className="flex flex-col w-full h-[400px] space-y-4">
        <div className="flex justify-end items-center">
          <Dropdown
            options={years}
            selected={selectedYear}
            onSelect={setSelectedYear}
            placeholder="Pilih Tahun"
            className="w-32"
          />
        </div>

        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis domain={yDomain} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} tickCount={6} />
              <Tooltip content={<CustomTooltip selectedYear={selectedYear} />} cursor={{ fill: "#F3F4F6" }} />
              <Bar dataKey="people" radius={[4, 4, 0, 0]} barSize={30}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#0B4803" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <File className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="mt-3 text-gray-500">Tidak ada data untuk ditampilkan</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
