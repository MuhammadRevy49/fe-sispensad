"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Button from "../reusable/button";

export default function UpdatePasswordForm({
  newPassword,
  setNewPassword,
  loading,
  error,
  setError,
  setLoading,
  setStep,
  otpVerifiedToken,
  userId,
  setEmail,
  setOtp,
  setOtpVerifiedToken,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const updatePassword = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            otpVerifiedToken: `Bearer ${otpVerifiedToken}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal update password");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setOtpVerifiedToken("");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center select-none mb-4">
        <Image
          src="/images/logo1.png"
          alt="logo"
          width={72}
          height={72}
          className="h-20 w-auto"
        />
      </div>

      <div className="relative mb-4">
        <p className="text-sm font-medium text-[var(--foreground)] mb-1">
          Password
        </p>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] text-gray-500 hover:text-[var(--textgray)] focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <Button onClick={updatePassword} loading={loading} className="mb-2">
        Update Password
      </Button>

      <a
        href="/auth/login"
        className="text-[var(--armycolor)] hover:underline text-sm"
      >
        Login ulang?
      </a>
    </>
  );
}
