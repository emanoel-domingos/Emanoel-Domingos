import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ContactForm } from './components/ContactForm';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Button } from './components/Button';
import { BookDetailsModal, BookType } from './components/BookDetailsModal';
import { AdminSettings } from './components/AdminSettings';
import { FirebaseProvider, useFirebase, handleFirestoreError, OperationType } from './components/FirebaseProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { auth, db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { motion } from 'motion/react';
import { BookOpen, Clock, Globe, ArrowRight, Star, Heart, Award, User, MessageSquare, Instagram, Facebook, Youtube, Quote, Book, PenTool, Plus, ShoppingBag, ExternalLink, LogIn, LogOut, Infinity } from 'lucide-react';

// ==================================================================================
// 📸 IMAGENS SELECIONADAS (Links Google Drive Convertidos)
// ==================================================================================
const DEFAULT_IMAGES = {
  LOGO: "https://lh3.googleusercontent.com/d/1oVmqXdi8-DCn9_hfhoo1TJbTNC9psneh", 
  HERO_AUTOR: "https://lh3.googleusercontent.com/d/1OD6EqwoJOBYiammYKC6EsTyWNxq9Et_c", 
  SOBRE_AUTOR: "https://lh3.googleusercontent.com/d/1uD3EUzQy5VW-5EAQmuPgiPSG5RYfzOZ5",
  LIVRO_DESTAQUE: "https://lh3.googleusercontent.com/d/1Nx7_8ka5vzaNz0nHcv5G2ZWx6vVGdVc6",
  CONTATO_AUTOR: "https://lh3.googleusercontent.com/d/1AT0LS3AJMi-OCcIlwRcynWjEU175xM8L", // Imagem Atualizada
  BANNER_LIVROS: "https://lh3.googleusercontent.com/d/1OD6EqwoJOBYiammYKC6EsTyWNxq9Et_c",
  BOOK_COVER_2: "https://lh3.googleusercontent.com/d/1UXcVj_A2jrU6mvOWepBzPQpznkuXIxxD", 
  BOOK_COVER_3: "https://lh3.googleusercontent.com/d/1007Q1YCOEtzwW6YLVz26FDKy2M_F29aA" // Imagem atualizada
};

