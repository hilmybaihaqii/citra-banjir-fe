"use client";

import React from "react";
import Image from "next/image";
import { X, User, Lock, Eye, EyeOff, ArrowLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";

import { useLoginForm } from "@/hooks/use-login-form";
import { AGENCIES } from "@/lib/data";

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
          
          {/* Backdrop Blur Ringan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
          />

          {/* Modal Card - Solid Blue Background, Kotak (rounded-sm) */}
          <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-blue-950 rounded-sm shadow-2xl overflow-hidden border border-blue-900"
          >
            
            {/* Header Section */}
            <div className="px-6 sm:px-8 pt-8 pb-5 flex justify-between items-start border-b border-white/10">
              <div className="flex flex-col gap-1">
                <motion.h2 
                  key={logic.step}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-semibold text-white tracking-tight"
                >
                  {logic.step === "agency" ? "Pilih Instansi" : "Login"}
                </motion.h2>
                <p className="text-xs text-blue-200">
                  {logic.step === "agency" ? "Silakan pilih instansi Anda" : logic.selectedAgency?.label}
                </p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-sm text-blue-300 hover:text-white hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              
              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {logic.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-sm text-red-200 text-xs text-center overflow-hidden"
                  >
                    {logic.error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CONTENT AREA */}
              <div className="min-h-64">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: AGENCY SELECTION (5 ITEM LAYOUT) */}
                  {logic.step === "agency" ? (
                    <motion.div
                      key="agency-grid"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-wrap justify-center gap-3 sm:gap-4"
                    >
                      {AGENCIES.map((agency) => (
                        <button
                          key={agency.id}
                          onClick={() => logic.selectAgency(agency)}
                          className="group relative flex flex-col items-center justify-center gap-3 p-4 w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.67rem)] bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all duration-200"
                        >
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <Image 
                              src={agency.logo} 
                              alt={agency.label}
                              fill 
                              className="object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-blue-100 group-hover:text-white transition-colors text-center">
                            {agency.label}
                          </span>
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
                      className="flex flex-col gap-5"
                    >
                      {/* Input Username */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-blue-200 ml-1">Username</label>
                        <div className="relative group">
                          {/* Kotak Putih Untuk Input */}
                          <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 z-10">
                            <User size={18} />
                          </div>
                          <input
                            type="text"
                            required
                            className="relative w-full h-12 pl-12 pr-4 bg-white border border-transparent rounded-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                            placeholder="Ketik username"
                            value={logic.username}
                            onChange={(e) => logic.setUsername(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Input Password */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-blue-200 ml-1">Password</label>
                        <div className="relative group">
                           {/* Kotak Putih Untuk Input */}
                          <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 z-10">
                            <Lock size={18} />
                          </div>
                          <input
                            type={logic.showPassword ? "text" : "password"}
                            required
                            className="relative w-full h-12 pl-12 pr-12 bg-white border border-transparent rounded-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                            placeholder="Ketik password"
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

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          onClick={logic.goBack}
                          className="w-12 h-12 flex items-center justify-center rounded-sm border border-white/10 text-blue-200 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        
                        <button
                          type="submit"
                          disabled={logic.isLoading}
                          className="flex-1 h-12 bg-amber-400 text-blue-950 font-bold rounded-sm hover:bg-amber-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {logic.isLoading ? "Loading..." : "Masuk"}
                          {!logic.isLoading && <ChevronRight size={18} strokeWidth={2.5} />}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};