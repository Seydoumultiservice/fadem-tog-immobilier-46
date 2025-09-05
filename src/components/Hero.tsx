
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useTextContent } from '@/hooks/useTextContent';

const Hero = () => {
  const { getContent, loading } = useTextContent('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fadem-blue">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fadem-gold"></div>
      </div>
    );
  }

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-fadem-blue/90 to-fadem-blue/70"
          style={{
            backgroundImage: `url('/lovable-uploads/09c437d5-9b16-45fa-ab93-c9656e8e6b23.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {getContent('main_title', 'Groupe FADEM')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            {getContent('subtitle', 'Votre patrimoine, notre expertise')}
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            {getContent('description', 'Expert togolais en immobilier, BTP et gérance locative. Nous accompagnons vos projets de la conception à la gestion quotidienne.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="bg-fadem-gold hover:bg-fadem-gold-light text-fadem-blue font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-transform"
            >
              Confiez-nous votre projet
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('services')}
              className="border-white text-white hover:bg-white hover:text-fadem-blue px-8 py-4 text-lg transform hover:scale-105 transition-transform"
            >
              Découvrir nos services
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold text-fadem-gold mb-2">+100</div>
              <div className="text-sm uppercase tracking-wide">Biens Gérés</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl font-bold text-fadem-gold mb-2">+50</div>
              <div className="text-sm uppercase tracking-wide">Chantiers Livrés</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.6s'}}>
              <div className="text-4xl font-bold text-fadem-gold mb-2">15+</div>
              <div className="text-sm uppercase tracking-wide">Années d'expérience</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <button 
            onClick={() => scrollToSection('services')}
            className="p-2 rounded-full border border-white/50 hover:bg-white/20 transition-colors"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
