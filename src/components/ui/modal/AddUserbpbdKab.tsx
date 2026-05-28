"use client";

import React, { useState } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";

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
    if (isSubmitting) return;
    onClose();
    setTimeout(() => setFormData({ email: "", name: "", password: "", role: "ADMIN" }), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd({ ...formData, username: formData.email });
      setFormData({ email: "", name: "", password: "", role: "ADMIN" });
    } catch (error) {
      console.error("Gagal menambahkan akun:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleCloseModal}
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-950">
            <UserPlus size={16} /> TAMBAH PENGGUNA
          </h3>
          <button 
            onClick={handleCloseModal} 
            disabled={isSubmitting}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none disabled:opacity-50"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input 
              required 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Nama Lengkap" 
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" 
            />
          </div>
          
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Email Akses <span className="text-rose-500">*</span>
            </label>
            <input 
              required 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="nama@email.com" 
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Password <span className="text-rose-500">*</span>
              </label>
              <input 
                required 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" 
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Otoritas <span className="text-rose-500">*</span>
              </label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className="w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-blue-950 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
              >
                <option value="ADMIN">Admin</option>
                <option value="MASTER_ADMIN">Master Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button 
              type="button" 
              onClick={handleCloseModal} 
              disabled={isSubmitting} 
              className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 focus:outline-none disabled:opacity-50"
            >
              BATAL
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex items-center gap-2 rounded-md bg-blue-950 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-blue-900 focus:outline-none disabled:opacity-70 min-w-30 justify-center"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UserPlus size={14} />
              )}
              {isSubmitting ? "MEMPROSES..." : "DAFTARKAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};