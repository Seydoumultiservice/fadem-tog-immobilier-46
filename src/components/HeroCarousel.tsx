
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, Building, Wrench, ArrowRight, Car } from 'lucide-react';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/lovable-uploads/8ab4fdca-37dc-441b-aebe-aee42fe5c4e6.png",
      title: "Groupe FADEM",
      subtitle: "Votre Partenaire Multi-Services",
      description: "Immobilier • BTP • Gérance • Véhicules • Appartements Meublés",
      ctaText: "Découvrir nos services",
      ctaLink: "#services",
      overlay: "from-fadem-blue/80 to-fadem-blue-dark/60"
    },
    {
      id: 2,
      image: "/lovable-uploads/90399d8c-01d2-41c1-a9bf-02492d47a59b.png",
      title: "Biens Immobiliers Premium",
      subtitle: "Trouvez votre bien idéal",
      description: "Villas, appartements, terrains et commerces à Lomé et dans tout le Togo",
      ctaText: "Voir nos biens",
      ctaLink: "#properties",
      overlay: "from-fadem-gold/80 to-fadem-gold-light/60"
    },
    {
      id: 3,
      image: "/lovable-uploads/8ec83cc5-ed50-4539-b9c5-5239a6e91c05.png",
      title: "Construction & Rénovation",
      subtitle: "Expertise BTP",
      description: "Projets de construction, rénovation et aménagement avec des professionnels qualifiés",
      ctaText: "Nos réalisations",
      ctaLink: "#realisations",
      overlay: "from-fadem-blue/80 to-fadem-blue-dark/60"
    },
    {
      id: 4,
      image: "/lovable-uploads/97514e34-c373-4a22-abb4-8fbf7f8304ae.png",
      title: "Appartements Meublés",
      subtitle: "Confort et Élégance",
      description: "Logements entièrement équipés pour vos séjours de courte ou longue durée",
      ctaText: "Réserver maintenant",
      ctaLink: "#appartements-meubles",
      overlay: "from-fadem-gold/80 to-fadem-gold-light/60"
    },
    {
      id: 5,
      image: "/lovable-uploads/c7015043-8beb-45e3-abc6-e62d723a8060.png",
      title: "Véhicules Premium",
      subtitle: "Vente & Location",
      description: "Large gamme de véhicules neufs et d'occasion - Hyundai, Mercedes, BMW et plus",
      ctaText: "Voir nos véhicules",
      ctaLink: "#vehicules",
      overlay: "from-blue-900/80 to-gray-800/60"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Image de fond */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
            
            {/* Contenu */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  {slide.subtitle}
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <Button
                    onClick={() => scrollToSection(slide.ctaLink)}
                    size="lg"
                    className="bg-fadem-gold hover:bg-fadem-gold-light text-fadem-blue font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    {slide.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <Button
                    onClick={() => scrollToSection('#contact')}
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-fadem-blue font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  >
                    Nous contacter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contrôles de navigation */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 pointer-events-none">
        <Button
          onClick={prevSlide}
          variant="outline"
          size="lg"
          className="pointer-events-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-fadem-blue backdrop-blur-sm rounded-full p-3 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          onClick={nextSlide}
          variant="outline"
          size="lg"
          className="pointer-events-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-fadem-blue backdrop-blur-sm rounded-full p-3 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-fadem-gold scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Services rapides */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 hidden md:flex gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        {[
          { icon: Home, text: 'Immobilier', link: '#properties' },
          { icon: Building, text: 'Construction', link: '#realisations' },
          { icon: Car, text: 'Véhicules', link: '#vehicules' },
          { icon: Wrench, text: 'Gérance', link: '#gerance' }
        ].map((service, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(service.link)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white hover:text-fadem-blue transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <service.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{service.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
