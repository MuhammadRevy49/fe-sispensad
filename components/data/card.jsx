"use client";

import { useState, useEffect } from "react";
import Cards from "@/components/reusable/card";
import { variable } from "@/lib/variable";

export default function CardsSection({ loading, setLoading }) {
  const [cards, setCards] = useState([]);

  // Hanya pangkat Pati (brigjen, letjen, mayjen, jenderal)
  const patiRanks = [
    { name: "brigjen", icon: "/images/perwira/brigjen.png" },
    { name: "letjen", icon: "/images/perwira/letjen.png" },
    { name: "mayjen", icon: "/images/perwira/mayjen.png" },
    { name: "jenderal", icon: "/images/perwira/jenderal.png" },
  ];

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

      const formattedCards = [];

      // Buat cards hanya untuk pangkat Pati
      patiRanks.forEach(({ name, icon }) => {
        const jumlah = typeof data[name] === "number" ? data[name] : 0;
        formattedCards.push({
          label: name.charAt(0).toUpperCase() + name.slice(1),
          jumlah,
          sub: `Jumlah ${name.charAt(0).toUpperCase() + name.slice(1)}`,
          iconUrl: icon,
        });
      });

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
  }, []);

  return <Cards cards={cards} loading={loading} />;
}
