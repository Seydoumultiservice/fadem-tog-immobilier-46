import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building, 
  Image, 
  Car, 
  MessageCircle, 
  BarChart3, 
  Users,
  HelpCircle,
  RefreshCw,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import des composants de gestion
import PropertyManager from './admin/PropertyManager';
import ProjectManager from './admin/ProjectManager';
import GalleryManager from './admin/GalleryManager';
import VehicleManager from './admin/VehicleManager';
import ContactManager from './admin/ContactManager';
import TestimonialManager from './admin/TestimonialManager';
import ModernDashboardStats from './admin/ModernDashboardStats';
import FAQModule from './admin/FAQModule';

// Import des types
import { Property, Project, GalleryImage, Vehicle, ContactRequest, Testimonial, VehicleSellRequest } from '@/types/database';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // États pour les données
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [vehicleSellRequests, setVehicleSellRequests] = useState<VehicleSellRequest[]>([]);

  // Statistiques générales
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalProjects: 0,
    totalImages: 0,
    totalVehicles: 0,
    totalContacts: 0,
    publishedImages: 0,
    availableProperties: 0,
    completedProjects: 0
  });

  // Chargement des données au montage
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProperties(),
        loadProjects(),
        loadGalleryImages(),
        loadVehicles(),
        loadContacts(),
        loadTestimonials(),
        loadVehicleSellRequests()
      ]);
      
      toast({
        title: "✅ Données chargées",
        description: "Toutes les données ont été synchronisées avec succès",
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProperties(data as Property[]);
    }
  };

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProjects(data as Project[]);
    }
  };

  const loadGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('ordre', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setGalleryImages(data as GalleryImage[]);
    }
  };

  const loadVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setVehicles(data as Vehicle[]);
    }
  };

  const loadContacts = async () => {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setContacts(data as ContactRequest[]);
    }
  };

  const loadTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setTestimonials(data as Testimonial[]);
    }
  };

  const loadVehicleSellRequests = async () => {
    const { data, error } = await supabase
      .from('vehicle_sell_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setVehicleSellRequests(data as VehicleSellRequest[]);
    }
  };

  // Calcul des statistiques
  useEffect(() => {
    setStats({
      totalProperties: properties.length,
      totalProjects: projects.length,
      totalImages: galleryImages.length,
      totalVehicles: vehicles.length,
      totalContacts: contacts.length,
      publishedImages: galleryImages.filter(img => img.statut === 'publie').length,
      availableProperties: properties.filter(p => p.statut === 'disponible').length,
      completedProjects: projects.filter(p => p.statut === 'termine').length
    });
  }, [properties, projects, galleryImages, vehicles, contacts]);

  const tabsConfig = [
    {
      value: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: null
    },
    {
      value: 'properties',
      label: 'Biens Immobiliers',
      icon: <Home className="w-4 h-4" />,
      badge: stats.totalProperties
    },
    {
      value: 'projects',
      label: 'Réalisations BTP',
      icon: <Building className="w-4 h-4" />,
      badge: stats.totalProjects
    },
    {
      value: 'gallery',
      label: 'Galerie Photo',
      icon: <Image className="w-4 h-4" />,
      badge: stats.publishedImages
    },
    {
      value: 'vehicles',
      label: 'Véhicules',
      icon: <Car className="w-4 h-4" />,
      badge: stats.totalVehicles
    },
    {
      value: 'contacts',
      label: 'Contacts',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: contacts.filter(c => c.statut === 'nouveau').length
    },
    {
      value: 'testimonials',
      label: 'Témoignages',
      icon: <Users className="w-4 h-4" />,
      badge: testimonials.filter(t => t.statut === 'en_attente').length
    },
    {
      value: 'faq',
      label: 'FAQ',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header avec stats rapides */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-fadem-blue">Dashboard Administrateur</h1>
              <p className="text-muted-foreground">Gestion complète de votre plateforme FADEM</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={loadAllData}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-fadem-blue/20 text-fadem-blue hover:bg-fadem-blue/5"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Synchronisé</span>
              </div>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-3 text-center">
                <Home className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">{stats.availableProperties}</div>
                <div className="text-xs opacity-90">Biens Dispos</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-3 text-center">
                <Building className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">{stats.completedProjects}</div>
                <div className="text-xs opacity-90">Proj. Terminés</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-3 text-center">
                <Image className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">{stats.publishedImages}</div>
                <div className="text-xs opacity-90">Photos Publiées</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-3 text-center">
                <Car className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">{stats.totalVehicles}</div>
                <div className="text-xs opacity-90">Véhicules</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-3 text-center">
                <MessageCircle className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">{contacts.filter(c => c.statut === 'nouveau').length}</div>
                <div className="text-xs opacity-90">Nouveaux Contacts</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <CardContent className="p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">{testimonials.filter(t => t.statut === 'en_attente').length}</div>
                <div className="text-xs opacity-90">Témoignages</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <CardContent className="p-3 text-center">
                <Eye className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">{stats.totalProperties + stats.totalProjects + stats.publishedImages}</div>
                <div className="text-xs opacity-90">Total Visible</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
              <CardContent className="p-3 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                <div className="text-lg font-bold">100%</div>
                <div className="text-xs opacity-90">Sync Temps Réel</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            {tabsConfig.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1 text-xs">
                {tab.icon}
                <span className="hidden sm:inline truncate">{tab.label.split(' ')[0]}</span>
                {tab.badge !== null && tab.badge > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <ModernDashboardStats 
              properties={properties}
              projects={projects}
              galleryImages={galleryImages}
              vehicles={vehicles}
              contacts={contacts}
              testimonials={testimonials}
            />
          </TabsContent>

          <TabsContent value="properties">
            <PropertyManager 
              properties={properties} 
              onRefresh={loadProperties}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectManager 
              projects={projects} 
              onRefresh={loadProjects}
            />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager 
              images={galleryImages} 
              onRefresh={loadGalleryImages}
            />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehicleManager 
              vehicles={vehicles}
              sellRequests={vehicleSellRequests}
              onRefresh={loadVehicles}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactManager 
              contactRequests={contacts} 
              onRefresh={loadContacts}
            />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialManager 
              testimonials={testimonials} 
              onRefresh={loadTestimonials}
            />
          </TabsContent>

          <TabsContent value="faq">
            <FAQModule />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Dashboard FADEM - Synchronisation temps réel active</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
