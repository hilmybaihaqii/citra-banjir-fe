"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

// Hook internal untuk Next.js Hydration
const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  return mounted;
};

interface SecurityModuleProps {
  onVerify: (status: boolean) => void;
  showError: boolean;
}

export const SecurityModule = ({ onVerify, showError }: SecurityModuleProps) => {
  const isMounted = useMounted();
  const [vals, setVals] = useState({ a: 0, b: 0 });
  const [ans, setAns] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        setVals({ a: Math.floor(Math.random() * 9) + 1, b: Math.floor(Math.random() * 9) + 1 });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  const check = () => {
    if (parseInt(ans) === vals.a + vals.b) {
      setStatus('success'); onVerify(true);
    } else {
      setStatus('error'); setAns(''); setTimeout(() => setStatus('idle'), 800);
    }
  };

  if (!isMounted) return <div className="h-24 w-full bg-slate-50 animate-pulse rounded-lg border border-slate-100"></div>;

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} 
        className="p-6 bg-emerald-50/50 border border-emerald-100 flex items-center gap-4 text-emerald-800 rounded-sm">
        <div className="p-2 bg-emerald-100 rounded-full"><ShieldCheck size={18} /></div>
        <span className="text-xs font-bold uppercase tracking-widest">Verifikasi Berhasil</span>
      </motion.div>
    );
  }

  return (
    <motion.div animate={showError ? { x: [-3, 3, -3, 3, 0] } : {}} transition={{ duration: 0.3 }}
      className={`p-6 bg-slate-50/50 border transition-all duration-500 relative overflow-hidden group rounded-sm
        ${(showError || status === 'error') ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100'}`}>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${(showError || status === 'error') ? 'text-rose-500' : 'text-slate-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${(showError || status === 'error') ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
            Verifikasi Keamanan Lapangan
          </label>
          {(showError || status === 'error') && (
            <span className="text-[10px] text-rose-500 font-bold tracking-widest">
              {status === 'error' ? 'JAWABAN SALAH' : 'WAJIB DIISI'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="font-mono text-xl text-slate-600 tracking-widest bg-white px-3 py-1 border border-slate-200 rounded-sm">
            {vals.a} + {vals.b}
          </div>
          <span className="text-slate-300 mx-1 text-lg">=</span>
          <input 
            type="tel" value={ans} onChange={(e) => setAns(e.target.value)} placeholder="?" 
            onKeyDown={(e) => e.key === 'Enter' && check()}
            className={`w-20 bg-transparent border-b-2 py-1 text-xl font-mono text-center outline-none transition-all
              ${(status === 'error' || showError) ? 'border-rose-400 text-rose-600 placeholder:text-rose-300' : 'border-slate-300 focus:border-blue-900'}`} 
          />
          <button type="button" onClick={check} disabled={!ans} 
            className="ml-auto w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-blue-900 disabled:opacity-20 transition-all hover:scale-105 active:scale-95">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};