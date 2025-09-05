import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GalleryImage } from '@/types/database';
import ImageModal from '@/components/ImageModal';

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  
  const imagesPerPage = 12;

  useEffect(() => {
    loadImages();
    
    // Écouter les événements de mise à jour
    const handleGalleryUpdate = () => {
      console.log('🔄 Mise à jour galerie détectée');
      loadImages();
    };

    window.addEventListener('gallery-updated', handleGalleryUpdate);
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GALLERY_REFRESH') {
        console.log('📨 Message refresh galerie reçu');
        loadImages();
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('gallery-updated', handleGalleryUpdate);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const loadImages = async () => {
    try {
      console.log('📸 Chargement images galerie...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('statut', 'publie' as const)
        .order('ordre', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur chargement galerie:', error);
        throw error;
      }

      console.log('✅ Images chargées:', data?.length || 0);
      setImages(data as GalleryImage[] || []);
    } catch (error: any) {
      console.error('❌ Erreur complète galerie:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors du chargement de la galerie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image => {
    if (filter === 'all') return true;
    return image.categorie === filter;
  });

  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = filteredImages.slice(startIndex, startIndex + imagesPerPage);

  const categories = [...new Set(images.map(img => img.categorie).filter(Boolean))];

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-fadem-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la galerie...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-fadem-blue mb-4">
            Notre Galerie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos plus belles réalisations et propriétés exceptionnelles
          </p>
        </motion.div>

        {/* Filtres */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="mb-2"
            >
              Toutes ({images.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                onClick={() => setFilter(category)}
                className="mb-2 capitalize"
              >
                {category} ({images.filter(img => img.categorie === category).length})
              </Button>
            ))}
          </div>
        )}

        {/* Grille des images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedImage(image)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.titre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                          {image.titre}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(image.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <Button size="sm" variant="secondary" className="opacity-90">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </div>
                    {image.categorie && (
                      <Badge className="absolute top-2 left-2 bg-fadem-blue/90 text-white capitalize">
                        {image.categorie}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Message si aucune image */}
        {currentImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune image disponible
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "La galerie sera bientôt alimentée avec nos plus belles réalisations."
                : `Aucune image trouvée pour la catégorie "${filter}".`
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Modal d'image */}
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Gallery;
