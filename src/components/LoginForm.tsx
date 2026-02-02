"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
});

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalBackgroundPattern = () => {
  const topoSVG = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E`;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-blue-950">
      <div 
        className="absolute inset-0 w-full h-full opacity-40"
        style={{ backgroundImage: `url("${topoSVG}")`, backgroundSize: '60px 60px', backgroundRepeat: 'repeat' }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-950/40 to-blue-950/95"></div>
    </div>
  );
};

export const LoginForm = ({ isOpen, onClose }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-100 flex items-center justify-center px-4 ${outfit.className}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-all"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-100 overflow-hidden bg-blue-950 border border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm" 
          >
            <ModalBackgroundPattern />

            <div className="relative z-10 p-8">
              <div className="flex justify-between items-start mb-8">
                 <div className="flex flex-col gap-1">
                    <h2 className="text-md font-bold text-white uppercase tracking-widest">
                      Selamat <span className="text-amber-400">Datang</span>
                    </h2>
                    <p className="text-[8px] text-blue-200 uppercase tracking-widest opacity-70">
                       BBWS Citarum Access
                    </p>
                 </div>
                 <button 
                  onClick={onClose}
                  className="text-blue-300 hover:text-white transition-colors hover:rotate-90 duration-300"
                >
                   <X size={20} />
                 </button>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                {/* Username Input */}
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest text-blue-200 font-medium ml-1">Username</label>
                   <div className="relative group">
                      {/* Icon Container */}
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-blue-900/60 group-focus-within:text-amber-600 transition-colors pointer-events-none">
                        <User size={18} strokeWidth={2} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Masukan Username"
                        className="w-full h-11 pl-10 pr-4 bg-white border border-blue-100 rounded-sm text-sm text-black placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
                      />
                   </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest text-blue-200 font-medium ml-1">Password</label>
                   <div className="relative group">
                      {/* Icon Container */}
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-blue-900/60 group-focus-within:text-amber-600 transition-colors pointer-events-none">
                        <Lock size={18} strokeWidth={2} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Masukan Password"
                        className="w-full h-11 pl-10 pr-10 bg-white border border-blue-100 rounded-sm text-sm text-black placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
                </div>

                <div className="pt-2">
                  <button className="relative w-full overflow-hidden h-11 bg-amber-400 rounded-sm group shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-300">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative flex items-center justify-center gap-2 text-blue-950 font-bold uppercase text-xs tracking-[0.2em]">
                      Masuk <LogIn size={14} strokeWidth={3} />
                    </span>
                  </button>
                </div>

              </form>

              <div className="mt-8 text-center border-t border-white/5 pt-4">
                 <p className="text-[9px] text-blue-400 uppercase tracking-widest">
                   © 2026 Citra Banjir
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};