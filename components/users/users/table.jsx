"use client";

import { useState, useRef, useEffect } from "react";
import { User, ShieldUser } from "lucide-react";
import { createPortal } from "react-dom";

export default function UserTableBody({
  users,
  isLoading,
  selectedUser,
  handleSelectUser,
  handleEdit,
  handleDelete,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const tableRef = useRef(null);

  // Tutup dropdown saat scroll
  useEffect(() => {
    const handleScroll = () => {
      setMenuOpenId(null);
      setMenuPos(null);
    };

    const el = tableRef.current;
    el?.addEventListener("scroll", handleScroll);

    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pr-4 pt-4 h-[350px] bg-white shadow-lg rounded-lg mt-4">
      <div
        ref={tableRef}
        className="overflow-y-scroll h-[300px] overflow-x-auto"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white sticky top-0 z-10">
              <th className="px-4 py-3 text-xs text-gray-700 border-b">User</th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b">Email</th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b">Role</th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b">
                Created
              </th>
              <th className="px-4 py-3 text-xs text-gray-700 border-b" />
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-[var(--armycolor)]" />
                  </div>
                  <p className="mt-3 text-gray-500 font-medium">
                    Memuat data user...
                  </p>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => {
                const isSelected = selectedUser?.id === user.id;

                return (
                  <tr
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`border-t border-gray-200 hover:bg-gray-50 transition
                      ${
                        isSelected
                          ? "border-l-4 border-l-[var(--armycolor)]"
                          : "border-gray-300"
                      }`}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-[var(--armycolor)]/20 flex items-center justify-center text-[var(--armycolor)] font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-4">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-500">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 w-[90px] justify-center rounded-full text-xs font-semibold
                          ${
                            user.role?.toLowerCase() === "admin"
                              ? "bg-[var(--armycolor)]/20 text-[var(--armycolor)]"
                              : "bg-[var(--armycolor)] text-white"
                          }`}
                      >
                        {user.role?.toLowerCase() === "admin" ? (
                          <>
                            <ShieldUser size={14} /> Admin
                          </>
                        ) : (
                          <>
                            <User size={14} /> User
                          </>
                        )}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 text-center text-gray-500">
                      {new Date(
                        user.createdAt || Date.now()
                      ).toLocaleDateString("id-ID")}
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          if (menuOpenId === user.id) {
                            setMenuOpenId(null);
                            setMenuPos(null);
                            return;
                          }

                          const rect =
                            e.currentTarget.getBoundingClientRect();

                          setMenuOpenId(user.id);
                          setMenuPos({
                            top: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX,
                          });
                        }}
                        className="px-2 py-1 rounded-full hover:bg-gray-100"
                      >
                        ⋮
                      </button>

                      {menuOpenId === user.id &&
                        menuPos &&
                        createPortal(
                          <div
                            style={{
                              position: "absolute",
                              top: menuPos.top,
                              left: menuPos.left,
                              zIndex: 99999,
                              background: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.5rem",
                              width: "8rem",
                              boxShadow:
                                "0 4px 10px rgba(0,0,0,0.1)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                handleEdit(user);
                                setMenuOpenId(null);
                                setMenuPos(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-[var(--armycolor)] hover:bg-[var(--armycolor)]/10"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(user);
                                setMenuOpenId(null);
                                setMenuPos(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            >
                              Hapus
                            </button>
                          </div>,
                          document.body
                        )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Tidak ada data user sesuai filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
