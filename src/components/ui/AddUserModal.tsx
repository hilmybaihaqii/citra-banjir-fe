import React, { useState } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";

export interface UserType {
  username: string;
  name: string;
  agencyId: string;
  role: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: UserType) => void;
}

const AGENCIES = [
  { id: "bbws", label: "BBWS Citarum" },
  { id: "bpbd", label: "BPBD Jawa Barat" },
  { id: "bpbd_kab", label: "BPBD Kab. Bandung" },
  { id: "bmkg", label: "BMKG Jawa Barat" },
  { id: "admin", label: "Citra Banjir Pusat" },
];

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    agencyId: "bbws",
    role: "admin",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  // Fungsi khusus untuk mereset form saat modal ditutup
  const handleCloseModal = () => {
    onClose();
    // Gunakan timeout kecil agar form tidak langsung reset saat animasi modal menutup
    setTimeout(() => {
      setFormData({ username: "", name: "", password: "", agencyId: "bbws", role: "admin" });
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi proses API
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Tunggu sebentar agar user melihat pesan sukses
      setTimeout(() => {
        onAdd({
          username: formData.username,
          name: formData.name,
          agencyId: formData.agencyId,
          role: formData.role
        });
        
        // Reset form setelah berhasil ditambahkan
        setFormData({ username: "", name: "", password: "", agencyId: "bbws", role: "admin" });
        setShowSuccess(false);
      }, 1500); 
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header Modal */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-950">
            <UserPlus size={18} strokeWidth={2.5} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Tambah Pengguna Baru</h3>
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
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
              <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={2} />
            </div>
            <h4 className="text-lg font-bold text-blue-950 mb-1">Berhasil Ditambahkan!</h4>
            <p className="text-sm text-slate-500">Akun {formData.name} telah aktif.</p>
          </div>
        ) : (
          /* State: Formulir Utama */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Nama Lengkap</label>
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all" 
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
                placeholder="Contoh: staff_budi"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Password Akses</label>
              <input 
                required 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all" 
              />
            </div>

            <div className="grid grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Instansi</label>
                <select 
                  name="agencyId" 
                  value={formData.agencyId} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all cursor-pointer appearance-none"
                >
                  {AGENCIES.map(agency => (
                    <option key={agency.id} value={agency.id}>{agency.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">Level Akses</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm text-blue-950 font-medium focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all cursor-pointer appearance-none"
                >
                  <option value="admin">Admin Biasa</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-6 mt-2 flex justify-end gap-3 border-t border-slate-100">
              <button 
                type="button" 
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-950 bg-white border border-slate-200 hover:border-slate-300 rounded-sm transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-950 hover:bg-blue-900 border border-blue-950 hover:border-blue-900 rounded-sm transition-all disabled:opacity-70 disabled:cursor-wait min-w-30"
              >
                {isSubmitting ? "Memproses..." : "Simpan Data"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};