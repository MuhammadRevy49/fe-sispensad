"use client";

import { useState, useRef, useEffect } from "react";
import { User, ShieldUser } from "lucide-react";

export default function UserTableBody({ users, isLoading, selectedUser, handleSelectUser, handleEdit, handleDelete }) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const tableRef = useRef(null);

  // Tutup dropdown saat scroll
  useEffect(() => {
    function handleScroll() {
      setMenuOpenId(null);
    }
    tableRef.current?.addEventListener("scroll", handleScroll);
    return () => tableRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pr-4 pt-4 h-[350px] bg-white shadow-lg rounded-lg mt-5">
      <div className="overflow-y-scroll h-[300px] overflow-x-auto" ref={tableRef}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="divide-y divide-gray-300 sticky top-0 z-10">
              <th className="px-4 py-3 text-xs text-gray-700 border-b border-gray-300">User</th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b border-gray-300">Email</th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b border-gray-300">Role</th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b border-gray-300">Created</th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--armycolor)]"></div>
                  </div>
                  <p className="mt-3 text-[var(--textgray)] font-medium">Memuat data user...</p>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => {
                const isSelected = selectedUser?.id === user.id;

                return (
                  <tr
                    key={user.id}
                    className={`border-t border-gray-300 hover:bg-gray-50 transition-all duration-200 ${
                      isSelected ? "border-l-4 border-l-[var(--armycolor)]" : ""
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    {/* Kolom User + Inisial */}
                    <td className="px-4 py-3 cursor-pointer">
                      <div className="flex items-center overflow-x-auto">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--armycolor)]/20 to-[var(--armycolor)]/30 flex items-center justify-center text-[var(--armycolor)] font-bold text-lg shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4 whitespace-nowrap">{user.name}</div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 cursor-pointer text-[var(--textgray)]">{user.email}</td>

                    {/* Role */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 w-[80px] justify-center rounded-full text-xs font-semibold ${
                          user.role.toLowerCase() === "admin"
                            ? "bg-[var(--armycolor)]/20 text-[var(--armycolor)]"
                            : "bg-[var(--armycolor)] text-[var(--background)]"
                        }`}
                      >
                        {user.role.toLowerCase() === "admin" ? (
                          <div className="flex items-center"><ShieldUser className="w-4 h-4 mr-1" /> Admin</div>
                        ) : (
                          <div className="flex items-center"><User className="w-4 h-4 mr-1" /> User</div>
                        )}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 text-center text-[var(--textgray)]">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString("id-ID")}
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === user.id ? null : user.id);
                        }}
                        className="px-2 py-1 text-sm font-bold hover:bg-gray-100 rounded-full transition-colors"
                      >
                        ⋮
                      </button>

                      {menuOpenId === user.id && (
                        <div className="absolute z-50 right-8 top-8 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col w-32">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(user);
                              setMenuOpenId(null);
                            }}
                            className="px-4 py-2 text-sm text-[var(--armycolor)] hover:bg-[var(--armycolor)]/10 rounded-t-lg text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user);
                              setMenuOpenId(null);
                            }}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-b-lg text-left"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--textgray)]">
                  Tidak ada data user sesuai filter atau pencarian
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
