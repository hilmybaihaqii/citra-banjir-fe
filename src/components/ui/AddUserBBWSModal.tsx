"use client";

import React, { useState } from "react";
import { X, User, Lock, Shield, Mail, CheckCircle2 } from "lucide-react";
import { User as UserType, UserRole } from "@/types";

interface AddUserBBWSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: UserType) => void;
}

export function AddUserBBWSModal({
  isOpen,
  onClose,
  onAdd,
}: AddUserBBWSModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "admin" as UserRole,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Perbaikan: Tambahkan property 'password' agar sesuai dengan interface UserType
      const newUser: UserType = {
        name: formData.name,
        username: formData.username,
        password: formData.password, // Sekarang sudah lengkap sesuai kontrak type User
        role: formData.role,
        agencyId: "bbws",
      };

      onAdd(newUser);
      setIsSubmitting(false);
      setFormData({
        name: "",
        username: "",
        password: "",
        role: "admin" as UserRole,
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="bg-blue-950 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 rounded-lg">
              <Shield className="text-blue-950" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest">
                Registrasi Akun
              </h3>
              <p className="text-[9px] text-blue-300 font-bold uppercase tracking-tighter">
                Otoritas Internal BBWS Citarum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <User size={14} /> Nama Lengkap Petugas
            </label>
            <input
              required
              type="text"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none transition-all"
              placeholder="Masukkan nama asli..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Mail size={14} /> ID Username
            </label>
            <input
              required
              type="text"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none transition-all"
              placeholder="petugas_citarum01"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <input
                required
                type="password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Shield size={14} /> Hak Akses
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
              >
                <option value="admin">Admin Balai</option>
                <option value="superadmin">Kepala Balai</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-950 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={16} /> Daftarkan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
