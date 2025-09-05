
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Car, Shield, Building, Phone, MessageCircle, Globe, Camera, MapPin, FileText } from 'lucide-react';

const DiasporaSection = () => {
  const handleWhatsAppContact = (service: string) => {
    let message = "";
    switch (service) {
      case 'construction':
        message = "Bonjour Groupe FADEM ! Je vis à l'étranger et souhaite construire ma maison au Togo. Pouvez-vous m'accompagner dans ce projet depuis l'étranger ? J'aimerais connaître vos services de suivi à distance. Merci !";
        break;
      case 'vehicules':
        message = "Bonjour Groupe FADEM ! Je souhaite acheter ou louer un véhicule au Togo depuis l'étranger. Pouvez-vous me présenter vos options et modalités pour la diaspora ? Merci !";
        break;
      default:
        message = "Bonjour Groupe FADEM ! Je vis à l'étranger et souhaite bénéficier de vos services pour la diaspora togolaise. Pouvez-vous me contacter ? Merci !";
    }
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "22892716641";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+22892716641', '_self');
  };

  const services = [
    {
      id: 'construction-diaspora',
      title: 'Construisez votre maison depuis l\'étranger',
      subtitle: 'Accompagnement total pour la diaspora togolaise',
      description: 'De la recherche du terrain à la remise des clés, nous gérons votre projet immobilier au Togo avec transparence et professionnalisme.',
      icon: Home,
      gradient: 'from-blue-600 to-blue-800',
      features: [
        'Recherche et sélection de terrain',
        'Gestion complète du projet de construction',
        'Suivi photo et vidéo en temps réel',
        'Gestion locative après construction',
        'Accompagnement juridique et administratif',
        'Transparence financière totale'
      ]
    },
    {
      id: 'vehicules-diaspora',
      title: 'Location et Vente de Véhicules',
      subtitle: 'Votre mobilité, notre priorité',
      description: 'Large gamme de véhicules disponibles à la vente et à la location avec service d\'entretien inclus.',
      icon: Car,
      gradient: 'from-green-600 to-green-800',
      features: [
        'Construction de maisons individuelles',
        'Travaux de rénovation et réhabilitation',
        'Travaux publics et infrastructure',
        'Suivi de chantier professionnel',
        'Matériaux de qualité certifiée',
        'Respect des délais contractuels'
      ]
    },
    {
      id: 'accompagnement-diaspora',
      title: 'Accompagnement Diaspora',
      subtitle: 'Votre projet immobilier depuis l\'étranger',
      description: 'Un service complet et transparent pour les Togolais vivant en Europe, au Royaume-Uni et aux États-Unis.',
      icon: Globe,
      gradient: 'from-purple-600 to-purple-800',
      features: [
        'Service personnalisé diaspora',
        'Suivi à distance 24h/7j',
        'Rapports détaillés réguliers',
        'Gestion des formalités administratives',
        'Support multilingue',
        'Garantie satisfaction'
      ]
    },
    {
      id: 'btp-diaspora',
      title: 'BTP & Construction',
      subtitle: 'Excellence en construction et rénovation',
      description: 'Des équipes qualifiées pour tous vos projets de construction selon les normes internationales.',
      icon: Building,
      gradient: 'from-orange-600 to-red-700',
      features: [
        'Standards internationaux',
        'Équipes certifiées',
        'Matériaux premium',
        'Contrôle qualité rigoureux',
        'Livraison dans les délais',
        'Service après-vente'
      ]
    }
  ];

  return (
    <section id="diaspora" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Drapeau du Togo en arrière-plan */}
      <div className="absolute top-10 right-10 opacity-10 hidden lg:block">
        <img 
          src="/lovable-uploads/06ea9e3f-9a96-4075-b0e4-d9a2b05a95ad.png" 
          alt="Drapeau du Togo" 
          className="w-32 h-24 object-cover rounded-lg animate-float"
        />
      </div>

      {/* Animations de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-500 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Globe className="w-12 h-12 text-blue-600 mr-4 animate-pulse" />
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-blue-900 mb-2">
                Services Diaspora
              </h2>
              <p className="text-lg text-purple-700 font-semibold">
                Spécialement conçus pour la diaspora togolaise
              </p>
            </div>
          </div>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
            Que vous soyez en Europe, au Royaume-Uni ou aux États-Unis, 
            nous vous accompagnons dans tous vos projets au Togo avec transparence et professionnalisme.
          </p>

          {/* Boutons d'appel à l'action principaux */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={() => handleWhatsAppContact('diaspora')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold hover:scale-110 transition-all duration-300 animate-pulse"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Diaspora
            </Button>
            
            <Button 
              onClick={handleCall}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold hover:scale-110 transition-all duration-300"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Secrétariat +228 92 71 66 41
            </Button>
            
            <Button 
              onClick={() => window.open('https://diaspora.groupefadem.tech', '_blank')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold hover:scale-110 transition-all duration-300"
              size="lg"
            >
              <Globe className="w-5 h-5 mr-2" />
              Portail Diaspora
            </Button>
          </div>
        </div>

        {/* Grille des services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in hover:-rotate-1 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0 h-full">
                {/* Header avec gradient */}
                <div className={`bg-gradient-to-r ${service.gradient} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                  <service.icon className="w-12 h-12 mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 relative z-10" />
                  <h3 className="text-lg font-bold mb-2 relative z-10 group-hover:scale-105 transition-transform">
                    {service.title}
                  </h3>
                  <p className="text-sm font-semibold opacity-90 relative z-10 mb-2">
                    {service.subtitle}
                  </p>
                  <p className="text-xs opacity-80 relative z-10">
                    {service.description}
                  </p>
                </div>

                {/* Contenu */}
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Boutons d'action */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleWhatsAppContact(service.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold hover:scale-105 transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contacter via WhatsApp
                    </Button>
                    
                    <Button 
                      onClick={handleCall}
                      variant="outline" 
                      size="sm"
                      className="w-full text-blue-600 border-blue-500 hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Appeler le secrétariat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section finale avec statistiques */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-8 rounded-2xl text-white animate-fade-in">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 animate-pulse">150+</div>
              <p className="text-lg opacity-90">Projets Diaspora Réalisés</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 animate-pulse">15+</div>
              <p className="text-lg opacity-90">Pays d'Accompagnement</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 animate-pulse">98%</div>
              <p className="text-lg opacity-90">Satisfaction Client</p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à réaliser votre rêve togolais depuis l'étranger ?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Contactez notre équipe spécialisée diaspora dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleWhatsAppContact('projet-diaspora')}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold hover:scale-110 transition-all duration-300"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Démarrer mon projet
              </Button>
              <Button 
                onClick={() => window.open('https://diaspora.groupefadem.tech', '_blank')}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-110 transition-all duration-300"
                size="lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                Visiter le portail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiasporaSection;
