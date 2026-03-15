"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CloudSun,
  Thermometer,
  CloudRain,
  Calendar,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { apiFetch } from "@/lib/api";

const rainData = [
  { day: "Sen", mm: 12 },
  { day: "Sel", mm: 18 },
  { day: "Rab", mm: 45 },
  { day: "Kam", mm: 30 },
  { day: "Jum", mm: 15 },
  { day: "Sab", mm: 5 },
  { day: "Min", mm: 10 },
];

const tempData = [
  { time: "06:00", temp: 22 },
  { time: "09:00", temp: 25 },
  { time: "12:00", temp: 31 },
  { time: "15:00", temp: 29 },
  { time: "18:00", temp: 26 },
  { time: "21:00", temp: 24 },
];

export default function BMKGDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [weatherStats, setWeatherStats] = useState({
    temperature: 26,
    precipitation: 12,
    status: "Cerah Berawan",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchRealtimeData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch(`${baseUrl}/regions`);
      const result = await res.json();

      if (res.ok && result.success && result.data?.length > 0) {
        // Ambil data terbaru (id paling besar atau data pertama)
        const latest = result.data[0];
        setWeatherStats({
          temperature: 26, // Default jika field temperature belum ada di DB
          precipitation: latest.alertStatus === "RAWAN_BANJIR" ? 65 : 12,
          status:
            latest.alertStatus === "RAWAN_BANJIR"
              ? "Waspada Hujan"
              : "Cerah Berawan",
        });
      }
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    const init = async () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );

      await fetchRealtimeData();
      setIsMounted(true);
    };
    init();
  }, [fetchRealtimeData]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Monitor Meteorologi
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Pusat Data Presipitasi & Cuaca Jawa Barat (Real-time)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRealtimeData}
            className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw
              size={16}
              className={`${isLoading ? "animate-spin" : ""} text-slate-600`}
            />
          </button>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[10px] font-bold uppercase text-slate-600 shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-amber-400 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Suhu Rata-rata
            </p>
            <Thermometer size={20} className="text-amber-500" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            {weatherStats.temperature}
            <span className="text-amber-500">°C</span>
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-blue-950 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Intensitas Hujan
            </p>
            <CloudRain size={20} className="text-blue-600" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            {weatherStats.precipitation}{" "}
            <span className="text-xs font-bold text-slate-400">mm/jam</span>
          </h3>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-6 border-l-4 border-l-green-500 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-green-700">
              Status Cuaca
            </p>
            <CloudSun size={20} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-black text-green-600 uppercase tracking-tight">
            {weatherStats.status}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Tren Presipitasi
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Intensitas Hujan Mingguan (mm)
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainData}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="day"
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
                  dataKey="mm"
                  stroke="#1e3a8a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRain)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Fluktuasi Suhu
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pemantauan 24 Jam Terakhir (°C)
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  domain={[20, 35]}
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="temp" radius={[4, 4, 0, 0]} barSize={30}>
                  {tempData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.temp > 28 ? "#f59e0b" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
