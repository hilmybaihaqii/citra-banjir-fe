"use client";

import React, { useState } from "react";
import { X, Loader2, User, AlertCircle } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; 
  userToDelete: { name: string; email: string } | null; 
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, onConfirm, userToDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !userToDelete) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await onConfirm(); 
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Gagal menghapus pengguna.";
      setErrorMsg(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (isDeleting) return;
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={handleCloseModal} 
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-sm bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        <button 
          onClick={handleCloseModal} 
          className="absolute right-4 top-4 z-10 rounded-sm p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 pt-0.5">
              <h3 className="text-lg font-medium text-slate-900">Hapus Pengguna</h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white border border-slate-200 text-slate-400">
              <User size={18} strokeWidth={1.5} />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{userToDelete.name}</p>
              <p className="truncate text-xs text-slate-500">{userToDelete.email}</p>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 flex items-start gap-2.5 rounded-sm border border-rose-200 bg-rose-50 p-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="text-sm leading-snug">{errorMsg}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 bg-slate-50 px-6 py-4 border-t border-slate-200">
          <button 
            onClick={handleCloseModal} 
            disabled={isDeleting} 
            className="rounded-sm px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 focus:outline-none disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={isDeleting} 
            className="flex items-center justify-center gap-2 rounded-sm bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:bg-rose-400 disabled:cursor-not-allowed min-w-22.5"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                Proses
              </>
            ) : (
              "Hapus"
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
};