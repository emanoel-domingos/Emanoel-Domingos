import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/5532984249779"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <div className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-xl hover:bg-[#128C7E] transition-colors">
        {/* Pulse Effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
        
        {/* Icon */}
        <MessageCircle className="w-8 h-8 text-white relative z-10" fill="currentColor" />
        
        {/* Tooltip on Hover */}
        <span className="absolute right-full mr-4 bg-white text-brand-navy px-3 py-1 rounded-lg shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100">
          Fale Conosco
        </span>
      </div>
    </a>
  );
};