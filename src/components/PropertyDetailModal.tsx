
import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Square, Car, Waves, TreePine, Wind, Shield, Calendar, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/database';

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailModal = ({ property, isOpen, onClose }: PropertyDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const nextImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
    }
    if (url.includes('tiktok.com')) {
      return url.replace('/video/', '/embed/');
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="font-serif text-2xl font-bold text-fadem-blue">
              Détails du bien
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Galerie d'images */}
              <div className="space-y-4">
                {property.images && property.images.length > 0 && (
                  <div className="relative">
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.titre}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    {property.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {property.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full cursor-pointer ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Miniatures */}
                {property.images && property.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${property.titre} ${index + 1}`}
                        className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                          index === currentImageIndex ? 'border-fadem-gold' : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Vidéo */}
                {property.video_url && (
                  <div className="relative">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      Visite virtuelle
                    </h4>
                    <div className="aspect-video">
                      <iframe
                        src={getVideoEmbedUrl(property.video_url)}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        title="Visite virtuelle"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Informations détaillées */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-fadem-blue mb-2">
                    {property.titre}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.localisation}, {property.ville}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-fadem-blue text-white text-sm px-3 py-1">
                      {property.type_transaction}
                    </Badge>
                    <Badge className="bg-fadem-gold text-fadem-blue text-sm px-3 py-1">
                      {property.type_bien}
                    </Badge>
                    <Badge 
                      variant={property.statut === 'disponible' ? 'default' : 'secondary'}
                      className={`text-sm px-3 py-1 ${property.statut === 'disponible' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                    >
                      {property.statut}
                    </Badge>
                  </div>

                  <div className="text-4xl font-bold text-fadem-gold mb-6">
                    {formatPrice(property.prix)}
                    {property.type_transaction === 'location' && '/mois'}
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="grid grid-cols-2 gap-4">
                  {property.nombre_pieces && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{property.nombre_pieces} pièces</span>
                    </div>
                  )}
                  {property.nombre_chambres && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <Bed className="w-5 h-5 mr-2 text-fadem-blue" />
                      <span>{property.nombre_chambres} chambres</span>
                    </div>
                  )}
                  {property.nombre_salles_bain && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <Bath className="w-5 h-5 mr-2 text-fadem-blue" />
                      <span>{property.nombre_salles_bain} salles de bain</span>
                    </div>
                  )}
                  {property.surface_habitable && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <Square className="w-5 h-5 mr-2 text-fadem-blue" />
                      <span>{property.surface_habitable}m² habitables</span>
                    </div>
                  )}
                  {property.surface_totale && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <Square className="w-5 h-5 mr-2 text-fadem-blue" />
                      <span>{property.surface_totale}m² totaux</span>
                    </div>
                  )}
                  {property.date_disponibilite && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <Calendar className="w-5 h-5 mr-2 text-fadem-blue" />
                      <span>Disponible le {new Date(property.date_disponibilite).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                {/* Équipements */}
                <div>
                  <h4 className="font-semibold text-fadem-blue mb-3">Équipements</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {property.parking && (
                      <div className="flex items-center text-sm bg-blue-50 px-3 py-2 rounded">
                        <Car className="w-4 h-4 mr-2" />
                        Parking
                      </div>
                    )}
                    {property.piscine && (
                      <div className="flex items-center text-sm bg-blue-50 px-3 py-2 rounded">
                        <Waves className="w-4 h-4 mr-2" />
                        Piscine
                      </div>
                    )}
                    {property.jardin && (
                      <div className="flex items-center text-sm bg-green-50 px-3 py-2 rounded">
                        <TreePine className="w-4 h-4 mr-2" />
                        Jardin
                      </div>
                    )}
                    {property.climatisation && (
                      <div className="flex items-center text-sm bg-cyan-50 px-3 py-2 rounded">
                        <Wind className="w-4 h-4 mr-2" />
                        Climatisation
                      </div>
                    )}
                    {property.securite && (
                      <div className="flex items-center text-sm bg-red-50 px-3 py-2 rounded">
                        <Shield className="w-4 h-4 mr-2" />
                        Sécurité
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-fadem-blue mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 bg-fadem-blue hover:bg-fadem-blue-dark text-white">
                    Demander une visite
                  </Button>
                  <Button variant="outline" className="flex-1 border-fadem-gold text-fadem-blue hover:bg-fadem-gold">
                    Contacter l'agence
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailModal;
