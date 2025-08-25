"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { user } from "@/data/user"; // import data dummy Anda

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const foundUser = user.find(
        (u) => u.username === usernameOrEmail || u.email === usernameOrEmail
      );

      if (!foundUser) {
        setError("Maaf, username/email tidak ditemukan!");
      } else if (foundUser.password !== password) {
        setError("Maaf, password salah!");
      } else {
        // login sukses
        localStorage.setItem("user", JSON.stringify(foundUser));
        router.push("/");
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg flex flex-col space-y-4"
      >
        <div className="flex justify-center select-none">
          <img src="/images/logo1.png" className="h-18" />
        </div>

        {/* Username */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Username / Email</p>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="Masukkan username atau email"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <p className="text-sm font-medium text-gray-700 mb-1">Password</p>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all pr-10"
            placeholder="Masukkan password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Tombol Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[var(--armycolor)] text-white font-semibold rounded-lg shadow hover:opacity-80 disabled:opacity-50 transition-all flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* Link Lupa Password */}
        <a href="#" className="text-left text-sm text-gray-700 hover:underline">
          Lupa password ?
        </a>
      </form>
    </div>
  );
}
