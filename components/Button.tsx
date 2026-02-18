import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Atualizado com hover:scale-105, active:scale-95 e transições suaves para feedback tátil
  const baseStyles = "px-8 py-3.5 rounded-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 uppercase text-sm";
  
  const variants = {
    primary: "bg-brand-red text-white hover:bg-red-700 hover:shadow-xl hover:shadow-brand-red/40",
    secondary: "bg-brand-dark text-white hover:bg-black border border-brand-dark hover:shadow-xl hover:shadow-black/20",
    outline: "border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white hover:shadow-lg hover:shadow-brand-red/20",
    gold: "bg-brand-gold text-brand-dark hover:bg-yellow-600 hover:text-white hover:shadow-xl hover:shadow-brand-gold/30"
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};