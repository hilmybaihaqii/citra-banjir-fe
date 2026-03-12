"use client";

import React from "react";
import { X, Lock, Eye, EyeOff, ChevronRight, Mail, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";

import { useLoginForm } from "@/hooks/use-login-form";

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
        <div className={`fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 ${outfit.variable} font-sans`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all"
          />
          <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-blue-950 rounded-sm shadow-2xl overflow-hidden border border-blue-900"
          >

            <div className="px-6 sm:px-8 pt-8 pb-6 flex justify-between items-start border-b border-white/10">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Selamat Datang
                </h2>
                <p className="text-xs text-blue-200/80">
                  Silakan masukkan email dan password Anda.
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-sm text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence>
                {logic.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-3 p-3.5 bg-red-950/40 border border-red-500/30 rounded-sm text-red-200">
                      <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm leading-snug">{logic.error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <form
                  onSubmit={logic.handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-blue-200 ml-1">Email</label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 z-10">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        className="relative w-full h-12 pl-12 pr-4 bg-white border border-transparent rounded-sm text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder="Email"
                        value={logic.email}
                        onChange={(e) => logic.setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-blue-200 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 z-10">
                        <Lock size={18} />
                      </div>
                      <input
                        type={logic.showPassword ? "text" : "password"}
                        required
                        className="relative w-full h-12 pl-12 pr-12 bg-white border border-transparent rounded-sm text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder="Password"
                        value={logic.password}
                        onChange={(e) => logic.setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => logic.setShowPassword(!logic.showPassword)}
                        className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none z-10"
                      >
                        {logic.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={logic.isLoading}
                      className="w-full h-12 bg-amber-400 text-blue-950 font-bold rounded-sm hover:bg-amber-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {logic.isLoading ? "Memproses..." : "Masuk"}
                      {!logic.isLoading && <ChevronRight size={18} strokeWidth={2.5} />}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};