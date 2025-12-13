"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
  options = [],
  selected,
  onSelect,
  placeholder = "Pilih",
  className = "w-[140px]",
  bgColor = "gray-50",
  isOpen: externalIsOpen,
  onToggle,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof externalIsOpen === "boolean" && typeof onToggle === "function";
  const isOpen = isControlled ? externalIsOpen : internalOpen;

  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    // close dropdown on Escape
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (isControlled) onToggle(false);
        else setInternalOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isControlled, onToggle]);

  const toggle = (e) => {
    if (e) e.stopPropagation();
    if (isControlled) onToggle(!externalIsOpen);
    else setInternalOpen((s) => !s);
  };

  const handleSelect = (option) => {
    onSelect?.(option);
    if (isControlled) onToggle(false);
    else setInternalOpen(false);
  };

  useEffect(() => {
    if (isOpen && buttonRef.current && panelRef.current) {
      const btnW = buttonRef.current.offsetWidth;
      panelRef.current.style.minWidth = `${btnW}px`;
      panelRef.current.querySelectorAll("div").forEach((el) => {
        el.style.whiteSpace = "nowrap";
      });
    }
  }, [isOpen]);

  return (
    <div className={`inline-block relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={toggle}
        className={`flex items-center justify-between px-3 py-2 bg-${bgColor} border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-100 transition-all duration-150 whitespace-nowrap w-full`}
        type="button"
      >
        {selected?.label || selected || placeholder}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div ref={panelRef} className="absolute left-0 z-50 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {options.map((option, index) => {
            const label = typeof option === "object" ? option.label : option;
            const value = typeof option === "object" ? option.value : option;
            const isSelected = (selected && (selected.value === value || selected === value));

            return (
              <div
                key={index}
                className={`px-3 py-2 cursor-pointer hover:bg-green-50 transition-colors duration-150 text-sm ${isSelected ? "bg-[var(--armyhover)] font-medium text-[var(--background)]" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(value);
                }}
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
