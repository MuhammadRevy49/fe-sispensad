"use client";

import { useState } from "react";
import EmailOtpForm from "@/components/authentikasi/otpForm";
import UpdatePasswordForm from "@/components/authentikasi/resetPassword";

export default function LupaPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerifiedToken, setOtpVerifiedToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg flex flex-col space-y-4">
        {step === 1 && (
          <EmailOtpForm
            email={email}
            setEmail={setEmail}
            otp={otp}
            setOtp={setOtp}
            loading={loading}
            error={error}
            setError={setError}
            setLoading={setLoading}
            setStep={setStep}
            setOtpVerifiedToken={setOtpVerifiedToken}
            setUserId={setUserId}
          />
        )}

        {step === 2 && (
          <UpdatePasswordForm
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            loading={loading}
            error={error}
            setError={setError}
            setLoading={setLoading}
            setStep={setStep}
            otpVerifiedToken={otpVerifiedToken}
            userId={userId}
            setEmail={setEmail}
            setOtp={setOtp}
            setOtpVerifiedToken={setOtpVerifiedToken}
          />
        )}
      </div>
    </div>
  );
}