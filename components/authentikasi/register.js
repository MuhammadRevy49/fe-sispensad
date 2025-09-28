"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Button from "../reusable/button";
import { variable } from "@/lib/variable";
import RequireAdmin from "@/lib/checkAdmin";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}` + variable.register,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: isAdmin ? "ADMIN" : "USER",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registrasi gagal!");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan, coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAdmin>
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg flex flex-col space-y-4"
        >
          <div className="flex justify-center select-none">
            <Image
              src="/images/logo1.png"
              alt="logo"
              width={72}
              height={72}
              className="h-20 w-auto"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--foreground)] mb-1">
              Username
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] transition-all"
              placeholder="Masukkan name"
              required
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--foreground)] mb-1">
              Email
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] transition-all"
              placeholder="Masukkan email"
              required
            />
          </div>

          <div className="relative">
            <p className="text-sm font-medium text-[var(--foreground)] mb-1">
              Password
            </p>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] transition-all pr-10"
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-[var(--textgray)] focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <p className="text-sm font-medium text-[var(--foreground)] mb-1">
              Konfirmasi Password
            </p>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] transition-all pr-10"
              placeholder="Masukkan ulang password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-[var(--textgray)] focus:outline-none"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Checkbox Admin */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 text-[var(--armycolor)] border-gray-300 rounded"
            />
            <label htmlFor="admin" className="text-sm text-[var(--foreground)]">
              Jadikan admin
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" loading={loading}>
            Register
          </Button>

          <a
            href="/auth/login"
            className="text-[var(--armycolor)] hover:underline text-sm text-center"
          >
            Sudah punya akun? Login
          </a>
        </form>
      </div>
    </RequireAdmin>
  );
}
