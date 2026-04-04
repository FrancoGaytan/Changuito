import React from 'react';

export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 text-stone-400 transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
