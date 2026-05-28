"use client";

import React from 'react';
import { Check } from 'lucide-react';

export const severityLevels = [
  { id: 'ringan', label: 'Ringan', desc: 'Genangan < 30cm', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'sedang', label: 'Sedang', desc: 'Air masuk rumah', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'parah', label: 'Parah', desc: 'Akses terputus', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

interface SeveritySelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export const SeveritySelector = ({ selected, onChange }: SeveritySelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {severityLevels.map((lvl) => (
        <button
          type="button"
          key={lvl.id}
          onClick={() => onChange(lvl.id)}
          className={`p-4 border text-left rounded-sm transition-all duration-300 relative overflow-hidden
            ${selected === lvl.id ? lvl.color : 'bg-transparent border-slate-200 text-slate-600 hover:border-slate-300'}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-lg">{lvl.label}</span>
            {selected === lvl.id && <Check size={16} strokeWidth={2.5} />}
          </div>
          <span className={`text-xs ${selected === lvl.id ? 'opacity-80' : 'text-slate-400'}`}>
            {lvl.desc}
          </span>
        </button>
      ))}
    </div>
  );
};