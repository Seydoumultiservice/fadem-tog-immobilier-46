
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite obtenir des informations sur vos services.");
    const phoneNumber = "22891005317"; // Sans le +
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsApp}
      className="fixed bottom-20 right-6 z-40 bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-full p-4 animate-float"
      size="lg"
    >
      <MessageCircle className="w-6 h-6 mr-2" />
      <span className="hidden sm:inline">WhatsApp</span>
    </Button>
  );
};

export default WhatsAppButton;
