"use client";

import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Info, File, PlusCircle } from "lucide-react";
import PageTitle from "@/components/reusable/pageTitle";

const templates = [
  {
    id: "skep_pengantarpati",
    title: "Skep Pengantar Pati",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Pengantar Pati",
  },
  {
    id: "skep_anak1",
    title: "Skep Anak 1",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Anak 2",
  },
  {
    id: "skep_anak2",
    title: "Skep Anak 2",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Piagam",
  },
  {
    id: "skep_piagam",
    title: "Skep Piagam",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Tanpa Anak",
  },
  {
    id: "skep_tanpaanak",
    title: "Skep Tanpa Anak",
    image: "/images/skep_docs.jpeg",
    desc: "Surat Keputusan Tanpa Anak",
  },
];

export default function GenerateSKEPPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const template = searchParams.get("template");

  return (
    <div className="p-2 space-y-3">
      <PageTitle
        title="Generate Surat Keputusan (SKEP)"
        desc="Sistem Pensiun Angkatan Darat"
      />

      <div className="flex items-center gap-2 px-3 py-1 mt-6 rounded-full bg-green-100 shadow w-fit">
        <Info size={16} className="text-green-700" />
        <p className="text-green-700 text-sm">Pilih Template SKEP</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {templates.map((tpl) => (
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
