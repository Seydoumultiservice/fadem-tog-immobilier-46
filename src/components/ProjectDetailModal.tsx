
import React, { useState } from 'react';
import { X, MapPin, Calendar, DollarSign, Square, ChevronLeft, ChevronRight, Play, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Project } from '@/types/database';

interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('fr-FR').format(budget) + ' FCFA';
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'termine': return 'bg-green-500 text-white';
      case 'en_cours': return 'bg-blue-500 text-white';
      case 'planifie': return 'bg-yellow-500 text-white';
      case 'suspendu': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const nextImage = () => {
    if (project.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
    }
    if (url.includes('tiktok.com')) {
      return url.replace('/video/', '/embed/');
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="font-serif text-2xl font-bold text-fadem-blue">
              Détails du projet
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Galerie d'images */}
              <div className="space-y-4">
                {project.images && project.images.length > 0 && (
                  <div className="relative">
                    <img
                      src={project.images[currentImageIndex]}
                      alt={project.titre}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    {project.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {project.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full cursor-pointer ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Miniatures */}
                {project.images && project.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {project.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${project.titre} ${index + 1}`}
                        className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                          index === currentImageIndex ? 'border-fadem-gold' : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Vidéo */}
                {project.video_url && (
                  <div className="relative">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      Vidéo du projet
                    </h4>
                    <div className="aspect-video">
                      <iframe
                        src={getVideoEmbedUrl(project.video_url)}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        title="Vidéo du projet"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Informations détaillées */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-fadem-blue mb-2">
                    {project.titre}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{project.adresse || project.ville}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-fadem-blue text-white text-sm px-3 py-1">
                      {project.categorie}
                    </Badge>
                    {project.type_projet && (
                      <Badge className="bg-fadem-gold text-fadem-blue text-sm px-3 py-1">
                        {project.type_projet}
                      </Badge>
                    )}
                    <Badge className={`text-sm px-3 py-1 ${getStatusColor(project.statut || 'planifie')}`}>
                      {project.statut}
                    </Badge>
                  </div>

                  {/* Avancement */}
                  {project.pourcentage_avancement !== undefined && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Avancement du projet</span>
                        <span className="text-fadem-blue font-bold">{project.pourcentage_avancement}%</span>
                      </div>
                      <Progress value={project.pourcentage_avancement} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Informations projet */}
                <div className="grid grid-cols-1 gap-4">
                  {project.superficie && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <Square className="w-5 h-5 mr-3 text-fadem-blue" />
                      <div>
                        <span className="font-medium">Superficie</span>
                        <p className="text-sm text-gray-600">{project.superficie}m²</p>
                      </div>
                    </div>
                  )}
                  
                  {project.budget_prevu && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <DollarSign className="w-5 h-5 mr-3 text-fadem-blue" />
                      <div>
                        <span className="font-medium">Budget prévu</span>
                        <p className="text-sm text-gray-600">{formatBudget(project.budget_prevu)}</p>
                      </div>
                    </div>
                  )}

                  {project.budget_reel && (
                    <div className="flex items-center p-3 bg-gray-50 rounded">
                      <DollarSign className="w-5 h-5 mr-3 text-fadem-blue" />
                      <div>
                        <span className="font-medium">Budget réel</span>
                        <p className="text-sm text-gray-600">{formatBudget(project.budget_reel)}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {project.date_debut && (
                      <div className="flex items-center p-3 bg-gray-50 rounded">
                        <Calendar className="w-5 h-5 mr-3 text-fadem-blue" />
                        <div>
                          <span className="font-medium">Début</span>
                          <p className="text-sm text-gray-600">{new Date(project.date_debut).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    )}

                    {project.date_fin_prevue && (
                      <div className="flex items-center p-3 bg-gray-50 rounded">
                        <Calendar className="w-5 h-5 mr-3 text-fadem-blue" />
                        <div>
                          <span className="font-medium">Fin prévue</span>
                          <p className="text-sm text-gray-600">{new Date(project.date_fin_prevue).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations client */}
                {project.client_nom && (
                  <div>
                    <h4 className="font-semibold text-fadem-blue mb-3">Informations client</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{project.client_nom}</span>
                      </div>
                      {project.client_email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{project.client_email}</span>
                        </div>
                      )}
                      {project.client_telephone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{project.client_telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-fadem-blue mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Notes internes (si applicable) */}
                {project.notes_internes && (
                  <div>
                    <h4 className="font-semibold text-fadem-blue mb-3">Notes</h4>
                    <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3 rounded">
                      {project.notes_internes}
                    </p>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 bg-fadem-blue hover:bg-fadem-blue-dark text-white">
                    Demander un devis
                  </Button>
                  <Button variant="outline" className="flex-1 border-fadem-gold text-fadem-blue hover:bg-fadem-gold">
                    Contacter l'agence
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailModal;
