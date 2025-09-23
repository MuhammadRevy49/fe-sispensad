"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  LayoutGrid,
  Users,
  UserCog,
  ChevronDown,
  ChevronUp,
  Venus,
} from "lucide-react";
import Navbar from "./Navbar";
import { variable } from "@/lib/variable";

export default function Sidebar({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // cek apakah sidebar ditampilkan
  const sidebarPaths = ["/", "/perwira", "/warakawuri", "/users"];
  const showSidebar = pathname && sidebarPaths.includes(pathname);

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

  const currentCategory = searchParams.get("category");

  const menuItems = [
    { name: "Dashboard", icon: <LayoutGrid />, href: "/" },
    {
      name: "Data Perwira",
      icon: <Users />,
      isDropdown: true,
      subMenu: [
        {
          name: "Keseluruhan Perwira",
          href: "/perwira?category=all",
          category: "all",
        },
        {
          name: "Perwira Pertama",
          href: "/perwira?category=pama",
          category: "pama",
        },
        {
          name: "Perwira Menengah",
          href: "/perwira?category=pamen",
          category: "pamen",
        },
        {
          name: "Perwira Tinggi",
          href: "/perwira?category=pati",
          category: "pati",
        },
      ],
    },
    {
      name: "Data Warakawuri",
      icon: <Venus />,
      isDropdown: true,
      subMenu: [{ name: "Warakawuri", href: "/warakawuri" }],
    },
    { name: "Users", icon: <UserCog />, href: "/users" },
  ];

  return (
    <div className="flex h-screen overflow-x-auto">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`bg-[var(--background)] shadow-xl flex-col transition-all duration-300 overflow-hidden hidden md:flex
          ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Logo + Nama Aplikasi */}
        <div className="flex items-center py-3 px-4">
          <img
            src="/images/logo1.png"
            alt="Logo"
            className="h-12 w-12 shrink-0"
          />
          <span
            className={`text-xl font-bold transition-opacity duration-300 whitespace-nowrap ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            SispendAD
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-2 overflow-hidden">
          {menuItems.map((item) => {
            if (item.isDropdown) {
              const isOpen = openDropdown === item.name;

              // cek apakah ada subMenu aktif
              const isParentActive = item.subMenu.some((sub) => {
                return (
                  (pathname === "/perwira" &&
                    sub.category &&
                    currentCategory === sub.category) ||
                  pathname === sub.href
                );
              });

              return (
                <div key={item.name}>
                  <div
                    className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition whitespace-nowrap
            ${
              isParentActive
                ? "bg-[var(--armycolor)] text-[var(--background)]"
                : "hover:bg-[var(--armycolor)]/20 hover:text-[var(--armycolor)]"
            }`}
                  >
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <span
                        className={`font-medium transition-opacity duration-300 whitespace-nowrap ${
                          isSidebarOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>

                    {isSidebarOpen && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : item.name)
                        }
                        className="p-1 rounded hover:opacity-70"
                      >
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    )}
                  </div>

                  {isOpen && isSidebarOpen && (
                    <div className="space-y-1 mt-1 rounded-lg">
                      {item.subMenu.map((sub) => {
                        const isActive =
                          (pathname === "/perwira" &&
                            sub.category &&
                            currentCategory === sub.category) ||
                          pathname === sub.href;

                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            prefetch={false}
                            className={`flex ml-4 items-center gap-3 px-4 py-2 rounded-lg transition text-sm
                    ${
                      isActive
                        ? "bg-[var(--armycolor)] text-[var(--background)]"
                        : "hover:bg-[var(--armyhover)]/20 hover:text-[var(--armycolor)]"
                    }`}
                          >
                            <span className="font-medium whitespace-nowrap">
                              {sub.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // menu biasa
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm
        ${
          isActive
            ? "bg-[var(--armycolor)] text-[var(--background)]"
            : "hover:bg-[var(--armycolor)]/20 hover:text-[var(--armycolor)]"
        }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                <span
                  className={`font-medium transition-opacity duration-300 whitespace-nowrap ${
                    isSidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
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
