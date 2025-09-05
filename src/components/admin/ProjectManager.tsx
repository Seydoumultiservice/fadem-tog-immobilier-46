
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/database';
import { Plus, Save, Edit, Trash2, Building2, Calendar, Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface ProjectManagerProps {
  projects: Project[];
  onRefresh: () => void;
}

const ProjectManager = ({ projects, onRefresh }: ProjectManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    type_projet: '',
    statut: 'planifie',
    adresse: '',
    ville: 'Lomé',
    superficie: '',
    budget_prevu: '',
    budget_reel: '',
    date_debut: '',
    date_fin_prevue: '',
    date_fin_reelle: '',
    pourcentage_avancement: '0',
    client_nom: '',
    client_email: '',
    client_telephone: '',
    images: [] as string[],
    video_url: '',
    notes_internes: ''
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      categorie: '',
      type_projet: '',
      statut: 'planifie',
      adresse: '',
      ville: 'Lomé',
      superficie: '',
      budget_prevu: '',
      budget_reel: '',
      date_debut: '',
      date_fin_prevue: '',
      date_fin_reelle: '',
      pourcentage_avancement: '0',
      client_nom: '',
      client_email: '',
      client_telephone: '',
      images: [],
      video_url: '',
      notes_internes: ''
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    console.log('📝 Édition du projet:', project.id);
    setFormData({
      titre: project.titre,
      description: project.description,
      categorie: project.categorie,
      type_projet: project.type_projet || '',
      statut: project.statut || 'planifie',
      adresse: project.adresse || '',
      ville: project.ville || 'Lomé',
      superficie: project.superficie?.toString() || '',
      budget_prevu: project.budget_prevu?.toString() || '',
      budget_reel: project.budget_reel?.toString() || '',
      date_debut: project.date_debut || '',
      date_fin_prevue: project.date_fin_prevue || '',
      date_fin_reelle: project.date_fin_reelle || '',
      pourcentage_avancement: project.pourcentage_avancement?.toString() || '0',
      client_nom: project.client_nom || '',
      client_email: project.client_email || '',
      client_telephone: project.client_telephone || '',
      images: project.images || [],
      video_url: project.video_url || '',
      notes_internes: project.notes_internes || ''
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleImagesUploaded = (urls: string[], uploadStatus?: { isUploading: boolean; allUploaded: boolean }) => {
    console.log('📸 Images uploadées pour le projet:', urls);
    setFormData(prev => ({ ...prev, images: urls }));
    
    toast({
      title: "✅ Images ajoutées",
      description: `${urls.length} image(s) prête(s) pour publication`,
    });
  };

  const validateForm = () => {
    const requiredFields = ['titre', 'description', 'categorie'];
    
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

    if (formData.budget_prevu && isNaN(parseFloat(formData.budget_prevu))) {
      toast({
        title: "❌ Budget invalide",
        description: "Veuillez saisir un budget valide",
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
    console.log('💾 Début sauvegarde projet BTP...');

    try {
      const projectData = {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        categorie: formData.categorie,
        type_projet: formData.type_projet || null,
        statut: formData.statut,
        adresse: formData.adresse.trim() || null,
        ville: formData.ville,
        superficie: formData.superficie ? parseFloat(formData.superficie) : null,
        budget_prevu: formData.budget_prevu ? parseFloat(formData.budget_prevu) : null,
        budget_reel: formData.budget_reel ? parseFloat(formData.budget_reel) : null,
        date_debut: formData.date_debut || null,
        date_fin_prevue: formData.date_fin_prevue || null,
        date_fin_reelle: formData.date_fin_reelle || null,
        pourcentage_avancement: parseInt(formData.pourcentage_avancement) || 0,
        client_nom: formData.client_nom.trim() || null,
        client_email: formData.client_email.trim() || null,
        client_telephone: formData.client_telephone.trim() || null,
        images: formData.images.length > 0 ? formData.images : null,
        video_url: formData.video_url.trim() || null,
        notes_internes: formData.notes_internes.trim() || null
      };

      console.log('📋 Données à sauvegarder:', projectData);

      let result;
      if (editingProject) {
        console.log('🔄 Mise à jour du projet:', editingProject.id);
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
          .select();
      } else {
        console.log('➕ Création nouveau projet');
        result = await supabase
          .from('projects')
          .insert([projectData])
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Projet sauvegardé avec succès:', data);

      toast({
        title: "✅ Succès",
        description: editingProject 
          ? "Projet BTP mis à jour avec succès"
          : "Projet BTP créé avec succès",
      });

      // Synchronisation temps réel
      onRefresh();
      window.dispatchEvent(new CustomEvent('projects-updated'));
      window.postMessage({ type: 'PROJECTS_REFRESH' }, '*');

      resetForm();

    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "❌ Erreur de sauvegarde",
        description: error.message || "Impossible de sauvegarder le projet",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    console.log('🗑️ Suppression du projet:', id);

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erreur suppression:', error);
        throw error;
      }

      console.log('✅ Projet supprimé avec succès');

      toast({
        title: "✅ Projet supprimé",
        description: "Le projet a été supprimé avec succès",
      });

      // Synchronisation temps réel
      onRefresh();
      window.dispatchEvent(new CustomEvent('projects-updated'));
      window.postMessage({ type: 'PROJECTS_REFRESH' }, '*');
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de supprimer le projet",
        variant: "destructive",
      });
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-fadem-blue">
            {editingProject ? 'Modifier le projet' : 'Nouveau projet BTP'}
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
                    <Label htmlFor="titre">Titre du projet *</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                      placeholder="Construction villa moderne..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="categorie">Catégorie *</Label>
                    <Select
                      value={formData.categorie}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categorie: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="renovation">Rénovation</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="amenagement">Aménagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type_projet">Type de projet</Label>
                    <Select
                      value={formData.type_projet}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type_projet: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residentiel">Résidentiel</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industriel">Industriel</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
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
                        <SelectItem value="planifie">Planifié</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                        <SelectItem value="suspendu">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                      placeholder="Adresse du projet"
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
                    <Label htmlFor="superficie">Superficie (m²)</Label>
                    <Input
                      id="superficie"
                      type="number"
                      value={formData.superficie}
                      onChange={(e) => setFormData(prev => ({ ...prev, superficie: e.target.value }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pourcentage_avancement">Avancement (%)</Label>
                    <Input
                      id="pourcentage_avancement"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.pourcentage_avancement}
                      onChange={(e) => setFormData(prev => ({ ...prev, pourcentage_avancement: e.target.value }))}
                      placeholder="0"
                    />
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
                  placeholder="Description détaillée du projet..."
                  rows={4}
                  required
                />
              </div>

              {/* Budget et dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget_prevu">Budget prévu (FCFA)</Label>
                  <Input
                    id="budget_prevu"
                    type="number"
                    value={formData.budget_prevu}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_prevu: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="budget_reel">Budget réel (FCFA)</Label>
                  <Input
                    id="budget_reel"
                    type="number"
                    value={formData.budget_reel}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_reel: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="date_debut">Date de début</Label>
                  <Input
                    id="date_debut"
                    type="date"
                    value={formData.date_debut}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_debut: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_fin_prevue">Date fin prévue</Label>
                  <Input
                    id="date_fin_prevue"
                    type="date"
                    value={formData.date_fin_prevue}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_fin_prevue: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="date_fin_reelle">Date fin réelle</Label>
                  <Input
                    id="date_fin_reelle"
                    type="date"
                    value={formData.date_fin_reelle}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_fin_reelle: e.target.value }))}
                  />
                </div>
              </div>

              {/* Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="client_nom">Nom du client</Label>
                  <Input
                    id="client_nom"
                    value={formData.client_nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_nom: e.target.value }))}
                    placeholder="Nom du client"
                  />
                </div>
                <div>
                  <Label htmlFor="client_email">Email client</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <Label htmlFor="client_telephone">Téléphone client</Label>
                  <Input
                    id="client_telephone"
                    value={formData.client_telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_telephone: e.target.value }))}
                    placeholder="+228 XX XX XX XX"
                  />
                </div>
              </div>

              {/* Upload d'images optimisé */}
              <div>
                <Label className="text-base font-medium">Images du projet</Label>
                <div className="mt-3">
                  <ImageUploader
                    onImagesUploaded={handleImagesUploaded}
                    maxFiles={20}
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
                      {editingProject ? 'Mettre à jour' : 'Créer le projet'}
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
          <h3 className="text-lg font-semibold text-fadem-blue">Gestion des Projets BTP</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} projet(s) • Synchronisation temps réel active
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-fadem-blue hover:bg-fadem-blue-dark w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun projet BTP</h4>
            <p className="text-gray-500 mb-6">Commencez par créer votre premier projet de construction</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-fadem-blue hover:bg-fadem-blue-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer un projet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-fadem-blue truncate">
                      {project.titre}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-fadem-blue/10 text-fadem-blue">
                        {project.categorie}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        project.statut === 'termine' ? 'bg-green-100 text-green-800' :
                        project.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        project.statut === 'planifie' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.statut === 'en_cours' ? 'En cours' : 
                         project.statut === 'planifie' ? 'Planifié' :
                         project.statut === 'termine' ? 'Terminé' : project.statut}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {project.adresse && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{project.adresse}</span>
                  </div>
                )}
                
                {project.budget_prevu && (
                  <div className="flex items-center gap-2 text-lg font-bold text-fadem-blue">
                    <span>{project.budget_prevu.toLocaleString()} FCFA</span>
                  </div>
                )}

                {project.pourcentage_avancement !== undefined && (
                  <div className="text-sm text-muted-foreground">
                    Avancement: {project.pourcentage_avancement}%
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(project.id)}
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

export default ProjectManager;
