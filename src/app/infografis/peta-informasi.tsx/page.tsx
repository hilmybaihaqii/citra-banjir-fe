"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Map, Info } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

// Import komponen peta secara dinamis (Wajib untuk Leaflet di Next.js)
const MapInformasi = dynamic(() => import("@/components/infografis/MapInformasi"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900/10 rounded-md border border-blue-800/20">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-blue-950/60 text-sm font-medium animate-pulse uppercase tracking-widest">Memuat Peta...</p>
    </div>
  ),
});

export default function PetaInformasiPage() {
  return (
    // ReactLenis membungkus halaman untuk memberikan efek smooth scroll
    <ReactLenis root>
      <main className={`${outfit.variable} font-sans min-h-screen bg-[#F8FAFC] pt-28 pb-12 px-4 md:px-6`}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Halaman Minimalis */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-blue-900/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <Map size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Infografis Bencana</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight">
                Peta Informasi Banjir
              </h1>
              <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
                Pantauan visual interaktif untuk wilayah rawan genangan dan luapan aliran sungai. Gunakan kontrol di sudut kanan atas peta untuk mengubah tampilan ke mode satelit atau topografi.
              </p>
            </div>

            {/* Panel Info Ringkas */}
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-md border border-blue-100 max-w-sm">
              <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-900/80 leading-relaxed font-medium">
                Klik pada indikator wilayah (Dayeuhkolot, Baleendah, dll) untuk melihat detail status siaga terkini.
              </p>
            </div>
          </div>

          {/* Kontainer Peta */}
          <div className="w-full h-[65vh] min-h-125 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
             <MapInformasi />
          </div>

          {/* Footer/Catatan Tambahan di Bawah Peta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
             <div className="p-4 bg-white border border-gray-100 rounded-md shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Titik Pantau</h4>
                <p className="text-2xl font-black text-blue-950">6 <span className="text-sm font-medium text-gray-500">Kecamatan</span></p>
             </div>
             <div className="p-4 bg-white border border-gray-100 rounded-md shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sumber Data Base</h4>
                <p className="text-sm font-bold text-blue-950">Citra Satelit & Topografi (Esri / OpenTopo)</p>
             </div>
             <div className="p-4 bg-white border border-gray-100 rounded-md shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pembaruan Sistem</h4>
                <p className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Real-time (Aktif)
                </p>
             </div>
          </div>

        </div>
      </main>
    </ReactLenis>
  );
}