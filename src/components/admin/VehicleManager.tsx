
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plus, Edit2, Trash2, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vehicle, VehicleSellRequest } from '@/types/database';
import ImageUploader from './ImageUploader';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  sellRequests: VehicleSellRequest[];
  onRefresh: () => void;
}

const VehicleManager = ({ vehicles, sellRequests, onRefresh }: VehicleManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    marque: '',
    modele: '',
    annee: '',
    type_transaction: 'vente',
    prix: '',
    prix_location_jour: '',
    kilometrage: '',
    carburant: '',
    transmission: '',
    couleur: '',
    nombre_places: '',
    climatisation: false,
    gps: false,
    bluetooth: false,
    statut: 'disponible',
    localisation: 'Lomé',
    images: [] as string[],
    video_url: '',
    proprietaire_nom: '',
    proprietaire_telephone: '',
    notes_internes: ''
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
      marque: '',
      modele: '',
      annee: '',
      type_transaction: 'vente',
      prix: '',
      prix_location_jour: '',
      kilometrage: '',
      carburant: '',
      transmission: '',
      couleur: '',
      nombre_places: '',
      climatisation: false,
      gps: false,
      bluetooth: false,
      statut: 'disponible',
      localisation: 'Lomé',
      images: [],
      video_url: '',
      proprietaire_nom: '',
      proprietaire_telephone: '',
      notes_internes: ''
    });
    setEditingVehicle(null);
    setShowForm(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    console.log('📝 Édition du véhicule:', vehicle.id);
    setFormData({
      titre: vehicle.titre,
      description: vehicle.description || '',
      marque: vehicle.marque,
      modele: vehicle.modele,
      annee: vehicle.annee?.toString() || '',
      type_transaction: vehicle.type_transaction,
      prix: vehicle.prix?.toString() || '',
      prix_location_jour: vehicle.prix_location_jour?.toString() || '',
      kilometrage: vehicle.kilometrage?.toString() || '',
      carburant: vehicle.carburant || '',
      transmission: vehicle.transmission || '',
      couleur: vehicle.couleur || '',
      nombre_places: vehicle.nombre_places?.toString() || '',
      climatisation: vehicle.climatisation || false,
      gps: vehicle.gps || false,
      bluetooth: vehicle.bluetooth || false,
      statut: vehicle.statut || 'disponible',
      localisation: vehicle.localisation || 'Lomé',
      images: vehicle.images || [],
      video_url: vehicle.video_url || '',
      proprietaire_nom: vehicle.proprietaire_nom || '',
      proprietaire_telephone: vehicle.proprietaire_telephone || '',
      notes_internes: vehicle.notes_internes || ''
    });
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleImagesUploaded = (urls: string[], uploadStatus?: { isUploading: boolean; allUploaded: boolean }) => {
    console.log('📸 Images uploadées pour le véhicule:', urls);
    setFormData(prev => ({ ...prev, images: urls }));
    
    toast({
      title: "✅ Images ajoutées",
      description: `${urls.length} image(s) prête(s) pour publication`,
    });
  };

  const validateForm = () => {
    const requiredFields = ['titre', 'marque', 'modele', 'prix'];
    
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

    if (formData.prix && isNaN(parseFloat(formData.prix))) {
      toast({
        title: "❌ Prix invalide",
        description: "Veuillez saisir un prix valide",
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
    console.log('💾 Début sauvegarde véhicule...');

    try {
      const vehicleData = {
        titre: formData.titre.trim(),
        description: formData.description.trim() || null,
        marque: formData.marque.trim(),
        modele: formData.modele.trim(),
        annee: formData.annee ? parseInt(formData.annee) : null,
        type_transaction: formData.type_transaction,
        prix: parseFloat(formData.prix),
        prix_location_jour: formData.prix_location_jour ? parseFloat(formData.prix_location_jour) : null,
        kilometrage: formData.kilometrage ? parseInt(formData.kilometrage) : null,
        carburant: formData.carburant || null,
        transmission: formData.transmission || null,
        couleur: formData.couleur.trim() || null,
        nombre_places: formData.nombre_places ? parseInt(formData.nombre_places) : null,
        climatisation: formData.climatisation,
        gps: formData.gps,
        bluetooth: formData.bluetooth,
        statut: formData.statut,
        localisation: formData.localisation.trim() || null,
        images: formData.images.length > 0 ? formData.images : null,
        video_url: formData.video_url.trim() || null,
        proprietaire_nom: formData.proprietaire_nom.trim() || null,
        proprietaire_telephone: formData.proprietaire_telephone.trim() || null,
        notes_internes: formData.notes_internes.trim() || null
      };

      console.log('📋 Données à sauvegarder:', vehicleData);

      let result;
      if (editingVehicle) {
        console.log('🔄 Mise à jour du véhicule:', editingVehicle.id);
        result = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', editingVehicle.id)
          .select();
      } else {
        console.log('➕ Création nouveau véhicule');
        result = await supabase
          .from('vehicles')
          .insert([vehicleData])
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Véhicule sauvegardé avec succès:', data);

      toast({
        title: "✅ Succès",
        description: editingVehicle 
          ? "Véhicule mis à jour avec succès"
          : "Véhicule créé avec succès",
      });

      // Synchronisation temps réel
      onRefresh();
      window.dispatchEvent(new CustomEvent('vehicles-updated'));
      window.postMessage({ type: 'VEHICLES_REFRESH' }, '*');

      resetForm();

    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "❌ Erreur de sauvegarde",
        description: error.message || "Impossible de sauvegarder le véhicule",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Suppression de la vérification admin pour permettre les publications
    setLoading(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ 
          statut: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "✅ Statut mis à jour",
        description: `Véhicule ${newStatus}`,
      });

      onRefresh();
    } catch (error: any) {
      console.error('Erreur changement statut:', error);
      toast({
        title: "❌ Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Suppression de la vérification admin pour permettre les publications
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "🗑️ Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès",
      });

      onRefresh();
    } catch (error: any) {
      console.error('Erreur suppression:', error);
      toast({
        title: "❌ Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const availableCount = vehicles.filter(v => v.statut === 'disponible').length;
  const soldCount = vehicles.filter(v => v.statut === 'vendu').length;
  const pendingRequests = sellRequests?.filter(r => r.statut === 'nouveau').length || 0;

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-fadem-blue">
            {editingVehicle ? 'Modifier le véhicule' : 'Nouveau véhicule'}
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
              {/* Informations principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="titre">Titre de l'annonce *</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                      placeholder="BMW X5 2020 - Excellent état"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="marque">Marque *</Label>
                      <Input
                        id="marque"
                        value={formData.marque}
                        onChange={(e) => setFormData(prev => ({ ...prev, marque: e.target.value }))}
                        placeholder="BMW"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="modele">Modèle *</Label>
                      <Input
                        id="modele"
                        value={formData.modele}
                        onChange={(e) => setFormData(prev => ({ ...prev, modele: e.target.value }))}
                        placeholder="X5"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="annee">Année</Label>
                      <Input
                        id="annee"
                        type="number"
                        min="1990"
                        max="2025"
                        value={formData.annee}
                        onChange={(e) => setFormData(prev => ({ ...prev, annee: e.target.value }))}
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <Label htmlFor="kilometrage">Kilométrage</Label>
                      <Input
                        id="kilometrage"
                        type="number"
                        value={formData.kilometrage}
                        onChange={(e) => setFormData(prev => ({ ...prev, kilometrage: e.target.value }))}
                        placeholder="50000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type_transaction">Type de transaction</Label>
                    <Select
                      value={formData.type_transaction}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type_transaction: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vente">Vente</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prix">Prix {formData.type_transaction === 'vente' ? 'de vente' : 'par jour'} (FCFA) *</Label>
                    <Input
                      id="prix"
                      type="number"
                      value={formData.prix}
                      onChange={(e) => setFormData(prev => ({ ...prev, prix: e.target.value }))}
                      placeholder="25000"
                      required
                    />
                  </div>

                  {formData.type_transaction === 'location' && (
                    <div>
                      <Label htmlFor="prix_location_jour">Prix par jour (FCFA)</Label>
                      <Input
                        id="prix_location_jour"
                        type="number"
                        value={formData.prix_location_jour}
                        onChange={(e) => setFormData(prev => ({ ...prev, prix_location_jour: e.target.value }))}
                        placeholder="150"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carburant">Carburant</Label>
                      <Select
                        value={formData.carburant}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, carburant: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="essence">Essence</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybride">Hybride</SelectItem>
                          <SelectItem value="electrique">Électrique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="transmission">Transmission</Label>
                      <Select
                        value={formData.transmission}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manuelle">Manuelle</SelectItem>
                          <SelectItem value="automatique">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="couleur">Couleur</Label>
                      <Input
                        id="couleur"
                        value={formData.couleur}
                        onChange={(e) => setFormData(prev => ({ ...prev, couleur: e.target.value }))}
                        placeholder="Noir"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nombre_places">Nombre de places</Label>
                      <Input
                        id="nombre_places"
                        type="number"
                        min="2"
                        max="9"
                        value={formData.nombre_places}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre_places: e.target.value }))}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="localisation">Localisation</Label>
                    <Select
                      value={formData.localisation}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, localisation: value }))}
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
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée du véhicule..."
                  rows={4}
                />
              </div>

              {/* Équipements */}
              <div>
                <Label className="text-base font-medium">Équipements</Label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.climatisation}
                      onChange={(e) => setFormData(prev => ({ ...prev, climatisation: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Climatisation</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.gps}
                      onChange={(e) => setFormData(prev => ({ ...prev, gps: e.target.checked }))}
                      className="rounded"
                    />
                    <span>GPS</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.bluetooth}
                      onChange={(e) => setFormData(prev => ({ ...prev, bluetooth: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Bluetooth</span>
                  </label>
                </div>
              </div>

              {/* Propriétaire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proprietaire_nom">Nom du propriétaire</Label>
                  <Input
                    id="proprietaire_nom"
                    value={formData.proprietaire_nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, proprietaire_nom: e.target.value }))}
                    placeholder="Nom du propriétaire"
                  />
                </div>
                <div>
                  <Label htmlFor="proprietaire_telephone">Téléphone propriétaire</Label>
                  <Input
                    id="proprietaire_telephone"
                    value={formData.proprietaire_telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, proprietaire_telephone: e.target.value }))}
                    placeholder="+228 XX XX XX XX"
                  />
                </div>
              </div>

              {/* Upload d'images */}
              <div>
                <Label className="text-base font-medium">Images du véhicule</Label>
                <div className="mt-3">
                  <ImageUploader
                    onImagesUploaded={handleImagesUploaded}
                    maxFiles={15}
                    existingImages={formData.images}
                  />
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

              {/* Notes internes */}
              <div>
                <Label htmlFor="notes_internes">Notes internes</Label>
                <Textarea
                  id="notes_internes"
                  value={formData.notes_internes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes_internes: e.target.value }))}
                  placeholder="Notes internes pour l'équipe..."
                  rows={3}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-fadem-blue hover:bg-fadem-blue-dark flex-1 sm:flex-none"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingVehicle ? 'Mettre à jour' : 'Créer le véhicule'}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Gestion des Véhicules
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-600">
                ✅ Disponibles: {availableCount}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                🚗 Vendus: {soldCount}
              </Badge>
              {pendingRequests > 0 && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
                  📝 Demandes: {pendingRequests}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Total: {vehicles.length} véhicules • Synchronisation automatique
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-fadem-blue hover:bg-fadem-blue-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Véhicule
            </Button>
          </div>

          {/* Liste des véhicules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="relative h-48">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.titre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Car className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className={
                      vehicle.statut === 'disponible' ? 'bg-green-500 text-white' :
                      vehicle.statut === 'vendu' ? 'bg-red-500 text-white' :
                      'bg-yellow-500 text-white'
                    }>
                      {vehicle.statut?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-fadem-blue mb-2 truncate">
                    {vehicle.titre}
                  </h4>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <div>{vehicle.marque} {vehicle.modele}</div>
                    <div>{vehicle.annee} • {vehicle.carburant}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-fadem-blue">
                      {vehicle.prix?.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(vehicle.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                   <div className="flex gap-1">
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => handleEdit(vehicle)}
                       className="flex-1"
                     >
                       <Edit2 className="w-3 h-3 mr-1" />
                       Modifier
                     </Button>
                     
                     {vehicle.statut === 'disponible' ? (
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => handleStatusChange(vehicle.id, 'vendu')}
                         className="text-red-600 hover:text-red-700"
                         disabled={loading}
                       >
                         Vendu
                       </Button>
                     ) : (
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => handleStatusChange(vehicle.id, 'disponible')}
                         className="text-green-600 hover:text-green-700"
                         disabled={loading}
                       >
                         Disponible
                       </Button>
                     )}
                     
                     <Button
                       size="sm"
                       variant="destructive"
                       onClick={() => handleDelete(vehicle.id)}
                       disabled={loading}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                </div>
              </div>
            ))}

            {vehicles.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun véhicule disponible</p>
                <p className="text-sm mt-2">Ajoutez votre premier véhicule !</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demandes de vente */}
      {sellRequests && sellRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Demandes de Vente ({sellRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {sellRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{request.marque} {request.modele}</h4>
                      <p className="text-sm text-gray-600">{request.nom} • {request.email}</p>
                      <p className="text-sm text-gray-600">Prix souhaité: {request.prix_souhaite?.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <Badge className={
                      request.statut === 'nouveau' ? 'bg-blue-500' :
                      request.statut === 'accepte' ? 'bg-green-500' :
                      'bg-gray-500'
                    }>
                      {request.statut?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleManager;
