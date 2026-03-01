"use client";

import React, { useState } from "react";
import {
  Search,
  Eye,
  Mail,
  Calendar,
  Phone,
  CheckCircle2,
  X,
  MessageSquare
} from "lucide-react";

// Interface & Mock Data
interface Feedback {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "Unread" | "Read";
}

const INITIAL_FEEDBACKS: Feedback[] = [
  { id: 1, name: "Budi Santoso", email: "budi.s@email.com", phone: "081234567890", message: "Sensor debit air di sungai Ciliwung area Manggarai sepertinya mengalami delay update. Mohon segera dicek karena kami warga bantaran sangat bergantung pada data tersebut.", date: "28 Feb 2026", status: "Unread" },
  { id: 2, name: "Siti Aminah", email: "siti.aminah@email.com", phone: "089876543210", message: "Terima kasih, sistem peringatan dininya sangat membantu warga bantaran sungai kemarin malam saat hujan deras.", date: "27 Feb 2026", status: "Read" },
  { id: 3, name: "Ahmad Dahlan", email: "ahmad.d@email.com", phone: "081122334455", message: "Mohon tambahkan titik pantau TMA di area jembatan merah, sering meluap tiba-tiba tanpa ada peringatan.", date: "25 Feb 2026", status: "Read" },
];

export default function AdminSaran() {
  // Fitur Data & Pencarian
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler untuk menandai pesan sudah dibaca
  const handleMarkAsRead = (id: number) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: "Read" } : f));
    setIsModalOpen(false);
    setTimeout(() => setSelectedFeedback(null), 300);
  };

  // Filter pencarian
  const filteredFeedbacks = feedbacks.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Konten */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Saran & Masukan</h1>
            <p className="text-slate-600 font-medium text-sm mt-1 tracking-wide">Daftar aspirasi dan laporan dari masyarakat terkait sistem.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Cari pengirim atau pesan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* TABEL SARAN */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest w-16 text-center">No</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Pengirim</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest hidden md:table-cell">Kontak</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest max-w-xs">Pesan Singkat</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Tanggal</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((feedback, index) => (
                    <tr key={feedback.id} className={`transition-colors group ${feedback.status === 'Unread' ? 'bg-amber-50/30 hover:bg-amber-50' : 'bg-white hover:bg-slate-50'}`}>
                      <td className="p-4 text-sm text-slate-700 text-center font-bold">{index + 1}</td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-blue-950">{feedback.name}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-xs font-bold text-slate-600">{feedback.email}</p>
                        <p className="text-[10px] font-bold tracking-widest text-slate-500 mt-1">{feedback.phone}</p>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className={`text-sm truncate pr-4 ${feedback.status === 'Unread' ? 'text-blue-950 font-bold' : 'text-slate-600 font-medium'}`}>
                          {feedback.message}
                        </p>
                      </td>
                      <td className="p-4 text-sm font-bold text-blue-950">{feedback.date}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border min-w-20 ${
                          feedback.status === 'Unread' 
                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          {feedback.status === 'Unread' ? 'BARU' : 'DIBACA'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setIsModalOpen(true);
                          }}
                          className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
                        >
                          <Eye size={14} /> LIHAT
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-600 font-medium italic">
                        <MessageSquare size={40} className="text-slate-400 mb-4" />
                        <span>Tidak ada laporan atau masukan yang ditemukan.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-slate-300 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-700 font-medium">Menampilkan <span className="font-bold text-blue-950">{filteredFeedbacks.length}</span> pesan</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-300 rounded-sm text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-slate-100 cursor-not-allowed">PREV</button>
              <button className="px-4 py-2 border border-slate-300 rounded-sm text-[10px] uppercase tracking-widest font-bold text-blue-950 bg-white hover:bg-slate-100 hover:border-blue-950 transition-all">NEXT</button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL BACA PESAN (DETAIL)                 */}
      {/* ========================================= */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-300">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-blue-950 uppercase tracking-widest text-xs flex items-center gap-2">
                <Mail size={16} /> DETAIL MASUKAN
              </h3>
              <button onClick={() => {
                setIsModalOpen(false);
                setTimeout(() => setSelectedFeedback(null), 300);
              }} className="text-slate-400 hover:text-rose-600 transition-colors p-1">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">PENGIRIM</p>
                  <p className="text-base font-black text-blue-950 uppercase">{selectedFeedback.name}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                      <Mail size={12} className="text-slate-400" /> {selectedFeedback.email}
                    </p>
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                      <Phone size={12} className="text-slate-400" /> {selectedFeedback.phone}
                    </p>
                  </div>
                </div>
                
                <div className="md:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TANGGAL MASUK</p>
                  <p className="text-sm font-bold text-blue-950 flex items-center md:justify-end gap-2">
                    <Calendar size={14} className="text-slate-400" /> {selectedFeedback.date}
                  </p>
                  <div className="mt-3">
                     <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
                        selectedFeedback.status === 'Unread' 
                          ? 'bg-amber-100 text-amber-800 border-amber-300' 
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        STATUS: {selectedFeedback.status === 'Unread' ? 'BARU' : 'DIBACA'}
                      </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">ISI PESAN</p>
                <div className="bg-slate-50 p-6 rounded-sm border border-slate-200 text-sm text-blue-950 font-medium leading-relaxed min-h-30">
                  {selectedFeedback.message}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeout(() => setSelectedFeedback(null), 300);
                }}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-300 rounded-sm hover:bg-slate-100 transition-all"
              >
                TUTUP
              </button>
              
              {selectedFeedback.status === 'Unread' ? (
                <button 
                  onClick={() => handleMarkAsRead(selectedFeedback.id)}
                  className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 rounded-sm transition-all shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> TANDAI SUDAH DIBACA
                </button>
              ) : (
                <button 
                  disabled
                  className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200 border border-slate-300 rounded-sm cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> PESAN TELAH DIBACA
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}