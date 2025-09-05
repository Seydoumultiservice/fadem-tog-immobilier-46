
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type TextContent = Tables<'site_text_content'>;

export const useTextContent = (section?: string) => {
  const [textContents, setTextContents] = useState<TextContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTextContents = async () => {
      try {
        let query = supabase
          .from('site_text_content')
          .select('*');

        if (section) {
          query = query.eq('section', section);
        }

        const { data, error } = await query.order('key', { ascending: true });

        if (error) throw error;
        setTextContents(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des contenus texte:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTextContents();

    // Configuration temps réel
    const channel = supabase
      .channel('text-content-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_text_content',
        filter: section ? `section=eq.${section}` : undefined
      }, () => {
        loadTextContents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [section]);

  // Fonction utilitaire pour récupérer un contenu spécifique
  const getContent = (key: string, defaultValue: string = '') => {
    const content = textContents.find(c => c.key === key);
    return content?.content || defaultValue;
  };

  // Fonction utilitaire pour récupérer tous les contenus d'une section
  const getSectionContents = (sectionName: string) => {
    return textContents.filter(c => c.section === sectionName);
  };

  return {
    textContents,
    loading,
    getContent,
    getSectionContents
  };
};
