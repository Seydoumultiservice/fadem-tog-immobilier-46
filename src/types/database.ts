
export interface Property {
  id: string;
  titre: string;
  description: string;
  type_bien: 'appartement' | 'villa' | 'maison' | 'terrain' | 'immeuble' | 'commerce';
  type_transaction: 'vente' | 'location';
  prix: number;
  localisation: string;
  quartier?: string;
  ville?: string;
  nombre_pieces?: number;
  nombre_chambres?: number;
  nombre_salles_bain?: number;
  surface_habitable?: number;
  surface_totale?: number;
  parking?: boolean;
  piscine?: boolean;
  jardin?: boolean;
  climatisation?: boolean;
  securite?: boolean;
  statut?: 'disponible' | 'loue' | 'vendu' | 'reserve';
  date_disponibilite?: string;
  images?: string[];
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  titre: string;
  description: string;
  categorie: 'construction' | 'renovation' | 'rehabilitation' | 'amenagement';
  type_projet?: 'residentiel' | 'commercial' | 'industriel' | 'infrastructure';
  statut?: 'planifie' | 'en_cours' | 'termine' | 'suspendu';
  adresse?: string;
  ville?: string;
  superficie?: number;
  budget_prevu?: number;
  budget_reel?: number;
  date_debut?: string;
  date_fin_prevue?: string;
  date_fin_reelle?: string;
  pourcentage_avancement?: number;
  client_nom?: string;
  client_email?: string;
  client_telephone?: string;
  images?: string[];
  video_url?: string;
  notes_internes?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  titre: string;
  slug: string;
  extrait?: string;
  contenu: string;
  categorie?: 'actualite' | 'conseil' | 'marche' | 'projet';
  statut?: 'brouillon' | 'publie' | 'archive';
  image_principale?: string;
  images?: string[];
  video_url?: string;
  tags?: string[];
  date_publication?: string;
  vues?: number;
  created_at: string;
  updated_at: string;
}

export interface ContactRequest {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  sujet: string;
  message: string;
  service_demande?: 'immobilier' | 'btp' | 'gerance';
  urgence?: 'faible' | 'normale' | 'haute' | 'urgente';
  statut?: 'nouveau' | 'en_cours' | 'traite' | 'ferme';
  property_id?: string;
  budget_estime?: number;
  date_reponse?: string;
  notes_internes?: string;
  assigne_a?: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_nom: string;
  client_email?: string;
  contenu: string;
  service?: string;
  note?: number;
  statut?: 'en_attente' | 'approuve' | 'rejete';
  created_at: string;
}

export interface SiteStats {
  id: string;
  date_stat: string;
  vues_totales: number;
  vues_biens: number;
  vues_projets: number;
  vues_blog: number;
  demandes_contact: number;
  rendez_vous: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  titre: string;
  description?: string;
  image_url: string;
  video_url?: string;
  categorie?: string;
  ordre?: number;
  statut?: 'publie' | 'brouillon' | 'archive';
  created_at: string;
  updated_at: string;
}

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
