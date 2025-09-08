"use client";

import { Pencil, Trash } from "lucide-react";

export default function Table({ columns, data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 divide-y divide-gray-300">
            {columns.map((col, idx) => (
              <th key={idx} className="px-3 py-3 text-xs text-gray-700 border-b border-gray-300">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-3 text-center text-gray-500 border-t border-gray-300"
              >
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-4 py-3 text-sm text-gray-700 border-t border-gray-300"
                  >
                    {col.accessor === "action" ? (
                      <div className="flex">
                        <button
                          onClick={() => onEdit(row)}
                          className="flex items-center px-1 py-1 text-xs rounded-l text-yellow-500 hover:opacity-50 transition-all hover:cursor-pointer"
                        >
                        <Pencil size={12} className="mr-1"/>
                        Edit
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          className="flex items-center px-2 py-1 text-xs rounded-r text-red-500 hover:opacity-50 transition-all hover:cursor-pointer"
                        >
                            <Trash size={12} className="mr-1"/>
                          Delete
                        </button>
                      </div>
                    ) : (
                      row[col.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
