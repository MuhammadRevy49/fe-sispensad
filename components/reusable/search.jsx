"use client";

import { useId, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/* 🔍 SearchInput Component */
export function SearchInput({ value, onChange, placeholder = "Cari..." }) {
  const id = useId();

  return (
    <div className="relative flex-1 min-w-[200px]">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-[8px] 
                   focus:ring-1 focus:ring-[var(--armycolor)]/50 
                   focus:border-[var(--armycolor)] 
                   text-[var(--foreground)] bg-white shadow-sm transition duration-150 text-sm"
        value={value}
        onChange={onChange}
      />
      <svg
        className="w-5 h-5 absolute left-3 top-3 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

/* ⬇️ Dropdown Component */
export function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Pilih opsi",
  width = "w-[180px]",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${width} z-50`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-2 border border-gray-200 
                   rounded-[8px] text-[var(--foreground)] bg-white shadow-sm 
                   hover:bg-gray-50 transition-all duration-150 text-sm"
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 text-sm ">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-[var(--armycolor)]/10 cursor-pointer transition"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
