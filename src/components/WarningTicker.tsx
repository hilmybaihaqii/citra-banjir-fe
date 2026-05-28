"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, ChevronRight, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TickerAlertItem {
  wilayah: string;
  status: string;
  desc: string;
}

interface BackendLogItem {
  id: string | number;
  tinggiMukaAir: string | number;
  wilayah?: {
    nama: string;
  };
  pos?: {
    nama: string;
  };
}

export const WarningTicker = () => {
  const pathname = usePathname();
  const [alerts, setAlerts] = useState<TickerAlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cleanFloat = (val: string | number | undefined): number => {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number") return val;
    const sanitized = val.replace(/,/g, ".");
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const fetchTickerData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/pemantauan-terpadu`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Gagal memuat log untuk ticker alert");

      const data = await res.json();
      const logsArray: BackendLogItem[] = Array.isArray(data)
        ? data
        : data.data || [];

      if (logsArray.length === 0) {
        setAlerts([]);
        return;
      }

      const activeAlerts: TickerAlertItem[] = logsArray.map((log) => {
        const tma = cleanFloat(log.tinggiMukaAir);
        const namaWilayah = log.wilayah?.nama || "Area Pantauan";
        const namaPos = log.pos?.nama || "Stasiun Hidrologi";

        let statusText = "Aman";
        let description = `Tinggi air di ${namaPos} terpantau normal. Kondisi kondusif.`;

        if (tma >= 0.57 && tma < 0.93) {
          statusText = "Waspada";
          description = `Kenaikan TMA di ${namaPos}. Waspada potensi genangan air.`;
        } else if (tma >= 0.93 && tma <= 1.3) {
          statusText = "Siaga 2";
          description = `Tinggi air di ${namaPos} kritis. Bersiap hadapi luapan air sungai.`;
        } else if (tma > 1.3) {
          statusText = "Awas / Siaga 1";
          description = `Status Darurat! Potensi luapan besar Sungai Citarum di wilayah ${namaWilayah}.`;
        }

        return {
          wilayah: namaWilayah,
          status: statusText,
          desc: description,
        };
      });

      setAlerts(activeAlerts);
    } catch (error) {
      console.error("Gagal sinkronisasi data warning ticker:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 30000);
    return () => clearInterval(interval);
  }, [fetchTickerData]);
  if (pathname?.startsWith("/dashboard")) return null;

  const tickerItems =
    alerts.length > 0 ? [...alerts, ...alerts, ...alerts, ...alerts] : [];

  if (!isLoading && tickerItems.length === 0) return null;

  return (
    <div className="fixed top-18 left-0 right-0 z-40 bg-white border-b border-slate-200 flex items-center h-10 overflow-hidden shadow-sm">
      <div className="relative z-20 flex items-center gap-2 bg-red-600 h-full px-4 md:px-6 shadow-[4px_0_15px_rgba(0,0,0,0.08)] shrink-0">
        <AlertTriangle
          size={16}
          strokeWidth={2.5}
          className="text-white animate-pulse"
        />
        <span className="font-bold text-[10px] md:text-[11px] tracking-widest uppercase text-white hidden sm:block">
          Peringatan Dini
        </span>
        <span className="font-bold text-[10px] tracking-widest uppercase text-white sm:hidden">
          Info
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative flex items-center h-full bg-slate-50/50">
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        {isLoading ? (
          <div className="flex items-center gap-2 px-4 text-slate-400 select-none">
            <Loader2 size={12} className="animate-spin text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Memuat Info Cuaca...
            </span>
          </div>
        ) : (
          <div className="animate-ticker whitespace-nowrap flex items-center gap-8 px-4 hover:pause">
            {tickerItems.map((alert, idx) => (
              <div key={idx} className="flex items-center gap-3 select-none">
                <span
                  className={`text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    alert.status.includes("Awas") ||
                    alert.status.includes("Siaga 1")
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : alert.status === "Aman"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  {alert.status}
                </span>

                <span className="text-xs font-black text-slate-800">
                  {alert.wilayah}:
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {alert.desc}
                </span>
                <ChevronRight
                  size={14}
                  className="text-slate-300 ml-4 shrink-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: inline-flex;
          animation: ticker 50s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />
    </div>
  );
};
