"use client";

import React from "react";
import Image from "next/image";
import { X, User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";

import { useLoginForm } from "@/hooks/use-login-form";
import { AGENCIES } from "@/lib/data";
import { ModalBackgroundPattern } from "@/components/ui/background";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose }) => {
  const logic = useLoginForm(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${outfit.variable} font-sans`}>
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-blue-950/80 backdrop-blur-md transition-all"
          />

          {/* Modal Card */}
          <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl border border-amber-500/30"
          >
            <ModalBackgroundPattern />

            <div className="relative z-10 p-6 sm:p-8">
              
              {/* HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <motion.h2 
                    key={logic.step}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-lg font-bold text-white uppercase tracking-widest"
                  >
                    {logic.step === "agency" ? "Pilih Instansi" : "Login Portal"}
                  </motion.h2>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest opacity-70">
                    {logic.step === "agency" ? "Sistem Keamanan Terpadu" : logic.selectedAgency?.label}
                  </p>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-blue-300 hover:text-amber-400 hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {logic.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="px-3 py-2 bg-red-500/20 border border-red-500/40 rounded text-red-200 text-[10px] text-center uppercase tracking-wider overflow-hidden"
                  >
                    {logic.error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CONTENT AREA */}
              <div className="min-h-64">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: AGENCY SELECTION */}
                  {logic.step === "agency" ? (
                    <motion.div
                      key="agency-grid"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {AGENCIES.map((agency) => (
                        <button
                          key={agency.id}
                          onClick={() => logic.selectAgency(agency)}
                          className="group relative flex flex-col items-center justify-center gap-3 p-4 bg-black/20 hover:bg-black/40 border border-white/5 hover:border-amber-500/50 rounded-lg transition-all duration-300"
                        >
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <Image 
                              src={agency.logo} 
                              alt={agency.label}
                              width={48} 
                              height={48} 
                              className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider group-hover:text-white transition-colors text-center">
                            {agency.label}
                          </span>
                          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${agency.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    
                    /* STEP 2: LOGIN FORM */
                    <motion.form
                      key="login-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={logic.handleSubmit}
                      className="flex flex-col gap-4"
                    >
                      {/* Username */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-blue-300 font-semibold ml-1">Username</label>
                        <div className="relative group">
                          <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-blue-400/70 group-focus-within:text-amber-400 transition-colors">
                            <User size={16} />
                          </div>
                          <input
                            type="text"
                            required
                            className="w-full h-10 pl-10 pr-4 bg-black/20 border border-blue-500/20 rounded text-sm text-white placeholder:text-blue-500/40 focus:outline-none focus:border-amber-400 focus:bg-black/30 transition-all"
                            placeholder="ID Pengguna"
                            value={logic.username}
                            onChange={(e) => logic.setUsername(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-blue-300 font-semibold ml-1">Password</label>
                        <div className="relative group">
                          <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-blue-400/70 group-focus-within:text-amber-400 transition-colors">
                            <Lock size={16} />
                          </div>
                          <input
                            type={logic.showPassword ? "text" : "password"}
                            required
                            className="w-full h-10 pl-10 pr-10 bg-black/20 border border-blue-500/20 rounded text-sm text-white placeholder:text-blue-500/40 focus:outline-none focus:border-amber-400 focus:bg-black/30 transition-all"
                            placeholder="Kata Sandi"
                            value={logic.password}
                            onChange={(e) => logic.setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => logic.setShowPassword(!logic.showPassword)}
                            className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-blue-400/50 hover:text-white transition-colors"
                          >
                            {logic.showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          type="button"
                          onClick={logic.goBack}
                          className="w-10 h-10 flex items-center justify-center rounded border border-blue-500/30 text-blue-300 hover:text-white hover:border-amber-400 hover:bg-white/5 transition-all"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        
                        <button
                          type="submit"
                          disabled={logic.isLoading}
                          className="flex-1 relative overflow-hidden h-10 bg-amber-400 text-blue-950 font-bold uppercase text-[10px] tracking-[0.2em] rounded shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                          {logic.isLoading ? "Memproses..." : "Masuk"}
                          {!logic.isLoading && <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* FOOTER */}
              <div className="mt-6 text-center pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-2 text-blue-400/60">
                  <ShieldCheck size={12} />
                  <span className="text-[9px] uppercase tracking-[0.2em]">
                    Portal Resmi 2026
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};