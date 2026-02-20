"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ContactItem } from '@/components/ui/ContactItem';

interface ContactData {
  num: string;
  label: string;
  val: string;
  sub?: string;
  href?: string;
  isCopy?: boolean;
  isExpandable?: boolean;
  mapUrl?: string;
  embedSrc?: string;
}

interface AgencyAccordionProps {
  agency: {
    id: string;
    name: string;
    desc: string;
    contacts: ContactData[];
  };
  // Secara default buka instansi urutan pertama agar user tahu fungsinya
  defaultOpen?: boolean; 
}

export const AgencyAccordion = ({ agency, defaultOpen = false }: AgencyAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      
      {/* Header Interaktif (Tombol Klik) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 group text-left focus:outline-none"
      >
        <div>
          <h2 className="text-2xl md:text-4xl font-light tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors duration-300">
            {agency.name}
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-2 font-light">
            {agency.desc}
          </p>
        </div>
        
        <div className={`ml-4 p-3 md:p-4 rounded-full transition-all duration-500 shrink-0
          ${isOpen ? 'bg-blue-50 text-blue-900' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}
        >
          <ChevronDown size={24} strokeWidth={1.5} className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Konten Dropdown (Daftar Kontak) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pt-2">
              <div className="pl-0 md:pl-12 border-l-0 md:border-l border-slate-100 flex flex-col">
                {agency.contacts.map((contact, idx) => (
                  <ContactItem 
                    key={idx}
                    number={contact.num}
                    label={contact.label}
                    value={contact.val}
                    subValue={contact.sub}
                    isExpandable={contact.isExpandable}
                    mapUrl={contact.mapUrl}
                    embedSrc={contact.embedSrc}
                    href={contact.href}
                    isCopy={contact.isCopy}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};