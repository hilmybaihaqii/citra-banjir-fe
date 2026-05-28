"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, MessageSquare, Calendar, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Cookies from "js-cookie";

interface User {
  id: number;
  agency?: string | null;
}

interface Feedback {
  id: number;
  createdAt: string;
  isRead: boolean;
}

export default function AdminMainDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [currentDate, setCurrentDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [agencyStats, setAgencyStats] = useState({
    CITRA_BANJIR: 0,
    BBWS: 0,
    BMKG: 0,
    BPBD_KAB: 0,
    BPBD_JABAR: 0,
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [chartData, setChartData] = useState<
    { tanggal: string; laporan: number }[]
  >([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    setEndDate(end.toISOString().split("T")[0]);
    setStartDate(start.toISOString().split("T")[0]);

    const savedUser = Cookies.get("user_session");
    if (savedUser) {
      try {
        setUserData(JSON.parse(savedUser));
      } catch (error) {
        console.error("Gagal parse user_session");
      }
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [resUsers, resFeedbacks] = await Promise.all([
        fetch(`${API_URL}/users`, { method: "GET", headers }),
        fetch(`${API_URL}/feedback?limit=1000`, { method: "GET", headers }),
      ]);

      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        const usersArray: User[] =
          dataUsers.data?.items || dataUsers.data || [];
        setUsersCount(usersArray.length);

        const stats = {
          CITRA_BANJIR: 0,
          BBWS: 0,
          BMKG: 0,
          BPBD_KAB: 0,
          BPBD_JABAR: 0,
        };
        usersArray.forEach((u) => {
          if (u.agency && stats[u.agency as keyof typeof stats] !== undefined) {
            stats[u.agency as keyof typeof stats]++;
          } else if (u.agency === "SYSTEM" || !u.agency) {
            stats.CITRA_BANJIR++;
          }
        });
        setAgencyStats(stats);
      }

      if (resFeedbacks.ok) {
        const dataFeedbacks = await resFeedbacks.json();
        const feedbacksArray =
          dataFeedbacks.data?.items || dataFeedbacks.data || [];
        setFeedbacks(feedbacksArray);
      }
    } catch (error) {
      console.error("Gagal menarik data dashboard", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (isMounted) fetchDashboardData();
  }, [isMounted, fetchDashboardData]);

  useEffect(() => {
    if (!startDate || !endDate || feedbacks.length === 0) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const dateRange: { tanggal: string; rawDate: Date; laporan: number }[] = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateRange.push({
        tanggal: dt.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        rawDate: new Date(dt),
        laporan: 0,
      });
    }

    feedbacks.forEach((fb) => {
      const fbDate = new Date(fb.createdAt);
      if (fbDate >= start && fbDate <= end) {
        const formattedDate = fbDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });
        const targetDay = dateRange.find((d) => d.tanggal === formattedDate);
        if (targetDay) targetDay.laporan += 1;
      }
    });

    setChartData(
      dateRange.map(({ tanggal, laporan }) => ({ tanggal, laporan })),
    );
  }, [startDate, endDate, feedbacks]);

  if (!isMounted) return null;

  const unreadFeedbacks = feedbacks.filter((f) => !f.isRead).length;

  return (
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500 max-w-350 mx-auto w-full p-4 sm:p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Halo, {userData?.name?.split(" ")[0] || "Administrator"}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Ringkasan Status Sistem Pusat Kendali Citra Banjir
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all">
          <Calendar size={14} className="text-blue-600" />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />

          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Pengguna Sistem
            </p>
            <Users size={20} className="text-emerald-500" />
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <h3 className="text-4xl font-black text-blue-950">
              {isLoading ? (
                <Loader2 className="animate-spin inline text-slate-300" />
              ) : (
                usersCount
              )}
            </h3>
            <span className="text-xs font-bold uppercase text-slate-400">
              Akun Terdaftar
            </span>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-t border-slate-100 pt-4">
              Rincian Instansi
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> BMKG (
                {agencyStats.BMKG})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> BBWS
                ({agencyStats.BBWS})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> BPBD
                KAB ({agencyStats.BPBD_KAB})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> BPBD
                JABAR ({agencyStats.BPBD_JABAR})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-950" />{" "}
                PUSAT ({agencyStats.CITRA_BANJIR})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />

          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total Saran Masuk
            </p>
            <MessageSquare size={20} className="text-amber-500" />
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <h3 className="text-4xl font-black text-blue-950">
              {isLoading ? (
                <Loader2 className="animate-spin inline text-slate-300" />
              ) : (
                feedbacks.length
              )}
            </h3>
            <span className="text-xs font-bold uppercase text-slate-400">
              Pesan Warga
            </span>
          </div>

          <div className="mt-auto border-t border-slate-100 pt-4 flex items-center gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Belum Dibaca
              </p>
              <p className="text-lg font-black text-rose-600">
                {isLoading ? "-" : unreadFeedbacks}
              </p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Sudah Dibaca
              </p>
              <p className="text-lg font-black text-emerald-600">
                {isLoading ? "-" : feedbacks.length - unreadFeedbacks}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950 flex items-center gap-2">
              Laporan Masuk
            </h3>
            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Statistik pengaduan berdasarkan rentang tanggal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-blue-950 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
            <span className="text-slate-400 font-bold">-</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-blue-950 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="h-72 w-full">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Memproses Grafik...
              </span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  dx={-10}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#1e3a8a", fontWeight: "bold" }}
                  labelStyle={{
                    color: "#64748b",
                    fontWeight: "bold",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="laporan"
                  name="Saran Masuk"
                  stroke="#1e3a8a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLaporan)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
