import React, { useState } from 'react';
import { X, Calendar, ShoppingCart, BookOpen, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './FirebaseProvider';

export interface BookType {
  id: number;
  title: string;
  subtitle: string;
  cover: string;
  icon?: React.ElementType; // Adicionado para suporte a ícones
  year: string;
  description: string;
  pages?: string;
  link?: string;
  isAvailable: boolean;
}

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookType | null;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ isOpen, onClose, book }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !book) return null;

  const handlePurchase = () => {
    if (!book.link) return;
    
    setIsPurchasing(true);
    
    // Simula um delay para feedback visual antes de abrir o link
    setTimeout(() => {
      window.open(book.link, '_blank');
      setIsPurchasing(false);
    }, 1000);
  };

  const handleSubmitNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !book) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'launch_notifications'), {
        email,
        bookId: book.id,
        bookTitle: book.title,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setEmail('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'launch_notifications');
    } finally {
      setIsSubmitting(false);
    }
  };

  const BookIcon = book.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col md:flex-row transform scale-100 animate-in zoom-in-95 duration-300">
        
        {/* Botão Fechar Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 rounded-full text-brand-dark md:hidden backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Coluna da Imagem / Ícone */}
        <div className="w-full md:w-2/5 relative bg-brand-gray flex items-center justify-center p-8 border-r border-gray-100">
            <div className="relative shadow-2xl rounded w-48 md:w-64 transform transition-transform hover:scale-105 duration-500 bg-white aspect-[2/3] flex items-center justify-center overflow-hidden">
                {BookIcon ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center">
                      <BookIcon className="w-10 h-10 text-brand-red" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display text-brand-dark text-lg leading-tight uppercase tracking-tighter">{book.title}</p>
                      <div className="h-0.5 w-8 bg-brand-gold mx-auto"></div>
                    </div>
                  </div>
                ) : (
                  <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-full h-full rounded object-cover"
                      referrerPolicy="no-referrer"
                  />
                )}
                {/* Efeito de brilho na "capa" */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none"></div>
            </div>
            {/* Background pattern decorativo */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        {/* Coluna de Conteúdo */}
        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto max-h-[80vh] md:max-h-full bg-white relative">
             <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-brand-red transition-colors hidden md:block"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="space-y-6">
                <div>
                    <div className="flex items-center gap-3 text-brand-gold text-sm font-bold tracking-widest uppercase mb-2">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {book.year}</span>
                        {book.pages && <span className="flex items-center gap-1 before:content-['•'] before:mr-3"><BookOpen className="w-4 h-4" /> {book.pages} Páginas</span>}
                    </div>
                    <h2 className="text-4xl font-display text-brand-dark leading-tight">{book.title}</h2>
                    <p className="text-xl text-brand-red font-serif italic mt-1">{book.subtitle}</p>
                </div>

                <div className="w-16 h-1 bg-brand-red/20 rounded-full"></div>

                <div className="prose prose-lg text-gray-600 leading-relaxed">
                    <p>{book.description}</p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    {book.isAvailable ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                onClick={handlePurchase} 
                                className={`flex-1 transition-opacity ${isPurchasing ? 'opacity-80 cursor-not-allowed' : ''}`}
                                disabled={isPurchasing}
                            >
                                {isPurchasing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" /> Adquirir Agora
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isPurchasing}>
                                Continuar Explorando
                            </Button>
                        </div>
                    ) : (
                         <div className="bg-brand-gray p-6 rounded-lg border border-gray-200">
                            {isSuccess ? (
                                <div className="text-center space-y-3 animate-in fade-in zoom-in duration-300">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <p className="text-brand-dark font-bold">Inscrição Confirmada!</p>
                                    <p className="text-sm text-gray-500">Avisaremos você assim que {book.title} for lançado.</p>
                                    <button 
                                        onClick={() => setIsSuccess(false)}
                                        className="text-xs text-brand-red font-bold uppercase tracking-widest hover:underline mt-2"
                                    >
                                        Cadastrar outro e-mail
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-brand-dark font-bold uppercase tracking-widest text-sm">Em Breve</p>
                                        <p className="text-sm text-gray-500">Seja o primeiro a saber quando este livro for lançado.</p>
                                    </div>
                                    <form onSubmit={handleSubmitNotification} className="flex flex-col sm:flex-row gap-2">
                                        <div className="relative flex-grow">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                                type="email" 
                                                placeholder="Seu melhor e-mail"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="whitespace-nowrap"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Avise-me'
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            )}
                         </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};