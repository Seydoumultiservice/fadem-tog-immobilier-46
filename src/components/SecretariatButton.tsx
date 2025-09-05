
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Users } from 'lucide-react';

const SecretariatButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:+22892716641';
  };

  const handleWhatsApp = () => {
    const message = "Bonjour, je souhaite contacter le secrétariat de Groupe FADEM pour obtenir des informations sur vos services. Merci !";
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "22892716641";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed bottom-20 left-6 z-50 flex flex-col items-start space-y-2">
      {/* Boutons secondaires */}
      {isExpanded && (
        <div className="flex flex-col space-y-2 animate-slide-in-up">
          <Button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-full p-3 hover:scale-110 transition-all duration-300"
            size="sm"
            title="WhatsApp Secrétariat"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={handleCall}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full p-3 hover:scale-110 transition-all duration-300"
            size="sm"
            title="Appeler Secrétariat"
          >
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Bouton principal */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl rounded-full p-4 animate-pulse hover:scale-110 transition-all duration-300 relative"
        size="lg"
      >
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold">Secrétariat</div>
            <div className="text-xs opacity-90">92 71 66 41</div>
          </div>
        </div>
        
        {/* Indicator dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
      </Button>

      {/* Version mobile compacte */}
      <div className="sm:hidden">
        {isExpanded && (
          <div className="bg-white rounded-lg shadow-xl p-4 animate-fade-in border border-gray-200">
            <div className="text-center mb-3">
              <h3 className="font-bold text-gray-800">Secrétariat FADEM</h3>
              <p className="text-sm text-gray-600">+228 92 71 66 41</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleCall}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Phone className="w-4 h-4 mr-1" />
                Appeler
              </Button>
              <Button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretariatButton;
