"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { EmergencyReportForm } from '@/components/forms/EmergencyReportForm';

const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function ReportPage() {
  return (
    <div className="h-full w-full pt-28 md:pt-32 bg-white text-slate-900 font-sans overflow-y-auto selection:bg-blue-100 selection:text-blue-900 relative">
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-4 md:pt-10">
        
        <motion.div initial="hidden" animate="show" variants={containerVar} className="mb-12 md:mb-16 border-b border-slate-200 pb-8 md:pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.span variants={itemVar} className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
               Form Tanggap Darurat
              </motion.span>
              <motion.h1 variants={itemVar} className="text-4xl md:text-7xl font-medium tracking-tighter text-slate-900 leading-tight pb-2">
                Lapor <br /> <span className="text-slate-900">Kejadian.</span>
              </motion.h1>
            </div>
            <motion.div variants={itemVar} className="flex flex-col gap-2 text-left md:text-right items-start md:items-end pb-2">
              <p className="text-slate-500 max-w-sm text-xs md:text-sm leading-relaxed">
                Sistem Pelaporan Mandiri Masyarakat.<br/>
                Data akurat Anda mempercepat evakuasi.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-12 h-fit"
          >
            <div className="bg-slate-50 p-6 md:p-8 border border-slate-100 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                 Panduan Pelaporan
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <span className="text-blue-900 font-mono text-sm mt-0.5">01</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Lokasi Presisi</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Sertakan nama jalan, RT/RW, atau patokan terdekat agar tim mudah menemukan lokasi.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-900 font-mono text-sm mt-0.5">02</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Bukti Visual</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Unggah 1 foto yang paling mewakili kondisi banjir atau kerusakan saat ini.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-900 font-mono text-sm mt-0.5">03</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Prioritas Evakuasi</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Sebutkan di deskripsi jika ada lansia, balita, atau orang sakit yang terjebak.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-8" variants={containerVar} initial="hidden" animate="show">
            <EmergencyReportForm />
          </motion.div>

        </div>
      </div>
    </div>
  );
}