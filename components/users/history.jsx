"use client";

import { File } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

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

export default function UserHistory({ selectedUser, logs }) {
  dayjs.locale("id");

  return (
    <div className="w-full lg:w-96 bg-white shadow-lg rounded-[8px] border border-gray-100">
      {/* User Info */}
      {selectedUser ? (
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 h-20">
          <div className="w-10 h-10 rounded-full bg-[var(--armycolor)]/20 text-[var(--armycolor)] font-bold flex items-center justify-center shadow-sm">
            {selectedUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {selectedUser.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {selectedUser.email}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center border-b border-gray-200 p-4 h-20">
          <div className="p-2 rounded-lg mr-3 ">
            <File className="text-[var(--armycolor)]" size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">Aktivitas User</p>
            <p className="text-sm text-gray-500">Log aktivitas user</p>
          </div>
        </div>
      )}

      {/* Logs List */}
      <div className="flex-1 max-h-[400px] overflow-y-auto flex flex-col gap-3">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors duration-150 group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[var(--armycolor)] text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                {log.user?.name ? log.user.name.charAt(0).toUpperCase() : "?"}
              </div>

              {/* Konten */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {log.user?.name || "Unknown User"}
                </p>
                <p className="text-sm text-gray-600 truncate">{log.action}</p>
                {log.details && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {log.details}
                  </p>
                )}
              </div>

              {/* Waktu */}
              <div className="text-xs text-gray-500 whitespace-nowrap py-1 px-2 rounded-full">
                {dayjs(log.createdAt).fromNow()}
              </div>
            </div>
          ))
        ) : (
          <div className=" flex flex-col items-center justify-center pt-24 text-gray-400">
            <File size={48} className="mx-auto mb-2 opacity-50" />
            <p>
              {selectedUser
                ? "Tidak ada log untuk user ini"
                : "Pilih user untuk melihat log"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
