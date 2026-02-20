"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FeedbackForm } from '@/components/forms/FeedbackForm';

const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function FeedbackPage() {
  return (
    <div className="h-full w-full bg-white text-slate-900 font-sans overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Noise Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-28 md:pt-36">
        
        {/* Header Section */}
        <motion.div initial="hidden" animate="show" variants={containerVar} className="mb-20 border-b border-slate-200 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="overflow-hidden">
              <motion.span variants={itemVar} className="block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">
                Pusat Bantuan & Layanan
              </motion.span>
              <motion.h1 variants={itemVar} className="text-5xl md:text-8xl font-medium tracking-tighter text-slate-900 leading-tight">
                Formulir <br /> <span className="text-slate-900">Digital.</span>
              </motion.h1>
            </div>
            <motion.p variants={itemVar} className="text-slate-500 max-w-sm text-sm leading-relaxed text-left pb-2">
              Sistem Informasi Bencana Terpadu.<br/>
              Aspirasi dan masukan Anda sangat berarti bagi pengembangan kami.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Privacy Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-12 h-fit order-1"
          >
            <div className="pl-4 border-l-2 border-slate-200 py-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                 Jaminan Privasi
              </h3>
              <p className="text-slate-500 text-lg font-serif italic leading-relaxed">
                &quot;Identitas pelapor dijamin kerahasiaannya. Data digunakan murni untuk validasi lapangan dan pengembangan sistem.&quot;
              </p>
            </div>
            
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Resmi Pengaduan</span>
              <p className="text-xl font-medium text-slate-900 break-all">lapor@citrabanjir.id</p>
            </div>
          </motion.div>

          {/* Right Column - The Feedback Form */}
          <motion.div className="lg:col-span-8 order-2" variants={containerVar} initial="hidden" animate="show">
             <FeedbackForm />
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}