"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Loader2, AlertCircle, Check, ShieldCheck, ArrowRight } from 'lucide-react';

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  return mounted;
};

const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const validateInput = (name: string, value: string) => {
  switch (name) {
    case 'name':
      if (!/^[a-zA-Z\s\.\']+$/.test(value)) return "Nama hanya boleh berisi huruf.";
      if (value.length < 3) return "Nama terlalu pendek.";
      return "";
    case 'phone':
      if (!/^[0-9]+$/.test(value)) return "Hanya angka yang diperbolehkan.";
      if (value.length < 10 || value.length > 15) return "Nomor tidak valid (10-15 digit).";
      return "";
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Format email tidak valid.";
      return "";
    case 'message':
      if (value.length < 10) return "Pesan terlalu singkat.";
      if (/[<>]/.test(value)) return "Karakter < > tidak diizinkan.";
      return "";
    default: return "";
  }
};

interface InputProps {
  label: string; name: string; type?: string; value: string; 
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isArea?: boolean; error?: string;
}

const FloatingInput = ({ label, name, type = "text", value, onChange, isArea = false, error }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  
  return (
    <div className="relative w-full group mb-8">
      <div className="relative z-10">
        {isArea ? (
          <textarea
            name={name} required rows={4} value={value}
            onChange={onChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
            className={`block w-full bg-transparent border-b py-4 text-xl font-light text-slate-900 outline-none transition-all resize-none leading-relaxed
              ${error ? 'border-rose-500' : isFocused ? 'border-blue-900' : 'border-slate-200 group-hover:border-slate-300'}`}
          />
        ) : (
          <input
            type={type} name={name} required value={value}
            onChange={onChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
            className={`block w-full bg-transparent border-b py-4 text-xl font-light text-slate-900 outline-none transition-all
              ${error ? 'border-rose-500' : isFocused ? 'border-blue-900' : 'border-slate-200 group-hover:border-slate-300'}`}
          />
        )}
      </div>

      <label className={`absolute left-0 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${(isFocused || hasValue) ? '-top-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-900' : 'top-4 text-lg text-slate-400 font-light'}
          ${error ? '!text-rose-500!' : ''}`}>
        {label}
      </label>

      <div className="h-5 mt-2 overflow-hidden">
        <AnimatePresence>
          {error && (
            <motion.div initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }}
              className="text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SecurityModule = ({ onVerify, showError }: { onVerify: (status: boolean) => void, showError: boolean }) => {
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
        className="p-6 bg-emerald-50/50 border border-emerald-100 flex items-center gap-4 text-emerald-800">
        <div className="p-2 bg-emerald-100 rounded-full"><ShieldCheck size={18} /></div>
        <span className="text-xs font-bold uppercase tracking-widest">Verifikasi Berhasil</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      animate={showError ? { x: [-3, 3, -3, 3, 0] } : {}}
      transition={{ duration: 0.3 }}
      className={`p-6 bg-slate-50/50 border transition-all duration-500 relative overflow-hidden group rounded-lg
        ${(showError || status === 'error') ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100'}`}
    >
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${(showError || status === 'error') ? 'text-rose-500' : 'text-slate-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${(showError || status === 'error') ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
            Verifikasi Keamanan
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

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [securityError, setSecurityError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validateInput(name, value) });
    if (securityError) setSecurityError(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const nameE = validateInput('name', form.name); const phoneE = validateInput('phone', form.phone);
    const emailE = validateInput('email', form.email); const msgE = validateInput('message', form.message);
    if (nameE || phoneE || emailE || msgE) {
      setErrors({ name: nameE, phone: phoneE, email: emailE, message: msgE }); 
      return;
    }

    if (!verified) {
      setSecurityError(true);
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false); setStatus('success');
  };

  return (
    <div className="h-full w-full bg-white text-slate-900 font-sans overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-28 md:pt-36">
        <motion.div initial="hidden" animate="show" variants={containerVar} className="mb-20 border-b border-slate-200 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="overflow-hidden">
              <motion.span variants={itemVar} className="block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">
                Pusat Bantuan
              </motion.span>
              <motion.h1 variants={itemVar} className="text-5xl md:text-8xl font-medium tracking-tighter text-slate-900 leading-tight">
                Formulir <br /> <span className="text-slate-900">Digital.</span>
              </motion.h1>
            </div>
            <motion.p variants={itemVar} className="text-slate-500 max-w-sm text-sm leading-relaxed text-left pb-2">
              Sistem Peringatan Dini Banjir Kabupaten Bandung.<br/>
              Aspirasi Anda adalah prioritas kami.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-12 h-fit order-1"
          >
            <div className="pl-4 border-l-2 border-slate-200 py-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                 Jaminan Privasi
              </h3>
              <p className="text-slate-500 text-lg font-serif italic leading-relaxed">
                &quot;Identitas pelapor dijamin kerahasiaannya. Data digunakan murni untuk validasi lapangan.&quot;
              </p>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Resmi</span>
              <p className="text-xl font-medium text-slate-900 break-all">lapor@citrabanjir.id</p>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-8 order-2" variants={containerVar} initial="hidden" animate="show">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="bg-slate-50 p-12 md:p-16 text-center border border-slate-100 relative overflow-hidden group rounded-sm"
                >
                  <div className="w-24 h-24 bg-emerald-100/50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-light text-slate-900 mb-4 tracking-tight leading-tight">
                    Terima Kasih,<br/>Aspirasi Diterima.
                  </h3>
                  <p className="text-slate-500 mb-12 max-w-lg mx-auto text-lg leading-relaxed font-light">
                    Laporan Anda telah berhasil masuk ke sistem kami. Partisipasi Anda adalah langkah nyata menuju Kabupaten Bandung yang lebih aman dan tangguh bencana.
                  </p>
                  
                  <div>
                      <button onClick={() => { setStatus('idle'); setVerified(false); setForm({name:'', phone:'', email:'', message:''}); setErrors({name:'', phone:'', email:'', message:''}) }}
                        className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-900 transition-colors border-b border-transparent hover:border-blue-900 pb-1">
                        Kirim Laporan Lain
                      </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  variants={itemVar} 
                  initial="hidden" // Fix: Memastikan animasi dimulai dari hidden
                  animate="show"   // Fix: Memastikan animasi dijalankan ke show saat dirender ulang
                  exit="hidden"    // Opsional: untuk animasi keluar yang halus
                  onSubmit={handleSubmit} 
                  className="space-y-12" 
                  autoComplete="off"
                >
                  <input type="text" name="confirm_field" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12">
                    <FloatingInput label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} error={errors.name} />
                    <FloatingInput label="Nomor Telepon" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
                  </div>
                  <FloatingInput label="Alamat Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                  <FloatingInput label="Pesan / Aspirasi" name="message" isArea value={form.message} onChange={handleChange} error={errors.message} />

                  <div className="pt-6 border-t border-slate-100">
                    <SecurityModule onVerify={setVerified} showError={securityError} />
                  </div>

                  <div className="flex flex-col items-end gap-6 pt-6">
                    <AnimatePresence>
                      {(securityError || Object.values(errors).some(e => e)) && (
                         <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y:0}} exit={{opacity:0}} 
                           className="text-xs font-medium text-rose-500 flex items-center gap-2 bg-rose-50 px-4 py-3 rounded-md border border-rose-100">
                            <AlertCircle size={14} /> Mohon lengkapi formulir & verifikasi keamanan dengan benar.
                         </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={submitting}
                      className="group relative px-12 py-6 bg-slate-900 text-white w-full md:w-auto disabled:bg-slate-200 disabled:text-slate-400 transition-all overflow-hidden shadow-2xl hover:shadow-xl rounded-sm">
                      <span className="relative z-10 text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3">
                        {submitting ? <Loader2 className="animate-spin" size={14} /> : null} {submitting ? 'Memproses...' : 'Kirim Laporan'}
                      </span>
                      <div className="absolute inset-0 bg-blue-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}