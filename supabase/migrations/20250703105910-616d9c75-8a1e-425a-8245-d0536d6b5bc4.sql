-- Création de la table des profils utilisateurs
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nom VARCHAR NOT NULL,
  prenom VARCHAR,
  telephone VARCHAR,
  adresse TEXT,
  ville VARCHAR DEFAULT 'Lomé',
  pays VARCHAR DEFAULT 'Togo',
  type_client VARCHAR DEFAULT 'particulier' CHECK (type_client IN ('particulier', 'entreprise', 'diaspora')),
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT now(),
  statut VARCHAR DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Création de la table des locations (maisons/voitures)
CREATE TABLE public.client_rentals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type_location VARCHAR NOT NULL CHECK (type_location IN ('maison', 'appartement', 'vehicule')),
  titre VARCHAR NOT NULL,
  description TEXT,
  adresse TEXT,
  prix_mensuel DECIMAL(10,2),
  date_debut DATE NOT NULL,
  date_fin DATE,
  statut VARCHAR DEFAULT 'actif' CHECK (statut IN ('actif', 'termine', 'suspendu')),
  documents JSONB DEFAULT '[]',
  notes_internes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Création de la table des biens confiés
CREATE TABLE public.client_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type_bien VARCHAR NOT NULL CHECK (type_bien IN ('maison', 'appartement', 'terrain', 'vehicule', 'equipement')),
  titre VARCHAR NOT NULL,
  description TEXT,
  adresse TEXT,
  valeur_estimee DECIMAL(12,2),
  date_confie DATE NOT NULL,
  type_gestion VARCHAR CHECK (type_gestion IN ('location', 'vente', 'maintenance')),
  statut VARCHAR DEFAULT 'en_gestion' CHECK (statut IN ('en_gestion', 'vendu', 'retire')),
  documents JSONB DEFAULT '[]',
  revenus_generes DECIMAL(10,2) DEFAULT 0,
  notes_internes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Création de la table des projets/travaux
CREATE TABLE public.client_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type_projet VARCHAR NOT NULL CHECK (type_projet IN ('construction', 'renovation', 'amenagement', 'maintenance')),
  titre VARCHAR NOT NULL,
  description TEXT,
  adresse TEXT,
  budget_prevu DECIMAL(12,2),
  budget_reel DECIMAL(12,2),
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  pourcentage_avancement INTEGER DEFAULT 0 CHECK (pourcentage_avancement >= 0 AND pourcentage_avancement <= 100),
  statut VARCHAR DEFAULT 'planifie' CHECK (statut IN ('planifie', 'en_cours', 'termine', 'suspendu', 'annule')),
  documents JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  notes_internes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Création de la table des factures
CREATE TABLE public.client_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numero_facture VARCHAR UNIQUE NOT NULL,
  type_service VARCHAR NOT NULL CHECK (type_service IN ('location', 'gestion', 'construction', 'maintenance', 'autre')),
  related_id UUID, -- ID du service/projet/location associé
  related_type VARCHAR CHECK (related_type IN ('rental', 'property', 'project')),
  montant_ht DECIMAL(10,2) NOT NULL,
  tva DECIMAL(10,2) DEFAULT 0,
  montant_ttc DECIMAL(10,2) NOT NULL,
  date_emission DATE NOT NULL DEFAULT CURRENT_DATE,
  date_echeance DATE,
  date_paiement DATE,
  statut VARCHAR DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'payee', 'en_retard', 'annulee')),
  mode_paiement VARCHAR CHECK (mode_paiement IN ('especes', 'virement', 'cheque', 'mobile_money')),
  document_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Création de la table des messages/requêtes
CREATE TABLE public.client_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sujet VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type_demande VARCHAR CHECK (type_demande IN ('information', 'reclamation', 'demande_service', 'urgent')),
  statut VARCHAR DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'traite', 'ferme')),
  priorite VARCHAR DEFAULT 'normale' CHECK (priorite IN ('faible', 'normale', 'haute', 'urgente')),
  reponse_admin TEXT,
  date_reponse TIMESTAMP WITH TIME ZONE,
  admin_id UUID,
  fichiers JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Création de la table des notifications
CREATE TABLE public.client_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titre VARCHAR NOT NULL,
  contenu TEXT NOT NULL,
  type_notification VARCHAR CHECK (type_notification IN ('info', 'rappel', 'facture', 'projet', 'urgent')),
  lu BOOLEAN DEFAULT false,
  date_envoi TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_lecture TIMESTAMP WITH TIME ZONE,
  related_id UUID,
  related_type VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies pour client_rentals
CREATE POLICY "Users can view their own rentals" ON public.client_rentals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all rentals" ON public.client_rentals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies pour client_properties
CREATE POLICY "Users can view their own properties" ON public.client_properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all properties" ON public.client_properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies pour client_projects
CREATE POLICY "Users can view their own projects" ON public.client_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all projects" ON public.client_projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies pour client_invoices
CREATE POLICY "Users can view their own invoices" ON public.client_invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all invoices" ON public.client_invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies pour client_messages
CREATE POLICY "Users can view their own messages" ON public.client_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON public.client_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages" ON public.client_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can update all messages" ON public.client_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies pour client_notifications
CREATE POLICY "Users can view their own notifications" ON public.client_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.client_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Triggers pour updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_client_rentals_updated_at
  BEFORE UPDATE ON public.client_rentals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_client_properties_updated_at
  BEFORE UPDATE ON public.client_properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_client_projects_updated_at
  BEFORE UPDATE ON public.client_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_client_invoices_updated_at
  BEFORE UPDATE ON public.client_invoices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_client_messages_updated_at
  BEFORE UPDATE ON public.client_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, nom, prenom)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- Index pour améliorer les performances
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_client_rentals_user_id ON public.client_rentals(user_id);
CREATE INDEX idx_client_properties_user_id ON public.client_properties(user_id);
CREATE INDEX idx_client_projects_user_id ON public.client_projects(user_id);
CREATE INDEX idx_client_invoices_user_id ON public.client_invoices(user_id);
CREATE INDEX idx_client_messages_user_id ON public.client_messages(user_id);
CREATE INDEX idx_client_notifications_user_id ON public.client_notifications(user_id);
CREATE INDEX idx_client_notifications_lu ON public.client_notifications(lu);
CREATE INDEX idx_client_messages_statut ON public.client_messages(statut);
CREATE INDEX idx_client_invoices_statut ON public.client_invoices(statut);