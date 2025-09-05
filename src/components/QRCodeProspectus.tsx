
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Phone, MessageCircle, MapPin, Star, Building, Users, Award, ChevronRight, Mail, Globe } from 'lucide-react';

const QRCodeProspectus = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const message = "Bonjour Groupe FADEM ! J'ai scanné votre QR code et je souhaite obtenir plus d'informations sur vos services. Pouvez-vous me contacter ? Merci !";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/22892716641?text=${encodedMessage}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+22891005317', '_self');
  };

  const handleSecretariatCall = () => {
    window.open('tel:+22892716641', '_self');
  };

  const scrollToContact = () => {
    setIsOpen(false);
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const services = [
    { name: 'Immobilier', count: '200+ biens', icon: Building, desc: 'Vente et location de biens' },
    { name: 'BTP & Construction', count: '50+ projets', icon: Award, desc: 'Construction clé en main' },
    { name: 'Gérance Locative', count: '100+ clients', icon: Users, desc: 'Gestion de patrimoine' },
    { name: 'Location Véhicules', count: '20+ véhicules', icon: Star, desc: 'Fleet management' }
  ];

  // Générer un QR code simple avec données structurées
  const qrData = {
    company: "GROUPE FADEM",
    website: "https://groupefadem.tech",
    phones: ["+228 91 00 53 17", "+228 92 71 66 41"],
    whatsapp: "+228 92 71 66 41",
    services: ["Immobilier", "BTP", "Gérance", "Location"],
    locations: ["Lomé", "Kara", "Sokodé", "Aneho", "Dapaong"]
  };

  return (
    <>
      {/* QR Code flottant repositionné - côté gauche */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed top-1/2 left-4 z-50 bg-gradient-to-br from-fadem-blue via-fadem-gold to-fadem-blue hover:from-fadem-gold hover:via-fadem-blue hover:to-fadem-gold text-white shadow-2xl rounded-xl p-4 md:p-5 animate-pulse hover:animate-bounce transition-all duration-500 hover:scale-110 group border-2 border-white/30 backdrop-blur-sm transform -translate-y-1/2"
            size="lg"
          >
            <div className="flex flex-col items-center space-y-2">
              <QrCode className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform" />
              <div className="text-center">
                <div className="text-sm md:text-base font-bold">QR CODE</div>
                <div className="text-xs opacity-90 hidden sm:block">Prospectus Digital</div>
              </div>
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-gold-50/30 border-2 border-fadem-gold/20">
          <DialogHeader className="text-center pb-6 border-b-2 border-gradient-to-r from-fadem-blue to-fadem-gold">
            <DialogTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fadem-blue to-fadem-gold bg-clip-text text-transparent">
              🏗️ GROUPE FADEM
            </DialogTitle>
            <p className="text-lg text-gray-600 mt-2">Votre partenaire de confiance au Togo</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Globe className="w-5 h-5 text-fadem-blue" />
              <span className="text-fadem-blue font-semibold">groupefadem.tech</span>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
            {/* QR Code principal et actions */}
            <div className="flex flex-col items-center space-y-6">
              {/* QR Code visuel amélioré */}
              <Card className="w-full max-w-sm bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-fadem-gold/20">
                <CardContent className="p-8 text-center">
                  <div className="bg-white p-6 rounded-2xl shadow-inner mb-6 border-2 border-gray-100">
                    <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                      <rect width="200" height="200" fill="white"/>
                      
                      {/* Coins de positionnement */}
                      <rect x="10" y="10" width="50" height="50" fill="black"/>
                      <rect x="20" y="20" width="30" height="30" fill="white"/>
                      <rect x="25" y="25" width="20" height="20" fill="black"/>
                      
                      <rect x="140" y="10" width="50" height="50" fill="black"/>
                      <rect x="150" y="20" width="30" height="30" fill="white"/>
                      <rect x="155" y="25" width="20" height="20" fill="black"/>
                      
                      <rect x="10" y="140" width="50" height="50" fill="black"/>
                      <rect x="20" y="150" width="30" height="30" fill="white"/>
                      <rect x="25" y="155" width="20" height="20" fill="black"/>
                      
                      {/* Données simulées */}
                      <rect x="70" y="10" width="10" height="10" fill="black"/>
                      <rect x="90" y="10" width="10" height="10" fill="black"/>
                      <rect x="110" y="10" width="10" height="10" fill="black"/>
                      
                      <rect x="10" y="70" width="10" height="10" fill="black"/>
                      <rect x="10" y="90" width="10" height="10" fill="black"/>
                      <rect x="10" y="110" width="10" height="10" fill="black"/>
                      
                      <rect x="70" y="70" width="60" height="60" fill="black"/>
                      <rect x="80" y="80" width="40" height="40" fill="white"/>
                      <rect x="90" y="90" width="20" height="20" fill="black"/>
                      
                      <rect x="140" y="70" width="10" height="10" fill="black"/>
                      <rect x="160" y="70" width="10" height="10" fill="black"/>
                      <rect x="180" y="70" width="10" height="10" fill="black"/>
                      
                      <rect x="140" y="140" width="10" height="10" fill="black"/>
                      <rect x="160" y="140" width="10" height="10" fill="black"/>
                      <rect x="180" y="140" width="10" height="10" fill="black"/>
                      
                      <rect x="70" y="140" width="10" height="10" fill="black"/>
                      <rect x="90" y="140" width="10" height="10" fill="black"/>
                      <rect x="110" y="140" width="10" height="10" fill="black"/>
                      
                      <rect x="140" y="160" width="10" height="10" fill="black"/>
                      <rect x="160" y="160" width="10" height="10" fill="black"/>
                      <rect x="180" y="160" width="10" height="10" fill="black"/>
                      
                      <rect x="70" y="160" width="10" height="10" fill="black"/>
                      <rect x="90" y="160" width="10" height="10" fill="black"/>
                      <rect x="110" y="160" width="10" height="10" fill="black"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl text-fadem-blue mb-3">Scannez pour plus d'infos</h3>
                  <p className="text-sm text-gray-600">Accès direct à toutes nos informations</p>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <div className="w-full max-w-sm space-y-4">
                <Button 
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  WhatsApp: +228 92 71 66 41
                </Button>
                
                <Button 
                  onClick={handleCall}
                  className="w-full bg-fadem-blue hover:bg-fadem-blue-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Direction: +228 91 00 53 17
                </Button>

                <Button 
                  onClick={handleSecretariatCall}
                  className="w-full bg-fadem-gold hover:bg-fadem-gold-light text-fadem-blue font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Secrétariat: +228 92 71 66 41
                </Button>
                
                <Button 
                  onClick={scrollToContact}
                  variant="outline"
                  className="w-full border-2 border-fadem-gold text-fadem-blue hover:bg-fadem-gold hover:text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 text-base"
                >
                  <MapPin className="w-6 h-6 mr-3" />
                  Nous Localiser
                </Button>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="space-y-6">
              {/* Services */}
              <Card className="bg-white shadow-lg border-2 border-fadem-blue/10">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-fadem-blue mb-6 flex items-center">
                    <Building className="w-7 h-7 mr-3" />
                    Nos Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-gold-50 transition-all duration-300 border border-gray-200">
                        <service.icon className="w-10 h-10 text-fadem-blue mr-4 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{service.name}</p>
                          <p className="text-sm text-fadem-gold font-semibold">{service.count}</p>
                          <p className="text-xs text-gray-600 mt-1">{service.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card className="bg-gradient-to-br from-fadem-blue via-fadem-blue-dark to-fadem-gold text-white shadow-lg border-2 border-fadem-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <Award className="w-7 h-7 mr-3" />
                    Nos Performances
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">15+</div>
                      <div className="text-sm opacity-90">Années d'expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">500+</div>
                      <div className="text-sm opacity-90">Clients satisfaits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">200+</div>
                      <div className="text-sm opacity-90">Projets réalisés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">100%</div>
                      <div className="text-sm opacity-90">Satisfaction client</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact et localisation */}
              <Card className="bg-white shadow-lg border-2 border-fadem-gold/20">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-fadem-blue mb-6 flex items-center">
                    <MapPin className="w-7 h-7 mr-3" />
                    Nous Contacter
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-fadem-gold mr-4" />
                      <span className="font-medium">Lomé • Kara • Sokodé • Aneho • Dapaong - TOGO</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-6 h-6 text-fadem-gold mr-4" />
                      <span className="font-medium">+228 91 00 53 17 | +228 92 71 66 41</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-fadem-gold mr-4" />
                      <span className="font-medium">Service WhatsApp 24h/7j</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-6 h-6 text-fadem-gold mr-4" />
                      <span className="font-medium">contact@groupefadem.tech</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer avec call-to-action */}
          <div className="border-t-2 border-fadem-blue/20 pt-6 bg-gradient-to-r from-blue-50/50 to-gold-50/50 rounded-lg">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-6 font-medium">🚀 Prêt à démarrer votre projet avec nous ?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Commencer une conversation
                </Button>
                <Button 
                  onClick={() => window.open('https://diaspora.groupefadem.tech', '_blank')}
                  variant="outline"
                  className="border-2 border-fadem-blue text-fadem-blue hover:bg-fadem-blue hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-base"
                >
                  <ChevronRight className="w-6 h-6 mr-3" />
                  Espace Diaspora
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodeProspectus;
