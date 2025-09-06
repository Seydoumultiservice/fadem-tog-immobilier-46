import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  TrendingUp,
  Eye,
  ArrowRight 
} from 'lucide-react';
import { Project } from '@/types/database';
import ProjectDetailModal from './ProjectDetailModal';
import YoutubeVideoPreview from './YoutubeVideoPreview';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'termine':
        return 'bg-green-500 text-white';
      case 'en_cours':
        return 'bg-blue-500 text-white';
      case 'planifie':
        return 'bg-yellow-500 text-white';
      case 'suspendu':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'construction':
        return <Building className="w-4 h-4" />;
      case 'renovation':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const mainImage = project.images && project.images.length > 0 
    ? project.images[0] 
    : '/placeholder.svg';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
          <CardContent className="p-0">
            {/* Vidéo YouTube en priorité, sinon image */}
            <div className="relative h-64 overflow-hidden">
              {project.video_url ? (
                <div className="h-full">
                  <YoutubeVideoPreview
                    videoUrl={project.video_url}
                    title={project.titre}
                    className="h-full"
                    autoplay={false}
                  />
                  
                  {/* Overlay sur vidéo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <Badge className={getStatusColor(project.statut || 'planifie')}>
                        {project.statut?.replace('_', ' ').toUpperCase() || 'PLANIFIÉ'}
                      </Badge>
                      {project.categorie && (
                        <Badge variant="secondary" className="bg-white/90 text-fadem-blue">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(project.categorie)}
                            {project.categorie.toUpperCase()}
                          </span>
                        </Badge>
                      )}
                    </div>

                    {/* Bouton de vue rapide sur vidéo */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowDetail(true)}
                        className="bg-white/90 text-fadem-blue hover:bg-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={imageError ? '/placeholder.svg' : mainImage}
                    alt={project.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setImageError(true)}
                  />
                  
                  {/* Overlay avec informations */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={getStatusColor(project.statut || 'planifie')}>
                        {project.statut?.replace('_', ' ').toUpperCase() || 'PLANIFIÉ'}
                      </Badge>
                      {project.categorie && (
                        <Badge variant="secondary" className="bg-white/90 text-fadem-blue">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(project.categorie)}
                            {project.categorie.toUpperCase()}
                          </span>
                        </Badge>
                      )}
                    </div>

                    {/* Bouton de vue rapide */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowDetail(true)}
                        className="bg-white/90 text-fadem-blue hover:bg-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Contenu de la carte */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-fadem-blue mb-3 line-clamp-2">
                {project.titre}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Informations du projet */}
              <div className="space-y-2 mb-6">
                {project.ville && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-fadem-gold" />
                    <span>{project.ville}</span>
                  </div>
                )}

                {project.date_debut && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-fadem-gold" />
                    <span>
                      Début: {new Date(project.date_debut).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}

                {project.client_nom && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-fadem-gold" />
                    <span>Client: {project.client_nom}</span>
                  </div>
                )}

                {project.superficie && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-fadem-gold" />
                    <span>Superficie: {project.superficie} m²</span>
                  </div>
                )}
              </div>

              {/* Progression */}
              {project.pourcentage_avancement !== undefined && project.pourcentage_avancement !== null && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Avancement</span>
                    <span className="text-sm font-medium text-fadem-blue">
                      {project.pourcentage_avancement}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-fadem-blue to-fadem-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.pourcentage_avancement}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Budget */}
              {project.budget_prevu && (
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="font-semibold text-fadem-blue">
                    {project.budget_prevu.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              )}

              {/* Bouton d'action */}
              <Button 
                onClick={() => setShowDetail(true)}
                className="w-full bg-fadem-blue hover:bg-fadem-blue-dark text-white group-hover:shadow-lg transition-all duration-300"
              >
                Voir les détails
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de détail */}
      {showDetail && (
        <ProjectDetailModal
          project={project}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default ProjectCard;
