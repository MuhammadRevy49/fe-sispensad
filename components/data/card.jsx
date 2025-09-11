"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cards from "@/components/reusable/card";
import { variable } from "@/lib/variable";

export default function CardsSection({ loading, setLoading }) {
  const [cards, setCards] = useState([]);
  const searchParams = useSearchParams();
  const categoryFilter = (searchParams.get("category") || "all").toLowerCase();

  // Mapping kategori → pangkat → icon
  const categoryMap = {
    pati: {
      ranks: [
        { name: "brigjen", icon: "/images/pati/brigjen.png" },
        { name: "letjen", icon: "/images/pati/letjen.png" },
        { name: "mayjen", icon: "/images/pati/mayjen.png" },
        { name: "jenderal", icon: "/images/pati/jenderal.png" },
      ],
    },
    pamen: {
      ranks: [
        { name: "mayor", icon: "/images/pamen/mayor.png" },
        { name: "letkol", icon: "/images/pamen/letkol.png" },
        { name: "kolonel", icon: "/images/pamen/kolonel.png" },
      ],
    },
    pama: {
      ranks: [
        { name: "letda", icon: "/images/pama/letda.png" },
        { name: "lettu", icon: "/images/pama/lettu.png" },
        { name: "kapten", icon: "/images/pama/kapten.png" },
      ],
    },
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${variable.totalSoldier}?category=rank`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      let formattedCards = [];

      if (categoryFilter === "all") {
        // Summary kategori: Pama, Pamen, Pati + Total Prajurit
        const pamaJumlah = data.kapten + data.lettu + data.letda;
        const pamenJumlah = data.mayor + data.letkol + data.kolonel;
        const patiJumlah = data.brigjen + data.mayjen + data.letjen + data.jenderal;
        const totalJumlah = Object.values(data).reduce((a, b) => a + b, 0);

        formattedCards = [
          {
            jumlah: pamaJumlah,
            label: "Letnan - Kapten",
            sub: "Jumlah Perwira Pertama",
            iconUrl: "/images/pama.png",
          },
          {
            jumlah: pamenJumlah,
            label: "Mayor - Kolonel",
            sub: "Jumlah Perwira Menengah",
            iconUrl: "/images/pamen.png",
          },
          {
            jumlah: patiJumlah,
            label: "Brigjen - Jenderal",
            sub: "Jumlah Perwira Tinggi",
            iconUrl: "/images/pati.png",
          },
          {
            jumlah: totalJumlah,
            label: "Total Prajurit",
            sub: "Seluruh Prajurit",
            iconUrl: "/images/tni.png",
          },
        ];
      } else if (categoryFilter in categoryMap) {
        // Detail per pangkat sesuai kategori
        const { ranks } = categoryMap[categoryFilter];
        ranks.forEach(({ name, icon }) => {
          if (name in data) {
            formattedCards.push({
              label: name.charAt(0).toUpperCase() + name.slice(1),
              jumlah: data[name],
              sub: `Jumlah ${name.charAt(0).toUpperCase() + name.slice(1)}`,
              iconUrl: icon,
            });
          }
        });
      } else {
        // Fallback: tampil semua pangkat default
        for (let key in data) {
          formattedCards.push({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            jumlah: data[key],
            sub: `Jumlah ${key.charAt(0).toUpperCase() + key.slice(1)}`,
            iconUrl: "/images/default.png",
          });
        }
      }

      setCards(formattedCards);
    } catch (error) {
      console.error("Error fetch cards:", error);
      setCards([
        {
          label: "Tidak ada pangkat",
          jumlah: 0,
          sub: "Terjadi kesalahan saat mengambil data",
          iconUrl: "/images/default.png",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [categoryFilter]);

  return <Cards cards={cards} loading={loading} />;
}
