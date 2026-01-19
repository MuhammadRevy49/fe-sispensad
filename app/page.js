"use client";

import { useEffect, useState } from "react";
import Cards from "@/components/reusable/card";
import Chart from "@/components/dashboard/chart";
import Activities from "@/components/dashboard/Activities";
import { variable } from "@/lib/variable";
import PageTitle from "@/components/reusable/pageTitle";

export default function Beranda() {
  const [chartData, setChartData] = useState([]);
  const [cards, setCards] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        // Ambil data rank (hanya pangkat Pati)
        const resRank = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${variable.totalSoldier}?category=rank`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!resRank.ok) throw new Error(`HTTP error! status: ${resRank.status}`);
        const rankData = await resRank.json();

        // Definisikan hanya pangkat Pati
        const patiRanks = [
          { name: "brigjen", icon: "/images/perwira/brigjen.png" },
          { name: "mayjen", icon: "/images/perwira/mayjen.png" },
          { name: "letjen", icon: "/images/perwira/letjen.png" },
          { name: "jenderal", icon: "/images/perwira/jenderal.png" },
        ];

        const newCards = patiRanks.map(({ name, icon }) => {
          const jumlah = typeof rankData[name] === "number" ? rankData[name] : 0;
          return {
            jumlah,
            label: name.charAt(0).toUpperCase() + name.slice(1),
            sub: `Jumlah ${name.charAt(0).toUpperCase() + name.slice(1)}`,
            iconUrl: icon,
          };
        });

        setCards(newCards);

        // Ambil data chart (tahun)
        const resChart = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${variable.historyYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const chartJson = await resChart.json();

        if (chartJson.success) {
          const formattedData = chartJson.data.map((item) => ({
            year: item.year,
            label: item.label,
            januari: item.januari,
            februari: item.februari,
            maret: item.maret,
            april: item.april,
            mei: item.mei,
            juni: item.juni,
            juli: item.juli,
            agustus: item.agustus,
            september: item.september,
            oktober: item.oktober,
            november: item.november,
            desember: item.desember,
          }));
          setChartData(formattedData);
        } else {
          setChartData([]);
        }

        // Ambil activity/history
        const resHistory = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${variable.history}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await resHistory.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        // Jika error, tampilkan cards default kosong agar UI tetap stabil
        setCards([
          { jumlah: 0, label: "Brigjen", sub: "Jumlah Brigjen", iconUrl: "/images/perwira/brigjen.png" },
          { jumlah: 0, label: "Mayjen", sub: "Jumlah Mayjen", iconUrl: "/images/perwira/mayjen.png" },
          { jumlah: 0, label: "Letjen", sub: "Jumlah Letjen", iconUrl: "/images/perwira/letjen.png" },
          { jumlah: 0, label: "Jenderal", sub: "Jumlah Jenderal", iconUrl: "/images/perwira/jenderal.png" },
        ]);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-1 flex flex-col">
      <PageTitle title="Dashboard Statistik" desc="Sistem Pensiun Angkatan Darat" />
      <Cards cards={cards} />
      <div className="flex md:flex-row flex-col mt-3 gap-3">
        <Chart chartData={chartData} />
        <Activities activities={activities} />
      </div>
    </div>
  );
}
