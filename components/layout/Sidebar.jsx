"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, Users, UserCog, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./Navbar";
import { variable } from "@/lib/variable";

export default function Sidebar({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Daftar path yang MENAMPILKAN sidebar
  const sidebarPaths = [
    "/",
    "/perwira/pama",
    "/perwira/pamen",
    "/perwira/pati",
    "/warakawuri",
    "/users",
    "/perwira",
  ];

  // Sidebar hanya tampil jika path termasuk sidebarPaths
  const showSidebar = pathname && sidebarPaths.includes(pathname);

  // Fetch user jika sidebar ditampilkan
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.getMe}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Jika path bukan sidebarPaths, langsung render children
  if (!showSidebar) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Dashboard", icon: <Home />, href: "/" },
    {
      name: "Data Perwira",
      icon: <Users />,
      isDropdown: true,
      subMenu: [
        { name: "Keseleruhan Perwira", href: "/perwira?category=all" },
        { name: "Perwira Pertama", href: "/perwira?category=pama" },
        { name: "Perwira Menengah", href: "/perwira?category=pamen" },
        { name: "Perwira Tinggi", href: "/perwira?category=pati" },
      ],
    },
    {
      name: "Data Warakawuri",
      icon: <Users />,
      isDropdown: true,
      subMenu: [{ name: "Warakawuri", href: "/warakawuri" }],
    },
    { name: "Users", icon: <UserCog />, href: "/users" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-[var(--armycolor)] shadow-xl flex-col transition-all duration-300 overflow-hidden hidden md:flex
          ${isSidebarOpen ? "w-57" : "w-20"}`}
      >
        <div className="flex items-center justify-center p-2 mt-4">
          <img src="/images/logo1.png" alt="Logo" className="h-16" />
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.isDropdown) {
              const isOpen = openDropdown === item.name;
              return (
                <div key={item.name}>
                  <div
                    className={`flex items-center justify-between px-4 py-2 text-white rounded-lg transition whitespace-nowrap
                      ${isOpen ? "bg-[var(--armyhover)]" : "bg-[var(--armycolor)] hover:bg-[var(--armyhover)]"}`}
                  >
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className="text-lg">{item.icon}</span>
                      {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                    </button>

                    {isSidebarOpen && (
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                        className="p-1 rounded hover:opacity-70"
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>

                  {isOpen && isSidebarOpen && (
                    <div className="space-y-1 mt-1 rounded-lg">
                      {item.subMenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          prefetch={false}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                            ${pathname === sub.href ? "bg-[var(--armycolor)] text-white" : "text-white/90 hover:bg-[var(--armyhover)]"}`}
                        >
                          <span className="font-medium">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                  ${pathname === item.href ? "bg-white text-[var(--armycolor)] shadow-lg" : "bg-[var(--armycolor)] text-white hover:bg-[var(--armyhover)]"}`}
              >
                <span className="text-lg">{item.icon}</span>
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Navbar user={user} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="p-4 overflow-x-hidden bg-gray-50 flex-1 md:pb-6 pb-[64px]">
          {children}
        </main>
      </div>
    </div>
  );
}
