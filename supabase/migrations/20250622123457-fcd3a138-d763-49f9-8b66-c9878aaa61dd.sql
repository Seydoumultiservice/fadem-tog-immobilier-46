
-- Supprimer toutes les tables existantes pour repartir proprement
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.contact_requests CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.partners CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Créer la table des administrateurs
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des biens immobiliers
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type_bien TEXT NOT NULL CHECK (type_bien IN ('appartement', 'villa', 'maison', 'terrain', 'immeuble', 'commerce')),
  type_transaction TEXT NOT NULL CHECK (type_transaction IN ('vente', 'location')),
  prix NUMERIC NOT NULL,
  localisation VARCHAR(255) NOT NULL,
  quartier VARCHAR(100),
  ville VARCHAR(100) DEFAULT 'Lomé',
  nombre_pieces INTEGER,
  nombre_chambres INTEGER,
  nombre_salles_bain INTEGER,
  surface_habitable INTEGER,
  surface_totale INTEGER,
  parking BOOLEAN DEFAULT false,
  piscine BOOLEAN DEFAULT false,
  jardin BOOLEAN DEFAULT false,
  climatisation BOOLEAN DEFAULT false,
  securite BOOLEAN DEFAULT false,
  statut TEXT DEFAULT 'disponible' CHECK (statut IN ('disponible', 'loue', 'vendu', 'reserve')),
  date_disponibilite DATE,
  images TEXT[], -- URLs des images
  video_url TEXT, -- URL de la vidéo YouTube/TikTok/Facebook
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des projets BTP
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('construction', 'renovation', 'rehabilitation', 'amenagement')),
  type_projet TEXT CHECK (type_projet IN ('residentiel', 'commercial', 'industriel', 'infrastructure')),
  statut TEXT DEFAULT 'planifie' CHECK (statut IN ('planifie', 'en_cours', 'termine', 'suspendu')),
  adresse TEXT,
  ville VARCHAR(100) DEFAULT 'Lomé',
  superficie NUMERIC,
  budget_prevu NUMERIC,
  budget_reel NUMERIC,
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  pourcentage_avancement INTEGER DEFAULT 0 CHECK (pourcentage_avancement >= 0 AND pourcentage_avancement <= 100),
  client_nom VARCHAR(255),
  client_email VARCHAR(255),
  client_telephone VARCHAR(20),
  images TEXT[], -- URLs des images
  video_url TEXT, -- URL de la vidéo YouTube/TikTok/Facebook
  notes_internes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des actualités/blog
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  extrait TEXT,
  contenu TEXT NOT NULL,
  categorie TEXT CHECK (categorie IN ('actualite', 'conseil', 'marche', 'projet')),
  statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'archive')),
  image_principale TEXT,
  images TEXT[], -- URLs des images supplémentaires
  video_url TEXT, -- URL de la vidéo YouTube/TikTok/Facebook
  tags TEXT[],
  date_publication TIMESTAMP WITH TIME ZONE,
  vues INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des demandes de contact
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  entreprise VARCHAR(255),
  sujet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  service_demande TEXT CHECK (service_demande IN ('immobilier', 'btp', 'gerance')),
  urgence TEXT DEFAULT 'normale' CHECK (urgence IN ('faible', 'normale', 'haute', 'urgente')),
  statut TEXT DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'traite', 'ferme')),
  property_id UUID REFERENCES public.properties(id),
  budget_estime NUMERIC,
  date_reponse TIMESTAMP WITH TIME ZONE,
  notes_internes TEXT,
  assigne_a UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des témoignages
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_nom VARCHAR(255) NOT NULL,
  client_entreprise VARCHAR(255),
  client_email VARCHAR(255),
  contenu TEXT NOT NULL,
  note INTEGER CHECK (note >= 1 AND note <= 5),
  service TEXT CHECK (service IN ('immobilier', 'btp', 'gerance')),
  property_id UUID REFERENCES public.properties(id),
  project_id UUID REFERENCES public.projects(id),
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuve', 'rejete')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des rendez-vous
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_nom VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_telephone VARCHAR(20),
  date_rdv TIMESTAMP WITH TIME ZONE NOT NULL,
  duree_minutes INTEGER DEFAULT 60,
  type_rdv TEXT CHECK (type_rdv IN ('visite', 'consultation', 'signature', 'suivi')),
  service TEXT CHECK (service IN ('immobilier', 'btp', 'gerance')),
  lieu TEXT,
  property_id UUID REFERENCES public.properties(id),
  project_id UUID REFERENCES public.projects(id),
  statut TEXT DEFAULT 'confirme' CHECK (statut IN ('confirme', 'reporte', 'annule', 'termine')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des statistiques
CREATE TABLE public.site_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_stat DATE NOT NULL DEFAULT CURRENT_DATE,
  vues_totales INTEGER DEFAULT 0,
  vues_biens INTEGER DEFAULT 0,
  vues_projets INTEGER DEFAULT 0,
  vues_blog INTEGER DEFAULT 0,
  demandes_contact INTEGER DEFAULT 0,
  rendez_vous INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date_stat)
);

