import React, { useState } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";

export interface UserType {
  username: string;
  name: string;
  agencyId: string;
  role: string;
  password?: string;
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

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
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

  const handleCloseModal = () => {
    onClose();
    setTimeout(() => {
      setFormData({
        username: "",
        name: "",
        password: "",
        agencyId: "bbws",
        role: "admin",
      });
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        onAdd({
          username: formData.username,
          name: formData.name,
          agencyId: formData.agencyId,
          role: formData.role,
          password: formData.password,
        });

        setFormData({
          username: "",
          name: "",
          password: "",
          agencyId: "bbws",
          role: "admin",
        });
        setShowSuccess(false);
      }, 1500);
    }, 800);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3 text-blue-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-md text-blue-700">
              <UserPlus size={18} strokeWidth={2.5} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">
              Tambah Pengguna Baru
            </h3>
          </div>
          {!showSuccess && (
            <button
              onClick={handleCloseModal}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center p-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-50 bg-emerald-100">
              <CheckCircle2
                size={32}
                className="text-emerald-600"
                strokeWidth={2.5}
              />
            </div>
            <h4 className="mb-1 text-lg font-black tracking-tight text-blue-950">
              Berhasil Ditambahkan!
            </h4>
            <p className="text-base font-medium text-slate-500">
              Akun{" "}
              <span className="font-bold text-slate-700">{formData.name}</span>{" "}
              telah aktif.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Username <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Password Akses <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Instansi <span className="text-rose-500">*</span>
                </label>
                <select
                  name="agencyId"
                  value={formData.agencyId}
                  onChange={handleChange}
                  className="w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base text-blue-950 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
                >
                  {AGENCIES.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Level Akses <span className="text-rose-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base text-blue-950 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="rounded-md border border-slate-200 bg-slate-50 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-100 hover:text-blue-950 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32 rounded-md bg-blue-950 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-blue-900 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? "MEMPROSES..." : "Daftarkan Akun"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
