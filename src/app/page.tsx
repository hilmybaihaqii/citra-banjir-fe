// app/dashboard/page.tsx (atau file parent-nya)
import React from 'react';
import { MapWrapper } from '@/components/dashboard/MapWrapper';

export default function HomePage() {
  return (
    <div className="w-full h-full relative z-0 bg-slate-50 overflow-hidden">
      <MapWrapper />
    </div>
  );
}