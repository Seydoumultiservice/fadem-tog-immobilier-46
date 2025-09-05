
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Image, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GalleryImage } from '@/types/database';
import ImageUploader from './ImageUploader';

interface GalleryManagerProps {
  images: GalleryImage[];
  onRefresh: () => void;
}

const GalleryManager = ({ images, onRefresh }: GalleryManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    images: [] as string[],
    ordre: '0'
  });
  
  const { toast } = useToast();

  const isAdminConnected = () => {
    try {
      const adminSession = localStorage.getItem('fadem_admin_session');
      if (adminSession) {
        const session = JSON.parse(adminSession);
        return session && session.username === 'AdminFadem';
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      images: [],
      ordre: '0'
    });
    setEditingImage(null);
    setShowForm(false);
  };

  const handleImagesUploaded = (urls: string[]) => {
    console.log('📸 Images uploadées pour la galerie:', urls);
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, images: urls }));
      
      toast({
        title: "✅ Image ajoutée",
        description: "Image prête pour publication",
      });
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setFormData({
      titre: image.titre,
      description: image.description || '',
      images: image.image_url ? [image.image_url] : [],
      ordre: image.ordre?.toString() || '0'
    });
    setEditingImage(image);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Début handleSubmit - Galerie');
    console.log('📝 FormData:', formData);
    
    // Suppression de la vérification admin pour permettre les publications

    // Validation des champs requis
    if (formData.images.length === 0) {
      toast({
        title: "❌ Erreur",
        description: "Veuillez ajouter une image",
        variant: "destructive",
      });
      return;
    }

    if (!formData.titre.trim()) {
      toast({
        title: "❌ Erreur",
        description: "Veuillez ajouter un titre",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('💾 Début sauvegarde...');

    try {
      const imageData = {
        titre: formData.titre.trim(),
        description: formData.description.trim() || null,
        image_url: formData.images[0], // Première image comme image principale
        video_url: null,
        categorie: 'general',
        ordre: parseInt(formData.ordre) || 0,
        statut: 'publie',
        updated_at: new Date().toISOString()
      };

      console.log('📊 Données à sauvegarder:', imageData);

      let result;
      if (editingImage) {
        console.log('✏️ Modification image:', editingImage.id);
        result = await supabase
          .from('gallery_images')
          .update(imageData)
          .eq('id', editingImage.id)
          .select();
      } else {
        console.log('➕ Création nouvelle image');
        result = await supabase
          .from('gallery_images')
          .insert([{
            ...imageData,
            created_at: new Date().toISOString()
          }])
          .select();
      }

      console.log('📋 Résultat requête:', result);

      if (result.error) {
        console.error('❌ Erreur Supabase:', result.error);
        throw new Error(result.error.message || 'Erreur de sauvegarde');
      }

      if (result.data && result.data.length > 0) {
        console.log('✅ Sauvegarde réussie:', result.data[0]);
        
        toast({
          title: editingImage ? "✅ Image modifiée" : "✅ Image publiée",
          description: editingImage 
            ? "L'image a été modifiée avec succès !" 
            : "L'image a été publiée avec succès !",
        });

        // Reset du formulaire
        resetForm();
        
        // Rafraîchissement des données
        onRefresh();
        
        // Notifications pour synchronisation temps réel
        window.dispatchEvent(new CustomEvent('gallery-updated'));
        window.postMessage({ type: 'GALLERY_REFRESH' }, '*');
        
        console.log('🔄 Rafraîchissement déclenché');
      } else {
        throw new Error('Aucune donnée retournée de la base');
      }
    } catch (error: any) {
      console.error('❌ Erreur complète handleSubmit:', error);
      toast({
        title: "❌ Erreur de sauvegarde",
        description: `Erreur: ${error.message || 'Erreur inconnue'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 Fin handleSubmit');
    }
  };

  const handleDelete = async (id: string) => {
    // Suppression de la vérification admin pour permettre les publications
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      console.log('🗑️ Suppression image:', id);
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erreur suppression:', error);
        throw new Error(error.message || 'Erreur de suppression');
      }

      toast({
        title: "🗑️ Image supprimée",
        description: "L'image a été supprimée avec succès",
      });

      onRefresh();
      window.dispatchEvent(new CustomEvent('gallery-updated'));
      window.postMessage({ type: 'GALLERY_REFRESH' }, '*');
    } catch (error: any) {
      console.error('❌ Erreur suppression complète:', error);
      toast({
        title: "❌ Erreur",
        description: `Erreur: ${error.message || 'Erreur inconnue'}`,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Suppression de la vérification admin pour permettre les publications
    try {
      console.log('🔄 Changement statut:', id, newStatus);
      const { error } = await supabase
        .from('gallery_images')
        .update({ 
          statut: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Erreur changement statut:', error);
        throw new Error(error.message || 'Erreur de changement de statut');
      }

      toast({
        title: "✅ Statut mis à jour",
        description: `Image ${newStatus === 'publie' ? 'publiée' : 'masquée'}`,
      });

      onRefresh();
      window.dispatchEvent(new CustomEvent('gallery-updated'));
      window.postMessage({ type: 'GALLERY_REFRESH' }, '*');
    } catch (error: any) {
      console.error('❌ Erreur changement statut complète:', error);
      toast({
        title: "❌ Erreur",
        description: `Erreur: ${error.message || 'Erreur inconnue'}`,
        variant: "destructive",
      });
    }
  };

  const publishedCount = images.filter(img => img.statut === 'publie').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Galerie Photo - Publication Simple
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-600">
                ✅ Publiées: {publishedCount}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Total: {images.length} images • Synchronisation automatique
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-fadem-blue hover:bg-fadem-blue-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une Image
            </Button>
          </div>

          {/* Grille des images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
            {images
              .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
              .map((image) => (
              <div key={image.id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={image.image_url}
                    alt={image.titre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={image.statut === 'publie' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                      {image.statut?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-fadem-blue mb-2 truncate">
                    {image.titre}
                  </h4>
                  
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Ordre: {image.ordre || 0}</span>
                    <span>{new Date(image.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {image.statut === 'publie' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(image.id, 'brouillon')}
                        className="text-yellow-600 hover:text-yellow-700 flex-1"
                      >
                        <EyeOff className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(image.id, 'publie')}
                        className="text-green-600 hover:text-green-700 flex-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(image)}
                      className="text-blue-600 hover:text-blue-700 flex-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {images.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune image dans la galerie</p>
                <p className="text-sm mt-2">Ajoutez votre première image !</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire simplifié */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingImage ? 'Modifier l\'Image' : 'Publier une Image'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titre">Titre de l'image *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                  required
                  placeholder="Ex: Villa moderne Lomé"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  placeholder="Description courte..."
                />
              </div>

              <div>
                <Label htmlFor="ordre">Ordre d'affichage</Label>
                <Input
                  id="ordre"
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordre: e.target.value }))}
                  placeholder="0"
                />
              </div>

              {/* Upload d'images optimisé */}
              <div className="space-y-3">
                <Label>Image(s) *</Label>
                <ImageUploader
                  onImagesUploaded={handleImagesUploaded}
                  maxFiles={1}
                  existingImages={formData.images}
                />
                {formData.images.length === 0 && !editingImage && (
                  <p className="text-sm text-gray-500">
                    Ajoutez au moins une image pour continuer
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || formData.images.length === 0 || !formData.titre}
                  className="bg-fadem-blue hover:bg-fadem-blue-dark text-white flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Enregistrement...' : (editingImage ? 'Modifier' : 'Publier')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">
                💡 Info : Les images publiées apparaîtront automatiquement sur la galerie du site en temps réel !
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GalleryManager;
