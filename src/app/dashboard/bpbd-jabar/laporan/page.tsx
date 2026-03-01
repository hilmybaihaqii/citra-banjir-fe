"use client";

import React, { useState } from "react";
import { Search, Eye, Phone, MessageSquare } from "lucide-react";
import ReportDetailModal, { EmergencyReport } from "@/components/ui/ReportDetailModal";

const INITIAL_REPORTS: EmergencyReport[] = [
  {
    id: "REP-001",
    name: "Ahmad Subarjo",
    phone: "081234567890",
    location: "Kec. Baleendah, RW 03 RT 01, Patokan dekat masjid An-Nur",
    waterLevel: "120 cm (Sedada)",
    severity: "tinggi",
    description: "Air naik sangat cepat sejak pukul 02.00 dini hari. Sebagian warga sudah mengungsi, namun masih ada lansia yang terjebak di lantai dua rumah.",
    date: "01 Mar 2026, 04:30 WIB",
    status: "Baru",
  },
  {
    id: "REP-002",
    name: "Siti Rahmawati",
    phone: "089876543210",
    location: "Dayeuhkolot, Jl. Raya Banjaran No. 45",
    waterLevel: "50 cm (Selutut)",
    severity: "sedang",
    description: "Jalan raya tergenang, kendaraan roda dua tidak bisa lewat. Air mulai masuk ke teras rumah warga di pinggir jalan.",
    date: "28 Feb 2026, 22:15 WIB",
    status: "Diproses",
  },
  {
    id: "REP-003",
    name: "Ketua RW 08 Bojongsoang",
    phone: "081122334455",
    location: "Desa Tegalluar, RW 08",
    waterLevel: "30 cm",
    severity: "rendah",
    description: "Luapan dari sungai Citarum. Saat ini masih aman, warga sudah bersiaga dan menaikkan barang-barang.",
    date: "28 Feb 2026, 18:00 WIB",
    status: "Selesai",
  },
];

type TabType = "Semua" | "Baru" | "Diproses" | "Selesai";

export default function BPBDLaporanPage() {
  const [reports, setReports] = useState<EmergencyReport[]>(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("Baru");
  
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateStatus = (id: string, newStatus: EmergencyReport["status"]) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const filteredReports = reports.filter((r) => {
    const matchesTab = activeTab === "Semua" ? true : r.status === activeTab;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "tinggi": return "bg-red-100 text-red-800 border-red-200";
      case "sedang": return "bg-amber-100 text-amber-800 border-amber-200";
      case "rendah": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Baru": return "bg-rose-500 text-white";
      case "Diproses": return "bg-amber-500 text-white";
      case "Selesai": return "bg-emerald-500 text-white";
      default: return "bg-slate-500 text-white";
    }
  };

  const TABS: TabType[] = ["Semua", "Baru", "Diproses", "Selesai"];

  return (
    <>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 uppercase tracking-tight">
            Semua Laporan
          </h1>
          <p className="text-slate-600 font-medium text-xs md:text-sm mt-1 tracking-wide">
            Kelola dan tindak lanjuti laporan darurat warga.
          </p>
        </div>

        <div className="relative w-full lg:w-auto mt-2 lg:mt-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari ID, Pelapor, Lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 w-full lg:w-72 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6 gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
        {TABS.map((tab) => {
          const count = tab === "Semua" ? reports.length : reports.filter((r) => r.status === tab).length;
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                isActive
                  ? "border-blue-950 text-blue-950"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-amber-400 text-blue-950' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-150 lg:min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="hidden sm:table-cell p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-12 lg:w-16 text-center">No</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID / Pelapor</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-37.5 lg:max-w-50">Lokasi</th>
                <th className="hidden md:table-cell p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Dampak</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={`transition-colors hover:bg-slate-50 ${
                      report.status === "Baru" ? "bg-rose-50/20" : ""
                    }`}
                  >
                    <td className="hidden sm:table-cell p-4 text-xs lg:text-sm text-slate-500 text-center font-bold">{index + 1}</td>
                    <td className="p-3 lg:p-4">
                      <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 mb-0.5">{report.id} • {report.date.split(',')[0]}</p>
                      <p className="text-xs lg:text-sm font-black text-blue-950 uppercase">{report.name}</p>
                      <p className="text-[10px] lg:text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                        <Phone size={10} /> {report.phone}
                      </p>
                    </td>
                    <td className="p-3 lg:p-4 max-w-37.5 lg:max-w-50">
                      <p className="text-xs lg:text-sm font-medium text-slate-700 line-clamp-2" title={report.location}>
                        {report.location}
                      </p>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="p-3 lg:p-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-sm text-[9px] lg:text-[10px] font-black uppercase tracking-widest shadow-sm min-w-17.5 lg:min-w-20 ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3 lg:p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setIsModalOpen(true);
                        }}
                        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-white border border-slate-200 hover:border-blue-950 hover:text-blue-950 text-slate-600 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-1.5 mx-auto shadow-sm"
                      >
                        <Eye size={12} className="lg:w-3.5 lg:h-3.5" /> <span className="hidden sm:inline">LIHAT</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 lg:p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 font-medium">
                      <MessageSquare size={24} className="text-slate-300 mb-3 lg:w-8 lg:h-8" />
                      <span className="text-xs lg:text-sm">Tidak ada laporan untuk tab <strong className="uppercase">{activeTab}</strong>.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between mt-auto gap-4 sm:gap-0">
          <p className="text-[10px] lg:text-xs text-slate-600 font-medium text-center sm:text-left">
            Menampilkan <span className="font-bold text-blue-950">{filteredReports.length}</span> laporan
          </p>
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-sm text-[9px] lg:text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 cursor-not-allowed">PREV</button>
            <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 rounded-sm text-[9px] lg:text-[10px] uppercase tracking-widest font-bold text-blue-950 bg-white hover:bg-slate-100 hover:border-blue-950 transition-all">NEXT</button>
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
        onDelete={handleDeleteReport}
      />
    </>
  );
}