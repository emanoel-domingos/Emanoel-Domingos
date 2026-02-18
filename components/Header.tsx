import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Obras', href: '#obras' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Ensaios', href: '#blog' },
    { name: 'Depoimentos', href: '#legado' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header className={`fixed w-full z-40 transition-all duration-500 ${isScrolled ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg py-3 border-b border-brand-gold/20' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="group">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Ed Willians Vigna Logo" 
              className={`transition-all duration-300 ${isScrolled ? 'h-10' : 'h-14 md:h-16'} object-contain drop-shadow-lg`} 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex flex-col leading-none">
              <span className={`font-display font-bold tracking-widest text-brand-gold transition-colors ${isScrolled ? 'text-lg' : 'text-2xl drop-shadow-md'}`}>ED WILLIANS</span>
              <span className="text-xs text-white tracking-[0.3em] group-hover:text-brand-red transition-colors duration-300">VIGNA</span>
            </div>
          )}
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-sm uppercase tracking-widest font-medium transition-colors hover:text-brand-gold ${isScrolled ? 'text-white' : 'text-white/90 hover:text-white'}`}
            >
              {link.name}
            </a>
          ))}
          <Button variant="gold" onClick={() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })} className="!py-2 !px-6 !text-xs">
            Agendar
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-dark shadow-2xl py-8 px-6 flex flex-col space-y-4 animate-in slide-in-from-top-5 border-t border-brand-gold/20">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-lg font-medium text-white border-b border-white/10 pb-3 hover:text-brand-gold uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button 
            fullWidth 
            variant="gold"
            onClick={() => {
              setIsMenuOpen(false);
              document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Agendar
          </Button>
        </div>
      )}
    </header>
  );
};