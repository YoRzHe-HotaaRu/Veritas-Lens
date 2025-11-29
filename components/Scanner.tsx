import React from 'react';

export const Scanner: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
      
      {/* Scanning Animation Layer */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(0deg,transparent_0%,#3b82f6_50%,transparent_100%)] bg-[length:100%_200%] animate-scan"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Image Forensics</h3>
        <p className="text-slate-500 max-w-sm">
          Our models are examining lighting consistency, anatomical structure, and diffusion artifacts...
        </p>
      </div>
    </div>
  );
};

// Add to global styles or tailwind config usually, but relying on arbitrary values/embedded styles for this prompt constraint.
// See index.html for specific font loading.
