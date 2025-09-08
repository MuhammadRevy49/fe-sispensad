"use client";

import { useEffect, useState } from "react";
import UserTableHeader from "@/components/users/users/header";
import UserTableBody from "@/components/users/users/table";
import UserHistory from "@/components/users/history";
import ConfirmModal from "@/components/reusable/modal";
import { useRouter } from "next/navigation";

function ConfirmDeleteModal({ isOpen, onClose, user, onConfirm }) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus User"
      message={`Apakah Anda yakin ingin menghapus user "${user?.name}"?`}
      confirmText="Hapus"
      cancelText="Batal"
      confirmColor="bg-red-600"
      onConfirm={() => onConfirm?.(user)}
    />
  );
}

function ConfirmEditModal({ isOpen, onClose, user, onConfirm }) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      message={`Apakah Anda yakin ingin mengedit data user "${user?.name}"?`}
      confirmText="Edit"
      cancelText="Batal"
      confirmColor="bg-[var(--armycolor)]"
      onConfirm={() => onConfirm?.(user)}
    />
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [logsAll, setLogsAll] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getMe`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();

         const currentUser = data.user; 
        if (currentUser.role !== "ADMIN") {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthorized(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/history`);
      const data = await res.json();
      setLogsAll(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (user) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Gagal menghapus user");
      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const editUser = (user) => {
    if (!user?.id) return;
    router.push(`/users/${user.id}/edit`);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    const filteredLogs = logsAll.filter((log) => log.user?.name === user.name);
    setLogs(filteredLogs);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchUsers(), fetchAllLogs()]);
    })();
  }, []);

  // 🚧 Tampilkan loading saat cek auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memeriksa otorisasi...</p>
      </div>
    );
  }

  // 🚫 Kalau unauthorized → modal keluar
  if (!isAuthorized) {
    return (
      <ConfirmModal
        isOpen={true}
        onClose={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        title="Akses Ditolak"
        message="Anda tidak memiliki izin untuk membuka halaman ini. Silakan login ulang dengan akun admin."
        confirmText="Login Ulang"
        cancelText="Tutup"
        confirmColor="bg-[var(--armycolor)]"
        onConfirm={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      />
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ? true : user.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-gray-50 px-1 pt-1 pb-5 overflow-y-hidden">
      <div className="mb-1">
        <h1 className="text-md font-semibold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm">
          Kelola pengguna dan lihat aktivitas mereka
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <UserTableHeader
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <UserTableBody
            users={filteredUsers}
            isLoading={isLoading}
            selectedUser={selectedUser}
            handleSelectUser={handleSelectUser}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
        <UserHistory selectedUser={selectedUser} logs={logs} />
      </div>

      {/* Modal Edit */}
      <ConfirmEditModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
        onConfirm={editUser}
      />

      {/* Modal Delete */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        user={selectedUser}
        onConfirm={deleteUser}
      />
    </div>
  );
}
