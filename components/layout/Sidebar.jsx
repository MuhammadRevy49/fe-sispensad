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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "./Navbar";
import { variable } from "@/lib/variable";

function CategoryDetector({ setCategory }) {
  const params = useSearchParams();
  const category = params.get("category");
  useEffect(() => {
    setCategory(category);
  }, [category, setCategory]);
  return null;
}

export default function Sidebar({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPerwiraOpen, setIsPerwiraOpen] = useState(false); // submenu state

  // Path yang pakai sidebar
  const sidebarPaths = [
    "/",
    "/perwira",
    "/peninjauan",
    "/perhitungan",
    "/generator",
    "/pengaturan",
  ];
  const showSidebar = pathname && sidebarPaths.some((p) => pathname.startsWith(p));

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

  // Auto expand Data Perwira jika route aktif
  useEffect(() => {
    if (pathname.startsWith("/perwira")) {
      setIsPerwiraOpen(true);
    }
  }, [pathname]);

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

  // Menu utama
  const mainMenu = [
    { name: "Dashboard", icon: <LayoutGrid />, href: "/" },
    {
      name: "Data Perwira",
      icon: <Users />,
      href: "/perwira",
      hasSubmenu: true,
      submenu: [
        { name: "Semua Perwira", href: "/perwira" },
        { name: "Perwira Pertama", href: "/perwira?category=pama" },
        { name: "Perwira Menengah", href: "/perwira?category=pamen" },
        { name: "Perwira Tinggi", href: "/perwira?category=pati" },
      ],
    },
    { name: "Peninjauan", icon: <ClipboardList />, href: "/peninjauan" },
    { name: "Perhitungan", icon: <Calculator />, href: "/perhitungan" },
    { name: "Generator", icon: <FileText />, href: "/generator" },
  ];

  const bottomMenu = { name: "Pengaturan", icon: <Settings />, href: "/pengaturan" };

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
            <img src="/images/logo1.png" alt="Logo" className="h-12 w-12 shrink-0" />
            <span
              className={`text-xl font-bold transition-opacity duration-300 whitespace-nowrap text-[var(--background)] ${
                isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              SispensAD
            </span>
          </div>

          <Suspense fallback={null}>
            <CategoryDetector setCategory={() => {}} />
          </Suspense>

          {/* Menu Utama */}
          <nav className="flex flex-col flex-1 p-3 space-y-2 text-white">
            {mainMenu.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              // Menu dengan submenu
              if (item.hasSubmenu) {
                const isSubActive = item.submenu.some((sub) =>
                  pathname.startsWith(sub.href)
                );

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsPerwiraOpen((prev) => !prev)}
                      className={`flex items-center justify-between w-full gap-3 px-4 py-2 rounded-lg transition text-sm
                        ${
                          isSubActive
                            ? "bg-[var(--armyhover)] text-[var(--background)]"
                            : "text-white hover:bg-[var(--armyhover)] hover:text-[var(--background)]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <span
                          className={`font-normal transition-opacity duration-300 whitespace-nowrap ${
                            isSidebarOpen ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      {isSidebarOpen && (
                        <span className="shrink-0">
                          {isPerwiraOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </button>

                    {/* Submenu (rata kiri dan hilang kalau sidebar tertutup) */}
                    <div
                      className={`mt-1 space-y-1 transition-all duration-300 overflow-hidden
                        ${
                          isPerwiraOpen && isSidebarOpen
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                    >
                      {item.submenu.map((sub) => {
                        const subActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            prefetch={false}
                            className={`flex items-center gap-3 px-4 py-1.5 rounded-md text-sm transition
                              ${
                                subActive
                                  ? "bg-[var(--armyhover)] text-[var(--background)]"
                                  : "text-white hover:bg-[var(--armyhover)] hover:text-[var(--background)]"
                              }`}
                          >
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Menu biasa
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
