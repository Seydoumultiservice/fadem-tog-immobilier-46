
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building, 
  Image, 
  Car, 
  MessageCircle, 
  Users,
  TrendingUp,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Property, Project, GalleryImage, Vehicle, ContactRequest, Testimonial } from '@/types/database';

interface ModernStatsProps {
  properties: Property[];
  projects: Project[];
  galleryImages: GalleryImage[];
  vehicles: Vehicle[];
  contacts: ContactRequest[];
  testimonials: Testimonial[];
}

const ModernDashboardStats = ({ 
  properties, 
  projects, 
  galleryImages, 
  vehicles, 
  contacts, 
  testimonials 
}: ModernStatsProps) => {
  // Calculs des statistiques
  const stats = {
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.statut === 'disponible').length,
    soldProperties: properties.filter(p => p.statut === 'vendu').length,
    rentedProperties: properties.filter(p => p.statut === 'loue').length,
    
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.statut === 'termine').length,
    ongoingProjects: projects.filter(p => p.statut === 'en_cours').length,
    plannedProjects: projects.filter(p => p.statut === 'planifie').length,
    
    totalImages: galleryImages.length,
    publishedImages: galleryImages.filter(img => img.statut === 'publie').length,
    draftImages: galleryImages.filter(img => img.statut === 'brouillon').length,
    
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.statut === 'disponible').length,
    soldVehicles: vehicles.filter(v => v.statut === 'vendu').length,
    
    totalContacts: contacts.length,
    newContacts: contacts.filter(c => c.statut === 'nouveau').length,
    processedContacts: contacts.filter(c => c.statut === 'traite').length,
    
    totalTestimonials: testimonials.length,
    approvedTestimonials: testimonials.filter(t => t.statut === 'approuve').length,
    pendingTestimonials: testimonials.filter(t => t.statut === 'en_attente').length
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    bgColor, 
    subtitle 
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
    subtitle?: string;
  }) => (
    <Card className={`${bgColor} text-white shadow-lg hover:shadow-xl transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs opacity-75 mt-1">{subtitle}</p>
            )}
          </div>
          <Icon className="w-8 h-8 opacity-80" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="w-6 h-6 text-fadem-blue" />
            Tableau de Bord - Vue d'Ensemble
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-fadem-blue">{stats.totalProperties}</div>
              <div className="text-sm text-gray-600">Total Biens</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">Total Projets</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.publishedImages}</div>
              <div className="text-sm text-gray-600">Images Publiées</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.newContacts}</div>
              <div className="text-sm text-gray-600">Nouveaux Contacts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Immobilier */}
        <StatCard
          title="Biens Disponibles"
          value={stats.availableProperties}
          icon={Home}
          color="text-blue-600"
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle={`${stats.soldProperties} vendus, ${stats.rentedProperties} loués`}
        />
        
        {/* Projets BTP */}
        <StatCard
          title="Projets Terminés"
          value={stats.completedProjects}
          icon={Building}
          color="text-green-600"
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
          subtitle={`${stats.ongoingProjects} en cours`}
        />
        
        {/* Galerie */}
        <StatCard
          title="Photos Galerie"
          value={stats.publishedImages}
          icon={Image}
          color="text-purple-600"
          bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle={`${stats.draftImages} en brouillon`}
        />
        
        {/* Véhicules */}
        <StatCard
          title="Véhicules Dispo"
          value={stats.availableVehicles}
          icon={Car}
          color="text-orange-600"
          bgColor="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle={`${stats.soldVehicles} vendus`}
        />
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contacts Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="font-medium">Nouveaux</span>
                <Badge variant="destructive">{stats.newContacts}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-medium">Traités</span>
                <Badge className="bg-green-500">{stats.processedContacts}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Total</span>
                <Badge variant="outline">{stats.totalContacts}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Témoignages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="font-medium">En attente</span>
                <Badge className="bg-yellow-500">{stats.pendingTestimonials}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-medium">Approuvés</span>
                <Badge className="bg-green-500">{stats.approvedTestimonials}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Total</span>
                <Badge variant="outline">{stats.totalTestimonials}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statut de synchronisation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4 text-sm text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Dashboard synchronisé - Toutes les données sont à jour</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString('fr-FR')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernDashboardStats;
