"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm rounded-md bg-white p-6 text-left shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Keluar Sistem
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Sesi Anda akan diakhiri. Anda harus login kembali untuk mengakses dashboard.
            </p>
          </div>
          
          <button 
            onClick={onClose} 
            className="text-slate-400 transition-colors hover:text-slate-600 ml-4"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}