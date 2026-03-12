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
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-sm bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 z-10 rounded-sm p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
          aria-label="Tutup"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 pt-0.5">
              <h3 className="text-lg font-medium text-slate-900">Keluar</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin keluar? Anda harus masuk kembali untuk dapat mengakses halaman ini.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 bg-slate-50 px-6 py-4 border-t border-slate-200">
          <button 
            onClick={onClose} 
            className="rounded-sm px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 focus:outline-none"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex items-center justify-center rounded-sm bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none min-w-22.5"
          >
            Keluar
          </button>
        </div>
        
      </div>
    </div>
  );
}