"use client";

import { useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import RequireAdminModal from "@/lib/checkAdmin";
import Button from "@/components/reusable/button";

export default function EditUserPage() {
  const params = useParams();
  const { id } = params;

  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil data user dari query params
  const [name, setName] = useState(searchParams.get("name") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isAdmin, setIsAdmin] = useState(searchParams.get("role") === "ADMIN");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");

    if (password && password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password: password || undefined,
          role: isAdmin ? "ADMIN" : "USER",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Gagal update user!");
        setLoading(false);
        return;
      }

      router.push("/users");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan, coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAdminModal>
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleEdit}
          className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg flex flex-col space-y-4"
        >
          <h2 className="text-xl font-semibold text-center">Edit User</h2>

          <InputField label="Username" value={name} onChange={(e) => setName(e.target.value)} required />
          <InputField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <PasswordField
            label="Password (kosongkan jika tidak diubah)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />
          <PasswordField
            label="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            show={showConfirm}
            toggleShow={() => setShowConfirm(!showConfirm)}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 text-[var(--armycolor)] border-gray-300 rounded"
            />
            <label className="text-sm text-[var(--foreground)]">Jadikan admin</label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" loading={loading}>
            Simpan Perubahan
          </Button>
        </form>
      </div>
    </RequireAdminModal>
  );
}

function InputField({ label, value, onChange, required }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--foreground)] mb-1">{label}</p>
      <input
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)]"
      />
    </div>
  );
}

function PasswordField({ label, value, onChange, show, toggleShow }) {
  return (
    <div className="relative">
      <p className="text-sm font-medium text-[var(--foreground)] mb-1">{label}</p>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] pr-10"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-[34px] text-gray-500 hover:text-[var(--textgray)]"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
