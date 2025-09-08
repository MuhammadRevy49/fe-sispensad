"use client";

import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  loading = false,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-2 px-3 rounded-lg text-white bg-[var(--armycolor)] 
        shadow hover:bg-[var(--armyhover)] disabled:opacity-50 transition-all flex items-center justify-center
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
