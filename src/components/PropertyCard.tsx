
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/database';
import { MapPin, Bed, Bath, Square, Car, Waves, TreePine, Snowflake, Shield, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import PropertyDetailModal from './PropertyDetailModal';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const images = property.images || [];
  const hasVideo = property.video_url && property.video_url.trim() !== '';

  const getYouTubeEmbedUrl = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${match[1]}`;
    }
    return url;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const amenities = [
    { key: 'parking', icon: Car, label: 'Parking' },
    { key: 'piscine', icon: Waves, label: 'Piscine' },
    { key: 'jardin', icon: TreePine, label: 'Jardin' },
    { key: 'climatisation', icon: Snowflake, label: 'Climatisation' },
    { key: 'securite', icon: Shield, label: 'Sécurité' }
  ];

  const availableAmenities = amenities.filter(amenity => 
    property[amenity.key as keyof Property] === true
  );

  return (
    <>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 group bg-white border-0 shadow-lg">
        <div className="relative overflow-hidden h-64">
          {/* Images et vidéo */}
          {hasVideo ? (
            <div className="relative w-full h-full">
              <iframe
                src={getYouTubeEmbedUrl(property.video_url!)}
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={property.titre}
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                <Play className="w-3 h-3 inline mr-1" />
                VIDÉO
              </div>
            </div>
          ) : images.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={images[currentImageIndex]}
                alt={property.titre}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    →
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-fadem-blue to-fadem-blue-dark flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium">Pas d'image</p>
              </div>
            </div>
          )}

          {/* Badge du type de transaction */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              property.type_transaction === 'vente' 
                ? 'bg-fadem-gold text-fadem-blue' 
                : 'bg-fadem-blue text-white'
            } shadow-lg`}>
              {property.type_transaction === 'vente' ? 'À VENDRE' : 'À LOUER'}
            </span>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="font-serif text-xl font-bold text-fadem-blue mb-2 group-hover:text-fadem-gold transition-colors duration-300">
              {property.titre}
            </h3>
            <p className="text-gray-600 flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-fadem-gold" />
              {property.localisation}, {property.ville}
            </p>
            <p className="text-2xl font-bold text-fadem-blue">
              {formatPrice(property.prix)} FCFA
            </p>
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {property.nombre_pieces && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Square className="w-4 h-4 text-fadem-gold" />
                <span>{property.nombre_pieces} pièces</span>
              </div>
            )}
            {property.nombre_chambres && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bed className="w-4 h-4 text-fadem-gold" />
                <span>{property.nombre_chambres} chambres</span>
              </div>
            )}
            {property.nombre_salles_bain && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bath className="w-4 h-4 text-fadem-gold" />
                <span>{property.nombre_salles_bain} salles de bain</span>
              </div>
            )}
            {property.surface_habitable && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Square className="w-4 h-4 text-fadem-gold" />
                <span>{property.surface_habitable} m²</span>
              </div>
            )}
          </div>

          {/* Équipements */}
          {availableAmenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {availableAmenities.slice(0, 3).map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={amenity.key} className="flex items-center gap-1 bg-fadem-gold/10 text-fadem-blue px-2 py-1 rounded-full text-xs">
                      <Icon className="w-3 h-3" />
                      <span>{amenity.label}</span>
                    </div>
                  );
                })}
                {availableAmenities.length > 3 && (
                  <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    +{availableAmenities.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          <Button 
            onClick={() => setShowModal(true)}
            className="w-full bg-fadem-blue hover:bg-fadem-gold hover:text-fadem-blue text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Voir les détails
          </Button>
        </CardContent>
      </Card>

      {showModal && (
        <PropertyDetailModal
          property={property}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default PropertyCard;
