"use client";

import { useRouter } from "next/navigation";

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  confirmColor = "bg-[var(--armycolor)]",
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-white hover:opacity-90 ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
