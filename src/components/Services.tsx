
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Building, Shield, Car, MessageCircle, Phone, ArrowRight, Star, Clock, Users } from 'lucide-react';

const Services = () => {
  const handleWhatsAppReservation = (service: string) => {
    let message = "";
    switch (service) {
      case 'btp':
        message = "Bonjour Groupe FADEM ! Je souhaite réserver vos services BTP pour un projet de construction/rénovation. Pouvez-vous me contacter pour discuter des détails et obtenir un devis gratuit ? Merci !";
        break;
      case 'vehicules':
        message = "Bonjour Groupe FADEM ! Je souhaite réserver un véhicule. Pouvez-vous me présenter vos options disponibles et les tarifs ? J'aimerais connaître les modalités de réservation. Merci !";
        break;
      case 'immobilier':
        message = "Bonjour Groupe FADEM ! Je m'intéresse à vos biens immobiliers. Pouvez-vous me présenter vos offres disponibles à Lomé, Kara, Sokodé, Aneho ou Dapaong ? Merci !";
        break;
      case 'gerance':
        message = "Bonjour Groupe FADEM ! Je souhaite confier la gérance de mon bien immobilier à votre entreprise. Pouvez-vous me contacter pour discuter de vos services de gérance locative ? Merci !";
        break;
      default:
        message = `Bonjour Groupe FADEM ! Je souhaite obtenir des informations sur vos services ${service}. Pouvez-vous me contacter ? Merci !`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "22892716641"; // Nouveau numéro secrétariat
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleCall = (number: string) => {
    window.open(`tel:+${number}`, '_self');
  };

  const services = [
    {
      id: 'immobilier',
      title: 'Immobilier',
      description: 'Vente et location de biens immobiliers de qualité à Lomé, Kara, Sokodé, Aneho et Dapaong.',
      icon: Home,
      gradient: 'from-blue-500 to-blue-700',
      features: ['Appartements modernes', 'Villas de luxe', 'Terrains viabilisés', 'Bureaux équipés'],
      cta: 'Découvrir nos biens',
      hasReservation: true
    },
    {
      id: 'btp',
      title: 'BTP & Construction',
      description: 'Construction, rénovation et réhabilitation de bâtiments avec une expertise reconnue.',
      icon: Building,
      gradient: 'from-orange-500 to-red-600',
      features: ['Construction neuve', 'Rénovation complète', 'Suivi de chantier', 'Devis gratuit'],
      cta: 'Réserver un projet',
      hasReservation: true
    },
    {
      id: 'gerance',
      title: 'Gérance Locative',
      description: 'Gestion complète de vos biens immobiliers avec un service professionnel et transparent.',
      icon: Shield,
      gradient: 'from-green-500 to-teal-600',
      features: ['Gestion locative', 'Entretien des biens', 'Suivi des paiements', 'Rapport mensuel'],
      cta: 'Confier mes biens',
      hasReservation: true
    },
    {
      id: 'vehicules',
      title: 'Véhicules',
      description: 'Location de véhicules modernes et bien entretenus pour tous vos déplacements.',
      icon: Car,
      gradient: 'from-purple-500 to-indigo-600',
      features: ['Véhicules récents', 'Assurance incluse', 'Chauffeur disponible', 'Tarifs compétitifs'],
      cta: 'Réserver un véhicule',
      hasReservation: true
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animations de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-fadem-blue rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-fadem-gold rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-fadem-blue rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-fadem-blue mb-6 hover:scale-105 transition-transform duration-300">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Groupe FADEM vous accompagne dans tous vos projets immobiliers, de construction et de transport au Togo
          </p>
          
          {/* Appels à l'action principaux renforcés */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={() => handleWhatsAppReservation('general')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold hover:scale-110 transition-all duration-300 animate-pulse px-8 py-4 rounded-xl shadow-xl"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp: +228 92 71 66 41
            </Button>
            
            <Button 
              onClick={() => handleCall('22892716641')}
              className="bg-fadem-blue hover:bg-fadem-blue-dark text-white hover:scale-110 transition-all duration-300 px-8 py-4 rounded-xl shadow-xl"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Secrétariat: +228 92 71 66 41
            </Button>
            
            <Button 
              onClick={() => handleCall('22891005317')}
              variant="outline"
              className="border-fadem-gold text-fadem-gold hover:bg-fadem-gold hover:text-white hover:scale-110 transition-all duration-300 px-8 py-4 rounded-xl shadow-xl"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Direction: +228 91 00 53 17
            </Button>
            
            <Button 
              onClick={() => window.open('https://diaspora.groupefadem.tech', '_blank')}
              variant="outline"
              className="border-fadem-blue text-fadem-blue hover:bg-fadem-blue hover:text-white hover:scale-110 transition-all duration-300 px-6 py-4 rounded-xl shadow-xl"
              size="lg"
            >
              <Star className="w-5 h-5 mr-2" />
              Espace Diaspora
            </Button>
          </div>

          {/* Badges de confiance */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-lg">
              <Clock className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-semibold">Service 24h/7j</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-lg">
              <Users className="w-5 h-5 text-fadem-blue mr-2" />
              <span className="text-sm font-semibold">500+ Clients Satisfaits</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-lg">
              <Star className="w-5 h-5 text-fadem-gold mr-2" />
              <span className="text-sm font-semibold">15+ Ans d'Expérience</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <h3 className="text-xl font-bold mb-2 relative z-10 group-hover:scale-105 transition-transform">
                    {service.title}
                  </h3>
                  <p className="text-sm opacity-90 relative z-10">
                    {service.description}
                  </p>
                </div>

                {/* Contenu */}
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        <ArrowRight className="w-4 h-4 mr-2 text-fadem-gold group-hover:translate-x-1 transition-transform" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Boutons d'action renforcés */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleWhatsAppReservation(service.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold hover:scale-105 transition-all duration-300 py-3 rounded-xl shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {service.cta}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCall('22892716641')}
                        className="text-fadem-blue border-fadem-blue hover:bg-fadem-blue hover:text-white hover:scale-105 transition-all duration-300"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Secrétariat
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCall('22891005317')}
                        className="text-fadem-gold border-fadem-gold hover:bg-fadem-gold hover:text-white hover:scale-105 transition-all duration-300"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Direction
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section finale avec appel à l'action renforcé */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-fadem-blue via-fadem-gold to-fadem-blue p-8 rounded-2xl text-white animate-fade-in shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à démarrer votre projet ?</h3>
            <p className="text-lg mb-6 opacity-90">
              Contactez-nous dès maintenant pour une consultation gratuite et un devis personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleWhatsAppReservation('consultation')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold hover:scale-110 transition-all duration-300 px-8 py-4 rounded-xl shadow-xl"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Consultation gratuite WhatsApp
              </Button>
              <Button 
                onClick={() => handleCall('22892716641')}
                className="bg-white text-fadem-blue hover:bg-gray-100 font-semibold hover:scale-110 transition-all duration-300 px-8 py-4 rounded-xl shadow-xl"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appelez le secrétariat
              </Button>
              <Button 
                onClick={() => handleCall('22891005317')}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-fadem-blue hover:scale-110 transition-all duration-300 px-8 py-4 rounded-xl"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Direction
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
