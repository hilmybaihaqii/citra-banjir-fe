"use client";

import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, Clock, MapPin, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';

const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
};

interface ContactItemProps {
  number: string;
  label: string;
  value: string;
  subValue?: string;
  href?: string;
  isCopy?: boolean;
  isExpandable?: boolean;
  mapUrl?: string;       
  embedSrc?: string;      
}

const ContactItem = ({ number, label, value, subValue, href, isCopy, isExpandable, mapUrl, embedSrc }: ContactItemProps) => {
  const { copied, copy } = useClipboard();
  const [isExpanded, setIsExpanded] = useState(false);
  const Wrapper = (href && !isExpandable ? Link : 'div') as React.ElementType;
  
  const handleClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    } else if (isCopy) {
      copy(value);
    }
  };

  const props = (href && !isExpandable) 
    ? { href, target: "_blank" } 
    : { onClick: handleClick };

  return (
    <motion.div variants={itemVar} className="w-full">
      <div className="border-t border-slate-200">
        <Wrapper {...props} className="group relative flex items-start gap-6 py-10 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-slate-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10" />

          <span className="hidden md:block text-xs font-mono text-slate-300 pt-1 group-hover:text-blue-600 transition-colors duration-300">
            {number}
          </span>
          
          <div className="flex-1 relative z-10">
            <div className="flex justify-between items-start">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-3 group-hover:text-blue-900 transition-colors duration-300">
                {label}
              </h3>
              
              <div className={`text-slate-300 group-hover:text-blue-600 transition-all duration-500 transform ${isExpandable ? 'opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                {copied ? <Check size={20} className="text-emerald-500" /> : 
                 isExpandable ? <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} /> :
                 href ? <ArrowUpRight size={20} /> : 
                 isCopy && <Copy size={20} />}
              </div>
            </div>

            <p className="text-2xl md:text-4xl font-light text-slate-900 leading-tight group-hover:text-blue-900 transition-colors duration-300">
              {value}
            </p>
            
            {subValue && (
              <p className="mt-3 text-sm text-slate-500 font-light leading-relaxed max-w-md group-hover:text-slate-600 transition-colors">
                {subValue}
              </p>
            )}
          </div>
        </Wrapper>

        <AnimatePresence>
          {isExpandable && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-10 pl-0 md:pl-[calc(2.5rem)]"> 
                <div className="relative w-full h-72 md:h-96 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner group/map">
                  {embedSrc ? (
                    <iframe 
                      src={embedSrc}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">Peta tidak tersedia</div>
                  )}
                  
                  <div className="absolute bottom-4 right-4 z-20">
                    <Link 
                      href={mapUrl || "#"} 
                      target="_blank" 
                      className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-950 shadow-lg border border-white/50 hover:bg-blue-900 hover:text-white hover:border-blue-900 hover:scale-105 transition-all duration-300"
                    >
                       <MapPin size={14} strokeWidth={2.5} />
                       Buka Google Maps
                    </Link>
                  </div>

                  <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-black/5 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function ContactPage() {
  return (
    <div className="h-full w-full bg-white text-slate-900 font-sans overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-28 md:pt-36">
        
        <motion.div 
          initial="hidden"
          animate="show"
          variants={containerVar}
          className="mb-20 border-b border-slate-200 pb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.span variants={itemVar} className="block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">
                Hubungi Kami
              </motion.span>
              <motion.h1 variants={itemVar} className="text-5xl md:text-8xl font-medium tracking-tighter text-slate-900 leading-tight pb-2">
                Layanan <br /> <span className="text-slate-900">Terpadu.</span>
              </motion.h1>
            </div>
            <motion.p variants={itemVar} className="text-slate-500 max-w-sm text-sm leading-relaxed text-left pb-2">
              BBWS Citarum & Citra Banjir.<br/>
              Siap melayani informasi kebencanaan 24/7.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-12"
          >
             <div className="bg-slate-50 p-8 border border-slate-100 relative overflow-hidden group rounded-lg shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="flex items-center gap-3 mb-8 text-slate-900">
                   <Clock size={20} />
                   <span className="text-xs font-bold uppercase tracking-widest">Waktu Operasional</span>
                </div>
                
                <div className="space-y-8 relative z-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Pelayanan Kantor</p>
                    <p className="text-xl font-medium text-slate-900">Senin - Jumat</p>
                    <p className="text-slate-500 text-sm mt-1">08:00 - 16:00 WIB</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Monitoring Sistem</p>
                    <p className="text-xl font-medium text-slate-900">Setiap Hari</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                       <p className="text-emerald-600 font-medium text-sm">Aktif 24 Jam</p>
                    </div>
                  </div>
                </div>
             </div>

             <div className="pl-4 border-l-2 border-slate-200">
                <p className="text-slate-400 text-lg font-serif italic leading-relaxed">
                  &quot;Menghubungkan masyarakat dengan informasi keselamatan yang akurat dan terpercaya.&quot;
                </p>
             </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-8"
            variants={containerVar}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-col">
              
              <ContactItem 
                number="01"
                label="Kantor Pusat"
                value="BBWS Citarum"
                subValue="Jl. Inspeksi Cidurian, Soekarno Hatta, Bandung, Jawa Barat. (Klik untuk melihat peta)"
                isExpandable={true}
                mapUrl="https://maps.app.goo.gl/Cc26UcPjXXFpXEEKA"
                embedSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.5522693328426!2d107.6693033747573!3d-6.948382093051811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c2a75bc7e2f3%3A0xd91e40072eba9c8c!2sBalai%20Besar%20Wilayah%20Sungai%20Citarum!5e1!3m2!1sid!2sid!4v1769700755107!5m2!1sid!2sid"
              />

              <ContactItem 
                number="02"
                label="Email Resmi"
                value="lapor@citrabanjir.id"
                subValue="Gunakan saluran ini untuk keperluan data resmi, kerjasama dinas, dan administrasi."
                isCopy
              />

              <ContactItem 
                number="03"
                label="Call Center"
                value="+62 812-3456-7890"
                subValue="Saluran respon cepat untuk pelaporan darurat dan koordinasi lapangan."
                href="https://wa.me/6281234567890"
              />

              <ContactItem 
                number="04"
                label="Website"
                value="citrabanjir.id"
                subValue="Portal informasi utama peringatan dini banjir."
                href="https://citrabanjir.id"
              />

              <motion.div variants={itemVar} className="border-t border-slate-200" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}