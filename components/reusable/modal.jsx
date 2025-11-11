"use client";

import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  XCircle,
} from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Ya",
  confirmColor,
  type = "success", // success / warning / error / info / question
  onConfirm,
}) {
  if (!isOpen) return null;

  // Tentukan ikon dan warna default berdasarkan tipe
  let icon, defaultColor;
  switch (type) {
    case "success":
      icon = <CheckCircle size={72} className="text-green-500" />;
      defaultColor = "bg-green-500";
      break;
    case "warning":
      icon = <AlertCircle size={72} className="text-yellow-500" />;
      defaultColor = "bg-yellow-500";
      break;
    case "error":
      icon = <XCircle size={72} className="text-red-500" />;
      defaultColor = "bg-red-500";
      break;
    case "info":
      icon = <Info size={72} className="text-blue-500" />;
      defaultColor = "bg-blue-500";
      break;
    case "question":
      icon = <HelpCircle size={72} className="text-purple-500" />;
      defaultColor = "bg-purple-500";
      break;
    default:
      icon = <CheckCircle size={72} className="text-green-500" />;
      defaultColor = "bg-green-600";
      break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm relative">
        {/* Tombol X pojok kanan */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        {/* Icon */}
        <div className="flex justify-center mb-4">{icon}</div>

        {/* Judul */}
        <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>

        {/* Pesan */}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        {/* Tombol konfirmasi */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`px-6 py-2 rounded-lg text-white hover:opacity-90 ${
              confirmColor || defaultColor
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
