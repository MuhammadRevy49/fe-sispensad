'use client';

import { useState } from "react";
import Cards from "@/components/dashboard/card";
import Dropdown from "@/components/reusable/dropdown";
import { Download, Upload, Plus } from "lucide-react";
import Table from "@/components/reusable/table";

export default function Pama() {
    // Ini Data Dummy Pama
    const data = [
        {
            jumlah: 33,
            label: "Letda",
            sub: "Jumlah Letnan Dua - Letda",
            iconUrl: "/images/pama.png"
        },
        {
            jumlah: 43,
            label: "Lettu",
            sub: "Jumlah Letnan Satu - Lettu",
            iconUrl: "/images/pama.png"
        },
        {
            jumlah: 53,
            label: "Kapten",
            sub: "Jumlah Kapten",
            iconUrl: "/images/pama.png"
        },
    ];

    // table
    const columns = [
        { header: "No", accessor: "no" },
        { header: "Nama Prajurit", accessor: "nama" },
        { header: "Pangkat", accessor: "pangkat" },
        { header: "NRP", accessor: "nrp" },
        { header: "Tanggal Lahir", accessor: "tglLahir" },
        { header: "Tanggal Mulai Dinas", accessor: "tglDinas" },
        { header: "Korps", accessor: "korps" },
        { header: "Jabatan", accessor: "jabatan" },
        { header: "Tempat Dinas", accessor: "tempatDinas" },
        { header: "Action", accessor: "action" },
    ];

    const dataTable = [
        {
            no: 1,
            nama: "Jacob Jhone Pati",
            pangkat: "Kapten",
            nrp: "1900026591265",
            tglLahir: "21 Januari 1982",
            tglDinas: "21 Januari 2005",
            korps: "Infanteri (Inf)",
            jabatan: "Kasubdit Renmas",
            tempatDinas: "Kodam III / Sil"
        },
        {
            no: 2,
            nama: "Kathryn Murphy Pati",
            pangkat: "Letda",
            nrp: "1900013050567",
            tglLahir: "30 Februari 1981",
            tglDinas: "30 Februari 2007",
            korps: "Infanteri (Inf)",
            jabatan: "Danramil 13",
            tempatDinas: "Kodam I / Sil"
        },
    ];

    return (
        <div>
            <div className="mb-3">
                <div className="mb-3">
                    <p className="text-gray-800">Data Perwira Tinggi - PATI</p>
                    <p className="text-gray-400 text-sm">Sistem Pensiun Angkatan Darat</p>
                </div>
                <Cards cards={data} />
            </div>
            <div className="flex gap-3 mb-3 justify-between">
                <div className="flex items-center gap-3">
                    <input className="text-sm p-2 bg-white border border-gray-300 rounded-lg w-80" type="text" placeholder="Masukkan Nama Perwira / NRP" />
                    <Dropdown />
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-sm p-2 border-1 border-green-800 text-green-800 rounded-lg flex items-center hover:opacity-50 hover:cursor-pointer transition-all">
                        <Download size={18} className="mr-1" />
                        Import
                    </button>
                    <button className="text-sm p-2 border-1 border-gren-800 text-green-800 rounded-lg flex items-center hover:opacity-50 hover:cursor-pointer transition-all">
                        <Upload size={18} className="mr-1" />
                        Export
                    </button>
                    <button className="text-sm p-2 bg-[var(--armycolor)] text-white rounded-lg flex items-center hover:opacity-50 hover:cursor-pointer transition-all">
                        <Plus size={18} className="mr-1" />
                        Tambahkan Data
                    </button>
                </div>
            </div>
            <div>
                <Table columns={columns} data={dataTable}/>
            </div>
        </div>
    );
}