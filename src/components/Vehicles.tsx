
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Fuel, Settings, MapPin, Calendar, DollarSign, Phone, Eye, Heart, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/vehicle';
import VehicleDetailModal from './VehicleDetailModal';
import YoutubeVideoPreview from './YoutubeVideoPreview';
import SellVehicleForm from './SellVehicleForm';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState('vente');
  const [showSellForm, setShowSellForm] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('statut', 'disponible')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles((data || []) as Vehicle[]);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => vehicle.type_transaction === activeTab);

  const formatPrice = (price: number, type: 'vente' | 'location') => {
    if (type === 'location') {
      return `${price.toLocaleString()} FCFA/jour`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  const getTransactionColor = (type: string) => {
    return type === 'vente' ? 'bg-fadem-blue text-white' : 'bg-fadem-gold text-white';
  };

  const getTransmissionIcon = (transmission?: string) => {
    return transmission === 'automatique' ? '🔄' : '⚙️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fadem-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des véhicules...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-fadem-blue to-fadem-gold rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-fadem-blue">
              Nos Véhicules
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez notre sélection de véhicules de qualité pour vente et location
          </p>
          
          {/* Bouton Vendre votre véhicule */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Dialog open={showSellForm} onOpenChange={setShowSellForm}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Vendre votre véhicule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-fadem-blue flex items-center">
                    <Car className="w-6 h-6 mr-2" />
                    Vendre votre véhicule
                  </DialogTitle>
                </DialogHeader>
                <SellVehicleForm onClose={() => setShowSellForm(false)} />
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Besoin d'aide ? Appelez-nous au +228 91 00 53 17</span>
            </div>
          </div>
        </div>

        {/* Tabs pour Vente/Location */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-lg border border-gray-200 rounded-xl p-1">
              <TabsTrigger 
                value="vente" 
                className="px-6 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-fadem-blue data-[state=active]:to-fadem-blue-dark data-[state=active]:text-white transition-all duration-300"
              >
                <Car className="w-4 h-4 mr-2" />
                Vente ({vehicles.filter(v => v.type_transaction === 'vente').length})
              </TabsTrigger>
              <TabsTrigger 
                value="location" 
                className="px-6 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-fadem-gold data-[state=active]:to-yellow-600 data-[state=active]:text-white transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Location ({vehicles.filter(v => v.type_transaction === 'location').length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="vente">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden bg-white border border-gray-100">
                  {/* Vidéo YouTube en priorité, sinon images */}
                  <div className="relative h-48 overflow-hidden group">
                    {vehicle.video_url ? (
                      <div className="h-full">
                        <YoutubeVideoPreview
                          videoUrl={vehicle.video_url}
                          title={vehicle.titre}
                          className="h-full"
                          autoplay={false}
                        />
                        
                        {/* Badges sur vidéo */}
                        <div className="absolute top-3 left-3 flex gap-2 z-10">
                          <Badge className={getTransactionColor(vehicle.type_transaction)}>
                            {vehicle.type_transaction}
                          </Badge>
                          {vehicle.annee && (
                            <Badge variant="secondary" className="bg-white/90 text-gray-800">
                              {vehicle.annee}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Boutons action sur vidéo */}
                        <div className="absolute top-3 right-3 flex gap-2 z-10">
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : vehicle.images && vehicle.images.length > 0 ? (
                      <>
                        <img 
                          src={vehicle.images[0]} 
                          alt={vehicle.titre}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-fadem-blue text-white">
                            {vehicle.type_transaction}
                          </Badge>
                        </div>
                        
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Car className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-fadem-blue mb-2 group-hover:text-fadem-blue-dark transition-colors">
                        {vehicle.titre}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {vehicle.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Marque/Modèle:</span>
                        <span className="font-medium">{vehicle.marque} {vehicle.modele}</span>
                      </div>
                      
                      {vehicle.annee && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Année:</span>
                          <span className="font-medium">{vehicle.annee}</span>
                        </div>
                      )}
                      
                      {vehicle.kilometrage && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Kilométrage:</span>
                          <span className="font-medium">{vehicle.kilometrage.toLocaleString()} km</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        {vehicle.carburant && (
                          <div className="flex items-center gap-1">
                            <Fuel className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{vehicle.carburant}</span>
                          </div>
                        )}
                        
                        {vehicle.transmission && (
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{vehicle.transmission}</span>
                          </div>
                        )}
                      </div>
                      
                      {vehicle.localisation && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{vehicle.localisation}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-fadem-blue">
                          {formatPrice(vehicle.prix, vehicle.type_transaction)}
                        </p>
                        {vehicle.type_transaction === 'location' && vehicle.prix_location_jour && (
                          <p className="text-sm text-gray-500">
                            {vehicle.prix_location_jour.toLocaleString()} FCFA/jour
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="bg-fadem-blue hover:bg-fadem-blue-dark text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucun véhicule disponible pour la vente
                </h3>
                <p className="text-gray-500">
                  Revenez bientôt, nous ajoutons régulièrement de nouveaux véhicules.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="location">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden bg-white border border-gray-100">
                  {/* Vidéo YouTube en priorité, sinon images */}
                  <div className="relative h-48 overflow-hidden group">
                    {vehicle.video_url ? (
                      <div className="h-full">
                        <YoutubeVideoPreview
                          videoUrl={vehicle.video_url}
                          title={vehicle.titre}
                          className="h-full"
                          autoplay={false}
                        />
                        
                        {/* Badges sur vidéo */}
                        <div className="absolute top-3 left-3 flex gap-2 z-10">
                          <Badge className={getTransactionColor(vehicle.type_transaction)}>
                            {vehicle.type_transaction}
                          </Badge>
                          {vehicle.annee && (
                            <Badge variant="secondary" className="bg-white/90 text-gray-800">
                              {vehicle.annee}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Boutons action sur vidéo */}
                        <div className="absolute top-3 right-3 flex gap-2 z-10">
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : vehicle.images && vehicle.images.length > 0 ? (
                      <>
                        <img 
                          src={vehicle.images[0]} 
                          alt={vehicle.titre}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-fadem-gold text-white">
                            {vehicle.type_transaction}
                          </Badge>
                        </div>
                        
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Car className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-fadem-blue mb-2 group-hover:text-fadem-blue-dark transition-colors">
                        {vehicle.titre}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {vehicle.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Marque/Modèle:</span>
                        <span className="font-medium">{vehicle.marque} {vehicle.modele}</span>
                      </div>
                      
                      {vehicle.annee && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Année:</span>
                          <span className="font-medium">{vehicle.annee}</span>
                        </div>
                      )}
                      
                      {vehicle.nombre_places && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Places:</span>
                          <span className="font-medium">{vehicle.nombre_places} places</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        {vehicle.carburant && (
                          <div className="flex items-center gap-1">
                            <Fuel className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{vehicle.carburant}</span>
                          </div>
                        )}
                        
                        {vehicle.transmission && (
                          <div className="flex items-center gap-1">
                            <span>{getTransmissionIcon(vehicle.transmission)}</span>
                            <span className="capitalize">{vehicle.transmission}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Options disponibles */}
                      <div className="flex flex-wrap gap-2">
                        {vehicle.climatisation && (
                          <Badge variant="outline" className="text-xs">❄️ Clim</Badge>
                        )}
                        {vehicle.gps && (
                          <Badge variant="outline" className="text-xs">🗺️ GPS</Badge>
                        )}
                        {vehicle.bluetooth && (
                          <Badge variant="outline" className="text-xs">📱 Bluetooth</Badge>
                        )}
                      </div>
                      
                      {vehicle.localisation && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{vehicle.localisation}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-fadem-gold">
                          {vehicle.prix_location_jour ? 
                            `${vehicle.prix_location_jour.toLocaleString()} FCFA/jour` : 
                            formatPrice(vehicle.prix, vehicle.type_transaction)
                          }
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="bg-fadem-gold hover:bg-yellow-600 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucun véhicule disponible pour la location
                </h3>
                <p className="text-gray-500">
                  Revenez bientôt, nous ajoutons régulièrement de nouveaux véhicules.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modal de détails */}
      {selectedVehicle && (
        <VehicleDetailModal 
          vehicle={selectedVehicle} 
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </section>
  );
};

export default Vehicles;
