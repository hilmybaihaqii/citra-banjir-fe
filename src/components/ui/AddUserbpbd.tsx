"use client";

import React, { useState } from "react";
import { X, UserPlus, CheckCircle2, ShieldCheck } from "lucide-react";
// Import tipe data asli dari file types
import { User, UserRole } from "@/types";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
  // Inisialisasi state dengan tipe role yang spesifik (UserRole)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    agencyId: "bpbd",
    role: "admin" as UserRole, // Casting ke UserRole agar sinkron dengan interface User
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    onClose();
    setTimeout(() => {
      setFormData({ username: "", name: "", password: "", agencyId: "bpbd", role: "admin" as UserRole });
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        // Mengirim data sesuai kontrak interface User di types/index.ts
        onAdd({
          username: formData.username,
          name: formData.name,
          password: formData.password,
          agencyId: "bpbd",
          role: formData.role, 
        });
        
        setFormData({ username: "", name: "", password: "", agencyId: "bpbd", role: "admin" as UserRole });
        setShowSuccess(false);
      }, 1500); 
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header Modal */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-950">
            <UserPlus size={18} strokeWidth={2.5} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Tambah Personil BPBD</h3>
          </div>
          {!showSuccess && (
            <button 
              onClick={handleCloseModal} 
              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {showSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
              <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={2} />
            </div>
            <h4 className="text-lg font-bold text-blue-950 mb-1">Berhasil Didaftarkan!</h4>
            <p className="text-sm text-slate-500 font-medium">Akun @{formData.username} telah aktif.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Locked Agency View */}
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-sm flex items-center gap-3">
              <ShieldCheck size={16} className="text-blue-600" />
              <div>
                <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Registrasi Internal</p>
                <p className="text-xs font-bold text-blue-950">BPBD PROVINSI JAWA BARAT</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Nama Lengkap</label>
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Masukkan nama personil"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Username</label>
              <input 
                required 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="Contoh: bpbd_jabar_01"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Password</label>
              <input 
                required 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Otoritas Akses</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all cursor-pointer appearance-none"
              >
                <option value="admin">Admin Biasa</option>
                <option value="superadmin">Super Admin</option>
                <option value="viewer">Viewer (Hanya Lihat)</option>
              </select>
            </div>

            {/* Footer Action */}
            <div className="pt-6 mt-2 flex justify-end gap-3 border-t border-slate-100">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-950 bg-white border border-slate-200 hover:border-slate-300 rounded-sm transition-all"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-950 hover:bg-blue-900 border border-blue-950 rounded-sm transition-all disabled:opacity-70 disabled:cursor-wait min-w-30"
              >
                {isSubmitting ? "Memproses..." : "Daftarkan Akun"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};