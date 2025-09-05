
export interface Vehicle {
  id: string;
  titre: string;
  description?: string;
  marque: string;
  modele: string;
  annee?: number;
  type_transaction: 'vente' | 'location';
  prix: number;
  prix_location_jour?: number;
  kilometrage?: number;
  carburant?: 'essence' | 'diesel' | 'hybride' | 'electrique';
  transmission?: 'manuelle' | 'automatique';
  couleur?: string;
  nombre_places?: number;
  climatisation?: boolean;
  gps?: boolean;
  bluetooth?: boolean;
  statut?: 'disponible' | 'loue' | 'vendu' | 'maintenance';
  localisation?: string;
  images?: string[];
  video_url?: string;
  proprietaire_nom?: string;
  proprietaire_telephone?: string;
  notes_internes?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleSellRequest {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  marque: string;
  modele: string;
  annee?: number;
  kilometrage?: number;
  prix_souhaite?: number;
  description?: string;
  couleur?: string;
  carburant?: string;
  transmission?: string;
  etat_vehicule?: 'excellent' | 'tres_bon' | 'bon' | 'moyen' | 'a_reparer';
  images?: string[];
  video_url?: string;
  statut?: 'nouveau' | 'en_cours' | 'accepte' | 'refuse' | 'vendu';
  notes_internes?: string;
  date_evaluation?: string;
  prix_propose?: number;
  created_at: string;
  updated_at: string;
}
