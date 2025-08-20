"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg flex flex-col space-y-4">
                {/* Username */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Username / Email</p>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Masukkan username atau email"
                    />
                </div>

                {/* Password dengan icon eye */}
                <div className="relative">
                    <p className="text-sm font-medium text-gray-700 mb-1">Password</p>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all pr-10"
                        placeholder="Masukkan password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Tombol Login */}
                <button className="w-full py-2 bg-[var(--armycolor)] text-white font-semibold rounded-lg shadow hover:opacity-50 hover:cursor-pointer transition-all">
                    Login
                </button>

                {/* Link Lupa Password */}
                <a href="#" className="text-left text-sm text-gray-700 hover:underline">
                    Lupa password ?
                </a>
            </div>
        </div>
    );
}
