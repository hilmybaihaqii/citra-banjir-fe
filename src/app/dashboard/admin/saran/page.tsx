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
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMarkAsRead = (id: number) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: "Read" } : f));
    setIsModalOpen(false);
    setTimeout(() => setSelectedFeedback(null), 300);
  };

  const filteredFeedbacks = feedbacks.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-12 lg:pb-8">
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-blue-950 md:text-2xl">
            Saran & Masukan
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Daftar aspirasi dan laporan dari masyarakat terkait sistem.
          </p>
        </div>
        
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-64">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari pengirim atau pesan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">No</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pengirim</th>
                <th className="w-48 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Kontak</th>
                <th className="w-80 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pesan Singkat</th>
                <th className="w-32 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tanggal</th>
                <th className="w-32 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="w-24 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback, index) => (
                  <tr key={feedback.id} className={`transition-colors group ${feedback.status === 'Unread' ? 'bg-amber-50/20 hover:bg-amber-50/60' : 'bg-white hover:bg-slate-50'}`}>
                    <td className="p-4 text-center text-sm font-medium text-slate-500">{index + 1}</td>
                    
                    <td className="p-4">
                      <p className="text-sm font-bold uppercase text-blue-950">{feedback.name}</p>
                    </td>
                    
                    <td className="p-4">
                      <p className="text-xs font-bold text-slate-600">{feedback.email}</p>
                      <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400">{feedback.phone}</p>
                    </td>
                    
                    <td className="p-4">
                      <p className={`line-clamp-2 text-sm pr-4 ${feedback.status === 'Unread' ? 'font-bold text-blue-950' : 'font-medium text-slate-600'}`}>
                        {feedback.message}
                      </p>
                    </td>
                    
                    <td className="p-4 text-sm font-bold text-slate-600">{feedback.date}</td>
                    
                    <td className="p-4 text-center">
                      <span className={`inline-flex min-w-20 items-center justify-center rounded border px-2 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                        feedback.status === 'Unread' 
                          ? 'border-amber-200 bg-amber-50 text-amber-700' 
                          : 'border-slate-200 bg-slate-50 text-slate-600'
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
                        className="mx-auto flex items-center justify-center gap-2 rounded-md bg-blue-950 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-blue-900"
                      >
                        <Eye size={14} /> LIHAT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <MessageSquare size={32} className="mb-3 text-slate-300" />
                      <span className="text-sm font-medium">Tidak ada laporan atau masukan yang ditemukan.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:gap-0">
          <p className="text-xs font-medium text-slate-600">
            Menampilkan <span className="font-bold text-blue-950">{filteredFeedbacks.length}</span> pesan
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:flex-none">
              PREV
            </button>
            <button className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-colors hover:bg-slate-50 hover:border-blue-950 sm:flex-none">
              NEXT
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-950">
                <Mail size={16} /> DETAIL MASUKAN
              </h3>
              <button onClick={() => {
                setIsModalOpen(false);
                setTimeout(() => setSelectedFeedback(null), 300);
              }} className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">PENGIRIM</p>
                  <p className="text-base font-black uppercase text-blue-950">{selectedFeedback.name}</p>
                  <div className="mt-2 space-y-1.5">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Mail size={14} className="text-slate-400" /> {selectedFeedback.email}
                    </p>
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Phone size={14} className="text-slate-400" /> {selectedFeedback.phone}
                    </p>
                  </div>
                </div>
                
                <div className="md:text-right">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">TANGGAL MASUK</p>
                  <p className="flex items-center gap-2 text-sm font-bold text-blue-950 md:justify-end">
                    <Calendar size={14} className="text-slate-400" /> {selectedFeedback.date}
                  </p>
                  <div className="mt-3">
                     <span className={`inline-flex min-w-25 items-center justify-center rounded border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                        selectedFeedback.status === 'Unread' 
                          ? 'border-amber-200 bg-amber-50 text-amber-700' 
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}>
                        STATUS: {selectedFeedback.status === 'Unread' ? 'BARU' : 'DIBACA'}
                      </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 border-b border-slate-100 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">ISI PESAN</p>
                <div className="min-h-30 rounded-md border border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-relaxed text-blue-950">
                  {selectedFeedback.message}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeout(() => setSelectedFeedback(null), 300);
                }}
                className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-100"
              >
                TUTUP
              </button>
              
              {selectedFeedback.status === 'Unread' ? (
                <button 
                  onClick={() => handleMarkAsRead(selectedFeedback.id)}
                  className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-emerald-700"
                >
                  <CheckCircle2 size={14} /> TANDAI SUDAH DIBACA
                </button>
              ) : (
                <button 
                  disabled
                  className="flex cursor-not-allowed items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400"
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