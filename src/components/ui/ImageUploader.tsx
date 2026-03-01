"use client";

import React, { useRef, ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  fileName: string;
  onFileSelect: (file: File | null) => void;
}

export const ImageUploader = ({ fileName, onFileSelect }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="w-full border-2 border-dashed border-slate-200 hover:border-blue-900 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer rounded-sm p-8 text-center group"
    >
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      <UploadCloud size={32} className="mx-auto text-slate-300 group-hover:text-blue-900 transition-colors mb-4" />
      
      {fileName ? (
        <p className="text-sm font-medium text-blue-900">{fileName}</p>
      ) : (
        <>
          <p className="text-sm font-medium text-slate-700 mb-1">Klik untuk unggah foto kondisi</p>
          <p className="text-xs text-slate-400">JPG, PNG, maksimal 5MB</p>
        </>
      )}
    </div>
  );
};