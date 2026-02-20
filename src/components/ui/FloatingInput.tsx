"use client";

import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isArea?: boolean;
  error?: string;
}

export const FloatingInput = ({ label, name, type = "text", value, onChange, isArea = false, error }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  
  return (
    <div className="relative w-full group mb-8">
      <div className="relative z-10">
        {isArea ? (
          <textarea
            name={name} required rows={3} value={value}
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