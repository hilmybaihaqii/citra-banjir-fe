"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CloudRain,
  Save,
  History,
  MapPin,
  Clock,
  Droplets,
  AlertTriangle,
  Calendar,
  RefreshCw,
  Loader2, // Ditambahkan agar tidak error
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface RainfallFormProps {
  agencyType: "bbws" | "bmkg";
}

interface RainfallLog {
  pos: string;
  val: string;
  time: string;
  agency: string;
}

// Interface baru untuk menghindari 'any'
interface LogApiResponse {
  id: number;
  action: string;
  description: string;
  createdAt: string;
  user: {
    agency: string;
  } | null;
}

export default function RainfallForm({ agencyType }: RainfallFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<RainfallLog[]>([]);

  const [formData, setFormData] = useState({
    lokasi: "",
    intensitas: "",
    status: "Normal",
    keterangan: "",
    tanggal: new Date().toISOString().split("T")[0],
    jam: new Date().toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const fetchRainfallHistory = useCallback(async () => {
    try {
      const res = await apiFetch(
        "https://sicitra-banjir.onrender.com/api/logs",
      );
      const result = await res.json();
      if (res.ok && result.success) {
        // Mapping tanpa menggunakan 'any'
        const mappedLogs = result.data
          .filter((log: LogApiResponse) => log.action === "UPDATE")
          .slice(0, 5)
          .map((log: LogApiResponse) => ({
            pos: log.description.split(":")[0] || "Wilayah",
            val: log.description.includes("mm")
              ? log.description.split("Intensitas ")[1]?.split(" mm")[0] + " mm"
              : "Updated",
            time: new Date(log.createdAt).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            agency: log.user?.agency || "SISTEM",
          }));
        setHistoryLogs(mappedLogs);
      }
    } catch {
      console.error("Gagal mengambil riwayat curah hujan");
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchRainfallHistory();
  }, [fetchRainfallHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        action: "UPDATE",
        description: `${formData.lokasi}: Intensitas ${formData.intensitas} mm/hr - Status ${formData.status}`,
      };

      const res = await apiFetch(
        "https://sicitra-banjir.onrender.com/api/logs",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        setSuccess(true);
        await fetchRainfallHistory();
        setFormData({
          ...formData,
          lokasi: "",
          intensitas: "",
          status: "Normal",
          keterangan: "",
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      // Menghapus variabel 'error' yang tidak terpakai
      alert("Gagal menyimpan data ke server.");
    } finally {
      setLoading(false);
    }
  };

  const accentColor = "bg-blue-950";
  const buttonColor = "bg-blue-950 hover:bg-slate-900 text-white";

  if (!isMounted) return null;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-6 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Form Input Curah Hujan
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 italic">
            Instansi:{" "}
            <span className="text-blue-600 font-bold">
              {agencyType === "bmkg" ? "BMKG Jawa Barat" : "BBWS Citarum"}
            </span>
          </p>
        </div>
        <button
          onClick={fetchRainfallHistory}
          className="p-2 text-slate-400 hover:text-blue-950 transition-colors"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-3 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center gap-3 mx-2"
          >
            <CheckCircleIcon size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Data Berhasil Disinkronkan ke Server
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 px-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-slate-200 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-blue-950">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} className="text-amber-500" /> Lokasi Pos
                </label>
                <select
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-950"
                  value={formData.lokasi}
                  onChange={(e) =>
                    setFormData({ ...formData, lokasi: e.target.value })
                  }
                >
                  <option value="">Pilih Pos Pengamatan...</option>
                  <option value="Cisanti">Hulu Cisanti</option>
                  <option value="Majalaya">Pos Majalaya</option>
                  <option value="Dayeuhkolot">Pos Dayeuhkolot</option>
                  <option value="Nanjung">Pos Nanjung</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Droplets size={12} className="text-blue-500" /> Intensitas
                  (mm/hr)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="15.5"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-950"
                  value={formData.intensitas}
                  onChange={(e) =>
                    setFormData({ ...formData, intensitas: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} className="text-amber-500" /> Tanggal
                </label>
                <input
                  type="date"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-950"
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} className="text-amber-500" /> Jam
                </label>
                <input
                  type="time"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-950"
                  value={formData.jam}
                  onChange={(e) =>
                    setFormData({ ...formData, jam: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={12} className="text-red-500" /> Status
                Siaga
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Normal", "Waspada", "Siaga"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`p-2.5 text-[9px] font-black uppercase border rounded-lg transition-all ${formData.status === s ? `${accentColor} text-white border-transparent shadow-md` : "bg-white text-blue-950 border-slate-200 hover:border-blue-950"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-blue-950">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-950">
                Keterangan
              </label>
              <textarea
                rows={3}
                placeholder="Kondisi lapangan..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-950"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${buttonColor} font-black uppercase text-[10px] tracking-[0.2em] py-3.5 rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all`}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Save size={14} /> Simpan Data
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-4 px-2">
          <div className="bg-blue-950 p-5 text-white rounded-2xl shadow-xl border-l-4 border-amber-400 h-fit">
            <h4 className="text-[9px] text-amber-400 font-bold uppercase mb-4 flex items-center gap-2 tracking-[0.2em]">
              <History size={12} /> Riwayat Live
            </h4>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {historyLogs.length > 0 ? (
                  historyLogs.map((item, i) => (
                    <motion.div
                      key={`${item.pos}-${i}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold uppercase">
                          {item.pos}
                        </p>
                        <span className="text-[7px] bg-white/10 px-1 py-0.5 rounded text-amber-400 font-bold">
                          {item.agency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center opacity-60">
                        <span className="text-[9px] italic">{item.val}</span>
                        <span className="text-[8px] flex items-center gap-1">
                          <Clock size={8} /> {item.time} WIB
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic">
                    Belum ada riwayat terbaru.
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="p-4 bg-blue-100/30 rounded-xl border border-blue-100 flex items-start gap-3">
            <CloudRain className="text-blue-600 shrink-0" size={16} />
            <p className="text-[9px] font-bold text-blue-900 uppercase leading-relaxed">
              Data input otomatis tersinkron ke riwayat live sistem pusat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const CheckCircleIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
