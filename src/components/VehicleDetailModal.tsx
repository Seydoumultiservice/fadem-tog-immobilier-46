
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Car, Calendar, MapPin, Fuel, Settings, Users, Phone, 
  X, Heart, Share2, Eye, Play, Video, Star, CheckCircle,
  DollarSign, Clock, Shield, Award
} from 'lucide-react';
import { Vehicle } from '@/types/vehicle';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDetailModal = ({ vehicle, isOpen, onClose }: VehicleDetailModalProps) => {
  const formatPrice = (price: number, type: 'vente' | 'location') => {
    if (type === 'location') {
      return `${price.toLocaleString()} FCFA/jour`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('watch?v=') ? url.split('watch?v=')[1] : url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId?.split('&')[0]}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-fadem-blue mb-2">
                {vehicle.titre}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>{vehicle.marque} {vehicle.modele}</span>
                </div>
                {vehicle.annee && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{vehicle.annee}</span>
                  </div>
                )}
                {vehicle.localisation && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.localisation}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                className={`${
                  vehicle.type_transaction === 'vente' 
                    ? 'bg-fadem-blue text-white' 
                    : 'bg-fadem-gold text-white'
                }`}
              >
                {vehicle.type_transaction}
              </Badge>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6">
          <Separator />
        </div>

        {/* Main content */}
        <div className="p-6 space-y-6">
          {/* Images et vidéo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Galerie Photos
              </h3>
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`${vehicle.titre} - Image ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Vidéo */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Vidéo de présentation
              </h3>
              {vehicle.video_url ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md">
                  {vehicle.video_url.includes('youtube.com') || vehicle.video_url.includes('youtu.be') ? (
                    <iframe
                      src={getVideoEmbedUrl(vehicle.video_url)}
                      className="w-full h-full"
                      allowFullScreen
                      title={`Vidéo - ${vehicle.titre}`}
                    />
                  ) : vehicle.video_url.includes('vimeo.com') ? (
                    <iframe
                      src={getVideoEmbedUrl(vehicle.video_url)}
                      className="w-full h-full"
                      allowFullScreen
                      title={`Vidéo - ${vehicle.titre}`}
                    />
                  ) : (
                    <video controls className="w-full h-full">
                      <source src={vehicle.video_url} type="video/mp4" />
                      Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Aucune vidéo disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prix et détails */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-fadem-blue mb-2">
                      {formatPrice(vehicle.prix, vehicle.type_transaction)}
                    </h3>
                    {vehicle.type_transaction === 'location' && vehicle.prix_location_jour && (
                      <p className="text-lg text-fadem-gold">
                        {vehicle.prix_location_jour.toLocaleString()} FCFA/jour
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {vehicle.statut}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Caractéristiques principales</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {vehicle.kilometrage && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-fadem-blue/10 rounded-full flex items-center justify-center">
                          <Settings className="w-4 h-4 text-fadem-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Kilométrage</p>
                          <p className="font-medium">{vehicle.kilometrage.toLocaleString()} km</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.carburant && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-fadem-blue/10 rounded-full flex items-center justify-center">
                          <Fuel className="w-4 h-4 text-fadem-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Carburant</p>
                          <p className="font-medium capitalize">{vehicle.carburant}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.transmission && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-fadem-blue/10 rounded-full flex items-center justify-center">
                          <Settings className="w-4 h-4 text-fadem-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Transmission</p>
                          <p className="font-medium capitalize">{vehicle.transmission}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.nombre_places && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-fadem-blue/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-fadem-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Places</p>
                          <p className="font-medium">{vehicle.nombre_places} places</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Équipements */}
                  <div>
                    <h4 className="font-semibold mb-3">Équipements inclus</h4>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.climatisation && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          ❄️ Climatisation
                        </Badge>
                      )}
                      {vehicle.gps && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          🗺️ GPS
                        </Badge>
                      )}
                      {vehicle.bluetooth && (
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                          📱 Bluetooth
                        </Badge>
                      )}
                      {vehicle.couleur && (
                        <Badge variant="secondary" className="bg-gray-50 text-gray-700">
                          🎨 {vehicle.couleur}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact
                </h3>
                
                <div className="space-y-4">
                  {vehicle.proprietaire_nom && (
                    <div>
                      <p className="text-sm text-gray-600">Propriétaire</p>
                      <p className="font-medium">{vehicle.proprietaire_nom}</p>
                    </div>
                  )}
                  
                  {vehicle.proprietaire_telephone && (
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium">{vehicle.proprietaire_telephone}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      className="w-full bg-fadem-blue hover:bg-fadem-blue-dark"
                      onClick={() => window.open(`tel:${vehicle.proprietaire_telephone}`, '_self')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler maintenant
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(`https://wa.me/${vehicle.proprietaire_telephone?.replace(/\s+/g, '')}`, '_blank')}
                    >
                      <span className="mr-2">📱</span>
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {vehicle.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Garanties et services */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Nos garanties
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Véhicule vérifié</p>
                    <p className="text-sm text-gray-600">Contrôle technique OK</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Service client</p>
                    <p className="text-sm text-gray-600">Support 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Disponibilité</p>
                    <p className="text-sm text-gray-600">Réponse rapide</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
