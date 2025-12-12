"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  Calculator,
  FileText,
  Settings,
} from "lucide-react";
import Navbar from "./Navbar";
import { variable } from "@/lib/variable";

export default function Sidebar({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || null;

  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const sidebarPaths = [
    "/perwira",
    "/peninjauan",
    "/perhitungan",
    "/generate_skep",
    "/pengaturan",
  ];

  const showSidebar =
    pathname &&
    (pathname === "/" || sidebarPaths.some((p) => pathname.startsWith(p)));

  useEffect(() => {
    if (!showSidebar) {
      if (loading) setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      if (loading) setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${variable.getMe}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        router.replace("/auth/login");
      } finally {
        if (loading) setLoading(false);
      }
    };

    fetchUser();
  }, [pathname, router, showSidebar, loading]);

  // Menu utama: Data Perwira sekarang jadi menu tunggal tanpa submenu
  const mainMenu = [
    { name: "Dashboard", icon: <LayoutGrid />, href: "/" },
    { name: "Data Perwira", icon: <Users />, href: "/perwira" },
    { name: "Perhitungan", icon: <Calculator />, href: "/perhitungan" },
    { name: "Generate Skep", icon: <FileText />, href: "/generate_skep" },
  ];

  const bottomMenu = {
    name: "Pengaturan",
    icon: <Settings />,
    href: "/pengaturan",
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-x-auto">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`bg-[var(--armycolor)] shadow-xl flex-col justify-between transition-all duration-300 overflow-hidden hidden md:flex
          ${isSidebarOpen ? "w-60" : "w-20"}`}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center py-3 px-4 border-b border-gray-600/30">
            <img
              src="/images/logo1.png"
              alt="Logo"
              className="h-12 w-12 shrink-0"
            />
            <span
              className={`text-xl font-bold transition-opacity duration-300 whitespace-nowrap text-[var(--background)] ${
                isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              SispensAD
            </span>
          </div>

          {/* Menu Utama */}
          <nav className="flex flex-col flex-1 p-3 space-y-2 text-white">
            {mainMenu.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm
                    ${
                      isActive
                        ? "bg-[var(--armyhover)] text-[var(--background)]"
                        : "text-white hover:bg-[var(--armyhover)] hover:text-[var(--background)]"
                    }`}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <span
                    className={`font-normal transition-opacity duration-300 whitespace-nowrap ${
                      isSidebarOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Menu bawah */}
        <div className="p-3 border-t border-gray-600/30">
          <Link
            href={bottomMenu.href}
            prefetch={false}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm
              ${
                pathname === bottomMenu.href
                  ? "bg-[var(--armyhover)] text-[var(--background)]"
                  : "text-white hover:bg-[var(--armyhover)] hover:text-[var(--background)]"
              }`}
          >
            <span className="text-lg shrink-0">{bottomMenu.icon}</span>
            <span
              className={`font-normal transition-opacity duration-300 whitespace-nowrap ${
                isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {bottomMenu.name}
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Navbar
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="p-4 overflow-x-hidden bg-gray-50 flex-1 md:pb-6 pb-[64px]">
          {children}
        </main>
      </div>
    </div>
  );
}
