"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Button from "../reusable/button";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Login gagal!");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan, coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
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
            Username / Email
          </p>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)] transition-all"
            placeholder="Masukkan username atau email"
            required
          />
        </div>

        <div className="relative">
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">Password</p>
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" loading={loading}>
          Login
        </Button>
        <a
          href="/auth/lupa-password"
          className="text-[var(--armycolor)] hover:underline text-sm"
        >
          Lupa password ?
        </a>
      </form>
    </div>
  );
}
