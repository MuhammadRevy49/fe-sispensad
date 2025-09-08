"use client";
import React, { useState, useEffect } from "react";

export default function Cards({ cards }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cards && cards.length > 0) {
      setLoading(false);
    }
  }, [cards]);

  const SkeletonCard = () => (
    <div className="flex-1 bg-white rounded-[8px] shadow p-3 animate-pulse">
      <div className="p-3 bg-gray-100 rounded-[5px] flex flex-row items-center gap-3">
        <div className="w-12 h-12 bg-gray-300 rounded-md" />
        <div className="flex-1">
          <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  if (loading || !cards || cards.length === 0) {
    return (
      <div className="flex md:flex-row flex-col justify-center gap-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col justify-center gap-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="flex-1 bg-white rounded-[8px] shadow p-3 hover:scale-95 transition-all"
        >
          <div className="p-3 bg-gray-100 shadow rounded-[5px] flex flex-row items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src={card.iconUrl}
                alt={card.label}
                className="w-8 h-auto object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {card.jumlah}
              </p>
              <p className="text-[var(--textgray)] text-sm">{card.label}</p>
            </div>
          </div>
          <div>
            <p className="text-sm p-3 text-[var(--foreground)]">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
