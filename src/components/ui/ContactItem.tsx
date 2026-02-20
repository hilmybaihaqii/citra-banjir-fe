"use client";

import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, ChevronDown, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useClipboard } from '@/hooks/useClipboard';

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

export const ContactItem = ({ number, label, value, subValue, href, isCopy, isExpandable, mapUrl, embedSrc }: ContactItemProps) => {
  const { copied, copy } = useClipboard();
  const [isExpanded, setIsExpanded] = useState(false);
  const Wrapper = (href && !isExpandable ? Link : 'div') as React.ElementType;
  
  const handleClick = () => {
    if (isExpandable) setIsExpanded(!isExpanded);
    else if (isCopy) copy(value);
  };

  const props = (href && !isExpandable) ? { href, target: "_blank" } : { onClick: handleClick };

  return (
    // FIX: Menggunakan div biasa agar jauh lebih ringan dan tidak konflik dengan Accordion
    <div className="w-full">
      <div className="border-t border-slate-200">
        <Wrapper {...props} className="group relative flex items-start gap-6 py-8 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-slate-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10" />

          <span className="hidden md:block text-xs font-mono text-slate-300 pt-1 group-hover:text-blue-600 transition-colors duration-300">
            {number}
          </span>
          
          <div className="flex-1 relative z-10">
            <div className="flex justify-between items-start">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2 group-hover:text-blue-900 transition-colors duration-300">
                {label}
              </h3>
              
              <div className={`text-slate-300 group-hover:text-blue-600 transition-all duration-500 transform ${isExpandable ? 'opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                {copied ? <Check size={18} className="text-emerald-500" /> : 
                 isExpandable ? <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} /> :
                 href ? <ArrowUpRight size={18} /> : 
                 isCopy && <Copy size={18} />}
              </div>
            </div>

            <p className="text-xl md:text-2xl font-light text-slate-900 leading-tight group-hover:text-blue-900 transition-colors duration-300">
              {value}
            </p>
            
            {subValue && (
              <p className="mt-2 text-sm text-slate-500 font-light leading-relaxed max-w-md group-hover:text-slate-600 transition-colors">
                {subValue}
              </p>
            )}
          </div>
        </Wrapper>

        {/* Area Dropdown Peta */}
        <AnimatePresence>
          {isExpandable && isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-8 pl-0 md:pl-[calc(2.5rem)]"> 
                <div className="relative w-full h-64 bg-slate-100 rounded-sm overflow-hidden border border-slate-200 shadow-inner group/map">
                  {embedSrc ? (
                    <iframe src={embedSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">Peta tidak tersedia</div>
                  )}
                  <div className="absolute bottom-4 right-4 z-20">
                    <Link href={mapUrl || "#"} target="_blank" className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-950 shadow-lg border border-white/50 hover:bg-blue-900 hover:text-white hover:border-blue-900 hover:scale-105 transition-all duration-300">
                       <MapPin size={14} strokeWidth={2.5} /> Buka Google Maps
                    </Link>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-black/5 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};