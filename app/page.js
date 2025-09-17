"use client";

import { useEffect, useState } from "react";
import Cards from "@/components/reusable/card";
import Chart from "@/components/dashboard/chart";
import Activities from "@/components/dashboard/Activities";
import {variable} from "@/lib/variable";
import PageTitle from "@/components/data/pageTitle";

export default function Beranda() {
  const [chartData, setChartData] = useState([]);
  const [cards, setCards] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        // Ambil data cards dari API
        const resTotal = await fetch(
       `${process.env.NEXT_PUBLIC_BASE_URL}${variable.totalSoldier}?category=all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const totalData = await resTotal.json();

        const resPerwira = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${variable.totalSoldier}?category=group`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const perwiraData = await resPerwira.json();

        const newCards = [
          {
            jumlah: perwiraData.pama,
            label: "Letnan - Kapten",
            sub: "Jumlah Perwira Pertama",
            iconUrl: "images/pama.png",
          },
          {
            jumlah: perwiraData.pamen,
            label: "Mayor - Kolonel",
            sub: "Jumlah Perwira Menengah",
            iconUrl: "/images/pamen.png",
          },
          {
            jumlah: perwiraData.pati,
            label: "Brigjen - Jendral",
            sub: "Jumlah Perwira Tinggi",
            iconUrl: "images/pati.png",
          },
          {
            jumlah: totalData.total,
            label: "Total Prajurit",
            sub: "Seluruh Prajurit",
            iconUrl: "/images/tni.png",
          },
        ];

        setCards(newCards);

        const resChart = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}`+ variable.historyYear,
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
        }

        const resHistory = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}`+ variable.history, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resHistory.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-1 flex flex-col">
      <PageTitle title="Dashboard Statistik" desc="Sistem Pensiun Angkatan Darat"/>
      <Cards cards={cards} />
      <div className="flex md:flex-row flex-col mt-3 gap-3">
        <Chart chartData={chartData} />
        <Activities activities={activities} />
      </div>
    </div>
  );
}