// ==================================================================================
// ✍️ TEXTOS EDITÁVEIS (DEFINITIVOS)
// ==================================================================================
const DEFAULT_TEXTS = {
  // HERO & DESTAQUE
  HERO_BADGE: "Lançamento Oficial",
  HERO_TITLE_PREFIX: "Histórias que",
  HERO_TITLE_HIGHLIGHT: "Transformam",
  HERO_DESC: "Uma jornada de cura interior e autoconhecimento através de narrativas que desafiam o tempo e tocam a alma.",
  
  BOOK_TITLE_1: "AMOR",
  BOOK_TITLE_2: "PROIBIDO",
  BOOK_DESC_1: "A emocionante história real de Katharinne Lee e William Bryan. Ela, criada em uma bolha religiosa, viveu 23 anos de um casamento abusivo. Ele, um teólogo de Harvard, superou traumas profundos.",
  BOOK_DESC_2: "No cenário paradisíaco da vila de Rodanthe, eles descobrem que nunca é tarde para viver um amor maduro, enfrentando dogmas e a busca pela identidade.",
  PRICE_PHYSICAL: "69,90",
  PRICE_PHYSICAL_OLD: "89,90",
  PRICE_EBOOK: "19,90",

  // GALERIA DE OBRAS
  GALLERY_TITLE: "Obras Literárias",
  GALLERY_DESC: "Explore a bibliografia completa de Ed Willians Vigna. Cada obra é um convite para reflexão, fé e autoconhecimento.",
  
  BOOK_1_GALLERY_TITLE: "Amor Proibido",
  BOOK_1_GALLERY_SUBTITLE: "História de Amor, Drama e Superação",
  BOOK_1_YEAR: "2025",

  BOOK_2_TITLE: "Caminhos da Fé",
  BOOK_2_SUBTITLE: "Uma Reflexão Teológica",
  BOOK_2_YEAR: "2025",
  BOOK_2_DESC: "Nesta obra aguardada, Ed Willians explora os labirintos da fé contemporânea, questionando tradições e propondo uma espiritualidade mais humana e acolhedora. Um guia essencial para quem busca reencontrar o sagrado.",

  BOOK_3_TITLE: "Um Amor Sem Fim",
  BOOK_3_SUBTITLE: "Onde o medo termina, o destino começa",
  BOOK_3_YEAR: "2026",
  BOOK_3_DESC: "A sequência direta do emocionante Amor Proibido traz de volta Lee e Bryan em uma fase decisiva de suas vidas. Após trajetórias marcadas por traumas e descobertas, os dois finalmente unem seus caminhos em busca de um ideal comum: o direito de viver um amor pleno, livre de amarras e julgamentos. No entanto, o recomeço exige mais do que paixão; exige a coragem de enfrentar fantasmas que se recusam a partir.",

  // BLOG / ENSAIOS
  BLOG_TITLE: "Ensaios & Reflexões",
  BLOG_DESC: "Artigos exclusivos onde a teologia encontra a psicologia e a vida cotidiana. Aprofunde-se nos temas que moldam nossas obras.",

  // SOBRE
  ABOUT_TITLE: "Sobre Ed Willians Vigna",
  ABOUT_TEXT_1: "Ed Willians Vigna é mais do que um escritor; é um contador de histórias que curam. Como teólogo e palestrante, dedicou sua vida a entender as complexidades da alma humana.",
  ABOUT_TEXT_2: "Sua escrita une a precisão teológica com a sensibilidade poética, criando obras que não apenas entretêm, mas transformam a visão de mundo do leitor.",
  ABOUT_QUOTE: "Minha missão é construir uma ponte entre a dor e a esperança, mostrando que o amor verdadeiro é possível, mesmo diante dos maiores obstáculos.",
  
  // DEPOIMENTOS
  TESTIMONIALS_TITLE: "O Impacto da Leitura",
  TESTIMONIALS_SUBTITLE: "Depoimentos reais de quem foi transformado.",

  // CONTATO
  CONTACT_TITLE: "Vamos Conversar?",
  CONTACT_DESC: "Leve a mensagem de superação para sua igreja, empresa ou evento literário. Atendimento direto e personalizado pelo autor e sua equipe.",

  // RODAPÉ
  FOOTER_TITLE_1: "ED WILLIANS",
  FOOTER_TITLE_2: "VIGNA",
  FOOTER_SUBTITLE: "Escritor & Conferencista"
};

