
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Type, Save, Edit2, Plus, Search, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type TextContent = Tables<'site_text_content'>;

const TextContentManager = () => {
  const [textContents, setTextContents] = useState<TextContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [newContent, setNewContent] = useState({
    section: '',
    key: '',
    content: '',
    type: 'paragraph'
  });

  const { toast } = useToast();

  const sections = [
    'hero', 'services', 'properties', 'projects', 'gallery', 
    'testimonials', 'contact', 'footer', 'about', 'navbar'
  ];

  useEffect(() => {
    loadTextContents();
    
    // Configuration temps réel
    const channel = supabase
      .channel('text-content-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_text_content' 
      }, () => {
        console.log('🔄 Changement détecté dans les contenus texte');
        loadTextContents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTextContents = async () => {
    try {
      const { data, error } = await supabase
        .from('site_text_content')
        .select('*')
        .order('section', { ascending: true })
        .order('key', { ascending: true });

      if (error) throw error;
      setTextContents(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger les contenus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (content: TextContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_text_content')
        .update({
          content: content.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', content.id);

      if (error) throw error;

      toast({
        title: "✅ Contenu mis à jour",
        description: "Les modifications sont visibles immédiatement sur le site",
      });

      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newContent.section || !newContent.key || !newContent.content) {
      toast({
        title: "⚠️ Champs requis",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_text_content')
        .insert([{
          section: newContent.section,
          key: newContent.key,
          content: newContent.content,
          type: newContent.type
        }]);

      if (error) throw error;

      toast({
        title: "✅ Contenu créé",
        description: "Le nouveau contenu est maintenant disponible",
      });

      setNewContent({ section: '', key: '', content: '', type: 'paragraph' });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de créer le contenu",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredContents = textContents.filter(content => {
    const matchesSearch = content.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || content.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'title': return 'bg-blue-100 text-blue-800';
      case 'subtitle': return 'bg-green-100 text-green-800';
      case 'paragraph': return 'bg-gray-100 text-gray-800';
      case 'button': return 'bg-purple-100 text-purple-800';
      case 'link': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-fadem-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header moderne avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-fadem-blue to-fadem-blue-dark text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Type className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Total Contenus</p>
                <p className="text-2xl font-bold">{textContents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-fadem-gold to-fadem-gold-light text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Sections</p>
                <p className="text-2xl font-bold">{sections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Responsive</p>
                <p className="text-xl font-bold">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm opacity-80">Synchronisation</p>
                <p className="text-xl font-bold">Temps Réel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles de recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Gestion des Contenus Texte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un contenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sections</SelectItem>
                {sections.map(section => (
                  <SelectItem key={section} value={section}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Formulaire de création */}
          <Card className="mb-6 border-dashed border-2 border-fadem-blue/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un nouveau contenu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label>Section</Label>
                  <Select value={newContent.section} onValueChange={(value) => setNewContent(prev => ({...prev, section: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(section => (
                        <SelectItem key={section} value={section}>
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Clé</Label>
                  <Input
                    placeholder="ex: main_title"
                    value={newContent.key}
                    onChange={(e) => setNewContent(prev => ({...prev, key: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={newContent.type} onValueChange={(value) => setNewContent(prev => ({...prev, type: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Titre</SelectItem>
                      <SelectItem value="subtitle">Sous-titre</SelectItem>
                      <SelectItem value="paragraph">Paragraphe</SelectItem>
                      <SelectItem value="button">Bouton</SelectItem>
                      <SelectItem value="link">Lien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleCreate}
                    disabled={saving}
                    className="w-full bg-fadem-blue hover:bg-fadem-blue-dark"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer
                  </Button>
                </div>
              </div>
              <div>
                <Label>Contenu</Label>
                <Textarea
                  placeholder="Tapez votre contenu ici..."
                  value={newContent.content}
                  onChange={(e) => setNewContent(prev => ({...prev, content: e.target.value}))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Liste des contenus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredContents.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {content.section}
                        </Badge>
                        <Badge className={`text-xs ${getTypeColor(content.type)}`}>
                          {content.type}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-fadem-blue truncate">
                        {content.key}
                      </h4>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(editingId === content.id ? null : content.id)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingId === content.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={content.content}
                        onChange={(e) => {
                          const updated = textContents.map(c => 
                            c.id === content.id ? {...c, content: e.target.value} : c
                          );
                          setTextContents(updated);
                        }}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(content)}
                          disabled={saving}
                          className="bg-fadem-blue hover:bg-fadem-blue-dark flex-1"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Sauvegarder
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {content.content}
                      </p>
                      <div className="mt-3 text-xs text-gray-400">
                        Modifié: {new Date(content.updated_at).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Type className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun contenu trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TextContentManager;