-- Créer la table des partenaires
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  secteur TEXT,
  logo_url TEXT,
  site_web TEXT,
  email VARCHAR(255),
  telephone VARCHAR(20),
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer les triggers pour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insérer un administrateur par défaut
INSERT INTO public.admins (username, password_hash, nom, email)
VALUES ('admin', '$2b$10$rGZJ8vKz9ZJ7FvKzQJ7FvO7FvKzQJ7FvO7FvKzQJ7FvO7FvKzQJ7F', 'Administrateur', 'admin@fadem.com');

-- Insérer quelques données de démonstration
INSERT INTO public.properties (titre, description, type_bien, type_transaction, prix, localisation, quartier, ville, nombre_pieces, nombre_chambres, nombre_salles_bain, surface_habitable, parking, climatisation, images) VALUES
('Appartement moderne 3 pièces', 'Magnifique appartement rénové avec vue dégagée', 'appartement', 'location', 180000, 'Adidogomé', 'Adidogomé', 'Lomé', 3, 2, 1, 85, true, true, ARRAY['/lovable-uploads/b01d8982-a00a-4af1-87ad-3a51a613c4e1.png']),
('Villa avec piscine', 'Villa moderne avec piscine et grand jardin', 'villa', 'vente', 45000000, 'Agbalépédo', 'Agbalépédo', 'Lomé', 5, 4, 3, 200, true, true, ARRAY['/lovable-uploads/f14a246e-3267-49a8-a4f2-78dd634f4092.png']),
('Immeuble de rapport', 'Immeuble de 6 appartements entièrement loués', 'immeuble', 'vente', 85000000, 'Bè', 'Bè', 'Lomé', 18, 12, 6, 600, true, false, ARRAY['/lovable-uploads/4d062b92-8af0-402f-a250-7626bf02b286.png']);

INSERT INTO public.projects (titre, description, categorie, type_projet, statut, ville, superficie, budget_prevu, date_debut, pourcentage_avancement, client_nom, images) VALUES
('Complexe résidentiel moderne', 'Construction de 12 appartements haut standing avec piscine et espaces verts', 'construction', 'residentiel', 'termine', 'Lomé', 2500, 850000000, '2023-01-15', 100, 'Société IMMOBAT', ARRAY['/lovable-uploads/4d062b92-8af0-402f-a250-7626bf02b286.png']),
('Centre commercial', 'Construction d''un centre commercial moderne avec parking souterrain', 'construction', 'commercial', 'en_cours', 'Lomé', 5000, 1200000000, '2024-03-01', 65, 'Groupe TOGO MALL', ARRAY['/lovable-uploads/09c437d5-9b16-45fa-ab93-c9656e8e6b23.png']),
('Logements sociaux Kpalimé', 'Réalisation de 30 logements sociaux avec infrastructure complète', 'construction', 'residentiel', 'termine', 'Kpalimé', 3000, 450000000, '2023-06-01', 100, 'Ministère de l''Urbanisme', ARRAY['/lovable-uploads/0d0f09d4-82ca-4e87-8245-5dd69bf4d4f6.png']);

-- Initialiser les statistiques
INSERT INTO public.site_stats (date_stat, vues_totales, vues_biens, vues_projets, demandes_contact) VALUES
(CURRENT_DATE, 150, 45, 32, 8),
(CURRENT_DATE - INTERVAL '1 day', 132, 38, 28, 6),
(CURRENT_DATE - INTERVAL '2 days', 145, 42, 35, 7);
