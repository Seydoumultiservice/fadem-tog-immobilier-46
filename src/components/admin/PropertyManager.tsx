
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { Plus, Save, Edit, Trash2, MapPin, Euro, Home, Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface PropertyManagerProps {
  properties: Property[];
  onRefresh: () => void;
}

const PropertyManager = ({ properties, onRefresh }: PropertyManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_bien: '',
    type_transaction: '',
    prix: '',
    localisation: '',
    quartier: '',
    ville: 'Lomé',
    nombre_pieces: '',
    nombre_chambres: '',
    nombre_salles_bain: '',
    surface_habitable: '',
    surface_totale: '',
    parking: false,
    piscine: false,
    jardin: false,
    climatisation: false,
    securite: false,
    date_disponibilite: '',
    statut: 'disponible',
    images: [] as string[],
    video_url: ''
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      type_bien: '',
      type_transaction: '',
      prix: '',
      localisation: '',
      quartier: '',
      ville: 'Lomé',
      nombre_pieces: '',
      nombre_chambres: '',
      nombre_salles_bain: '',
      surface_habitable: '',
      surface_totale: '',
      parking: false,
      piscine: false,
      jardin: false,
      climatisation: false,
      securite: false,
      date_disponibilite: '',
      statut: 'disponible',
      images: [],
      video_url: ''
    });
    setEditingProperty(null);
    setImagesReady(false);
    setIsUploadingImages(false);
    setShowForm(false);
  };

  const handleEdit = (property: Property) => {
    console.log('📝 Édition du bien:', property.id);
    setFormData({
      titre: property.titre,
      description: property.description,
      type_bien: property.type_bien,
      type_transaction: property.type_transaction,
      prix: property.prix.toString(),
      localisation: property.localisation,
      quartier: property.quartier || '',
      ville: property.ville || 'Lomé',
      nombre_pieces: property.nombre_pieces?.toString() || '',
      nombre_chambres: property.nombre_chambres?.toString() || '',
      nombre_salles_bain: property.nombre_salles_bain?.toString() || '',
      surface_habitable: property.surface_habitable?.toString() || '',
      surface_totale: property.surface_totale?.toString() || '',
      parking: property.parking || false,
      piscine: property.piscine || false,
      jardin: property.jardin || false,
      climatisation: property.climatisation || false,
      securite: property.securite || false,
      date_disponibilite: property.date_disponibilite || '',
      statut: property.statut || 'disponible',
      images: property.images || [],
      video_url: property.video_url || ''
    });
    setEditingProperty(property);
    // Si le bien a déjà des images, considérer comme prêt
    setImagesReady((property.images?.length || 0) > 0);
    setIsUploadingImages(false);
    setShowForm(true);
  };

  const handleImagesUploaded = (urls: string[], uploadStatus?: { isUploading: boolean; allUploaded: boolean }) => {
    console.log('📸 Images uploadées pour le bien:', urls);
    setFormData(prev => ({ ...prev, images: urls }));
    
    // Simplifier la gestion des états
    setIsUploadingImages(false);
    setImagesReady(true);
    
    toast({
      title: "✅ Images ajoutées",
      description: `${urls.length} image(s) prête(s) pour publication`,
    });
  };

  const validateForm = () => {
    const requiredFields = ['titre', 'description', 'type_bien', 'type_transaction', 'prix', 'localisation'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "❌ Champ requis manquant",
          description: `Le champ ${field} est obligatoire`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (isNaN(parseFloat(formData.prix)) || parseFloat(formData.prix) <= 0) {
      toast({
        title: "❌ Prix invalide",
        description: "Veuillez saisir un prix valide",
        variant: "destructive",
      });
      return false;
    }

    // Images optionnelles - permettre la création sans images
    if (isUploadingImages) {
      toast({
        title: "⏳ Upload en cours",
        description: "Attendez que l'upload des images soit terminé avant de publier",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    console.log('💾 Début sauvegarde bien immobilier...');

    try {
      const propertyData = {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        type_bien: formData.type_bien,
        type_transaction: formData.type_transaction,
        prix: parseFloat(formData.prix),
        localisation: formData.localisation.trim(),
        quartier: formData.quartier.trim() || null,
        ville: formData.ville,
        nombre_pieces: formData.nombre_pieces ? parseInt(formData.nombre_pieces) : null,
        nombre_chambres: formData.nombre_chambres ? parseInt(formData.nombre_chambres) : null,
        nombre_salles_bain: formData.nombre_salles_bain ? parseInt(formData.nombre_salles_bain) : null,
        surface_habitable: formData.surface_habitable ? parseInt(formData.surface_habitable) : null,
        surface_totale: formData.surface_totale ? parseInt(formData.surface_totale) : null,
        parking: formData.parking,
        piscine: formData.piscine,
        jardin: formData.jardin,
        climatisation: formData.climatisation,
        securite: formData.securite,
        date_disponibilite: formData.date_disponibilite || null,
        statut: formData.statut,
        images: formData.images.length > 0 ? formData.images : null,
        video_url: formData.video_url.trim() || null
      };

      console.log('📋 Données à sauvegarder:', propertyData);

      let result;
      if (editingProperty) {
        console.log('🔄 Mise à jour du bien:', editingProperty.id);
        result = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select();
      } else {
        console.log('➕ Création nouveau bien');
        result = await supabase
          .from('properties')
          .insert([propertyData])
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Bien sauvegardé avec succès:', data);

      toast({
        title: "✅ Succès",
        description: editingProperty 
          ? "Bien immobilier mis à jour avec succès"
          : "Bien immobilier créé avec succès",
      });

      // Synchronisation temps réel
      onRefresh();
      window.dispatchEvent(new CustomEvent('properties-updated'));
      window.postMessage({ type: 'PROPERTIES_REFRESH' }, '*');

      resetForm();

    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "❌ Erreur de sauvegarde",
        description: error.message || "Impossible de sauvegarder le bien immobilier",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return;

    console.log('🗑️ Suppression du bien:', id);

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erreur suppression:', error);
        throw error;
      }

      console.log('✅ Bien supprimé avec succès');

      toast({
        title: "✅ Bien supprimé",
        description: "Le bien immobilier a été supprimé avec succès",
      });

      // Synchronisation temps réel
      onRefresh();
      window.dispatchEvent(new CustomEvent('properties-updated'));
      window.postMessage({ type: 'PROPERTIES_REFRESH' }, '*');
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de supprimer le bien",
        variant: "destructive",
      });
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-fadem-blue">
            {editingProperty ? 'Modifier le bien' : 'Nouveau bien immobilier'}
          </h3>
          <Button
            variant="outline"
            onClick={resetForm}
            className="border-gray-300"
          >
            Annuler
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="titre">Titre du bien *</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                      placeholder="Villa moderne 4 chambres..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type_bien">Type de bien *</Label>
                    <Select
                      value={formData.type_bien}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type_bien: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="maison">Maison</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="bureau">Bureau</SelectItem>
                        <SelectItem value="commerce">Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type_transaction">Type de transaction *</Label>
                    <Select
                      value={formData.type_transaction}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type_transaction: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vente">Vente</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="location-meublee">Location meublée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="prix">Prix (FCFA) *</Label>
                    <Input
                      id="prix"
                      type="number"
                      value={formData.prix}
                      onChange={(e) => setFormData(prev => ({ ...prev, prix: e.target.value }))}
                      placeholder="50000000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="localisation">Localisation *</Label>
                    <Input
                      id="localisation"
                      value={formData.localisation}
                      onChange={(e) => setFormData(prev => ({ ...prev, localisation: e.target.value }))}
                      placeholder="Adresse complète"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="quartier">Quartier</Label>
                    <Input
                      id="quartier"
                      value={formData.quartier}
                      onChange={(e) => setFormData(prev => ({ ...prev, quartier: e.target.value }))}
                      placeholder="Nom du quartier"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ville">Ville</Label>
                    <Select
                      value={formData.ville}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, ville: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lomé">Lomé</SelectItem>
                        <SelectItem value="Kara">Kara</SelectItem>
                        <SelectItem value="Sokodé">Sokodé</SelectItem>
                        <SelectItem value="Kpalimé">Kpalimé</SelectItem>
                        <SelectItem value="Atakpamé">Atakpamé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="statut">Statut</Label>
                    <Select
                      value={formData.statut}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, statut: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="vendu">Vendu</SelectItem>
                        <SelectItem value="loue">Loué</SelectItem>
                        <SelectItem value="reserve">Réservé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée du bien..."
                  rows={4}
                  required
                />
              </div>

              {/* Caractéristiques */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="nombre_pieces">Pièces</Label>
                  <Input
                    id="nombre_pieces"
                    type="number"
                    value={formData.nombre_pieces}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_pieces: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="nombre_chambres">Chambres</Label>
                  <Input
                    id="nombre_chambres"
                    type="number"
                    value={formData.nombre_chambres}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_chambres: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="nombre_salles_bain">Salles de bain</Label>
                  <Input
                    id="nombre_salles_bain"
                    type="number"
                    value={formData.nombre_salles_bain}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_salles_bain: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="surface_habitable">Surface (m²)</Label>
                  <Input
                    id="surface_habitable"
                    type="number"
                    value={formData.surface_habitable}
                    onChange={(e) => setFormData(prev => ({ ...prev, surface_habitable: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Équipements */}
              <div>
                <Label className="text-base font-medium">Équipements</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
                  {[
                    { key: 'parking', label: 'Parking' },
                    { key: 'piscine', label: 'Piscine' },
                    { key: 'jardin', label: 'Jardin' },
                    { key: 'climatisation', label: 'Climatisation' },
                    { key: 'securite', label: 'Sécurité' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload d'images optimisé */}
              <div>
                <Label className="text-lg font-semibold text-fadem-blue mb-2">📸 Images du bien (Minimum 5 recommandées)</Label>
                <div className="mt-3 bg-gradient-to-br from-fadem-blue/5 to-fadem-gold/5 border-2 border-dashed border-fadem-blue/30 rounded-lg p-6 hover:border-fadem-blue/50 transition-colors">
                  <ImageUploader
                    onImagesUploaded={handleImagesUploaded}
                    maxFiles={15}
                    existingImages={formData.images}
                    onUploadStatusChange={(isUploading) => setIsUploadingImages(isUploading)}
                  />
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">💡 Conseil: Plus vous ajoutez d'images de qualité, plus votre bien sera attractif aux visiteurs</p>
                  </div>
                </div>
              </div>

              {/* URL vidéo */}
              <div>
                <Label htmlFor="video_url">URL Vidéo (YouTube, Vimeo...)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Date de disponibilité */}
              <div>
                <Label htmlFor="date_disponibilite">Date de disponibilité</Label>
                <Input
                  id="date_disponibilite"
                  type="date"
                  value={formData.date_disponibilite}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_disponibilite: e.target.value }))}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving || isUploadingImages}
                  className="bg-fadem-blue hover:bg-fadem-blue-dark flex-1 sm:flex-none disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingProperty ? 'Mettre à jour' : 'Créer le bien'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-fadem-blue">Gestion des Biens Immobiliers</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {properties.length} bien(s) immobilier(s) • Synchronisation temps réel active
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-fadem-blue hover:bg-fadem-blue-dark w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau bien
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun bien immobilier</h4>
            <p className="text-gray-500 mb-6">Commencez par créer votre premier bien immobilier</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-fadem-blue hover:bg-fadem-blue-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer un bien
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-fadem-blue truncate">
                      {property.titre}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-fadem-blue/10 text-fadem-blue">
                        {property.type_bien}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-fadem-gold/10 text-fadem-gold-dark">
                        {property.type_transaction}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{property.localisation}</span>
                </div>
                
                <div className="flex items-center gap-2 text-lg font-bold text-fadem-blue">
                  <Euro className="w-5 h-5" />
                  <span>{property.prix?.toLocaleString()} FCFA</span>
                </div>

                {property.nombre_chambres && (
                  <div className="text-sm text-muted-foreground">
                    {property.nombre_chambres} chambres • {property.nombre_pieces} pièces
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(property)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyManager;
