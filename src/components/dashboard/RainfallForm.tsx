"use client";

import React, { useState } from "react";
import {
  CloudRain,
  ArrowLeft,
  Save,
  History,
  MapPin,
  Clock,
  Droplets,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

interface RainfallFormProps {
  agencyType: "bbws" | "bmkg";
}

export default function RainfallForm({ agencyType }: RainfallFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Data awal untuk simulasi Riwayat Live
  const [historyLogs, setHistoryLogs] = useState([
    { pos: "Nanjung", val: "22 mm", time: "10:15", agency: "BMKG" },
    { pos: "Dayeuhkolot", val: "18 mm", time: "09:30", agency: "BBWS" },
  ]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi pengiriman data
    setTimeout(() => {
      // 1. Buat data baru dari Form untuk dimasukkan ke Riwayat
      const newLog = {
        pos: formData.lokasi,
        val: `${formData.intensitas} mm`,
        time: formData.jam,
        agency: agencyType.toUpperCase(),
      };

      // 2. Update State Riwayat (Data baru ditaruh di paling atas)
      setHistoryLogs([newLog, ...historyLogs]);

      setLoading(false);
      setSuccess(true);

      // Reset form setelah simpan
      setFormData({
        ...formData,
        lokasi: "",
        intensitas: "",
        status: "Normal",
        keterangan: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const backPath =
    agencyType === "bbws" ? "/dashboard/bbws" : "/dashboard/bmkg";
  const accentColor = agencyType === "bbws" ? "bg-blue-950" : "bg-emerald-900";
  const buttonColor =
    agencyType === "bbws"
      ? "bg-amber-400 hover:bg-amber-500"
      : "bg-emerald-500 hover:bg-emerald-600";
  const iconBg =
    agencyType === "bbws" ? "border-amber-400" : "border-emerald-400";

  return (
    <div
      className={`h-screen flex flex-col bg-slate-50 ${outfit.className} overflow-hidden`}
    >
      {/* HEADER */}
      <header className="h-16 md:h-20 bg-blue-950 text-white flex items-center justify-between px-4 md:px-10 shadow-lg shrink-0 z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href={backPath}>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-400">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div className="flex items-center gap-3 border-l pl-3 md:pl-4 border-white/10">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/images/logo-citra-banjir2.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xs md:text-lg font-black uppercase tracking-tight leading-none text-white">
                Update Curah Hujan
              </h1>
              <p className="text-[8px] md:text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
                Sistem Integrasi BBWS & BMKG
              </p>
            </div>
          </div>
        </div>

        <div
          className={`w-10 h-10 relative rounded-full overflow-hidden border-2 ${iconBg} bg-white shadow-md shrink-0`}
        >
          <Image
            src={
              agencyType === "bbws" ? "/images/bbws.png" : "/images/bmkg.png"
            }
            alt="Agency Logo"
            fill
            className="object-contain p-1"
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
        <div className="p-4 md:p-10 max-w-5xl mx-auto pb-24">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center gap-3"
              >
                <CheckCircleIcon size={18} />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Data Berhasil Disinkronkan ke Riwayat Live
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-950">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-amber-500" /> Lokasi Pos
                    </label>
                    <select
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-amber-400"
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
                      <Droplets size={12} className="text-blue-500" />{" "}
                      Intensitas (mm/hr)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Contoh: 15.5"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-amber-400"
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
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-amber-400"
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
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-amber-400"
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
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Normal", "Waspada", "Siaga"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: s })}
                        className={`p-3 text-[10px] font-bold uppercase border rounded-lg transition-all ${
                          formData.status === s
                            ? `${accentColor} text-white border-transparent shadow-md`
                            : "bg-white text-blue-950 border-slate-200 hover:border-amber-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-blue-950">
                  <label className="text-[10px] font-black uppercase tracking-widest">
                    Keterangan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Kondisi lapangan..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-amber-400"
                    value={formData.keterangan}
                    onChange={(e) =>
                      setFormData({ ...formData, keterangan: e.target.value })
                    }
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${buttonColor} text-blue-950 font-black uppercase text-xs tracking-[0.2em] py-4 rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all`}
                >
                  {loading ? (
                    "Menyinkronkan..."
                  ) : (
                    <>
                      <Save size={16} /> Simpan Data
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* --- RIWAYAT LIVE (DIPERBARUI REAL-TIME) --- */}
            <div className="space-y-6">
              <div className="bg-blue-950 p-6 text-white rounded-2xl shadow-xl border-l-4 border-amber-400 h-fit">
                <h4 className="text-[10px] text-amber-400 font-bold uppercase mb-6 flex items-center gap-2 tracking-[0.2em]">
                  <History size={14} /> Riwayat Live
                </h4>
                <div className="space-y-4">
                  {/* Animasi saat data baru muncul */}
                  <AnimatePresence initial={false}>
                    {historyLogs.map((item, i) => (
                      <motion.div
                        key={`${item.pos}-${i}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold uppercase">
                            {item.pos}
                          </p>
                          <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-amber-400 font-bold">
                            {item.agency}
                          </span>
                        </div>
                        <div className="flex justify-between items-center opacity-60">
                          <span className="text-[10px] italic">{item.val}</span>
                          <span className="text-[9px] flex items-center gap-1">
                            <Clock size={10} /> {item.time} WIB
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="p-4 bg-blue-100/50 rounded-xl border border-blue-200 flex items-start gap-3">
                <CloudRain className="text-blue-600 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-blue-900 uppercase leading-relaxed">
                  Setiap data yang diinput akan langsung muncul di panel riwayat
                  live instansi terkait.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
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
