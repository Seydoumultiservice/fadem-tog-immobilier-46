
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';

const FloatingCallButton = () => {
  const handleCall = () => {
    window.location.href = 'tel:+22891005317';
  };

  const handleSecretariatCall = () => {
    window.location.href = 'tel:+22892716641';
  };

  const handleWhatsApp = () => {
    const message = "Bonjour Groupe FADEM ! Je souhaite obtenir des informations sur vos services. Pouvez-vous me contacter ? Merci !";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/22891005317?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Boutons d'appel repositionnés - côté droit */}
      <div className="flex flex-col gap-3">
        {/* Bouton secrétariat - plus visible */}
        <Button
          onClick={handleSecretariatCall}
          className="bg-gradient-to-r from-fadem-blue to-fadem-blue-dark hover:from-fadem-gold hover:to-fadem-gold-light text-white shadow-xl rounded-full px-5 py-4 animate-pulse hover:animate-none transition-all duration-300 hover:scale-110 group border-2 border-white/20"
          size="lg"
        >
          <Phone className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">Secrétariat</span>
            <span className="text-xs opacity-90 hidden sm:inline">+228 92 71 66 41</span>
          </div>
        </Button>

        {/* Bouton direction */}
        <Button
          onClick={handleCall}
          className="bg-fadem-gold hover:bg-fadem-gold-light text-fadem-blue shadow-lg rounded-full px-5 py-4 transition-all duration-300 hover:scale-105 group border-2 border-fadem-blue/20"
          size="lg"
        >
          <Phone className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">Direction</span>
            <span className="text-xs opacity-90 hidden sm:inline">+228 91 00 53 17</span>
          </div>
        </Button>

        {/* Bouton WhatsApp */}
        <Button
          onClick={handleWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-full px-5 py-4 transition-all duration-300 hover:scale-105 group border-2 border-white/20"
          size="lg"
        >
          <MessageCircle className="w-6 h-6 mr-3 group-hover:bounce transition-transform" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">WhatsApp</span>
            <span className="text-xs opacity-90 hidden sm:inline">Chat 24/7</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default FloatingCallButton;
