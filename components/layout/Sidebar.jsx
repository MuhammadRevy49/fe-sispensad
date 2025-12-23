"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Settings,
  UserCog,
} from "lucide-react";
import Navbar from "./Navbar";
import { variable } from "@/lib/variable";

export default function Sidebar({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const sidebarPaths = [
    "/perwira",
    "/peninjauan",
    "/perhitungan",
    "/generate_skep",
    "/pengaturan",
    "/users",
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
        localStorage.setItem("role", data.user.role);
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
    { name: "Dashboard", icon: <LayoutGrid />, href: "/", roles: ["admin", "user"] },
    { name: "Data Perwira", icon: <Users />, href: "/perwira", roles: ["admin", "user"] },
    { name: "User Management", icon: <UserCog />, href: "/users", roles: ["admin"] },
    { name: "Pengaturan", icon: <Settings />, href: "/pengaturan", roles: ["admin", "user"] },
  ];

  const userRole = user?.role?.toLowerCase();
  const filteredMenu = mainMenu.filter(
    (item) => item.roles.includes(userRole)
  );

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
              Sispens<span className="text-yellow-400">AD</span>
            </span>
          </div>

          {/* Menu Utama */}
          <nav className="flex flex-col flex-1 p-3 space-y-2 text-white">
            {filteredMenu.map((item) => {
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
