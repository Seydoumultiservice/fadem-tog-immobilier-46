
-- Créer la table pour stocker les contenus texte du site
CREATE TABLE public.site_text_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'paragraph',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section, key)
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.site_text_content ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour permettre la lecture publique
CREATE POLICY "Lecture publique des contenus texte" 
  ON public.site_text_content 
  FOR SELECT 
  USING (true);

-- Créer des politiques pour permettre les modifications par les admins
CREATE POLICY "Admin peut modifier les contenus texte" 
  ON public.site_text_content 
  FOR ALL 
  USING (true);

-- Insérer quelques contenus par défaut
INSERT INTO public.site_text_content (section, key, content, type) VALUES
('hero', 'main_title', 'FADEM - Excellence en Construction et Immobilier', 'title'),
('hero', 'subtitle', 'Votre partenaire de confiance pour tous vos projets immobiliers au Togo', 'subtitle'),
('hero', 'description', 'Depuis notre création, FADEM s''est imposée comme une référence dans le secteur de la construction et de l''immobilier au Togo. Nous offrons des services complets et personnalisés pour répondre à tous vos besoins.', 'paragraph'),
('services', 'title', 'Nos Services', 'title'),
('services', 'construction_title', 'Construction', 'subtitle'),
('services', 'construction_desc', 'Constructions résidentielles et commerciales de haute qualité', 'paragraph'),
('services', 'immobilier_title', 'Immobilier', 'subtitle'),
('services', 'immobilier_desc', 'Vente et location de biens immobiliers premium', 'paragraph'),
('contact', 'title', 'Contactez-nous', 'title'),
('contact', 'description', 'Notre équipe est à votre disposition pour répondre à toutes vos questions', 'paragraph'),
('footer', 'company_desc', 'FADEM, votre partenaire de confiance pour tous vos projets immobiliers et de construction au Togo.', 'paragraph');

-- Activer les mises à jour en temps réel
ALTER TABLE public.site_text_content REPLICA IDENTITY FULL;
