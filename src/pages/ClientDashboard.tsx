import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Home, 
  Car, 
  Building, 
  FileText, 
  MessageSquare, 
  Bell, 
  LogOut,
  Loader2,
  Calendar,
  MapPin,
  Euro,
  TrendingUp,
  Settings,
  Plus
} from 'lucide-react';
import { 
  ClientRental, 
  ClientProperty, 
  ClientProject, 
  ClientInvoice, 
  ClientMessage, 
  ClientNotification 
} from '@/types/client';

const ClientDashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [rentals, setRentals] = useState<ClientRental[]>([]);
  const [properties, setProperties] = useState<ClientProperty[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  
  // Message form state
  const [newMessage, setNewMessage] = useState({
    sujet: '',
    message: '',
    type_demande: 'information' as const,
    priorite: 'normale' as const
  });

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Load all user data in parallel
      const [
        rentalsRes,
        propertiesRes,
        projectsRes,
        invoicesRes,
        messagesRes,
        notificationsRes
      ] = await Promise.all([
        supabase.from('client_rentals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('client_properties').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('client_projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('client_invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('client_messages').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('client_notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);
      
      setRentals(rentalsRes.data as ClientRental[] || []);
      setProperties(propertiesRes.data as ClientProperty[] || []);
      setProjects(projectsRes.data as ClientProject[] || []);
      setInvoices(invoicesRes.data as ClientInvoice[] || []);
      setMessages(messagesRes.data as ClientMessage[] || []);
      setNotifications(notificationsRes.data as ClientNotification[] || []);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.sujet.trim() || !newMessage.message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('client_messages')
        .insert({
          user_id: user.id,
          sujet: newMessage.sujet,
          message: newMessage.message,
          type_demande: newMessage.type_demande,
          priorite: newMessage.priorite
        });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès"
      });

      setNewMessage({
        sujet: '',
        message: '',
        type_demande: 'information',
        priorite: 'normale'
      });

      loadUserData(); // Refresh data
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('client_notifications')
        .update({ lu: true, date_lecture: new Date().toISOString() })
        .eq('id', notificationId);
      
      loadUserData();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string, type: 'rental' | 'property' | 'project' | 'invoice' | 'message') => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      actif: "default",
      termine: "secondary",
      suspendu: "destructive",
      en_gestion: "default",
      vendu: "secondary",
      retire: "outline",
      planifie: "outline",
      en_cours: "default",
      en_attente: "outline",
      payee: "default",
      en_retard: "destructive",
      nouveau: "default",
      traite: "secondary"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-fadem-blue" />
          <p className="text-muted-foreground">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // Overview stats
  const stats = {
    rentalsActives: rentals.filter(r => r.statut === 'actif').length,
    propertiesGestion: properties.filter(p => p.statut === 'en_gestion').length,
    projectsEnCours: projects.filter(p => p.statut === 'en_cours').length,
    invoicesEnAttente: invoices.filter(i => i.statut === 'en_attente').length,
    unreadNotifications: notifications.filter(n => !n.lu).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-fadem-blue" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-serif font-bold text-fadem-blue">
                  Mon Compte - Groupe FADEM
                </h1>
                <p className="text-sm text-muted-foreground">
                  Bienvenue, {profile?.prenom} {profile?.nom}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {stats.unreadNotifications > 0 && (
                <div className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.unreadNotifications}
                  </span>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                Site principal
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Locations ({rentals.length})
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Biens confiés ({properties.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Projets ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Factures ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages ({messages.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Locations actives</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-fadem-blue">{stats.rentalsActives}</div>
                  <p className="text-xs text-muted-foreground">
                    sur {rentals.length} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Biens en gestion</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-fadem-blue">{stats.propertiesGestion}</div>
                  <p className="text-xs text-muted-foreground">
                    Revenus générés: {formatCurrency(properties.reduce((sum, p) => sum + (p.revenus_generes || 0), 0))}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projets en cours</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-fadem-blue">{stats.projectsEnCours}</div>
                  <p className="text-xs text-muted-foreground">
                    sur {projects.length} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.invoicesEnAttente}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(invoices.filter(i => i.statut === 'en_attente').reduce((sum, i) => sum + i.montant_ttc, 0))}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${
                          !notification.lu ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                        }`}
                        onClick={() => !notification.lu && markNotificationAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{notification.titre}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.contenu}
                            </p>
                          </div>
                          {notification.type_notification && (
                            <Badge variant="outline" className="ml-2">
                              {notification.type_notification}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.date_envoi).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                    
                    {notifications.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        Aucune notification
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.slice(0, 5).map((message) => (
                      <div key={message.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{message.sujet}</h4>
                          {getStatusBadge(message.statut, 'message')}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {message.message}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {message.type_demande}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {messages.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        Aucun message
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rentals Tab */}
          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Mes locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentals.map((rental) => (
                    <div key={rental.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{rental.titre}</h3>
                          <p className="text-muted-foreground">{rental.description}</p>
                          {rental.adresse && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{rental.adresse}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(rental.statut, 'rental')}
                          {rental.prix_mensuel && (
                            <p className="text-sm font-medium mt-1">
                              {formatCurrency(rental.prix_mensuel)}/mois
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Type:</span> {rental.type_location}
                        </div>
                        <div>
                          <span className="font-medium">Début:</span> {new Date(rental.date_debut).toLocaleDateString('fr-FR')}
                        </div>
                        {rental.date_fin && (
                          <div>
                            <span className="font-medium">Fin:</span> {new Date(rental.date_fin).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {rentals.length === 0 && (
                    <div className="text-center py-8">
                      <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune location trouvée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Biens confiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{property.titre}</h3>
                          <p className="text-muted-foreground">{property.description}</p>
                          {property.adresse && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{property.adresse}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(property.statut, 'property')}
                          {property.valeur_estimee && (
                            <p className="text-sm font-medium mt-1">
                              Valeur: {formatCurrency(property.valeur_estimee)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Type:</span> {property.type_bien}
                        </div>
                        <div>
                          <span className="font-medium">Gestion:</span> {property.type_gestion || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Confié le:</span> {new Date(property.date_confie).toLocaleDateString('fr-FR')}
                        </div>
                        {property.revenus_generes && property.revenus_generes > 0 && (
                          <div>
                            <span className="font-medium">Revenus:</span> {formatCurrency(property.revenus_generes)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {properties.length === 0 && (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun bien confié trouvé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Mes projets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{project.titre}</h3>
                          <p className="text-muted-foreground">{project.description}</p>
                          {project.adresse && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{project.adresse}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(project.statut, 'project')}
                          {project.pourcentage_avancement !== undefined && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">{project.pourcentage_avancement}% terminé</p>
                              <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-fadem-blue h-2 rounded-full" 
                                  style={{ width: `${project.pourcentage_avancement}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Type:</span> {project.type_projet}
                        </div>
                        {project.budget_prevu && (
                          <div>
                            <span className="font-medium">Budget:</span> {formatCurrency(project.budget_prevu)}
                          </div>
                        )}
                        {project.date_debut && (
                          <div>
                            <span className="font-medium">Début:</span> {new Date(project.date_debut).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        {project.date_fin_prevue && (
                          <div>
                            <span className="font-medium">Fin prévue:</span> {new Date(project.date_fin_prevue).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {projects.length === 0 && (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun projet trouvé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mes factures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">Facture #{invoice.numero_facture}</h3>
                          <p className="text-muted-foreground">Service: {invoice.type_service}</p>
                          {invoice.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{invoice.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(invoice.statut, 'invoice')}
                          <p className="text-lg font-bold mt-1">{formatCurrency(invoice.montant_ttc)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Émission:</span> {new Date(invoice.date_emission).toLocaleDateString('fr-FR')}
                        </div>
                        {invoice.date_echeance && (
                          <div>
                            <span className="font-medium">Échéance:</span> {new Date(invoice.date_echeance).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        {invoice.date_paiement && (
                          <div>
                            <span className="font-medium">Paiement:</span> {new Date(invoice.date_paiement).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        {invoice.mode_paiement && (
                          <div>
                            <span className="font-medium">Mode:</span> {invoice.mode_paiement}
                          </div>
                        )}
                      </div>
                      
                      {invoice.document_url && (
                        <div className="mt-4">
                          <Button variant="outline" size="sm" asChild>
                            <a href={invoice.document_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              Télécharger
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {invoices.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune facture trouvée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            {/* Send Message Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Envoyer un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={sendMessage} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type de demande</label>
                      <select
                        value={newMessage.type_demande}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, type_demande: e.target.value as any }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                      >
                        <option value="information">Information</option>
                        <option value="reclamation">Réclamation</option>
                        <option value="demande_service">Demande de service</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Priorité</label>
                      <select
                        value={newMessage.priorite}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, priorite: e.target.value as any }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                      >
                        <option value="faible">Faible</option>
                        <option value="normale">Normale</option>
                        <option value="haute">Haute</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Sujet</label>
                    <input
                      type="text"
                      value={newMessage.sujet}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, sujet: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                      placeholder="Objet de votre message"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      value={newMessage.message}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                      placeholder="Décrivez votre demande..."
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="bg-fadem-blue hover:bg-fadem-blue-dark">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Messages List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Historique des messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{message.sujet}</h3>
                          <p className="text-muted-foreground mt-1">{message.message}</p>
                          
                          {message.reponse_admin && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-sm text-blue-900">Réponse de l'administration:</h4>
                              <p className="text-blue-800 mt-1">{message.reponse_admin}</p>
                              {message.date_reponse && (
                                <p className="text-xs text-blue-600 mt-2">
                                  Répondu le {new Date(message.date_reponse).toLocaleDateString('fr-FR')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          {getStatusBadge(message.statut, 'message')}
                          <Badge variant="outline" className="mt-2 block">
                            {message.type_demande}
                          </Badge>
                          <Badge variant="outline" className="mt-1 block">
                            {message.priorite}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-4">
                        Envoyé le {new Date(message.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun message trouvé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;