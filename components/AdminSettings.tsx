import React, { useState, useEffect } from 'react';
import { Settings, X, Save, RotateCcw, Image as ImageIcon, Link as LinkIcon, AlertCircle, Type, LayoutTemplate, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';

interface ImageConfig {
  LOGO: string;
  HERO_AUTOR: string;
  SOBRE_AUTOR: string;
  LIVRO_DESTAQUE: string;
  CONTATO_AUTOR: string;
  BANNER_LIVROS: string;
  BOOK_COVER_2: string;
  BOOK_COVER_3: string;
}

interface TextConfig {
  [key: string]: string; // Index signature para permitir acesso dinâmico seguro
  HERO_BADGE: string;
  HERO_TITLE_PREFIX: string;
  HERO_TITLE_HIGHLIGHT: string;
  HERO_DESC: string;
  BOOK_TITLE_1: string;
  BOOK_TITLE_2: string;
  BOOK_DESC_1: string;
  BOOK_DESC_2: string;
  PRICE_PHYSICAL: string;
  PRICE_PHYSICAL_OLD: string;
  PRICE_EBOOK: string;
  ABOUT_TITLE: string;
  ABOUT_TEXT_1: string;
  ABOUT_TEXT_2: string;
  ABOUT_QUOTE: string;
  CONTACT_TITLE: string;
  CONTACT_DESC: string;
  GALLERY_TITLE: string;
  GALLERY_DESC: string;
  BOOK_1_GALLERY_TITLE: string;
  BOOK_1_GALLERY_SUBTITLE: string;
  BOOK_1_YEAR: string;
  BOOK_2_TITLE: string;
  BOOK_2_SUBTITLE: string;
  BOOK_2_YEAR: string;
  BOOK_2_DESC: string;
  BOOK_3_TITLE: string;
  BOOK_3_SUBTITLE: string;
  BOOK_3_YEAR: string;
  BOOK_3_DESC: string;
  BLOG_TITLE: string;
  BLOG_DESC: string;
  TESTIMONIALS_TITLE: string;
  TESTIMONIALS_SUBTITLE: string;
  FOOTER_TITLE_1: string;
  FOOTER_TITLE_2: string;
  FOOTER_SUBTITLE: string;
}

interface AdminSettingsProps {
  currentImages: ImageConfig;
  onUpdate: (newImages: ImageConfig) => void;
  onReset: () => void;
  currentTexts: TextConfig;
  onUpdateTexts: (newTexts: TextConfig) => void;
  onResetTexts: () => void;
}

// Helper para Renderizar Grupos de Campos
const FieldGroup = ({ title, children }: { title: string, children?: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
            >
                <h3 className="font-bold text-brand-dark uppercase tracking-wider text-xs">{title}</h3>
                {isCollapsed ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
            </button>
            {!isCollapsed && <div className="p-4 space-y-4">{children}</div>}
        </div>
    );
};

export const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  currentImages, 
  onUpdate, 
  onReset,
  currentTexts,
  onUpdateTexts,
  onResetTexts
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'texts'>('texts');
  
  const [tempImages, setTempImages] = useState<ImageConfig>(currentImages);
  const [tempTexts, setTempTexts] = useState<TextConfig>(currentTexts);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Sincroniza o estado local quando as props mudam (ex: reset externo)
  useEffect(() => {
    setTempImages(currentImages);
    setTempTexts(currentTexts);
  }, [currentImages, currentTexts]);

  // Função robusta para converter Link do Google Drive
  const processUrl = (url: string) => {
    if (!url) return "";
    let id = "";
    const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) id = match1[1];
    else {
      const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match2) id = match2[1];
    }
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
  };

  const handleImageChange = (key: keyof ImageConfig, value: string) => {
    const processedValue = processUrl(value);
    setTempImages(prev => ({ ...prev, [key]: processedValue }));
    setImageErrors(prev => ({ ...prev, [key]: false }));
  };

  const handleTextChange = (key: keyof TextConfig, value: string) => {
    setTempTexts(prev => ({ ...prev, [key]: value }));
  };

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  const handleSave = () => {
    if (activeTab === 'images') {
        onUpdate(tempImages);
    } else {
        onUpdateTexts(tempTexts);
    }
    alert(`${activeTab === 'images' ? 'Imagens' : 'Textos'} atualizados com sucesso!`);
  };

  const imageLabels: Record<keyof ImageConfig, string> = {
    LOGO: "Logo do Site",
    HERO_AUTOR: "Banner Topo (Autor)",
    LIVRO_DESTAQUE: "Capa Destaque (Principal)",
    SOBRE_AUTOR: "Foto Seção Sobre",
    CONTATO_AUTOR: "Foto Contato",
    BANNER_LIVROS: "Fundo Textura (Cinza)",
    BOOK_COVER_2: "Capa Livro 2 (Galeria)",
    BOOK_COVER_3: "Capa Livro 3 (Galeria)"
  };

  const renderTextField = (key: string, label: string, isTextarea = false) => (
      <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          {isTextarea ? (
              <textarea
                  value={tempTexts[key] || ''}
                  onChange={(e) => handleTextChange(key as keyof TextConfig, e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:border-brand-red focus:ring-1 focus:ring-brand-red min-h-[80px]"
              />
          ) : (
              <input
                  type="text"
                  value={tempTexts[key] || ''}
                  onChange={(e) => handleTextChange(key as keyof TextConfig, e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:border-brand-red focus:ring-1 focus:ring-brand-red"
              />
          )}
      </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-white text-brand-dark p-3 rounded-full shadow-2xl hover:rotate-90 transition-transform duration-500 border-2 border-brand-gold group"
        title="Editar Site"
      >
        <Settings className="w-6 h-6 text-brand-dark" />
      </button>

      <div className={`fixed inset-y-0 left-0 z-[100] w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 bg-brand-dark text-white flex justify-between items-center shadow-md">
            <div>
              <h2 className="text-xl font-display font-bold">Personalizar</h2>
              <p className="text-xs text-brand-gold mt-1">Edite o conteúdo do site</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex bg-gray-100 p-2 gap-2 border-b border-gray-200">
             <button 
                onClick={() => setActiveTab('texts')}
                className={`flex-1 py-2 px-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'texts' ? 'bg-white text-brand-red shadow' : 'text-gray-500 hover:bg-gray-200'}`}
             >
                <Type className="w-4 h-4" /> Textos
             </button>
             <button 
                onClick={() => setActiveTab('images')}
                className={`flex-1 py-2 px-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'images' ? 'bg-white text-brand-red shadow' : 'text-gray-500 hover:bg-gray-200'}`}
             >
                <ImageIcon className="w-4 h-4" /> Imagens
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 pb-24">
            {activeTab === 'texts' && (
                <div className="space-y-4">
                    <FieldGroup title="1. Seção Topo (Hero)">
                        {renderTextField('HERO_BADGE', 'Etiqueta (ex: Lançamento)')}
                        {renderTextField('HERO_TITLE_PREFIX', 'Título Prefixo (ex: Histórias que)')}
                        {renderTextField('HERO_TITLE_HIGHLIGHT', 'Título Destaque (ex: Transformam)')}
                        {renderTextField('HERO_DESC', 'Descrição Curta', true)}
                    </FieldGroup>

                    <FieldGroup title="2. Livro Principal (Destaque)">
                        {renderTextField('BOOK_TITLE_1', 'Título Parte 1')}
                        {renderTextField('BOOK_TITLE_2', 'Título Parte 2 (Vermelho)')}
                        {renderTextField('BOOK_DESC_1', 'Sinopse Parágrafo 1', true)}
                        {renderTextField('BOOK_DESC_2', 'Sinopse Parágrafo 2', true)}
                        <div className="grid grid-cols-3 gap-2">
                             {renderTextField('PRICE_PHYSICAL', 'Preço Físico')}
                             {renderTextField('PRICE_PHYSICAL_OLD', 'Preço Antigo')}
                             {renderTextField('PRICE_EBOOK', 'Preço Ebook')}
                        </div>
                    </FieldGroup>

                    <FieldGroup title="3. Galeria de Obras (Abaixo)">
                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 mb-2">
                            Edite aqui os 3 livros que aparecem na lista horizontal.
                        </div>
                        {renderTextField('GALLERY_TITLE', 'Título da Seção')}
                        {renderTextField('GALLERY_DESC', 'Descrição da Seção', true)}
                        
                        <div className="mt-4 border-t pt-4">
                            <p className="font-bold text-sm mb-2 text-brand-red">Livro 1 (Reutiliza Destaque)</p>
                            {renderTextField('BOOK_1_GALLERY_TITLE', 'Título')}
                            {renderTextField('BOOK_1_GALLERY_SUBTITLE', 'Subtítulo')}
                            {renderTextField('BOOK_1_YEAR', 'Ano de Lançamento')}
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <p className="font-bold text-sm mb-2 text-brand-red">Livro 2 (Meio)</p>
                            {renderTextField('BOOK_2_TITLE', 'Título')}
                            {renderTextField('BOOK_2_SUBTITLE', 'Subtítulo')}
                            {renderTextField('BOOK_2_YEAR', 'Ano de Lançamento')}
                            {renderTextField('BOOK_2_DESC', 'Sinopse', true)}
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <p className="font-bold text-sm mb-2 text-brand-red">Livro 3 (Direita)</p>
                            {renderTextField('BOOK_3_TITLE', 'Título')}
                            {renderTextField('BOOK_3_SUBTITLE', 'Subtítulo')}
                            {renderTextField('BOOK_3_YEAR', 'Ano de Lançamento')}
                            {renderTextField('BOOK_3_DESC', 'Sinopse', true)}
                        </div>
                    </FieldGroup>

                     <FieldGroup title="4. Blog / Ensaios (Novo)">
                        {renderTextField('BLOG_TITLE', 'Título da Seção')}
                        {renderTextField('BLOG_DESC', 'Descrição da Seção', true)}
                    </FieldGroup>

                    <FieldGroup title="5. Sobre o Autor">
                        {renderTextField('ABOUT_TITLE', 'Título')}
                        {renderTextField('ABOUT_TEXT_1', 'Texto Parágrafo 1', true)}
                        {renderTextField('ABOUT_TEXT_2', 'Texto Parágrafo 2', true)}
                        {renderTextField('ABOUT_QUOTE', 'Citação em Destaque', true)}
                    </FieldGroup>

                    <FieldGroup title="6. Depoimentos & Rodapé">
                        {renderTextField('TESTIMONIALS_TITLE', 'Título Depoimentos')}
                        {renderTextField('TESTIMONIALS_SUBTITLE', 'Subtítulo Depoimentos')}
                        {renderTextField('CONTACT_TITLE', 'Título Contato')}
                        {renderTextField('CONTACT_DESC', 'Texto Contato', true)}
                        {renderTextField('FOOTER_SUBTITLE', 'Rodapé Subtítulo')}
                    </FieldGroup>
                </div>
            )}

            {activeTab === 'images' && (
                <div className="space-y-6">
                    {Object.entries(tempImages).map(([key, value]) => (
                    <div key={key} className="space-y-2 bg-white p-4 rounded shadow-sm border border-gray-200">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        {imageLabels[key as keyof ImageConfig]}
                        </label>
                        <input
                        type="text"
                        value={value}
                        onChange={(e) => handleImageChange(key as keyof ImageConfig, e.target.value)}
                        className={`w-full p-2 text-sm border rounded outline-none transition-all ${imageErrors[key] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-brand-red'}`}
                        placeholder="Link da imagem..."
                        />
                        {value && (
                        <div className="relative mt-2 h-32 rounded overflow-hidden border border-gray-200">
                            <img 
                                src={value} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                                onError={() => handleImageError(key)}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        )}
                    </div>
                    ))}
                </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white space-y-2 z-20">
            <Button onClick={handleSave} fullWidth className="gap-2 shadow-xl py-3">
              <Save className="w-4 h-4" /> Salvar {activeTab === 'images' ? 'Imagens' : 'Textos'}
            </Button>
            <button 
              onClick={() => {
                if(window.confirm(`Deseja restaurar os padrões?`)) {
                  if (activeTab === 'images') onReset();
                  else onResetTexts();
                  setIsOpen(false);
                }
              }}
              className="w-full py-2 text-xs text-gray-500 hover:text-brand-red flex items-center justify-center gap-2 transition-colors uppercase tracking-widest font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar Padrões
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};