
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SellVehicleFormProps {
  onClose: () => void;
}

const SellVehicleForm = ({ onClose }: SellVehicleFormProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    marque: '',
    modele: '',
    annee: '',
    kilometrage: '',
    prix_souhaite: '',
    description: '',
    couleur: '',
    carburant: '',
    transmission: '',
    etat_vehicule: ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "Limite d'images",
        description: "Vous ne pouvez ajouter que 5 images maximum",
        variant: "destructive",
      });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const fileName = `vehicles/${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from('fadem-images')
        .upload(fileName, image);
      
      if (error) {
        console.error('Erreur upload image:', error);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('fadem-images')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload des images
      const imageUrls = await uploadImages();
      
      // Préparer les données
      const submitData = {
        ...formData,
        annee: formData.annee ? parseInt(formData.annee) : null,
        kilometrage: formData.kilometrage ? parseInt(formData.kilometrage) : null,
        prix_souhaite: formData.prix_souhaite ? parseFloat(formData.prix_souhaite) : null,
        images: imageUrls,
        video_url: videoUrl || null,
        statut: 'nouveau'
      };

      const { error } = await supabase
        .from('vehicle_sell_requests')
        .insert([submitData]);

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "✅ Demande envoyée",
        description: "Votre demande de vente a été envoyée avec succès. Nous vous contacterons bientôt.",
      });

      // Reset form après 2 secondes
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "❌ Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-2">Demande envoyée avec succès !</h3>
        <p className="text-gray-600 mb-4">
          Nous avons bien reçu votre demande de vente. Notre équipe vous contactera dans les plus brefs délais.
        </p>
        <p className="text-sm text-gray-500">Cette fenêtre se fermera automatiquement...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations personnelles */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-fadem-blue mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                required
                placeholder="Votre nom"
              />
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                placeholder="+228 XX XX XX XX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations du véhicule */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-fadem-blue mb-4">Informations du véhicule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marque">Marque *</Label>
              <Input
                id="marque"
                value={formData.marque}
                onChange={(e) => handleInputChange('marque', e.target.value)}
                required
                placeholder="Toyota, Honda, etc."
              />
            </div>
            <div>
              <Label htmlFor="modele">Modèle *</Label>
              <Input
                id="modele"
                value={formData.modele}
                onChange={(e) => handleInputChange('modele', e.target.value)}
                required
                placeholder="Corolla, Civic, etc."
              />
            </div>
            <div>
              <Label htmlFor="annee">Année</Label>
              <Input
                id="annee"
                type="number"
                value={formData.annee}
                onChange={(e) => handleInputChange('annee', e.target.value)}
                placeholder="2020"
                min="1990"
                max="2024"
              />
            </div>
            <div>
              <Label htmlFor="kilometrage">Kilométrage</Label>
              <Input
                id="kilometrage"
                type="number"
                value={formData.kilometrage}
                onChange={(e) => handleInputChange('kilometrage', e.target.value)}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="couleur">Couleur</Label>
              <Input
                id="couleur"
                value={formData.couleur}
                onChange={(e) => handleInputChange('couleur', e.target.value)}
                placeholder="Blanc, Noir, Rouge, etc."
              />
            </div>
            <div>
              <Label htmlFor="prix_souhaite">Prix souhaité (FCFA)</Label>
              <Input
                id="prix_souhaite"
                type="number"
                value={formData.prix_souhaite}
                onChange={(e) => handleInputChange('prix_souhaite', e.target.value)}
                placeholder="5000000"
              />
            </div>
            <div>
              <Label htmlFor="carburant">Carburant</Label>
              <Select value={formData.carburant} onValueChange={(value) => handleInputChange('carburant', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le carburant" />
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
              <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manuelle">Manuelle</SelectItem>
                  <SelectItem value="automatique">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="etat_vehicule">État du véhicule</Label>
              <Select value={formData.etat_vehicule} onValueChange={(value) => handleInputChange('etat_vehicule', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'état" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="tres_bon">Très bon</SelectItem>
                  <SelectItem value="bon">Bon</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="a_reparer">À réparer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-fadem-blue mb-4">Description</h3>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Décrivez votre véhicule (historique, état, équipements, etc.)"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Photos et vidéo */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-fadem-blue mb-4">Photos et vidéo</h3>
          
          {/* Upload d'images */}
          <div className="mb-4">
            <Label>Photos du véhicule (max 5)</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-fadem-blue transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cliquez pour ajouter des photos</p>
                </div>
              </label>
            </div>
            
            {/* Aperçu des images */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Aperçu ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URL vidéo */}
          <div>
            <Label htmlFor="video_url">Lien vidéo (optionnel)</Label>
            <Input
              id="video_url"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Vous pouvez ajouter un lien YouTube ou autre pour une vidéo de présentation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notice importante */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">À noter :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Votre demande sera examinée par notre équipe</li>
                <li>Nous vous contacterons pour fixer un rendez-vous d'évaluation</li>
                <li>L'évaluation finale sera basée sur l'inspection physique du véhicule</li>
                <li>Aucun frais ne vous sera demandé pour l'évaluation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-fadem-blue hover:bg-fadem-blue-dark"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Envoi en cours...
            </>
          ) : (
            'Envoyer ma demande'
          )}
        </Button>
      </div>
    </form>
  );
};

export default SellVehicleForm;