const AppContent: React.FC = () => {
  const { user, siteConfig, isAuthReady } = useFirebase();

  // Estado para Imagens
  const [images, setImages] = useState(DEFAULT_IMAGES);

  // Estado para Textos
  const [texts, setTexts] = useState(DEFAULT_TEXTS);

  // Sincroniza com o Firebase quando os dados chegarem
  useEffect(() => {
    if (siteConfig) {
      if (siteConfig.images) setImages({ ...DEFAULT_IMAGES, ...siteConfig.images });
      if (siteConfig.texts) setTexts({ ...DEFAULT_TEXTS, ...siteConfig.texts });
    } else {
      // Fallback para localStorage se o Firebase ainda não tiver dados (primeiro acesso)
      const savedImages = localStorage.getItem('site_images');
      const savedTexts = localStorage.getItem('site_texts');
      if (savedImages) setImages({ ...DEFAULT_IMAGES, ...JSON.parse(savedImages) });
      if (savedTexts) setTexts({ ...DEFAULT_TEXTS, ...JSON.parse(savedTexts) });
    }
  }, [siteConfig]);

  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Verifica URL para habilitar Admin (?modo=admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('modo') === 'admin') {
      setShowAdmin(true);
    }
  }, []);

  // Login Handler
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Efeito para Atualizar Favicon Dinamicamente
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = images.LOGO;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [images.LOGO]);

  // --- Handlers Imagens ---
  const handleUpdateImages = async (newImages: typeof DEFAULT_IMAGES) => {
    setImages(newImages);
    if (user) {
      try {
        await setDoc(doc(db, 'config', 'site'), { 
          images: newImages,
          texts: texts,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'config/site');
      }
    } else {
      localStorage.setItem('site_images', JSON.stringify(newImages));
    }
  };

  const handleResetImages = async () => {
    setImages(DEFAULT_IMAGES);
    if (user) {
      try {
        await setDoc(doc(db, 'config', 'site'), { 
          images: DEFAULT_IMAGES,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'config/site');
      }
    } else {
      localStorage.removeItem('site_images');
    }
  };

  // --- Handlers Textos ---
  const handleUpdateTexts = async (newTexts: typeof DEFAULT_TEXTS) => {
    setTexts(newTexts);
    if (user) {
      try {
        await setDoc(doc(db, 'config', 'site'), { 
          texts: newTexts,
          images: images,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'config/site');
      }
    } else {
      localStorage.setItem('site_texts', JSON.stringify(newTexts));
    }
  };

  const handleResetTexts = async () => {
    setTexts(DEFAULT_TEXTS);
    if (user) {
      try {
        await setDoc(doc(db, 'config', 'site'), { 
          texts: DEFAULT_TEXTS,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'config/site');
      }
    } else {
      localStorage.removeItem('site_texts');
    }
  };

  // 🔗 LINKS SOCIAIS E VENDAS
  const whatsappLink = "https://wa.me/5532984249779?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20livro%20Amor%20Proibido.";
  const catalogoLink = "https://wa.me/c/553284249779";
  const amazonLink = "https://www.amazon.com.br/dp/B0GG59T28S";
  const hotmartPhysicalLink = "https://go.hotmart.com/P104964934F";
  const hotmartEbookLink = "https://go.hotmart.com/V103903945P";
  const instagramLink = "https://www.instagram.com/ed.ebookcriativo/"; 
  const facebookLink = "https://www.facebook.com/profile.php?id=61586950552494";
  const youtubeLink = "https://www.youtube.com/@e-BookCriativo-EmanoelDomingos";

  // 📚 DADOS DOS LIVROS
  const LIVROS: BookType[] = [
    {
      id: 1,
      title: texts.BOOK_1_GALLERY_TITLE,
      subtitle: texts.BOOK_1_GALLERY_SUBTITLE,
      cover: images.LIVRO_DESTAQUE,
      icon: Heart,
      year: texts.BOOK_1_YEAR,
      pages: "320",
      description: texts.BOOK_DESC_1 + " " + texts.BOOK_DESC_2, // Usa os textos da seção principal
      link: hotmartPhysicalLink,
      isAvailable: true
    },
    {
      id: 2,
      title: texts.BOOK_2_TITLE,
      subtitle: texts.BOOK_2_SUBTITLE,
      cover: images.BOOK_COVER_2, // Usa imagem editável
      icon: Globe,
      year: texts.BOOK_2_YEAR,
      description: texts.BOOK_2_DESC,
      isAvailable: false
    },
    {
      id: 3,
      title: texts.BOOK_3_TITLE,
      subtitle: texts.BOOK_3_SUBTITLE,
      cover: images.BOOK_COVER_3, // Usa imagem editável
      icon: Star,
      year: texts.BOOK_3_YEAR,
      description: texts.BOOK_3_DESC,
      isAvailable: false
    }
  ];

  // 📝 DADOS DOS POSTS (BLOG)
  const POSTS = [
    {
        id: 1,
        category: "Teologia & Vida",
        title: "A Fé no Século XXI",
        excerpt: "Como manter a espiritualidade viva em um mundo cada vez mais cético e acelerado? Uma reflexão sobre tradição e modernidade.",
        image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=600",
        link: "https://google.com/search?q=Ed+Willians+Vigna+Teologia"
    },
    {
        id: 2,
        category: "Psicologia",
        title: "Lidando com o Luto",
        excerpt: "O processo de cura não é linear. Entenda como as emoções funcionam durante as perdas e como encontrar esperança.",
        image: "https://images.unsplash.com/photo-1494178270175-e96de2971df9?auto=format&fit=crop&q=80&w=600",
        link: "https://google.com/search?q=Ed+Willians+Vigna+Psicologia"
    },
    {
        id: 3,
        category: "Relacionamentos",
        title: "O Amor Maduro",
        excerpt: "Baseado na história de Lee e Bryan, discutimos a diferença entre a paixão passageira e o amor que constrói.",
        image: "https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&q=80&w=600",
        link: "https://google.com/search?q=Ed+Willians+Vigna+Relacionamentos"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream relative overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header 
        logoUrl={images.LOGO} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      {/* Hero Section */}
      {/* ATUALIZAÇÃO: Alterado lg:h-screen para lg:min-h-screen para evitar corte de conteúdo em telas baixas */}
      <section className="relative pt-32 pb-20 lg:min-h-screen flex items-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src={images.HERO_AUTOR} 
            alt="Ed Willians na Biblioteca" 
            className="w-full h-full object-cover object-right opacity-80 saturate-150 hover:scale-105 transition-all duration-[2000ms]" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/70 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-transparent to-transparent"></div>
        </div>
        
        {/* ATUALIZAÇÃO: Reduzido o padding top de lg:pt-48 para lg:pt-32 para subir o conteúdo e exibir os botões */}
        <div className="container mx-auto px-6 relative z-10 pt-32 lg:pt-32">
          <div className="max-w-3xl space-y-8 animate-in slide-in-from-left duration-1000">
             <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded text-brand-red font-bold text-xs uppercase tracking-widest backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                {texts.HERO_BADGE}
             </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white font-display">
              <span className="block text-brand-gold mb-2 drop-shadow-lg">Ed Willians Vigna</span>
              {texts.HERO_TITLE_PREFIX} <span className="text-brand-red italic font-serif">{texts.HERO_TITLE_HIGHLIGHT}</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-xl font-light border-l-2 border-brand-red pl-6">
              {texts.HERO_DESC}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={() => window.open(hotmartPhysicalLink, '_blank')} className="shadow-lg shadow-brand-red/20">
                Adquirir Livro
              </Button>
              <Button variant="secondary" className="border-white/20 hover:bg-white/10" onClick={() => document.getElementById('obras')?.scrollIntoView({ behavior: 'smooth' })}>
                Ler Sinopse
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Strip */}
      <div className="bg-brand-red text-white py-6 relative z-20 shadow-xl border-t border-white/10">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <div className="flex items-center gap-3 group">
                 <div className="p-2 bg-white/10 rounded-full group-hover:bg-brand-gold/20 transition-colors">
                    <Clock className="w-6 h-6 text-brand-gold" />
                 </div>
                 <div>
                    <p className="font-bold uppercase text-[10px] tracking-widest opacity-80">Entrega</p>
                    <p className="font-serif text-lg">Envio Imediato</p>
                 </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20"></div>
              <div className="flex items-center gap-3 group">
                 <div className="p-2 bg-white/10 rounded-full group-hover:bg-brand-gold/20 transition-colors">
                    <Globe className="w-6 h-6 text-brand-gold" />
                 </div>
                 <div>
                    <p className="font-bold uppercase text-[10px] tracking-widest opacity-80">Digital</p>
                    <p className="font-serif text-lg">E-book Disponível</p>
                 </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20"></div>
              <div className="flex items-center gap-3 group">
                 <div className="p-2 bg-white/10 rounded-full group-hover:bg-brand-gold/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-brand-gold" />
                 </div>
                 <div>
                    <p className="font-bold uppercase text-[10px] tracking-widest opacity-80">Físico</p>
                    <p className="font-serif text-lg">Edição de Luxo</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Featured Book Section (Main) */}
      <section id="obras" className="py-24 bg-brand-cream relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
               <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white group">
                  <img 
                    src={images.LIVRO_DESTAQUE} 
                    alt="Livro Amor Proibido" 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-red/10 to-transparent pointer-events-none"></div>
               </div>
               <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-brand-dark/5 rounded-lg border border-brand-dark/5"></div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div className="flex items-center gap-2 mb-2">
                 <span className="h-px w-12 bg-brand-red"></span>
                 <span className="text-brand-red font-bold tracking-[0.2em] uppercase text-xs">Best-Seller</span>
              </div>
              
              <h2 className="text-5xl lg:text-7xl font-display text-brand-dark leading-none">
                {texts.BOOK_TITLE_1} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-600">{texts.BOOK_TITLE_2}</span>
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg border-l-4 border-gray-200 pl-6">
                <p>{texts.BOOK_DESC_1}</p>
                <p>{texts.BOOK_DESC_2}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-6">
                 <div className="border-2 border-brand-red bg-white p-6 rounded-sm relative hover:shadow-2xl hover:shadow-brand-red/10 transition-all duration-300 cursor-pointer group" onClick={() => window.open(hotmartPhysicalLink, '_blank')}>
                    <div className="absolute -top-3 right-4 bg-brand-dark text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-md">Disponível na Hotmart</div>
                    <Book className="w-8 h-8 text-brand-dark mb-3 group-hover:text-brand-red transition-colors" />
                    <h4 className="font-display font-bold text-xl text-brand-dark">Livro Físico</h4>
                    <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Edição Literando + Frete Grátis</p>
                    <div className="mt-4 flex items-end gap-2">
                       <span className="text-3xl font-bold text-brand-red">R$ {texts.PRICE_PHYSICAL}</span>
                       <span className="text-gray-400 line-through text-sm mb-1">R$ {texts.PRICE_PHYSICAL_OLD}</span>
                    </div>
                 </div>

                 <div className="border border-gray-200 bg-brand-gray p-6 rounded-sm relative hover:border-brand-gold hover:bg-white transition-all duration-300 cursor-pointer group" onClick={() => window.open(hotmartEbookLink, '_blank')}>
                    <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-[10px] font-bold px-2 py-1 uppercase">Plataforma Hotmart</div>
                    <Globe className="w-8 h-8 text-brand-gold mb-3" />
                    <h4 className="font-display font-bold text-xl text-brand-dark">E-book</h4>
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">Versão Digital / Hotmart</p>
                    <div className="mt-4 flex items-end gap-2">
                       <span className="text-3xl font-bold text-brand-dark">R$ {texts.PRICE_EBOOK}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none mix-blend-overlay">
           <img src={images.BANNER_LIVROS} className="w-full h-full object-cover" alt="Background Texture" referrerPolicy="no-referrer" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
             <div className="lg:w-1/2 space-y-8">
               <div className="inline-flex items-center gap-2 text-brand-gold mb-2 border-b border-brand-gold/30 pb-2">
                  <PenTool className="w-4 h-4" />
                  <span className="uppercase tracking-[0.2em] text-xs font-bold">O Autor</span>
               </div>
               
               <h2 className="text-4xl lg:text-5xl font-display text-white leading-tight">
                 {texts.ABOUT_TITLE.split('Ed Willians')[0]} <br/><span className="text-brand-gold">Ed Willians Vigna</span>
               </h2>
               
               <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                 <p>{texts.ABOUT_TEXT_1}</p>
                 <p>{texts.ABOUT_TEXT_2}</p>
               </div>
               
               <blockquote className="bg-white/5 border-l-4 border-brand-red p-6 italic text-gray-300 rounded-r-lg backdrop-blur-sm">
                 "{texts.ABOUT_QUOTE}"
               </blockquote>
               
               <div className="flex gap-12 pt-4">
                 <div>
                    <h4 className="text-4xl font-bold text-white font-display">20+</h4>
                    <p className="text-[10px] text-brand-gold uppercase tracking-widest mt-1">Anos de Estudos</p>
                 </div>
                 <div>
                    <h4 className="text-4xl font-bold text-white font-display">100%</h4>
                    <p className="text-[10px] text-brand-gold uppercase tracking-widest mt-1">Leitores Impactados</p>
                 </div>
               </div>
             </div>

             <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(214,31,38,0.2)] group">
                   <img 
                     src={images.SOBRE_AUTOR} 
                     alt="Ed Willians Assinando Livro" 
                     className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                     referrerPolicy="no-referrer"
                   />
                   <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 pt-24">
                      <p className="text-brand-gold font-display text-xl">Ed Willians Vigna</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Sessão de Autógrafos</p>
                   </div>
                </div>
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-brand-red/30 rounded-lg -z-0"></div>
             </div>
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 📚 GALERIA DE OBRAS COMPLETAS                                        */}
      {/* ================================================================================== */}
      <section id="galeria-obras" className="py-24 bg-brand-gray relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
             <h2 className="text-3xl lg:text-4xl font-display text-brand-dark mb-4">{texts.GALLERY_TITLE}</h2>
             <div className="h-1 w-20 bg-brand-gold mx-auto mb-6"></div>
             <p className="text-gray-600">
               {texts.GALLERY_DESC}
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LIVROS.map((livro) => {
              const BookIcon = livro.icon;
              return (
                <div 
                  key={livro.id}
                  onClick={() => setSelectedBook(livro)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100"
                >
                  <div className="relative overflow-hidden aspect-[3/4] bg-brand-gray flex items-center justify-center p-8">
                    <div className="relative w-full h-full bg-white shadow-xl rounded-sm flex flex-col items-center justify-center text-center p-6 transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                      {BookIcon ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-brand-red/20 transition-colors">
                            <BookIcon className="w-8 h-8 text-brand-red" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-display text-brand-dark text-sm leading-tight uppercase tracking-tighter">{livro.title}</p>
                            <div className="h-0.5 w-6 bg-brand-gold mx-auto"></div>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={livro.cover} 
                          alt={livro.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                      {/* Efeito de brilho na "capa" */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
                    </div>

                    <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-brand-dark px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <Plus className="w-4 h-4 text-brand-red" /> Ver Detalhes
                      </div>
                    </div>
                    {!livro.isAvailable && (
                      <div className="absolute top-4 right-4 bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                        Em Breve
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-brand-gold font-bold uppercase tracking-widest">{livro.year}</span>
                        {livro.isAvailable && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Disponível</span>}
                     </div>
                     <h3 className="text-xl font-display text-brand-dark mb-1 group-hover:text-brand-red transition-colors">{livro.title}</h3>
                     <p className="text-sm text-gray-500 font-serif italic mb-4">{livro.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* ✍️ BLOG / ENSAIOS (NOVA SEÇÃO PREMIUM)                                  */}
      {/* ================================================================================== */}
      <section id="blog" className="py-24 bg-white relative">
         <div className="container mx-auto px-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
            >
               <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="h-px w-8 bg-brand-gold"></span>
                     <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs">Blog do Autor</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display text-brand-dark leading-tight">{texts.BLOG_TITLE}</h2>
                  <p className="text-gray-500 mt-4 leading-relaxed">{texts.BLOG_DESC}</p>
               </div>
               <Button variant="outline" onClick={() => window.open(catalogoLink, '_blank')} className="hidden md:flex">
                  Ver Todos os Artigos
               </Button>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
               {POSTS.map((post, index) => (
                  <motion.article 
                     key={post.id} 
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                     className="group cursor-pointer flex flex-col h-full" 
                     onClick={() => window.open(post.link, '_blank')}
                  >
                     <div className="relative overflow-hidden rounded-lg mb-6 aspect-video">
                        <img 
                           src={post.image} 
                           alt={post.title} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors duration-300"></div>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-dark px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                           {post.category}
                        </div>
                     </div>
                     <h3 className="text-2xl font-serif text-brand-dark mb-3 group-hover:text-brand-red transition-colors leading-tight">
                        {post.title}
                     </h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                     </p>
                     <div className="flex items-center text-brand-gold font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all mt-auto">
                        Ler Ensaio <ArrowRight className="w-4 h-4 ml-1" />
                     </div>
                  </motion.article>
               ))}
            </div>
            
            <div className="mt-8 md:hidden text-center">
               <Button variant="outline" onClick={() => window.open(catalogoLink, '_blank')} fullWidth>
                  Ver Todos os Artigos
               </Button>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section id="legado" className="py-24 bg-brand-cream relative border-t border-white">
        <div className="container mx-auto px-6">
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
           >
             <Star className="w-8 h-8 text-brand-red mx-auto mb-4 animate-spin-slow" />
             <h2 className="text-3xl font-display text-brand-dark font-bold">{texts.TESTIMONIALS_TITLE}</h2>
             <p className="text-gray-500 mt-2">{texts.TESTIMONIALS_SUBTITLE}</p>
           </motion.div>
           
           <div className="grid md:grid-cols-3 gap-8">
             {[
               { text: "Uma história que me fez chorar e sorrir. Me vi na força de Katharinne. É impossível parar de ler.", author: "Júlia Dias, Leitora" },
               { text: "A abordagem sobre a fé fora da religiosidade me libertou. Uma obra teológica e humana necessária.", author: "Caroline Nascimento, Teóloga" },
               { text: "Simplesmente devorei o livro. A ambientação em Rodanthe é mágica e os personagens são vivos.", author: "Renata Dias, Estudante" }
             ].map((depoimento, idx) => (
               <motion.div 
                 key={idx} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: idx * 0.1 }}
                 className="bg-white p-10 rounded-sm relative hover:translate-y-[-5px] transition-transform duration-300 border-b-4 border-brand-gold shadow-sm hover:shadow-xl flex flex-col h-full"
               >
                 <Quote className="absolute top-6 left-6 text-brand-gold/20 w-12 h-12 transform -scale-x-100" />
                 <p className="text-gray-700 italic mb-8 font-serif relative z-10 leading-relaxed text-lg flex-grow">"{depoimento.text}"</p>
                 <div className="flex items-center gap-4 mt-auto pt-6 border-t border-brand-dark/5">
                    <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center font-bold font-display text-xl shadow-lg">
                       {depoimento.author[0]}
                    </div>
                    <div>
                       <p className="font-bold text-brand-dark text-sm uppercase tracking-wider">{depoimento.author.split(',')[0]}</p>
                       <p className="text-xs text-brand-red font-bold">{depoimento.author.split(',')[1]}</p>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-24 bg-brand-gray relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative hidden lg:block h-full min-h-[600px] rounded-lg overflow-hidden shadow-2xl group">
               <img 
                  src={images.CONTATO_AUTOR} 
                  alt="Fale Conosco" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-brand-dark/50 hover:bg-brand-dark/30 transition-colors duration-500"></div>
               <div className="absolute bottom-10 left-10 text-white max-w-xs">
                  <div className="w-12 h-1 bg-brand-red mb-4"></div>
                  <h3 className="text-4xl font-display mb-2">Estamos Prontos</h3>
                  <p className="text-gray-200 text-lg">Para ouvir você. Agende sua palestra ou tire dúvidas sobre o livro.</p>
               </div>
            </div>

            <div>
              <div className="mb-10">
                 <h2 className="text-4xl lg:text-5xl font-display text-brand-dark mb-4">{texts.CONTACT_TITLE}</h2>
                 <p className="text-gray-600 text-lg leading-relaxed">
                   {texts.CONTACT_DESC}
                 </p>
              </div>

              <div className="bg-white p-2 rounded-lg shadow-2xl">
                 <ContactForm />
              </div>
              
              <div className="mt-8 flex items-center justify-between text-gray-500 text-sm px-2">
                 <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Atendimento Online
                 </div>
                 <p>Resposta rápida via WhatsApp ou E-mail</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-20 pb-10 border-t-4 border-brand-red">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
             <div className="text-center md:text-left">
                {images.LOGO ? (
                   <img src={images.LOGO} alt="Logo Footer" className="h-12 object-contain mb-4 mx-auto md:mx-0 opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                ) : (
                  <h2 className="text-3xl font-display font-bold text-white mb-2">{texts.FOOTER_TITLE_1} <span className="text-brand-red">{texts.FOOTER_TITLE_2}</span></h2>
                )}
                <p className="text-gray-500 text-xs tracking-[0.2em] uppercase">{texts.FOOTER_SUBTITLE}</p>
             </div>
             
             <div className="flex gap-4">
                <Button onClick={() => window.open(instagramLink, '_blank')} variant="outline" className="!rounded-full w-12 h-12 !p-0 flex items-center justify-center border-gray-700 text-gray-400 hover:border-brand-red hover:text-white hover:scale-110 transition-all">
                   <Instagram className="w-5 h-5" />
                </Button>
                <Button onClick={() => window.open(facebookLink, '_blank')} variant="outline" className="!rounded-full w-12 h-12 !p-0 flex items-center justify-center border-gray-700 text-gray-400 hover:border-brand-red hover:text-white hover:scale-110 transition-all">
                   <Facebook className="w-5 h-5" />
                </Button>
                <Button onClick={() => window.open(youtubeLink, '_blank')} variant="outline" className="!rounded-full w-12 h-12 !p-0 flex items-center justify-center border-gray-700 text-gray-400 hover:border-brand-red hover:text-white hover:scale-110 transition-all">
                   <Youtube className="w-5 h-5" />
                </Button>
             </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
            <p className="mt-4 md:mt-0 flex items-center gap-2 hover:text-brand-red transition-colors cursor-default">
               Desenvolvido com <Heart className="w-3 h-3 text-brand-red fill-current" /> para leitores
            </p>
          </div>
        </div>
      </footer>

      {/* Botão de Login/Logout no Rodapé para facilitar o acesso */}
      <div className="fixed bottom-6 right-24 z-50">
        {user ? (
          <button 
            onClick={handleLogout}
            className="bg-white/90 backdrop-blur-sm text-brand-dark px-4 py-2 rounded-full shadow-lg border border-brand-red/20 flex items-center gap-2 hover:bg-brand-red hover:text-white transition-all group"
            title="Sair do Modo Admin"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Sair</span>
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            className="bg-brand-dark/80 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-brand-red transition-all group border border-white/10"
            title="Acesso Restrito"
          >
            <LogIn className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Admin</span>
          </button>
        )}
      </div>

      <WhatsAppButton />
      <BookDetailsModal isOpen={!!selectedBook} onClose={() => setSelectedBook(null)} book={selectedBook} />
      
      {/* PAINEL DE EDIÇÃO (ADMIN) - Só aparece se o usuário estiver logado e for o dono */}
      {user && (user.email === 'emanoel.domingos0909@gmail.com') && (
        <AdminSettings 
          currentImages={images} 
          onUpdate={handleUpdateImages} 
          onReset={handleResetImages}
          currentTexts={texts}
          onUpdateTexts={handleUpdateTexts}
          onResetTexts={handleResetTexts}
          user={user}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
};

export default App;