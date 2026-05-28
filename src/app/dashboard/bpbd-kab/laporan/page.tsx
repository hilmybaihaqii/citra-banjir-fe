"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Phone,
  MessageSquare,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import ReportDetailModal, {
  EmergencyReport,
} from "@/components/ui/ReportDetailModal";

type TabType = "SEMUA" | "BARU" | "DIPROSES" | "SELESAI";

interface RawReportData {
  id: number | string;
  reporterName?: string;
  location?: string;
  impact?: string;
  createdAt?: string;
  date?: string;
  status?: string;
  imageUrl?: string;
}

export default function BPBDKabLaporanPage() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("BARU");
  const [isMounted, setIsMounted] = useState(false);

  // Modal States
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmergencyReport | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  // 1. GET SEMUA LAPORAN & PARSING IMPACT STRINGS + MENDAPATKAN IMAGE URL
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/reports?limit=1000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        const rawData: RawReportData[] =
          data.data?.items || data.data || data || [];

        // MAPPING & PARSING REGEX
        const mappedReports: EmergencyReport[] = rawData.map((item) => {
          const impactStr = item.impact || "";

          // Membongkar string impact dari Frontend warga
          const severityMatch = impactStr.match(/\[Prioritas:\s*(.*?)\]/i);
          const waterMatch = impactStr.match(/\[Ketinggian Air:\s*(.*?)\]/i);
          const phoneMatch = impactStr.match(/\[Nomor HP:\s*(.*?)\]/i);
          const descMatch = impactStr.match(/Deskripsi:\s*(.*)/i);

          const formatStatus = (s?: string) => {
            if (!s) return "Baru";
            if (s.toUpperCase() === "DIPROSES") return "Diproses";
            if (s.toUpperCase() === "SELESAI") return "Selesai";
            return "Baru";
          };

          const formattedDate = item.createdAt
            ? new Date(item.createdAt)
                .toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(".", ":") + " WIB"
            : "-";

          return {
            id: String(item.id),
            name: item.reporterName || "Tanpa Nama",
            phone: phoneMatch ? phoneMatch[1] : "-",
            location: item.location || "-",
            waterLevel: waterMatch ? waterMatch[1] : "-",
            severity: severityMatch ? severityMatch[1].toLowerCase() : "sedang",
            description: descMatch ? descMatch[1] : impactStr,
            date: formattedDate,
            status: formatStatus(item.status),
            imageUrl: item.imageUrl || undefined,
          };
        });

        // Urutkan ID terbesar (Terbaru) ke atas
        mappedReports.sort((a, b) => Number(b.id) - Number(a.id));
        setReports(mappedReports);
      }
    } catch (error) {
      console.error("Gagal menarik data laporan:", error);
      showToast("Gagal memuat data laporan dari server.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setIsMounted(true);
    fetchReports();
  }, [fetchReports]);

  // Lock body scroll saat modal terbuka
  useEffect(() => {
    if (isModalOpen || deleteTarget) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, deleteTarget]);

  // 2. UPDATE STATUS LAPORAN
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${API_URL}/reports/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });

      if (!res.ok) throw new Error("Gagal mengubah status laporan");

      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: newStatus as EmergencyReport["status"] }
            : r,
        ),
      );

      if (selectedReport && selectedReport.id === id) {
        setSelectedReport({
          ...selectedReport,
          status: newStatus as EmergencyReport["status"],
        });
      }

      showToast("Status laporan berhasil diperbarui!", "success");
    } catch (error) {
      console.error(error);
      showToast("Gagal mengubah status.", "error");
    }
  };

  // 3. DELETE LAPORAN
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${API_URL}/reports/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus laporan");

      setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);

      if (selectedReport?.id === deleteTarget.id) {
        setIsModalOpen(false);
      }
      showToast("Laporan berhasil dihapus permanen.", "success");
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus laporan.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const reportStatus = r.status?.toUpperCase() || "BARU";
    const matchesTab =
      activeTab === "SEMUA" ? true : reportStatus === activeTab;
    const matchesSearch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(r.id).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    const sv = severity?.toLowerCase();
    switch (sv) {
      case "tinggi":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "sedang":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "rendah":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    const st = status?.toUpperCase();
    switch (st) {
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

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const parts = isoString.split(" ");
    return parts.length > 0
      ? parts[0] + " " + parts[1] + " " + parts[2]
      : isoString;
  };

  const TABS: TabType[] = ["SEMUA", "BARU", "DIPROSES", "SELESAI"];

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:pb-8 w-full max-w-350 mx-auto relative animate-in fade-in duration-500">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed z-200 flex items-center gap-3 rounded-lg border px-4 py-3.5 shadow-2xl backdrop-blur-md bottom-20 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 sm:max-w-md ${
              toast.type === "success"
                ? "border-emerald-200/60 bg-emerald-50/95 text-emerald-700"
                : "border-rose-200/60 bg-rose-50/95 text-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            ) : (
              <XCircle size={20} className="shrink-0 text-rose-600" />
            )}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 uppercase tracking-tight">
            Semua Laporan Masuk
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Kelola, filter, dan tindak lanjuti laporan darurat dari warga
            Kabupaten Bandung.
          </p>
        </div>

        <div className="relative w-full shrink-0 sm:w-72">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari ID, Pelapor, Lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
          />
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 overflow-x-auto custom-scrollbar">
        {TABS.map((tab) => {
          const count =
            tab === "SEMUA"
              ? reports.length
              : reports.filter((r) => r.status?.toUpperCase() === tab).length;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-[3px] flex items-center gap-2 shrink-0 ${
                isActive
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
              }`}
            >
              {tab}
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] ${isActive ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TABLE SECTION */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  No
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  ID / Pelapor
                </th>
                <th className="w-72 p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Lokasi Terdampak
                </th>
                <th className="w-24 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Bukti
                </th>
                <th className="w-32 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Dampak
                </th>
                <th className="w-32 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Status
                </th>
                <th className="w-28 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2
                      className="mx-auto mb-3 animate-spin text-blue-600"
                      size={32}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Sinkronisasi Laporan...
                    </span>
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={`group transition-colors hover:bg-slate-50/80 ${
                      report.status?.toUpperCase() === "BARU"
                        ? "bg-rose-50/30"
                        : ""
                    }`}
                  >
                    <td className="p-4 text-center text-sm font-bold text-slate-400 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider">
                        #{report.id} • {formatDate(report.date)}
                      </p>
                      <p className="text-sm font-black uppercase text-blue-950 line-clamp-1">
                        {report.name}
                      </p>
                      <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400" />{" "}
                        {report.phone}
                      </p>
                    </td>
                    <td className="p-4">
                      <p
                        className="text-xs font-bold text-slate-600 line-clamp-2 leading-relaxed"
                        title={report.location}
                      >
                        {report.location}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      {report.imageUrl ? (
                        <div className="flex flex-col items-center justify-center text-blue-600">
                          <ImageIcon size={18} />
                          <span className="text-[9px] font-bold mt-1">
                            Lampiran
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          -
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${getSeverityColor(report.severity)}`}
                      >
                        {report.severity || "-"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex min-w-20 items-center justify-center rounded-sm px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(report.status)}`}
                      >
                        {report.status || "BARU"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setIsModalOpen(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-950 text-white shadow-sm transition-all hover:bg-blue-900 focus:outline-none active:scale-95"
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(report)}
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-rose-50 text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white focus:outline-none active:scale-95"
                          title="Hapus Laporan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-slate-500 font-medium">
                      <div className="p-4 bg-slate-100 rounded-full mb-3">
                        <MessageSquare size={32} className="text-slate-300" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Tidak ada laporan untuk tab{" "}
                        <strong className="text-blue-950 uppercase">
                          {activeTab}
                        </strong>
                        .
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:gap-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center sm:text-left">
            Menampilkan{" "}
            <span className="font-black text-blue-950">
              {filteredReports.length}
            </span>{" "}
            laporan
          </p>
          <div className="flex w-full gap-2 sm:w-auto justify-center">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all sm:flex-none">
              PREV
            </button>
            <button className="flex-1 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-all hover:border-blue-950 hover:bg-slate-50 sm:flex-none">
              NEXT
            </button>
          </div>
        </div>
      </div>

      <ReportDetailModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedReport(null), 300);
        }}
        onUpdateStatus={handleUpdateStatus}
        onDelete={(id) => {
          const report = reports.find(
            (r) => r.id === id || r.id === String(id),
          );
          if (report) setDeleteTarget(report);
        }}
      />

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-600">
                <div className="p-1.5 bg-rose-100 rounded-md">
                  <Trash2 size={16} />
                </div>
                KONFIRMASI HAPUS
              </h3>
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 focus:outline-none disabled:opacity-50"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus laporan{" "}
                <span className="font-black uppercase text-blue-950">
                  #{deleteTarget.id}
                </span>{" "}
                dari pelapor{" "}
                <span className="font-bold text-blue-950">
                  {deleteTarget.name}
                </span>
                ?
                <br />
                <br />
                Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 focus:outline-none disabled:opacity-50"
              >
                BATAL
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-md bg-rose-600 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-rose-700 focus:outline-none disabled:opacity-50 min-w-35 justify-center active:scale-95"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {isDeleting ? "MEMPROSES..." : "YA, HAPUS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
