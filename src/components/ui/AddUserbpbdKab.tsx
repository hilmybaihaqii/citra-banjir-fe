"use client";

import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";

export interface NewUserPayload {
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: NewUserPayload) => Promise<void>; 
}

export const AddUserKabModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    email: "", name: "", password: "", role: "ADMIN",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    onClose();
    setTimeout(() => setFormData({ email: "", name: "", password: "", role: "ADMIN" }), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd({ ...formData, username: formData.email });
      setFormData({ email: "", name: "", password: "", role: "ADMIN" });
      // Modal akan otomatis ditutup oleh parent (page.tsx)
    } catch (error) {
      console.error("Gagal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3 text-blue-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-md text-blue-700">
                <UserPlus size={18} strokeWidth={2.5} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">Tambah Pengguna</h3>
          </div>
          <button onClick={handleCloseModal} className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Lengkap *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap" className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm focus:ring-1 focus:ring-blue-950" />
          </div>
          
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Akses *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nama@email.com" className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm focus:ring-1 focus:ring-blue-950" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Password *</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm focus:ring-1 focus:ring-blue-950" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Otoritas Akses *</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm focus:ring-1 focus:ring-blue-950">
                <option value="ADMIN">Admin Biasa</option>
                <option value="MASTER_ADMIN">Master Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={handleCloseModal} disabled={isSubmitting} className="rounded-md bg-slate-50 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100">Batal</button>
            <button type="submit" disabled={isSubmitting} className="min-w-32 rounded-md bg-blue-950 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-blue-900 disabled:opacity-70">
              {isSubmitting ? "MEMPROSES..." : "DAFTARKAN AKUN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};