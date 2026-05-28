"use client";

import React, { useState } from "react";
import { X, Trash2, Loader2 } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userToDelete: { name: string; email: string } | null;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userToDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !userToDelete) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => !isDeleting && onClose()}
      />
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl border border-slate-200 duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-600">
            <Trash2 size={16} /> KONFIRMASI HAPUS
          </h3>
          <button
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none disabled:opacity-50"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus akun milik <span className="font-black uppercase text-blue-950">{userToDelete.name}</span> (<span className="text-blue-950 font-bold">{userToDelete.email}</span>)? 
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5">
          <button
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 focus:outline-none disabled:opacity-50"
          >
            BATAL
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-md bg-rose-600 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-rose-700 focus:outline-none disabled:opacity-50 min-w-30 justify-center"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {isDeleting ? "MEMPROSES..." : "YA, HAPUS"}
          </button>
        </div>
      </div>
    </div>
  );
};