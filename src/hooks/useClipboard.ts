"use client";

import { useState } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  
  const copy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return { copied, copy };
};