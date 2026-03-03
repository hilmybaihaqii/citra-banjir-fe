import React, { useState } from "react";
import { X, CheckCircle2, Loader2, User } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userToDelete: { name: string; username: string } | null;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, onConfirm, userToDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen || !userToDelete) return null;

  const handleConfirm = () => {
    setIsDeleting(true);
    // Simulasi API Call
    setTimeout(() => {
      setIsDeleting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onConfirm();
        setShowSuccess(false);
      }, 1500); 
    }, 1200);
  };

  const handleCloseModal = () => {
    if (isDeleting) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity" 
        onClick={handleCloseModal} 
      />

      <div className="relative w-full max-w-100 overflow-hidden rounded-md bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {!showSuccess && (
          <button 
            onClick={handleCloseModal} 
            className="absolute right-4 top-4 z-10 rounded-full p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        )}

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 size={32} strokeWidth={1.5} />
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Data Terhapus</h4>
            <p className="mt-1 text-sm text-slate-500">
              Akun <span className="font-medium text-slate-900">@{userToDelete.username}</span> berhasil dihapus.
            </p>
          </div>
        ) : (
          <div>
            <div className="p-8">
              <div className="mb-6 text-left">
                <h3 className="text-xl font-semibold text-slate-900">Hapus Pengguna</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Apakah Anda yakin ingin menghapus akun ini? Seluruh data yang terkait akan terhapus secara permanen.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-md border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 shadow-sm">
                  <User size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-semibold text-slate-900">{userToDelete.name}</p>
                  <p className="truncate text-xs text-slate-500 italic">@{userToDelete.username}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-t border-slate-50 bg-white px-8 py-6">
              <button 
                onClick={handleCloseModal}
                disabled={isDeleting}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isDeleting}
                className="flex-[1.5] flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-[0.98] disabled:bg-rose-400 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Ya, Hapus Akun"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};