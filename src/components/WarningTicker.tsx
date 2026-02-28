"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, ChevronRight } from "lucide-react";

const PREDICTION_ALERTS = [
  { wilayah: "Dayeuhkolot", status: "Siaga 1", desc: "Potensi luapan sungai Citarum tinggi." },
  { wilayah: "Baleendah", status: "Siaga 1", desc: "Tinggi air diprediksi meningkat dalam 2 jam." },
  { wilayah: "Bojongsoang", status: "Waspada", desc: "Curah hujan intens terpantau." },
  { wilayah: "Majalaya", status: "Waspada", desc: "Waspada genangan di area cekungan." },
];

export const WarningTicker = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  const tickerItems = [...PREDICTION_ALERTS, ...PREDICTION_ALERTS, ...PREDICTION_ALERTS];

  return (
    <div className="fixed top-18 left-0 right-0 z-40 bg-white border-b border-slate-200 flex items-center h-10 overflow-hidden shadow-sm">
      <div className="relative z-20 flex items-center gap-2 bg-red-600 h-full px-4 md:px-6 shadow-[4px_0_15px_rgba(0,0,0,0.08)]">
        <AlertTriangle size={16} strokeWidth={2.5} className="text-white animate-pulse" />
        <span className="font-bold text-[10px] md:text-[11px] tracking-widest uppercase text-white hidden sm:block">
          Peringatan Dini
        </span>
        <span className="font-bold text-[10px] tracking-widest uppercase text-white sm:hidden">
          Info
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative flex items-center h-full bg-slate-50/50">
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="animate-ticker whitespace-nowrap flex items-center gap-8 px-4 hover:pause">
          {tickerItems.map((alert, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${alert.status.includes('Siaga') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {alert.status}
              </span>

              <span className="text-xs font-bold text-slate-800">
                {alert.wilayah}:
              </span>
              <span className="text-xs font-medium text-slate-600">
                {alert.desc}
              </span>
              <ChevronRight size={14} className="text-slate-300 ml-4" />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          display: inline-flex;
          /* KECEPATAN DIPERLAMBAT: Dari 35s menjadi 60s agar sangat mudah dibaca */
          animation: ticker 60s linear infinite;
        }
        /* Teks akan berhenti (pause) jika pengguna menahan mouse/jari di atasnya */
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};