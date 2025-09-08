"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Pilih Pangkat");
  const dropdownRef = useRef(null);

  const options = ["Letnan Dua", "Letnan Satu", "Kapten", "Semua Data"];

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-44">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm w-full flex items-center justify-between px-4 py-2 bg-[var(--armycolor)] text-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none"
      >
        <span>{selected}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                selected === option
                  ? "bg-gray-200 text-gray-900"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
