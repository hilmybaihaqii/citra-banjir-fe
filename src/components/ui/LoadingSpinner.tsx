import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Memuat data...", 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-slate-500 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" strokeWidth={2} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};