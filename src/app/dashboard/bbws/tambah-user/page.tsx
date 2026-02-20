"use client";

import React, { useState } from "react";
import {
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  User,
  Lock,
  Mail,
  Save,
  CheckCircle2,
  ChevronDown,
  KeyRound,
} from "lucide-react";
import { Outfit } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function TambahUserPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"tambah" | "ganti">("tambah");

  // State terpisah untuk Tambah User
  const [tambahData, setTambahData] = useState({
    username: "",
    namaLengkap: "",
    role: "",
    password: "",
  });

  // State terpisah untuk Ganti Password
  const [gantiData, setGantiData] = useState({
    username: "",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  // Fungsi pindah tab sekaligus reset status sukses sesuai aturan ESLint
  const handleTabChange = (tab: "tambah" | "ganti") => {
    setActiveTab(tab);
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Logika Simpan ke LocalStorage untuk Log Aktivitas
    const existingLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
    let detailLog = "";
    let aksiLog = "";

    if (activeTab === "tambah") {
      aksiLog = "Tambah User Baru";
      detailLog = `Registrasi petugas: ${tambahData.namaLengkap} (${tambahData.role})`;
      // Reset form tambah
      setTambahData({ username: "", namaLengkap: "", role: "", password: "" });
    } else {
      // Cek apakah password cocok sebelum simpan
      if (gantiData.passwordBaru !== gantiData.konfirmasiPassword) {
        alert("Konfirmasi password tidak cocok!");
        return;
      }
      aksiLog = "Update Password";
      detailLog = `Pembaruan kredensial petugas: ${gantiData.username}`;
      // Reset form ganti
      setGantiData({ username: "", passwordBaru: "", konfirmasiPassword: "" });
    }

    const newLog = {
      id: Date.now(),
      admin: "Superuser_Citra",
      aksi: aksiLog,
      detail: detailLog,
      waktu: "Baru saja",
      tipe: activeTab === "tambah" ? "user" : "update",
    };

    localStorage.setItem(
      "audit_logs",
      JSON.stringify([newLog, ...existingLogs]),
    );

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div
      className={`h-screen bg-slate-100 flex flex-col ${outfit.className} overflow-hidden`}
    >
      {/* HEADER */}
      <header className="h-16 md:h-20 bg-blue-950 text-white flex items-center justify-between px-4 md:px-10 shadow-lg shrink-0 z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/dashboard/bbws"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-400"
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </Link>
          <div>
            <h1 className="text-sm md:text-xl font-black uppercase tracking-tight leading-none">
              Manajemen User
            </h1>
            <p className="hidden md:block text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
              {activeTab === "tambah"
                ? "Registrasi Akun Petugas Baru"
                : "Pembaruan Kredensial Akses"}
            </p>
          </div>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 relative rounded-full overflow-hidden border-2 border-amber-400 bg-white shadow-md">
          <Image
            src="/images/bbws.png"
            alt="Logo"
            fill
            className="object-contain p-1"
          />
        </div>
      </header>

      {/* AREA SCROLLABLE */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="max-w-2xl mx-auto">
          {/* TAB SWITCHER */}
          <div className="flex gap-1 md:gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleTabChange("tambah")}
              className={`flex-1 py-3 px-3 rounded-t-md text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-x border-t ${
                activeTab === "tambah"
                  ? "bg-white text-blue-950 border-slate-200 shadow-sm"
                  : "bg-slate-200/50 text-slate-400 border-transparent hover:bg-slate-200"
              }`}
            >
              <UserPlus size={14} /> <span>Tambah User</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("ganti")}
              className={`flex-1 py-3 px-3 rounded-t-md text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-x border-t ${
                activeTab === "ganti"
                  ? "bg-white text-blue-950 border-slate-200 shadow-sm"
                  : "bg-slate-200/50 text-slate-400 border-transparent hover:bg-slate-200"
              }`}
            >
              <KeyRound size={14} /> <span>Ganti Password</span>
            </button>
          </div>

          <div className="bg-white rounded-b-md border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-100 md:max-h-137.5">
            {/* SIDEBAR INFO */}
            <div className="w-full md:w-64 bg-blue-950 p-6 text-white flex flex-col justify-between shrink-0">
              <div>
                <div className="p-2 bg-amber-400 w-fit rounded-lg mb-4 shadow-lg">
                  {activeTab === "tambah" ? (
                    <UserPlus className="text-blue-950" size={20} />
                  ) : (
                    <KeyRound className="text-blue-950" size={20} />
                  )}
                </div>
                <h2 className="text-lg font-black uppercase leading-tight mb-2">
                  {activeTab === "tambah" ? "Akses Kontrol" : "Keamanan"}
                </h2>
                <p className="text-blue-100 text-[10px] leading-relaxed font-medium opacity-80">
                  {activeTab === "tambah"
                    ? "Daftarkan petugas baru ke dalam sistem."
                    : "Perbarui kata sandi petugas yang terdaftar secara berkala."}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-amber-400 mt-6">
                <ShieldCheck size={14} /> Keamanan Terjamin
              </div>
            </div>

            {/* FORM SIDE */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar relative bg-white">
              {isSuccess && (
                <div className="mb-4 p-3 bg-green-500 border border-green-600 rounded flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 className="text-white" size={16} />
                  <p className="text-white text-[10px] font-bold uppercase tracking-wider">
                    Berhasil Disimpan & Dicatat!
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "tambah" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest ml-1">
                        Username
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          required
                          type="text"
                          placeholder="petugas_baru"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-blue-950 font-medium outline-none"
                          value={tambahData.username}
                          onChange={(e) =>
                            setTambahData({
                              ...tambahData,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest ml-1">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          required
                          type="text"
                          placeholder="Nama Lengkap..."
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-blue-950 font-medium outline-none"
                          value={tambahData.namaLengkap}
                          onChange={(e) =>
                            setTambahData({
                              ...tambahData,
                              namaLengkap: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest ml-1">
                        Role
                      </label>
                      <div className="relative">
                        <select
                          required
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-blue-950 font-bold focus:border-blue-950 outline-none appearance-none"
                          value={tambahData.role}
                          onChange={(e) =>
                            setTambahData({
                              ...tambahData,
                              role: e.target.value,
                            })
                          }
                        >
                          <option value="">Pilih Role</option>
                          <option value="Petugas Lapangan">
                            Petugas Lapangan
                          </option>
                          <option value="Admin Dinas">Admin Dinas</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={16}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest ml-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          required
                          type="password"
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-blue-950 font-bold outline-none"
                          value={tambahData.password}
                          onChange={(e) =>
                            setTambahData({
                              ...tambahData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest ml-1">
                        Konfirmasi Username
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          required
                          type="text"
                          placeholder="Masukkan username..."
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-blue-950 outline-none font-medium"
                          value={gantiData.username}
                          onChange={(e) =>
                            setGantiData({
                              ...gantiData,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest ml-1">
                        Password Baru
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          required
                          type="password"
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-blue-950 font-bold outline-none"
                          value={gantiData.passwordBaru}
                          onChange={(e) =>
                            setGantiData({
                              ...gantiData,
                              passwordBaru: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    {/* KONFIRMASI PASSWORD BARU SUDAH KEMBALI */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-blue-900/60 uppercase tracking-widest ml-1">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          required
                          type="password"
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-blue-950 font-bold outline-none"
                          value={gantiData.konfirmasiPassword}
                          onChange={(e) =>
                            setGantiData({
                              ...gantiData,
                              konfirmasiPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-4 sticky bottom-0 bg-white pb-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-950 hover:bg-amber-400 hover:text-blue-950 text-white font-black py-3 rounded text-[10px] tracking-[0.15em] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save size={16} />{" "}
                    {activeTab === "tambah" ? "SIMPAN AKUN" : "UPDATE PASSWORD"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
