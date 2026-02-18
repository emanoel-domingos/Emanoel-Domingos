import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-95 duration-300 relative border-t-4 border-brand-red">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-50 p-4">
            <CheckCircle className="w-12 h-12 text-brand-red animate-bounce" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-brand-dark mb-2 font-display">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <button
          onClick={onClose}
          className="w-full bg-brand-red text-white font-bold py-3 rounded hover:bg-red-700 transition-colors uppercase tracking-widest text-xs"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};