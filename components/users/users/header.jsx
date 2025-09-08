"use client";

import {SearchInput, Dropdown} from "@/components/reusable/search";
import Button from "@/components/reusable/button";

export default function UserHeader({ roleFilter, setRoleFilter, searchTerm, setSearchTerm }) {
  const roleOptions = [
    { value: "all", label: "All Role" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-2 bg-white rounded-[8px] shadow-sm">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama atau email..."
        />

        <Dropdown
          options={roleOptions}
          value={roleFilter}
          onChange={setRoleFilter}
          placeholder="Semua Role"
        />
      </div>

      {/* Add Button */}
      <div className="flex justify-end mt-3 sm:mt-0">
        <Button
          variant="primary"
          onClick={() => (window.location.href = "/auth/registrasi")}
        >
          Tambah Pengguna
        </Button>
      </div>
    </div>
  );
}
