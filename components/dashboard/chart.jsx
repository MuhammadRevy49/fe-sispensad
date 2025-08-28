"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { ChevronDown } from "lucide-react";

export default function Chart({ chartData }) {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const availableYears = chartData.map((item) => item.year);
      setYears(availableYears);
      
      if (!selectedYear) {
        const latestYear = Math.max(...availableYears);
        setSelectedYear(latestYear);
      }
    }
  }, [chartData, selectedYear]);

  useEffect(() => {
    if (selectedYear && chartData && chartData.length > 0) {
      const selectedYearData = chartData.find((item) => item.year === selectedYear);
      
      if (selectedYearData) {
        const data = monthNames.map((m) => ({
          month: m.label,
          people: selectedYearData[m.key] || 0,
          fullMonth: m.key
        }));
        setMonthlyData(data);
      }
    }
  }, [selectedYear, chartData]);

  const maxValue = monthlyData.length
    ? Math.max(...monthlyData.map((item) => item.people))
    : 0;
  const yDomain = [0, Math.ceil((maxValue + 10) / 10) * 10];
  const getBarColor = (value) => {
    if (value === 0) return "#D1D5DB";
    if (value <= 10) return "#86EFAC";
    if (value <= 30) return "#4ADE80";
    if (value <= 50) return "#22C55E"; 
    return "#166534";
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-[8px] shadow-md">
          <p className="font-bold text-gray-800 capitalize">{data.fullMonth}</p>
          <p className="text-green-700 font-medium">{`Jumlah: ${payload[0].value}`}</p>
          <p className="text-xs text-gray-500">Tahun: {selectedYear}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 bg-white shadow-lg p-4 rounded-xl flex flex-col border border-gray-100">
      <div className="flex items-center border-b border-gray-200 pb-3 mb-4">
        <div className="rounded-lg mr-3">
          <Image
            src="/images/chart.png"
            width={24}
            height={24}
            alt="chart-bar"
          />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            Jumlah Pensiun Perwira TNI AD
          </p>
          <p className="text-sm text-gray-500">
            Data per bulan tahun {selectedYear || "..."}
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full h-[400px] space-y-4">
        <div className="flex justify-end items-center">
          <div className="relative w-32">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex justify-between items-center p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-100 transition-all duration-150"
            >
              {selectedYear || "Pilih Tahun"}
              <ChevronDown 
                className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                {years.map((year) => (
                  <div
                    key={year}
                    className={`p-2 cursor-pointer hover:bg-green-50 transition-colors duration-150 text-sm ${
                      selectedYear === year ? 'bg-[var(--armyhover)] font-medium text-[var(--background)] hover:text-[var(--foreground)]' : ''
                    }`}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsOpen(false);
                    }}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                domain={yDomain} 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
              <Bar dataKey="people" radius={[4, 4, 0, 0]} barSize={30}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.people)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                <Image
                  src="/images/no-data.png"
                  width={48}
                  height={48}
                  alt="No data"
                  className="mx-auto opacity-50"
                />
              </div>
              <p className="mt-3 text-gray-500">Tidak ada data untuk ditampilkan</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}