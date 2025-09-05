
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContactRequest } from '@/types/database';

interface ContactManagerProps {
  contactRequests: ContactRequest[];
  onRefresh: () => void;
}

const ContactManager = ({ contactRequests, onRefresh }: ContactManagerProps) => {
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleStatusChange = async (id: string, newStatus: string, notes?: string) => {
    if (!isAdminConnected()) {
      toast({
        title: "❌ Erreur",
        description: "Vous devez être connecté en tant qu'admin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        statut: newStatus,
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updateData.notes_internes = notes;
      }

      if (newStatus === 'traite') {
        updateData.date_reponse = new Date().toISOString();
      }

      const { error } = await supabase
        .from('contact_requests')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "✅ Contact mis à jour",
        description: `Statut changé vers: ${newStatus}`,
      });

      onRefresh();
      setSelectedContact(null);
      setResponseText('');
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
    if (!isAdminConnected()) {
      toast({
        title: "❌ Erreur",
        description: "Vous devez être connecté en tant qu'admin",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande de contact ?')) return;

    try {
      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "🗑️ Contact supprimé",
        description: "La demande de contact a été supprimée",
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

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'nouveau': return 'bg-red-500 text-white';
      case 'en_cours': return 'bg-yellow-500 text-white';
      case 'traite': return 'bg-green-500 text-white';
      case 'ferme': return 'bg-gray-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getUrgencyColor = (urgence?: string) => {
    switch (urgence) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'haute': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normale': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'faible': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const newCount = contactRequests.filter(c => c.statut === 'nouveau').length;
  const inProgressCount = contactRequests.filter(c => c.statut === 'en_cours').length;
  const treatedCount = contactRequests.filter(c => c.statut === 'traite').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Gestion des Contacts
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-600">
                🆕 Nouveaux: {newCount}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
                ⏳ En cours: {inProgressCount}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600">
                ✅ Traités: {treatedCount}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-gray-600">
              Total: {contactRequests.length} demandes • Synchronisation automatique
            </p>
          </div>

          {/* Liste des contacts */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {contactRequests
              .sort((a, b) => {
                // Tri par statut (nouveaux en premier) puis par date
                if (a.statut !== b.statut) {
                  const priority = { 'nouveau': 0, 'en_cours': 1, 'traite': 2, 'ferme': 3 };
                  return (priority[a.statut as keyof typeof priority] || 4) - 
                         (priority[b.statut as keyof typeof priority] || 4);
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              })
              .map((contact) => (
              <div key={contact.id} className={`border rounded-lg p-4 ${
                contact.statut === 'nouveau' ? 'bg-red-50 border-red-200' :
                contact.statut === 'en_cours' ? 'bg-yellow-50 border-yellow-200' :
                'bg-white'
              }`}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-fadem-blue truncate">
                        {contact.nom} {contact.prenom}
                      </h4>
                      <Badge className={getStatusColor(contact.statut)}>
                        {contact.statut?.toUpperCase()}
                      </Badge>
                      {contact.urgence && (
                        <Badge variant="outline" className={getUrgencyColor(contact.urgence)}>
                          {contact.urgence?.toUpperCase()}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      {contact.telephone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{contact.telephone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(contact.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {contact.service_demande && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span className="capitalize">{contact.service_demande}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <strong className="text-sm">Sujet:</strong>
                      <p className="text-sm text-gray-700">{contact.sujet}</p>
                    </div>

                    <div className="mb-3">
                      <strong className="text-sm">Message:</strong>
                      <p className="text-sm text-gray-700 line-clamp-3">{contact.message}</p>
                    </div>

                    {contact.notes_internes && (
                      <div className="mb-3 p-2 bg-blue-50 rounded">
                        <strong className="text-sm text-blue-800">Notes internes:</strong>
                        <p className="text-sm text-blue-700">{contact.notes_internes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-0 md:min-w-[120px]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedContact(contact)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>

                    {contact.statut === 'nouveau' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(contact.id, 'en_cours')}
                        className="text-yellow-600 hover:text-yellow-700"
                        disabled={loading}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        En cours
                      </Button>
                    )}

                    {contact.statut !== 'traite' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(contact.id, 'traite')}
                        className="text-green-600 hover:text-green-700"
                        disabled={loading}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Traité
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(contact.id)}
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {contactRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune demande de contact</p>
                <p className="text-sm mt-2">Les nouvelles demandes apparaîtront ici</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de détail du contact */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Détails du Contact</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContact(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Nom complet:</strong>
                  <p>{selectedContact.nom} {selectedContact.prenom}</p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p>{selectedContact.email}</p>
                </div>
                <div>
                  <strong>Téléphone:</strong>
                  <p>{selectedContact.telephone || 'Non fourni'}</p>
                </div>
                <div>
                  <strong>Entreprise:</strong>
                  <p>{selectedContact.entreprise || 'Non fournie'}</p>
                </div>
              </div>

              <div>
                <strong>Sujet:</strong>
                <p>{selectedContact.sujet}</p>
              </div>

              <div>
                <strong>Message complet:</strong>
                <p className="bg-gray-50 p-3 rounded">{selectedContact.message}</p>
              </div>

              <div>
                <strong>Notes internes:</strong>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Ajoutez vos notes internes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusChange(selectedContact.id, 'traite', responseText)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marquer comme Traité
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedContact(null)}
                  className="flex-1"
                >
                  Fermer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
