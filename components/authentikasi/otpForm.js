import { useState } from "react";
import Image from "next/image";
import Button from "../reusable/button";
import { variable } from "@/lib/variable";
export default function EmailOtpForm({
  email,
  setEmail,
  otp,
  setOtp,
  loading,
  error,
  setError,
  setLoading,
  setStep,
  setOtpVerifiedToken,
  setUserId,
}) {
  const [emailSent, setEmailSent] = useState(false);

  // Kirim OTP ke email
  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}`+ variable.otp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal kirim OTP");
      setEmailSent(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cek OTP
  const checkOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}`+ variable.otpVerify,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP salah");
      setOtpVerifiedToken(data.otpVerifiedToken);
      setUserId(data.userId);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center select-none">
        <Image
          src="/images/logo1.png"
          alt="logo"
          width={72}
          height={72}
          className="h-20 w-auto"
        />
      </div>

      {!emailSent ? (
        <>
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">Email</p>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)]"
          />
        </>
      ) : (
        <>
          <p className="text-sm text-[var(--foreground)] mb-4">
            Kode OTP telah dikirim ke <strong className="text-[var(--armycolor)]">{email}</strong>. Silakan periksa
            inbox atau folder spam Anda.
          </p>
          <input
            type="text"
            placeholder="Masukkan kode OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--armycolor)]"
          />
        </>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button onClick={emailSent ? checkOtp : sendOtp} disabled={loading}>
        {emailSent ? "Verifikasi OTP" : "Kirim OTP"}
      </Button>
      <div className="mt-2">
        <button
          onClick={() => {
            setOtp("");
            setError("");
            sendOtp();
          }}
          className="text-[var(--armycolor)] hover:underline text-sm"
        >
          Kirim ulang OTP
        </button>
      </div>
    </>
  );
}
