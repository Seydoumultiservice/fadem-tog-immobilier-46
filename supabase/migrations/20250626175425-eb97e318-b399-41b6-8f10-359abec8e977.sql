
-- Créer une table pour gérer les images de la galerie
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  video_url TEXT,
  categorie TEXT DEFAULT 'general',
  ordre INTEGER DEFAULT 0,
  statut TEXT DEFAULT 'publie' CHECK (statut IN ('publie', 'brouillon', 'archive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer la réplication en temps réel
ALTER TABLE public.gallery_images REPLICA IDENTITY FULL;

-- Ajouter à la publication pour le temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER handle_updated_at_gallery_images
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insérer quelques images par défaut en utilisant les images existantes
INSERT INTO public.gallery_images (titre, description, image_url, categorie, ordre) VALUES
('Villa Moderne Lomé', 'Magnifique villa moderne avec piscine à Lomé', '/lovable-uploads/90399d8c-01d2-41c1-a9bf-02492d47a59b.png', 'construction', 1),
('Appartement Luxueux', 'Appartement haut de gamme avec vue panoramique', '/lovable-uploads/8ab4fdca-37dc-441b-aebe-aee42fe5c4e6.png', 'construction', 2),
('Projet Commercial Kara', 'Centre commercial moderne à Kara', '/lovable-uploads/d430ee40-6496-4a37-89bc-1cf192ce7339.png', 'commercial', 3),
('Résidence Familiale', 'Belle résidence familiale avec jardin', '/lovable-uploads/fab7e7bf-0f7b-4fa7-b572-ce9698a9789b.png', 'construction', 4),
('Immeuble Bureaux Sokodé', 'Immeuble de bureaux moderne à Sokodé', '/lovable-uploads/ff1282ce-da89-4a00-b69c-9e40e87ada43.png', 'commercial', 5);
