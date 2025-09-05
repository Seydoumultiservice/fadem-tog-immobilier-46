
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, Check, X, MessageSquare, Edit2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  client_nom: string;
  client_email?: string;
  contenu: string;
  service?: string;
  note?: number;
  statut?: string;
  created_at: string;
}

interface TestimonialManagerProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

const TestimonialManager = ({ testimonials, onRefresh }: TestimonialManagerProps) => {
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;

      const statusMessages = {
        'approuve': '✅ Témoignage approuvé et publié !',
        'rejete': '❌ Témoignage rejeté',
        'en_attente': '⏳ Témoignage remis en attente'
      };

      toast({
        title: statusMessages[newStatus as keyof typeof statusMessages] || 'Statut mis à jour',
        description: 'Le changement est visible instantanément sur le site',
      });

      onRefresh();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (testimonial: Testimonial) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({
          client_nom: testimonial.client_nom,
          contenu: testimonial.contenu,
          note: testimonial.note
        })
        .eq('id', testimonial.id);

      if (error) throw error;

      toast({
        title: "✅ Témoignage mis à jour",
        description: "Modifications visibles instantanément !",
      });
      
      setEditingTestimonial(null);
      onRefresh();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "🗑️ Témoignage supprimé",
        description: "Suppression effective immédiatement",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'approuve': return 'bg-green-500 text-white';
      case 'rejete': return 'bg-red-500 text-white';
      case 'en_attente': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const renderStars = (note?: number) => {
    if (!note) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const pendingCount = testimonials.filter(t => t.statut === 'en_attente').length;
  const approvedCount = testimonials.filter(t => t.statut === 'approuve').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Gestion des Témoignages de Lucien Koumessi
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
                ⏳ En attente: {pendingCount}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600">
                ✅ Approuvés: {approvedCount}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testimonials
              .sort((a, b) => {
                // Prioriser les témoignages en attente
                if (a.statut === 'en_attente' && b.statut !== 'en_attente') return -1;
                if (b.statut === 'en_attente' && a.statut !== 'en_attente') return 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              })
              .map((testimonial) => (
              <div key={testimonial.id} className="p-4 border rounded-lg bg-white shadow-sm">
                {editingTestimonial?.id === testimonial.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Nom du client
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.client_nom}
                          onChange={(e) => setEditingTestimonial(prev => prev ? ({...prev, client_nom: e.target.value}) : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fadem-blue"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Note (1-5)
                        </label>
                        <select
                          value={editingTestimonial.note || ''}
                          onChange={(e) => setEditingTestimonial(prev => prev ? ({...prev, note: parseInt(e.target.value) || undefined}) : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fadem-blue"
                        >
                          <option value="">Aucune note</option>
                          <option value="1">1 étoile</option>
                          <option value="2">2 étoiles</option>
                          <option value="3">3 étoiles</option>
                          <option value="4">4 étoiles</option>
                          <option value="5">5 étoiles</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Contenu du témoignage
                      </label>
                      <Textarea
                        value={editingTestimonial.contenu}
                        onChange={(e) => setEditingTestimonial(prev => prev ? ({...prev, contenu: e.target.value}) : null)}
                        rows={4}
                        className="w-full"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(editingTestimonial)}
                        disabled={loading}
                        className="bg-fadem-blue hover:bg-fadem-blue-dark text-white"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Sauvegarder
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTestimonial(null)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-fadem-blue">
                            {testimonial.client_nom}
                          </h4>
                          <Badge className={getStatusColor(testimonial.statut || 'en_attente')}>
                            {testimonial.statut === 'approuve' ? '✅ Approuvé' : 
                             testimonial.statut === 'rejete' ? '❌ Rejeté' : '⏳ En attente'}
                          </Badge>
                          {testimonial.note && renderStars(testimonial.note)}
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-2">
                          "{testimonial.contenu}"
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📅 {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}</span>
                          {testimonial.service && (
                            <span>🏷️ {testimonial.service}</span>
                          )}
                          {testimonial.client_email && (
                            <span>📧 {testimonial.client_email}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTestimonial(testimonial)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        
                        {testimonial.statut !== 'approuve' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(testimonial.id, 'approuve')}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {testimonial.statut !== 'rejete' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusUpdate(testimonial.id, 'rejete')}
                            disabled={loading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun témoignage pour le moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialManager;
