
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Home, Building, Users, Mail, Star, Image } from 'lucide-react';
import { Property, Project, ContactRequest, Testimonial, GalleryImage } from '@/types/database';

interface AdminStatsProps {
  properties: Property[];
  projects: Project[];
  contactRequests: ContactRequest[];
  testimonials: Testimonial[];
  galleryImages: GalleryImage[];
}

const AdminStats = ({ properties, projects, contactRequests, testimonials, galleryImages }: AdminStatsProps) => {
  const pendingTestimonials = testimonials.filter(t => t.statut === 'en_attente').length;
  const newContacts = contactRequests.filter(c => c.statut === 'nouveau').length;
  
  const statsCards = [
    {
      title: 'Biens immobiliers',
      value: properties.length,
      icon: Home,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Projets BTP',
      value: projects.length,
      icon: Building,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Images galerie',
      value: galleryImages.length,
      icon: Image,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Nouveaux contacts',
      value: newContacts,
      icon: Mail,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Témoignages en attente',
      value: pendingTestimonials,
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Total demandes',
      value: contactRequests.length,
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-fadem-blue">📊 Répartition des biens</h3>
            <div className="space-y-2">
              {['appartement', 'villa', 'maison', 'terrain', 'commerce'].map(type => {
                const count = properties.filter(p => p.type_bien === type).length;
                return (
                  <div key={type} className="flex justify-between items-center">
                    <span className="capitalize text-gray-600">{type}s</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-fadem-blue">🏗️ Projets par statut</h3>
            <div className="space-y-2">
              {['planifie', 'en_cours', 'termine', 'suspendu'].map(statut => {
                const count = projects.filter(p => p.statut === statut).length;
                return (
                  <div key={statut} className="flex justify-between items-center">
                    <span className="capitalize text-gray-600">{statut.replace('_', ' ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
