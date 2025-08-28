"use client";

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";

export default function Navbar({ user, isSidebarOpen, setIsSidebarOpen }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-lg border-b border-gray-100 p-2">
      <div className="flex flex-row">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:block hover:cursor-pointer"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="text-[var(--armycolor)]" size={24} />
          ) : (
            <ChevronRight className="text-[var(--armycolor)]" size={24} />
          )}
        </button>
        <div className="ml-3">
          <p className="font-bold text-[var(--armycolor)] text-lg">
            {user ? user.name : "Guest"}
          </p>
          <p className="text-[var(--textgray)] text-sm">
            {user ? user.role : "-"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="w-10 h-10 rounded-full bg-[var(--armycolor)] text-white font-bold flex items-center justify-center">
          {user ? user.name?.charAt(0).toUpperCase() : "?"}
        </p>
        <button
          onClick={handleLogout}
          className="hover:scale-105 transition-transform"
        >
          <LogOut className="text-[var(--textgray)]" />
        </button>
      </div>
    </header>
  );
}
