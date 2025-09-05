import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Car, Utensils, Tv, Wind, Shield, Clock, Calendar, MessageCircle, Phone } from 'lucide-react';

const FurnishedApartments = () => {
  const apartments = [
    {
      id: 1,
      title: "Studio Meublé Moderne - Centre-ville",
      location: "Plateau, Lomé",
      price: "150,000",
      duration: "court séjour",
      image: "/lovable-uploads/fab7e7bf-0f7b-4fa7-b572-ce9698a9789b.png",
      amenities: ["wifi", "climatisation", "télévision", "cuisine équipée"]
    },
    {
      id: 2,
      title: "Appartement 2 Pièces Tout Équipé",
      location: "Kodjoviakopé, Lomé",
      price: "250,000",
      duration: "long séjour",
      image: "/lovable-uploads/d430ee40-6496-4a37-89bc-1cf192ce7339.png",
      amenities: ["parking", "wifi", "climatisation", "sécurité", "cuisine moderne"]
    },
    {
      id: 3,
      title: "Appartement de Standing avec Cuisine Moderne",
      location: "Agbalépédo, Lomé",
      price: "350,000",
      duration: "court/long séjour",
      image: "/lovable-uploads/ff1282ce-da89-4a00-b69c-9e40e87ada43.png",
      amenities: ["wifi", "parking", "climatisation", "télévision", "sécurité"]
    }
  ];

  const handleReservation = (apartment: typeof apartments[0]) => {
    const message = `Bonjour Groupe FADEM ! Je souhaite réserver l'appartement meublé "${apartment.title}" situé à ${apartment.location} au prix de ${apartment.price} FCFA/mois. Pouvez-vous me contacter pour finaliser la réservation ? Merci !`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "22892716641";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+22892716641', '_self');
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'cuisine équipée':
      case 'cuisine moderne': return <Utensils className="w-4 h-4" />;
      case 'télévision': return <Tv className="w-4 h-4" />;
      case 'climatisation': return <Wind className="w-4 h-4" />;
      case 'sécurité': return <Shield className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <section id="appartements-meubles" className="py-20 bg-white relative overflow-hidden">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-fadem-gold rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-fadem-blue rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-fadem-gold rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl font-bold text-fadem-blue mb-4 hover:scale-105 transition-transform duration-300">
            Appartements Meublés
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Pour vos séjours courts ou longs à Lomé
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apartments.map((apartment, index) => (
            <Card 
              key={apartment.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={apartment.image}
                  alt={apartment.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-fadem-gold text-fadem-blue px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                  {apartment.duration === 'court séjour' ? (
                    <><Clock className="w-3 h-3 inline mr-1" />Court séjour</>
                  ) : apartment.duration === 'long séjour' ? (
                    <><Calendar className="w-3 h-3 inline mr-1" />Long séjour</>
                  ) : (
                    <><Calendar className="w-3 h-3 inline mr-1" />Flexible</>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-bold text-fadem-blue mb-2 group-hover:text-fadem-gold transition-colors duration-300">
                  {apartment.title}
                </h3>
                <p className="text-gray-600 mb-3">{apartment.location}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {apartment.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 hover:bg-fadem-gold hover:text-fadem-blue px-2 py-1 rounded-full text-xs transition-all duration-300">
                      {getAmenityIcon(amenity)}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-fadem-blue group-hover:text-fadem-gold transition-colors duration-300">
                      {apartment.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">FCFA/mois</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => handleReservation(apartment)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Réserver via WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={handleCall}
                    variant="outline"
                    className="w-full border-fadem-blue text-fadem-blue hover:bg-fadem-blue hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler: +228 92 71 66 41
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-fadem-blue to-fadem-blue-dark text-white shadow-2xl hover:shadow-3xl transition-shadow duration-500">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold mb-4">
                Pourquoi Choisir Nos Appartements Meublés ?
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="hover:scale-105 transition-transform duration-300">
                  <h4 className="font-semibold mb-2">✓ Court Séjour (1 jour à 3 mois)</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Réservation flexible</li>
                    <li>• Tout inclus (eau, électricité, internet)</li>
                    <li>• Linge de maison fourni</li>
                    <li>• Service de ménage disponible</li>
                  </ul>
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <h4 className="font-semibold mb-2">✓ Long Séjour (3 mois et plus)</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Tarifs préférentiels</li>
                    <li>• Contrat de location flexible</li>
                    <li>• Maintenance incluse</li>
                    <li>• Possibilité de personnalisation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FurnishedApartments;
