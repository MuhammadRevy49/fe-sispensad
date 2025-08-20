"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Users, Tag, GraduationCap,
    ChevronDown, ChevronUp, LogOut,
    ChevronLeft, ChevronRight
} from "lucide-react";

export default function Sidebar({ children }) {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(null); // ganti jadi multi dropdown
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Halaman tanpa sidebar & bottom navbar
    const noSidebar = ["/login"];
    if (noSidebar.includes(pathname)) {
        return <>{children}</>;
    }

    const menuItems = [
        { name: "Dashboard", icon: <Home />, href: "/" },
        {
            name: "Data Perwira",
            icon: <Users />,
            isDropdown: true,
            subMenu: [
                { name: "Prospek", icon: <Users />, href: "/prospek" },
                { name: "Campaign", icon: <Tag />, href: "/campaign" },
                { name: "Anak Juara", icon: <GraduationCap />, href: "/anakjuara" },
            ]
        },
        {
            name: "Data Warakawuri",
            icon: <Users />,
            isDropdown: true,
            subMenu: [
                { name: "Prospek", icon: <Users />, href: "/warakawuri/prospek" },
                { name: "Campaign", icon: <Tag />, href: "/warakawuri/campaign" },
                { name: "Anak Juara", icon: <GraduationCap />, href: "/warakawuri/anakjuara" },
            ]
        },
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar hanya tampil di md ke atas */}
            <aside
                className={`bg-[var(--armycolor)] shadow-xl flex-col transition-all duration-300 overflow-hidden hidden md:flex
        ${isSidebarOpen ? "w-60" : "w-20"}`}
            >
                <div className="flex items-center justify-center p-2 mt-4">
                    {isSidebarOpen ? (
                        <img src="/images/logo1.png" alt="Logo" className="h-16" />
                    ) : (
                        <img src="/images/logo1.png" alt="Logo" className="h-16" />
                    )}
                </div>

                <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        if (item.isDropdown) {
                            const isOpen = openDropdown === item.name;
                            return (
                                <div key={item.name}>
                                    {/* Tombol dropdown utama */}
                                    <div
                                        className={`flex items-center justify-between px-4 py-2 text-white rounded-lg transition
                                        ${isOpen ? "bg-[var(--armyhover)] text-white" : "bg-[var(--armycolor)] hover:bg-[var(--armyhover)]"}`}
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenDropdown(isOpen ? null : item.name)
                                            }
                                            className="flex items-center gap-3 flex-1 text-left"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            {isSidebarOpen && (
                                                <span className="font-medium">{item.name}</span>
                                            )}
                                        </button>

                                        {isSidebarOpen && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenDropdown(isOpen ? null : item.name)
                                                }
                                                className="p-1 rounded hover:opacity-50"
                                                aria-label="Toggle submenu"
                                            >
                                                {isOpen ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Submenu */}
                                    {isOpen && isSidebarOpen && (
                                        <div className="space-y-2 mt-1 rounded-lg">
                                            {item.subMenu.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    prefetch={false}
                                                    className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg cursor-pointer transition
                                                    ${pathname === sub.href
                                                            ? "bg-green text-white"
                                                            : "bg-transparent hover:bg-[var(--armyhover)]"}`}
                                                >
                                                    <span className="text-lg text-white">{sub.icon}</span>
                                                    <span className="font-medium text-white">{sub.name}</span>
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
                                className={`flex items-center gap-3 px-4 py-2 text-white rounded-lg cursor-pointer transition
                                ${pathname === item.href
                                    ? "bg-[var(--armyhover)] text-white"
                                    : "bg-[var(--armycolor)] hover:bg-[var(--armyhover)]"}`}
                            >
                                <span className="text-lg text-white">{item.icon}</span>
                                {isSidebarOpen && (
                                    <span className="font-medium text-white">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-x-hidden">
                {/* Navbar atas selalu muncul */}
                <header className="flex items-center justify-between bg-white shadow-lg border-b border-gray-100 p-2">
                    <div className="flex flex-row">
                        {/* Tombol toggle hanya muncul kalau layar md ke atas */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden md:block hover:cursor-pointer"
                        >
                            {isSidebarOpen ? (
                                <ChevronLeft
                                    className="text-[var(--armycolor)]"
                                    size={24}
                                />
                            ) : (
                                <ChevronRight
                                    className="text-[var(--armycolor)]"
                                    size={24}
                                />
                            )}
                        </button>
                        <div className="ml-3">
                            <p className="font-bold text-[var(--armycolor)] text-lg">
                                Siti Maryam
                            </p>
                            <p className="text-gray-700 text-sm">01100830</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="w-10 h-10 rounded-full bg-[var(--armycolor)] text-white font-bold flex items-center justify-center">
                            M
                        </p>
                        <button className="p-2 rounded-full hover:bg-green-100 hover:cursor-pointer transition-all">
                            <LogOut className="text-gray-600" />
                        </button>
                    </div>
                </header>

                {/* Halaman dinamis */}
                <main className="p-4 overflow-x-hidden bg-gray-50 flex-1 md:pb-6 pb-[64px]">
                    {children}
                </main>

                {/* Bottom Navbar untuk mobile */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around py-3 px-3">
                    {menuItems.map((item) => {
                        if (item.isDropdown) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() =>
                                        setOpenDropdown(openDropdown === item.name ? null : item.name)
                                    }
                                    className={`flex flex-col items-center text-sm ${openDropdown === item.name
                                            ? "text-white"
                                            : "text-gray-500"}`}
                                >
                                    {item.icon}
                                    <span className="text-xs">{item.name}</span>
                                </button>
                            );
                        }
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                className={`flex flex-col items-center text-sm ${pathname === item.href
                                        ? "text-orange-600"
                                        : "text-gray-500"}`}
                            >
                                {item.icon}
                                <span className="text-xs">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
