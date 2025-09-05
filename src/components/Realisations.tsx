import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/database';
import ProjectCard from './ProjectCard';
import RealisationFilters from './realisations/RealisationFilters';
import { Phone, MessageCircle, Building, MapPin, Calendar, Users } from 'lucide-react';

const Realisations = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, categoryFilter, statusFilter, typeFilter]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []) as Project[]);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.categorie === categoryFilter);
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(project => project.statut === statusFilter);
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(project => project.type_projet === typeFilter);
    }

    setFilteredProjects(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactForProject = () => {
    const message = "Bonjour Groupe FADEM ! Je suis intéressé par vos services BTP et souhaite discuter d'un projet de construction/rénovation. Pouvez-vous me contacter pour un devis gratuit ? Merci !";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/22892716641?text=${encodedMessage}`, '_blank');
  };

  const handleCallForProject = () => {
    window.open('tel:+22892716641', '_self');
  };

  if (loading) {
    return (
      <section id="realisations" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fadem-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des projets...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="realisations" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-fadem-blue mb-6">
            Nos Réalisations BTP
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez nos projets de construction et rénovation réalisés avec excellence au Togo
          </p>
          
          {/* Appels à l'action renforcés */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleContactForProject}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Devis BTP Gratuit - WhatsApp
            </Button>
            
            <Button 
              onClick={handleCallForProject}
              className="bg-fadem-blue hover:bg-fadem-blue-dark text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Secrétariat: +228 92 71 66 41
            </Button>
            
            <Button 
              onClick={() => window.open('tel:+22891005317', '_self')}
              variant="outline"
              className="border-fadem-gold text-fadem-gold hover:bg-fadem-gold hover:text-fadem-blue font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Direction: +228 91 00 53 17
            </Button>
          </div>
        </div>

        <RealisationFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          onClearFilters={clearFilters}
        />

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-fadem-blue to-fadem-blue-dark text-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{projects.length}</div>
              <div className="text-sm opacity-90">Projets Total</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{projects.filter(p => p.statut === 'termine').length}</div>
              <div className="text-sm opacity-90">Projets Terminés</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-fadem-gold to-yellow-500 text-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{new Set(projects.map(p => p.ville).filter(Boolean)).size}</div>
              <div className="text-sm opacity-90">Villes Couvertes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{projects.filter(p => p.client_nom).length}</div>
              <div className="text-sm opacity-90">Clients Satisfaits</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </p>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun projet trouvé</h3>
              <p className="text-gray-600 mb-6">
                Aucun projet ne correspond à vos critères de recherche.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={clearFilters}
                  className="bg-fadem-blue hover:bg-fadem-blue-dark text-white"
                >
                  Voir tous les projets
                </Button>
                <Button 
                  onClick={handleContactForProject}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Proposer un projet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section finale avec appels à l'action renforcés */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-fadem-blue via-fadem-gold to-fadem-blue p-8 rounded-2xl text-white animate-fade-in shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à démarrer votre projet BTP ?</h3>
            <p className="text-lg mb-6 opacity-90">
              Contactez-nous dès maintenant pour un devis gratuit et personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleContactForProject}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Devis Gratuit WhatsApp
              </Button>
              <Button 
                onClick={handleCallForProject}
                className="bg-white text-fadem-blue hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appeler maintenant
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-fadem-blue font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                Formulaire de contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Realisations;
