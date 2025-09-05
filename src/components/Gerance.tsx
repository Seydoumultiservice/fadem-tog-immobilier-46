
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Gerance = () => {
  const steps = [
    {
      number: "01",
      title: "Étude du bien",
      description: "Évaluation complète de votre propriété et analyse du marché locatif",
      icon: "🔍"
    },
    {
      number: "02", 
      title: "Construction/Rénovation",
      description: "Travaux d'amélioration pour optimiser la rentabilité de votre bien",
      icon: "🏗️"
    },
    {
      number: "03",
      title: "Mise en location",
      description: "Recherche de locataires qualifiés et signature des baux",
      icon: "🤝"
    },
    {
      number: "04",
      title: "Suivi & Reporting",
      description: "Gestion quotidienne et bilan trimestriel détaillé",
      icon: "📊"
    }
  ];

  const advantages = [
    "Rentabilité garantie et optimisée",
    "Suivi 24/7 de votre patrimoine",
    "Bilan financier trimestriel détaillé",
    "Gestion complète des locataires",
    "Maintenance et entretien assurés",
    "Transparence totale sur les revenus"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="gerance" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-fadem-blue mb-6">
            Gérance & Gestion Locative
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Confiez-nous votre patrimoine immobilier pour une gestion professionnelle et rentable
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h3 className="font-serif text-3xl font-bold text-center text-fadem-blue mb-12">
            Notre Processus en 4 Étapes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-fadem-gold text-fadem-blue w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  <div className="text-4xl mb-4 mt-4">{step.icon}</div>
                  <h4 className="font-serif text-lg font-bold text-fadem-blue mb-3">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
          <h3 className="font-serif text-3xl font-bold text-center text-fadem-blue mb-8">
            Vos Avantages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-fadem-gold rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-fadem-blue rounded-2xl p-8 md:p-12 text-white">
          <h3 className="font-serif text-3xl font-bold mb-4">
            Prêt à optimiser votre patrimoine ?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Nos experts vous accompagnent de la construction à la gestion locative
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="bg-fadem-gold hover:bg-fadem-gold-light text-fadem-blue font-semibold px-8 py-4"
            >
              Confiez-nous votre bien
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="border-white text-white hover:bg-white hover:text-fadem-blue px-8 py-4"
            >
              Demander une étude gratuite
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gerance;
