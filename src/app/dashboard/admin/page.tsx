"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Building2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const trendData = [
  { tanggal: '25 Feb', laporan: 2 },
  { tanggal: '26 Feb', laporan: 5 },
  { tanggal: '27 Feb', laporan: 3 },
  { tanggal: '28 Feb', laporan: 8 },
  { tanggal: '01 Mar', laporan: 4 },
  { tanggal: '02 Mar', laporan: 7 },
  { tanggal: '03 Mar', laporan: 12 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-3 shadow-lg">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-sm font-black text-blue-950">
          {payload[0].value} <span className="text-[10px] font-bold text-slate-400">Pesan</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminMainDashboard() {
  const [userData, setUserData] = useState<{ name: string; role: string; } | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);

      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("id-ID", options));

      const savedUser = localStorage.getItem("user_session");
      if (!savedUser) {
        setUserData({ name: "Developer Pusat", role: "superadmin" }); 
      } else {
        try {
          const parsed = JSON.parse(savedUser);
          setUserData(parsed);
        } catch (e) {
          console.error("Gagal parsing data user", e);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;
  return (
    <div className="flex flex-col gap-6 pb-8 lg:gap-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Halo, {userData?.name || "Administrator"}
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Ringkasan Status Sistem Pusat Kendali Citra Banjir
          </p>
        </div>
        
        <div className="flex w-full shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 shadow-sm sm:w-auto">
          <span className="mr-2 text-slate-400">Update:</span>
          <span className="text-blue-700">{currentDate || "Memuat..."}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        
        <div className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Building2 size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Instansi</p>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-blue-950">
            4 <span className="ml-1 text-xs font-bold text-slate-400">Mitra</span>
          </h3>
        </div>

        <div className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pengguna Sistem</p>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-blue-950">
            12 <span className="ml-1 text-xs font-bold text-slate-400">Akun</span>
          </h3>
        </div>

        <div className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <MessageSquare size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Laporan Masuk</p>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-blue-950">
            24 <span className="ml-1 text-xs font-bold opacity-70">Pesan</span>
          </h3>
        </div>
      </div>

      <div className="flex flex-col rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">Aktivitas Laporan Masuk</h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tren Laporan Warga 7 Hari Terakhir</p>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorLaporan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="laporan" 
                stroke="#2563eb" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorLaporan)" 
                activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}