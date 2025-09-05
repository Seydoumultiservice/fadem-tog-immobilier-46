
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-r from-fadem-blue to-fadem-blue-dark text-white py-16 relative overflow-hidden">
      {/* Effets d'arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-fadem-gold rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/lovable-uploads/8ab4fdca-37dc-441b-aebe-aee42fe5c4e6.png" 
                alt="Groupe FADEM" 
                className="h-12 w-12 hover:rotate-12 transition-transform duration-300"
              />
              <div>
                <h3 className="font-serif text-xl font-bold">GROUPE FADEM</h3>
                <p className="text-sm text-fadem-gold">SARL-U</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Expert togolais en immobilier, BTP et gérance locative. 
              Votre patrimoine, notre expertise.
            </p>
            <div className="flex space-x-3">
              <div className="w-3 h-3 bg-fadem-gold rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-fadem-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-fadem-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Services */}
          <div className="hover:scale-105 transition-transform duration-300">
            <h4 className="font-serif text-lg font-bold mb-6">Nos Services</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Immobilier
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('diaspora')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Services Diaspora
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('realisations')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  BTP & Construction
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gerance')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Gérance Locative
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('vehicules')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Location/Vente Véhicules
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('apartements-meubles')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Appartements Meublés
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="hover:scale-105 transition-transform duration-300">
            <h4 className="font-serif text-lg font-bold mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('accueil')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Nos Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('realisations')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Réalisations
                </button>
              </li>
              <li>
                <a 
                  href="/about"
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  À Propos
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-fadem-gold transition-colors hover:scale-105 inline-block"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="hover:scale-105 transition-transform duration-300">
            <h4 className="font-serif text-lg font-bold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-fadem-gold mt-0.5 animate-pulse" />
                <div>
                  <p className="text-gray-300 hover:text-fadem-gold transition-colors cursor-pointer">+228 91 00 53 17</p>
                  <p className="text-fadem-gold font-semibold hover:text-white transition-colors cursor-pointer">
                    Secrétariat: +228 92 71 66 41
                  </p>
                  <p className="text-gray-300 hover:text-fadem-gold transition-colors cursor-pointer">+228 98 33 84 27</p>
                  <p className="text-sm text-gray-400">Disponible 7j/7</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-fadem-gold mt-0.5 animate-pulse" />
                <div>
                  <p className="text-gray-300 hover:text-fadem-gold transition-colors cursor-pointer">groupefadem@gmail.com</p>
                  <p className="text-gray-300 hover:text-fadem-gold transition-colors cursor-pointer">contact@groupefadem.tech</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-fadem-gold mt-0.5 animate-pulse" />
                <div>
                  <p className="text-gray-300">Tout le Togo</p>
                  <p className="text-sm text-gray-400">Réseau national</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0 hover:text-fadem-gold transition-colors">
              © 2024 Groupe FADEM Sarl-U. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <button className="text-gray-400 hover:text-fadem-gold transition-colors hover:scale-105">
                Mentions légales
              </button>
              <button className="text-gray-400 hover:text-fadem-gold transition-colors hover:scale-105">
                Politique de confidentialité
              </button>
              <button className="text-gray-400 hover:text-fadem-gold transition-colors hover:scale-105">
                CGV
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
