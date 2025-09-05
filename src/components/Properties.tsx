
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import PropertyCard from './PropertyCard';
import PropertyFilters from './properties/PropertyFilters';
import { Phone, MessageCircle, Home, MapPin, Building, Euro } from 'lucide-react';

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    loadProperties();
    
    // Synchronisation temps réel
    const handlePropertiesUpdate = () => {
      console.log('🔄 Mise à jour propriétés détectée');
      loadProperties();
    };

    window.addEventListener('properties-updated', handlePropertiesUpdate);
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PROPERTIES_REFRESH') {
        console.log('🔄 Rafraîchissement propriétés');
        loadProperties();
      }
    };
    
    window.addEventListener('message', handleMessage);

    // Synchronisation Supabase temps réel
    const channel = supabase
      .channel('properties-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'properties'
      }, (payload) => {
        console.log('🔄 Changement propriétés Supabase:', payload);
        loadProperties();
      })
      .subscribe();

    return () => {
      window.removeEventListener('properties-updated', handlePropertiesUpdate);
      window.removeEventListener('message', handleMessage);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, typeFilter, transactionFilter, priceRange, cityFilter]);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('statut', 'disponible')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties((data || []) as Property[]);
    } catch (error) {
      console.error('Erreur lors du chargement des propriétés:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.quartier?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type_bien === typeFilter);
    }

    if (transactionFilter && transactionFilter !== 'all') {
      filtered = filtered.filter(property => property.type_transaction === transactionFilter);
    }

    if (cityFilter && cityFilter !== 'all') {
      filtered = filtered.filter(property => property.ville === cityFilter);
    }

    if (priceRange.min) {
      filtered = filtered.filter(property => property.prix >= parseFloat(priceRange.min));
    }

    if (priceRange.max) {
      filtered = filtered.filter(property => property.prix <= parseFloat(priceRange.max));
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setTransactionFilter('');
    setPriceRange({ min: '', max: '' });
    setCityFilter('');
  };

  const handleContact = () => {
    const message = "Bonjour FADEM ! Je suis intéressé par vos biens immobiliers. Pouvez-vous me contacter pour plus d'informations ? Merci !";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/22892716641?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <section id="proprietes" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fadem-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des propriétés...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="proprietes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-fadem-blue mb-6">
            Nos Biens Immobiliers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez notre sélection de biens immobiliers de qualité au Togo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleContact}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact WhatsApp
            </Button>
            
            <Button 
              onClick={() => window.open('tel:+22892716641', '_self')}
              className="bg-fadem-blue hover:bg-fadem-blue-dark text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              +228 92 71 66 41
            </Button>
          </div>
        </div>

        <PropertyFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          transactionFilter={transactionFilter}
          setTransactionFilter={setTransactionFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          onClearFilters={clearFilters}
        />

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-fadem-blue to-fadem-blue-dark text-white">
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{properties.length}</div>
              <div className="text-sm opacity-90">Biens Total</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <Home className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{properties.filter(p => p.type_transaction === 'vente').length}</div>
              <div className="text-sm opacity-90">À Vendre</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-fadem-gold to-yellow-500 text-white">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{properties.filter(p => p.type_transaction === 'location').length}</div>
              <div className="text-sm opacity-90">À Louer</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Euro className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{new Set(properties.map(p => p.ville).filter(Boolean)).size}</div>
              <div className="text-sm opacity-90">Villes</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
          </p>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun bien trouvé</h3>
              <p className="text-gray-600 mb-6">
                Aucun bien ne correspond à vos critères de recherche.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={clearFilters}
                  className="bg-fadem-blue hover:bg-fadem-blue-dark text-white"
                >
                  Voir tous les biens
                </Button>
                <Button 
                  onClick={handleContact}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Nous contacter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section finale avec contact */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-fadem-blue via-fadem-gold to-fadem-blue p-8 rounded-2xl text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Vous cherchez un bien spécifique ?</h3>
            <p className="text-lg mb-6 opacity-90">
              Contactez-nous et nous vous aiderons à trouver le bien de vos rêves
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleContact}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact WhatsApp
              </Button>
              <Button 
                onClick={() => window.open('tel:+22892716641', '_self')}
                className="bg-white text-fadem-blue hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appeler maintenant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Properties;
