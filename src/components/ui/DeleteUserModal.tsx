import React, { useState } from "react";
import { AlertTriangle, X, Trash2, CheckCircle2 } from "lucide-react";

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

    // Simulasi proses API penghapusan
    setTimeout(() => {
      setIsDeleting(false);
      setShowSuccess(true);
      
      // Tunggu sebentar agar user melihat pesan sukses, lalu tutup modal & jalankan fungsi hapus di tabel
      setTimeout(() => {
        onConfirm();
        // Reset state setelah modal tertutup oleh fungsi onConfirm
        setShowSuccess(false);
      }, 1500); 
    }, 800);
  };

  const handleCloseModal = () => {
    onClose();
    // Reset state dengan jeda waktu sedikit agar tidak terlihat berkedip saat animasi menutup
    setTimeout(() => {
      setIsDeleting(false);
      setShowSuccess(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header Modal */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-rose-600">
            <Trash2 size={18} strokeWidth={2.5} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Hapus Pengguna</h3>
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

        {/* State: Notifikasi Sukses */}
        {showSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 border border-rose-100">
              <CheckCircle2 size={32} className="text-rose-500" strokeWidth={2} />
            </div>
            <h4 className="text-lg font-bold text-rose-950 mb-1">Berhasil Dihapus!</h4>
            <p className="text-sm text-slate-500">Akses untuk {userToDelete.name} telah dicabut permanen.</p>
          </div>
        ) : (
          /* State: Konfirmasi Utama */
          <div className="p-6 space-y-5">
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mb-4 border border-rose-100">
                <AlertTriangle size={26} className="text-rose-500" strokeWidth={2} />
              </div>
              <h4 className="text-sm font-bold text-blue-950 mb-2">Konfirmasi Pencabutan Akses</h4>
              {/* max-w-[280px] sudah diganti menjadi max-w-70 di bawah ini */}
              <p className="text-xs text-slate-500 mb-5 leading-relaxed max-w-70">
                Tindakan ini tidak dapat dibatalkan. Anda yakin ingin menghapus data pengguna ini dari sistem?
              </p>
              
              <div className="w-full bg-slate-50 border border-slate-200 rounded-sm p-4 text-left flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-slate-500 text-xs font-bold uppercase">
                    {userToDelete.name.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-blue-950 text-sm">{userToDelete.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium tracking-wide">@{userToDelete.username}</p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 mt-2 flex justify-end gap-3 border-t border-slate-100">
              <button 
                onClick={handleCloseModal}
                disabled={isDeleting}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-950 bg-white border border-slate-200 hover:border-slate-300 rounded-sm transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isDeleting}
                className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 border border-rose-600 hover:border-rose-700 rounded-sm transition-all disabled:opacity-70 disabled:cursor-wait min-w-30"
              >
                {isDeleting ? "Memproses..." : "Hapus Data"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};