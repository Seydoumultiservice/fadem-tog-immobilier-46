
-- Table pour les véhicules (admin)
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre VARCHAR NOT NULL,
  description TEXT,
  marque VARCHAR NOT NULL,
  modele VARCHAR NOT NULL,
  annee INTEGER,
  type_transaction TEXT NOT NULL CHECK (type_transaction IN ('vente', 'location')),
  prix NUMERIC NOT NULL,
  prix_location_jour NUMERIC,
  kilometrage INTEGER,
  carburant TEXT CHECK (carburant IN ('essence', 'diesel', 'hybride', 'electrique')),
  transmission TEXT CHECK (transmission IN ('manuelle', 'automatique')),
  couleur VARCHAR,
  nombre_places INTEGER,
  climatisation BOOLEAN DEFAULT false,
  gps BOOLEAN DEFAULT false,
  bluetooth BOOLEAN DEFAULT false,
  statut TEXT DEFAULT 'disponible' CHECK (statut IN ('disponible', 'loue', 'vendu', 'maintenance')),
  localisation VARCHAR,
  images TEXT[],
  video_url TEXT,
  proprietaire_nom VARCHAR,
  proprietaire_telephone VARCHAR,
  notes_internes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les demandes de vente de véhicules (clients)
CREATE TABLE public.vehicle_sell_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR NOT NULL,
  prenom VARCHAR,
  email VARCHAR NOT NULL,
  telephone VARCHAR,
  marque VARCHAR NOT NULL,
  modele VARCHAR NOT NULL,
  annee INTEGER,
  kilometrage INTEGER,
  prix_souhaite NUMERIC,
  description TEXT,
  couleur VARCHAR,
  carburant TEXT,
  transmission TEXT,
  etat_vehicule TEXT CHECK (etat_vehicule IN ('excellent', 'tres_bon', 'bon', 'moyen', 'a_reparer')),
  images TEXT[],
  video_url TEXT,
  statut TEXT DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'accepte', 'refuse', 'vendu')),
  notes_internes TEXT,
  date_evaluation DATE,
  prix_propose NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicles_updated_at 
  BEFORE UPDATE ON vehicles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_sell_requests_updated_at 
  BEFORE UPDATE ON vehicle_sell_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS (Row Level Security)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_sell_requests ENABLE ROW LEVEL SECURITY;

-- Policies pour l'accès public en lecture
CREATE POLICY "Public can view available vehicles" 
  ON public.vehicles 
  FOR SELECT 
  USING (statut = 'disponible');

CREATE POLICY "Admin can manage all vehicles" 
  ON public.vehicles 
  FOR ALL 
  USING (true);

-- Policies pour les demandes de vente
CREATE POLICY "Public can submit sell requests" 
  ON public.vehicle_sell_requests 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin can manage all sell requests" 
  ON public.vehicle_sell_requests 
  FOR ALL 
  USING (true);
