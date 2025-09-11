"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Generic Dropdown Component
 * @param {Array} options - array string, number, atau object {label, value}
 * @param {any} selected - item yang sedang dipilih
 * @param {Function} onSelect - callback saat pilih item
 * @param {String} placeholder - teks default
 * @param {String} className - tambahan class
 */
export default function Dropdown({ options = [], selected, onSelect, placeholder = "Pilih", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-[140px] ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[140px] flex justify-between items-center p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-100 transition-all duration-150"
      >
        {selected?.label || selected || placeholder}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {options.map((option, index) => {
            const label = typeof option === "object" ? option.label : option;
            const value = typeof option === "object" ? option.value : option;
            const isSelected = selected?.value === value || selected === value;

            return (
              <div
                key={index}
                className={`p-2 cursor-pointer hover:bg-green-50 transition-colors duration-150 text-sm ${
                  isSelected ? "bg-[var(--armyhover)] font-medium text-[var(--background)] hover:text-[var(--foreground)]" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
