"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Loader2, AlertCircle, Check } from 'lucide-react';

// Re-use komponen UI yang sudah ada
import { FloatingInput } from '@/components/ui/FloatingInput';
import { SecurityModule } from '@/components/ui/SecurityModule';

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

export const FeedbackForm = () => {
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
    if (honeypot) return; // Spam protection

    const nameE = validateInput('name', form.name); 
    const phoneE = validateInput('phone', form.phone);
    const emailE = validateInput('email', form.email); 
    const msgE = validateInput('message', form.message);
    
    if (nameE || phoneE || emailE || msgE) {
      setErrors({ name: nameE, phone: phoneE, email: emailE, message: msgE }); 
      return;
    }

    if (!verified) {
      setSecurityError(true);
      return;
    }

    setSubmitting(true);
    // Simulasi pengiriman data
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false); 
    setStatus('success');
  };

  const resetForm = () => {
    setStatus('idle'); 
    setVerified(false); 
    setForm({name:'', phone:'', email:'', message:''}); 
    setErrors({name:'', phone:'', email:'', message:''});
  };

  return (
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
            Laporan Anda telah berhasil masuk ke sistem kami. Partisipasi Anda adalah langkah nyata menuju wilayah yang lebih aman dan tangguh bencana.
          </p>
          
          <div>
            <button onClick={resetForm}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-900 transition-colors border-b border-transparent hover:border-blue-900 pb-1">
              Kirim Masukan Lain
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form 
          key="form"
          variants={itemVar} 
          initial="hidden" 
          animate="show" 
          exit="hidden" 
          onSubmit={handleSubmit} 
          className="space-y-12" 
          autoComplete="off"
        >
          {/* Honeypot field - hidden from users */}
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
                {submitting && <Loader2 className="animate-spin" size={14} />} 
                {submitting ? 'Memproses...' : 'Kirim Laporan'}
              </span>
              <div className="absolute inset-0 bg-blue-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
};