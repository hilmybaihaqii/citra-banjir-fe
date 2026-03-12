"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Building2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const trendData = [
  { tanggal: "25 Feb", laporan: 2 },
  { tanggal: "26 Feb", laporan: 5 },
  { tanggal: "27 Feb", laporan: 3 },
  { tanggal: "28 Feb", laporan: 8 },
  { tanggal: "01 Mar", laporan: 4 },
  { tanggal: "02 Mar", laporan: 7 },
  { tanggal: "03 Mar", laporan: 12 },
];

export default function AdminMainDashboard() {
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);

      // Memastikan format tanggal dengan hari lengkap (Senin, 8 Maret 2026)
      const now = new Date();
      const formattedDate = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setCurrentDate(formattedDate);

      const savedUser = localStorage.getItem("user_session");
      if (savedUser) setUserData(JSON.parse(savedUser));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Halo, {userData?.name || "Administrator"}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Ringkasan Status Sistem Pusat Kendali Citra Banjir
          </p>
        </div>

        {/* Box Tanggal dengan Hari */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[10px] font-bold uppercase text-slate-600 shadow-sm sm:w-auto transition-all hover:border-blue-200">
          <Calendar size={14} className="text-blue-600" />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-blue-950 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Total Mitra
            </p>
            <Building2 size={20} className="text-blue-600" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            4{" "}
            <span className="text-xs font-bold text-slate-400 uppercase">
              Instansi
            </span>
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-emerald-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Pengguna Sistem
            </p>
            <Users size={20} className="text-emerald-500" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            12{" "}
            <span className="text-xs font-bold text-slate-400 uppercase">
              Akun
            </span>
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-amber-400 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Saran Masuk
            </p>
            <MessageSquare size={20} className="text-amber-500" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            24{" "}
            <span className="text-xs font-bold text-slate-400 uppercase">
              Pesan
            </span>
          </h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Aktivitas Laporan Masuk
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tren Saran Warga 7 Hari Terakhir
            </p>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shadow-sm">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorLaporan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="tanggal"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="laporan"
                stroke="#1e3a8a"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLaporan)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
