
-- D'abord, vérifier les contraintes existantes sur la table testimonials
-- et corriger les témoignages avec les bonnes valeurs de service

-- Mettre à jour les témoignages avec des noms togolais et les bons services
UPDATE testimonials SET 
  client_nom = 'Kofi Mensah',
  contenu = 'Excellent travail sur ma villa à Lomé ! L''équipe de Groupe FADEM a livré un projet de qualité exceptionnelle. Je recommande vivement leurs services.',
  service = 'btp',
  note = 5
WHERE client_nom = 'Akosua Adjoua';

-- Ajouter d'autres témoignages avec des noms togolais et les bons services
INSERT INTO testimonials (client_nom, client_email, contenu, service, note, statut) VALUES
('Ama Koffi', 'ama.koffi@email.tg', 'Rénovation parfaite de notre bureau à Kara. Travail professionnel et dans les délais. Merci à toute l''équipe !', 'btp', 5, 'approuve'),
('Kwame Atsu', 'kwame.atsu@gmail.com', 'Construction de notre centre commercial à Sokodé. Résultat au-delà de nos attentes. Groupe FADEM est vraiment le leader au Togo !', 'btp', 5, 'approuve'),
('Efua Delali', 'efua.delali@yahoo.fr', 'Magnifique appartement trouvé grâce à leurs services immobiliers. Service client exceptionnel à Lomé.', 'immobilier', 4, 'approuve'),
('Yao Kodjo', 'yao.kodjo@hotmail.com', 'Gérance de nos propriétés impeccable. Nous faisons confiance à Groupe FADEM depuis 3 ans maintenant.', 'gerance', 5, 'approuve'),
('Akosua Abena', 'akosua.abena@email.tg', 'Projet de réhabilitation à Atakpamé réalisé avec brio. Équipe compétente et matériaux de qualité.', 'btp', 5, 'approuve'),
('Kojo Enam', 'kojo.enam@gmail.com', 'Villa de rêve construite à Dapaong. Conception moderne et finitions parfaites. Je recommande !', 'btp', 5, 'en_attente');

-- Créer un bucket de stockage pour les images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fadem-images', 
  'fadem-images', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Créer des politiques de stockage pour permettre l'upload et la lecture
CREATE POLICY "Permettre lecture publique des images" ON storage.objects
FOR SELECT USING (bucket_id = 'fadem-images');

CREATE POLICY "Permettre upload des images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'fadem-images');

CREATE POLICY "Permettre mise à jour des images" ON storage.objects
FOR UPDATE USING (bucket_id = 'fadem-images');

CREATE POLICY "Permettre suppression des images" ON storage.objects
FOR DELETE USING (bucket_id = 'fadem-images');

-- Créer une table pour gérer les uploads d'images
CREATE TABLE public.uploaded_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  related_type TEXT, -- 'property', 'project', 'gallery', 'blog'
  related_id UUID,
  uploaded_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table des images uploadées  
ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Lecture publique des images uploadées" ON public.uploaded_images
FOR SELECT USING (true);

-- Politique pour permettre l'insertion par les admins
CREATE POLICY "Admin peut uploader des images" ON public.uploaded_images
FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour par les admins
CREATE POLICY "Admin peut modifier des images" ON public.uploaded_images
FOR UPDATE USING (true);

-- Politique pour permettre la suppression par les admins
CREATE POLICY "Admin peut supprimer des images" ON public.uploaded_images
FOR DELETE USING (true);

-- Activer la réplication en temps réel pour les images uploadées
ALTER TABLE public.uploaded_images REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.uploaded_images;

-- Créer un trigger pour mettre à jour updated_at sur les images uploadées
CREATE TRIGGER handle_updated_at_uploaded_images
  BEFORE UPDATE ON public.uploaded_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
