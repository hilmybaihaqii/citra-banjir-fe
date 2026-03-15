"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, RefreshCw } from "lucide-react";
import ReportDetailModal, {
  EmergencyReport,
} from "@/components/ui/ReportDetailModal";
import { apiFetch } from "@/lib/api";

// 1. Definisikan Interface untuk Response dari Backend
interface BackendReport {
  id: number;
  reporterName: string;
  location: string;
  impact: string;
  status: string;
  createdAt: string;
  whatsapp?: string;
}

type TabType = "Semua" | "BARU" | "DIPROSES" | "SELESAI";

export default function BPBDKabLaporanPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("BARU");

  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch(`${baseUrl}/reports`);
      const result = await res.json();

      if (res.ok && result.success) {
        // 2. Gunakan interface BackendReport (Ganti 'any' jadi 'BackendReport')
        const mappedData = result.data.map((r: BackendReport) => ({
          id: r.id.toString(),
          name: r.reporterName,
          phone: r.whatsapp || "Tidak ada",
          location: r.location,
          waterLevel: "-",
          severity: r.status === "BARU" ? "tinggi" : "sedang",
          description: r.impact,
          date: new Date(r.createdAt).toLocaleString("id-ID"),
          // Bypass overlap type dengan unknown casting
          status: r.status as unknown as "Baru" | "Diproses" | "Selesai",
        }));
        setReports(mappedData);
      }
    } catch (err) {
      console.error("Gagal fetch laporan:", err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    setIsMounted(true);
    fetchReports();
  }, [fetchReports]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const statusForBackend = newStatus.toUpperCase();
      const res = await apiFetch(`${baseUrl}/reports/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: statusForBackend }),
      });
      if (res.ok) {
        fetchReports();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Hapus laporan ini secara permanen?")) return;
    try {
      const res = await apiFetch(`${baseUrl}/reports/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  const filteredReports = reports.filter((r) => {
    const currentStatusUpper = r.status.toUpperCase();
    const matchesTab =
      activeTab === "Semua" ? true : currentStatusUpper === activeTab;

    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "BARU":
        return "bg-rose-500 text-white";
      case "DIPROSES":
        return "bg-amber-500 text-white";
      case "SELESAI":
        return "bg-emerald-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const TABS: TabType[] = ["Semua", "BARU", "DIPROSES", "SELESAI"];

  if (!isMounted) return null;

  return (
    <>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 uppercase tracking-tight">
            Semua Laporan
          </h1>
          <p className="text-slate-600 font-medium text-xs md:text-sm mt-1 tracking-wide">
            Kelola laporan darurat warga (BPBD Kab).
          </p>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Cari pelapor/lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-sm text-sm w-full focus:outline-none focus:border-blue-950"
            />
          </div>
          <button
            onClick={fetchReports}
            className="p-2 bg-white border border-slate-300 rounded-sm hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6 gap-4 overflow-x-auto pb-1 custom-scrollbar">
        {TABS.map((tab) => {
          const count =
            tab === "Semua"
              ? reports.length
              : reports.filter((r) => r.status.toUpperCase() === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 flex items-center gap-2 transition-all ${
                activeTab === tab
                  ? "border-blue-950 text-blue-950"
                  : "border-transparent text-slate-400"
              }`}
            >
              {tab}
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] ${activeTab === tab ? "bg-amber-400 text-blue-950" : "bg-slate-100 text-slate-500"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase text-center w-16">
                  No
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">
                  ID / Pelapor
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">
                  Lokasi
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase text-center">
                  Status
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-16 text-center text-sm font-bold text-slate-400 italic"
                  >
                    MENYINKRONKAN DATA LAPORAN...
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={`transition-colors hover:bg-slate-50 ${report.status.toUpperCase() === "BARU" ? "bg-rose-50/20" : ""}`}
                  >
                    <td className="p-4 text-xs text-slate-500 text-center font-bold">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <p className="text-[10px] font-bold text-slate-400">
                        {report.id}
                      </p>
                      <p className="text-xs lg:text-sm font-black text-blue-950 uppercase">
                        {report.name}
                      </p>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-700 line-clamp-1">
                      {report.location}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-1.5 bg-white border border-slate-200 hover:border-blue-950 text-[10px] font-bold uppercase rounded-sm shadow-sm transition-all"
                      >
                        <Eye size={12} className="inline mr-1" /> LIHAT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-16 text-center text-slate-400 font-medium italic"
                  >
                    Belum ada laporan di kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReportDetailModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteReport}
      />
    </>
  );
}
