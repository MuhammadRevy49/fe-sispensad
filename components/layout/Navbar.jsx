"use client";

import { ChevronsLeft, ChevronsRight, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar({ user, isSidebarOpen, setIsSidebarOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  function Avatar({ name }) {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--armycolor)] font-bold shrink-0 text-white text-lg">
        {initial}
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between bg-white shadow-lg border-b border-gray-100 p-2">
      <div className="flex flex-row">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:block hover:cursor-pointer"
        >
          {isSidebarOpen ? (
            <ChevronsLeft className="text-[var(--armycolor)]" size={24} />
          ) : (
            <ChevronsRight className="text-[var(--armycolor)]" size={24} />
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 mx-4 relative">
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-gray-500 self-end font-semibold">
                {user.role}
              </span>
            </div>
          )}

          {user && (
            <div className="relative">
              {/* Tombol Avatar + Chevron */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100 transition"
              >
                <Avatar name={user.name} />
                <ChevronDown
                  size={24}
                  className={`text-gray-600 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-30 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    <LogOut size={16} className="text-[var(--armycolor)]" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
