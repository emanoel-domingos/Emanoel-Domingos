import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/contato@edwilliansvigna.online", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _subject: `Novo Agendamento: ${formData.name}`,
        })
      });

      if (response.ok) {
        setShowModal(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert("Ocorreu um erro ao enviar. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="agendar" className="bg-white p-8 rounded-lg shadow-2xl border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
      <h3 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2 font-serif">
        <Calendar className="w-6 h-6 text-brand-red" />
        Formulário
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative group">
          <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
          <input
            type="text"
            name="name"
            placeholder="Seu Nome Completo"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-brand-gray rounded border border-transparent focus:border-brand-red focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
          <input
            type="email"
            name="email"
            placeholder="Seu E-mail"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-brand-gray rounded border border-transparent focus:border-brand-red focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        <div className="relative group">
          <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
          <input
            type="tel"
            name="phone"
            placeholder="Seu WhatsApp"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-brand-gray rounded border border-transparent focus:border-brand-red focus:bg-white focus:ring-0 transition-all outline-none"
          />
        </div>

        <div className="relative group">
          <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
          <textarea
            name="message"
            placeholder="Mensagem ou data preferencial..."
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-brand-gray rounded border border-transparent focus:border-brand-red focus:bg-white focus:ring-0 transition-all outline-none resize-none"
          />
        </div>

        <Button 
          type="submit" 
          fullWidth 
          disabled={isSubmitting}
          className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
        >
          {isSubmitting ? 'Enviando...' : 'Confirmar Agendamento'}
        </Button>
      </form>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Sucesso!"
        message="Agendamento Recebido! Em breve entraremos em contato."
      />
    </div>
  );
};