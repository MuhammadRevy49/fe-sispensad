"use client";

import { File } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Update locale Indonesia untuk relativeTime
dayjs.updateLocale("id", {
  relativeTime: {
    future: "dalam %s",
    past: "%s yang lalu",
    s: "beberapa detik",
    m: "1 menit",
    mm: "%d menit",
    h: "1 jam",
    hh: "%d jam",
    d: "1 hari",
    dd: "%d hari",
    M: "sebulan",
    MM: "%d bulan",
    y: "setahun",
    yy: "%d tahun",
  },
});

export default function Activities({ activities }) {
  // Set locale global ke Indonesia
  dayjs.locale("id");

  return (
    <div className="flex-1 bg-white shadow-lg p-4 rounded-xl border border-gray-100">
      <div className="flex items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <p className="text-lg font-semibold text-gray-800">Aktivitas dan Peninjauan</p>
          <p className="text-sm text-gray-500">Log aktivitas dan info peninjauan</p>
        </div>
      </div>

      <div className="flex flex-col max-h-[400px] overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 p-3 hover:bg-green-50 transition-colors duration-150 group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[var(--armycolor)] text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                {a.user?.name ? a.user.name.charAt(0).toUpperCase() : "?"}
              </div>

              {/* Konten */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {a.user?.name || "Unknown User"}
                </p>
                <p className="text-sm text-gray-600 truncate">{a.action}</p>
              </div>

              {/* Waktu */}
              <div className="text-xs text-gray-500 whitespace-nowrap py-1 px-2 rounded-full">
                {dayjs(a.createdAt).fromNow()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <File size={48} className="mx-auto mb-2 opacity-50" />
            <p>Tidak ada informasi.</p>
          </div>
        )}
      </div>
    </div>
  );
}