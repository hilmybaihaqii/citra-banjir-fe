"use client";

import React from "react";
import { AlertTriangle, X, Phone, Waves, MapPin, CheckCircle2, Trash2 } from "lucide-react";

// Interface (Bisa dipisah ke file types.ts nantinya jika makin banyak)
export interface EmergencyReport {
  id: string;
  name: string;
  phone: string;
  location: string;
  waterLevel: string;
  severity: string;
  description: string;
  date: string;
  status: "Baru" | "Diproses" | "Selesai";
}

interface ReportDetailModalProps {
  report: EmergencyReport | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: EmergencyReport["status"]) => void;
  onDelete: (id: string) => void;
}

export default function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}: ReportDetailModalProps) {
  if (!isOpen || !report) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "tinggi": return "bg-red-100 text-red-800 border-red-200";
      case "sedang": return "bg-amber-100 text-amber-800 border-amber-200";
      case "rendah": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-blue-950/70 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded">
              <AlertTriangle size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-blue-950 uppercase tracking-widest text-xs">
                DETAIL LAPORAN DARURAT
              </h3>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                {report.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 transition-colors p-2 bg-white rounded border border-slate-200"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body Modal (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Status Banner */}
          <div className={`p-4 rounded-sm border mb-8 flex justify-between items-center ${
              report.status === "Baru" ? "bg-rose-50 border-rose-200" : 
              report.status === "Diproses" ? "bg-amber-50 border-amber-200" : 
              "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Status Saat Ini
              </p>
              <p className={`text-lg font-black uppercase tracking-tight ${
                  report.status === "Baru" ? "text-rose-600" : 
                  report.status === "Diproses" ? "text-amber-600" : 
                  "text-emerald-600"
                }`}
              >
                {report.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Waktu Laporan
              </p>
              <p className="text-sm font-bold text-slate-700">{report.date}</p>
            </div>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                Identitas Pelapor
              </h4>
              <p className="text-base font-black text-blue-950 uppercase">{report.name}</p>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2 mt-2">
                <Phone size={14} className="text-slate-400" /> {report.phone}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                Data Bencana
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold mb-1">TINGKAT KEPARAHAN</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold mb-1">KETINGGIAN AIR</p>
                  <p className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <Waves size={14} className="text-blue-500" /> {report.waterLevel || "Tidak ada data"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lokasi & Deskripsi */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">
                Lokasi Spesifik
              </h4>
              <p className="text-sm font-medium text-slate-700 flex items-start gap-2 bg-slate-50 p-4 rounded border border-slate-100">
                <MapPin size={16} className="text-rose-500 shrink-0 mt-0.5" />
                {report.location}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">
                Deskripsi Situasi
              </h4>
              <div className="bg-blue-50/50 p-4 rounded border border-blue-100 text-sm text-blue-950 font-medium leading-relaxed min-h-25">
                {report.description}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal (Actions) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          
          {/* Tombol Hapus: Muncul untuk Spam (Baru) atau yg sudah Selesai */}
          {(report.status === "Baru" || report.status === "Selesai") ? (
            <button
              onClick={() => {
                if(window.confirm("Yakin ingin menghapus laporan ini secara permanen?")) {
                  onDelete(report.id);
                  onClose();
                }
              }}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-100 border border-transparent hover:border-rose-200 rounded transition-all flex items-center gap-2"
            >
              <Trash2 size={14} /> {report.status === "Baru" ? "Hapus" : "Hapus Laporan"}
            </button>
          ) : (
            <div></div> /* Spacer agar tombol aksi penanganan tetap di kanan */
          )}

          <div className="flex flex-wrap gap-2 justify-end">
            {report.status === "Baru" && (
              <button
                onClick={() => {
                  onUpdateStatus(report.id, "Diproses");
                  onClose();
                }}
                className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 rounded shadow-sm transition-all"
              >
                Tandai Diproses
              </button>
            )}
            
            {report.status === "Diproses" && (
              <button
                onClick={() => {
                  onUpdateStatus(report.id, "Selesai");
                  onClose();
                }}
                className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={14} /> Selesai Ditangani
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}