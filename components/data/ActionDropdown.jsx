
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function ActionDropdown({ open, anchorRef, actions = [], onClose }) {
  const [pos, setPos] = useState(null);
  const dropdownRef = useRef(null);

  // Update posisi saat open, anchorRef berubah, atau saat scroll
  useEffect(() => {
    function updatePos() {
      if (open && anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
      }
    }
    if (open) {
      updatePos();
      window.addEventListener("scroll", updatePos, true);
      window.addEventListener("resize", updatePos);
    }
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, anchorRef]);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        if (onClose) onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, anchorRef]);

  // Jangan render portal sebelum posisi didapat
  if (!open || !pos) return null;
  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        zIndex: 99999,
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "8rem",
        transition: "top 0.1s, left 0.1s"
      }}
      onClick={e => e.stopPropagation()}
    >
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={action.onClick}
          className={`px-4 py-2 text-sm w-full text-left ${action.color || "text-gray-700"} ${action.rounded || ""} ${action.hover || "hover:bg-gray-100"}`}
        >
          {action.label}
        </button>
      ))}
    </div>,
    document.body
  );
}
