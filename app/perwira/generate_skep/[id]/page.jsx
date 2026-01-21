"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Info, ArrowLeft, PlusCircle } from "lucide-react";
import PageTitle from "@/components/reusable/pageTitle";
import { variable } from "@/lib/variable";
import Link from "next/link";

const templates = [
  {
    id: "skep_pengantarpati",
    type: "fixed",
    title: "Skep Pengantar Pati",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Pengantar Pati",
  },
  {
    id: "skep_piagam",
    type: "fixed",
    title: "Skep Piagam",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Piagam",
  },
  {
    id: "skep_anak1",
    type: "anak",
    anakKe: 1,
    title: "Skep Anak 1",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Anak 1",
  },
  {
    id: "skep_anak2",
    type: "anak",
    anakKe: 2,
    title: "Skep Anak 2",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Anak 2",
  },
  {
    id: "skep_tanpaanak",
    type: "tanpa-anak",
    title: "Skep Tanpa Anak",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Tanpa Anak",
  },
];

export default function GenerateSKEPPage() {
  const router = useRouter();
  const { id } = useParams();
  const [jmlAnakPerwira, setJmlAnakPerwira] = useState("");
  const token = localStorage.getItem("token");

  // fetch data
  const fetchPerwira = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${variable.detailPersonil(id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error(`Gagal mengambil data (${res.status})`);
      }
  
      const json = await res.json();
      const payload = json.data ?? json;
  
      setJmlAnakPerwira(payload.jml_anak);
    } catch (err) {
      console.error(err);
    } finally {
      //
    }
  };

  // helper
  const getAvailableTemplates = () => {
    const jumlah = Number(jmlAnakPerwira);
    const fixedTemplates = templates.filter((t) => t.type === "fixed");

    if (jumlah === 0) {
      return [
        ...fixedTemplates,
        templates.find((t) => t.type === "tanpa-anak"),
      ].filter(Boolean);
    }

    if (jumlah === 1) {
      return [
        ...fixedTemplates,
        templates.find((t) => t.type === "anak" && t.anakKe === 1),
      ].filter(Boolean);
    }

    if (jumlah >= 2) {
      return [
        ...fixedTemplates,
        templates.find((t) => t.type === "anak" && t.anakKe === 2),
      ].filter(Boolean);
    }

    return fixedTemplates;
  };

  useEffect(() => {
    if (!id && !token) return;
    fetchPerwira();
  }, [id]);

  return (
    <div className="p-2 space-y-3">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Generate Surat Keputusan (SKEP)"
          desc="Sistem Pensiun Angkatan Darat"
        />
        <Link
            href="/perwira"
            className="px-5 py-2 mb-3 rounded-lg bg-[var(--armycolor)] text-sm text-white hover:bg-[var(--armyhover)] transition-all"
          >
            <ArrowLeft className="inline mr-2" size={16} />
            Kembali
        </Link>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 mt-6 rounded-full bg-green-100 shadow w-fit">
        <Info size={16} className="text-green-700" />
        <p className="text-green-700 text-sm">Pilih Template SKEP {jmlAnakPerwira}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {getAvailableTemplates().map((tpl) => (
          <div
            key={tpl.id}
            onClick={() =>
              router.push(`/perwira/generate_skep/${id}/skep_pati?template=${tpl.id}`)
            }
            className="text-white group bg-white rounded-xl shadow hover:shadow-lg hover:bg-gray-100 aspect-square transition cursor-pointer overflow-hidden hover:text-gray-500"
          >
            {/* TEXT */}
            <div className="p-3 text-center bg-green-800">
              <p className="text-sm text-white hover:text-white">
                {tpl.title}
              </p>
            </div>

            {/* IMAGE */}
            <div className="relative w-full h-63 bg-gray-100">
              <Image
                src={tpl.image}
                alt={tpl.title}
                fill
                className="object-cover object-top group-hover:scale-105 transition"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="p-2 flex flex-row items-center justify-center text-sm mt-2">
              <PlusCircle size={17} className="mr-1"/>
              Buat {tpl.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
