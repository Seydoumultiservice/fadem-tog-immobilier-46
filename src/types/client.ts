export interface UserProfile {
  id: string;
  user_id: string;
  nom: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  type_client: 'particulier' | 'entreprise' | 'diaspora';
  date_inscription: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  created_at: string;
  updated_at: string;
}

export interface ClientRental {
  id: string;
  user_id: string;
  type_location: 'maison' | 'appartement' | 'vehicule';
  titre: string;
  description?: string;
  adresse?: string;
  prix_mensuel?: number;
  date_debut: string;
  date_fin?: string;
  statut: 'actif' | 'termine' | 'suspendu';
  documents: any[];
  notes_internes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientProperty {
  id: string;
  user_id: string;
  type_bien: 'maison' | 'appartement' | 'terrain' | 'vehicule' | 'equipement';
  titre: string;
  description?: string;
  adresse?: string;
  valeur_estimee?: number;
  date_confie: string;
  type_gestion?: 'location' | 'vente' | 'maintenance';
  statut: 'en_gestion' | 'vendu' | 'retire';
  documents: any[];
  revenus_generes?: number;
  notes_internes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientProject {
  id: string;
  user_id: string;
  type_projet: 'construction' | 'renovation' | 'amenagement' | 'maintenance';
  titre: string;
  description?: string;
  adresse?: string;
  budget_prevu?: number;
  budget_reel?: number;
  date_debut?: string;
  date_fin_prevue?: string;
  date_fin_reelle?: string;
  pourcentage_avancement?: number;
  statut: 'planifie' | 'en_cours' | 'termine' | 'suspendu' | 'annule';
  documents: any[];
  images: any[];
  notes_internes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientInvoice {
  id: string;
  user_id: string;
  numero_facture: string;
  type_service: 'location' | 'gestion' | 'construction' | 'maintenance' | 'autre';
  related_id?: string;
  related_type?: 'rental' | 'property' | 'project';
  montant_ht: number;
  tva?: number;
  montant_ttc: number;
  date_emission: string;
  date_echeance?: string;
  date_paiement?: string;
  statut: 'en_attente' | 'payee' | 'en_retard' | 'annulee';
  mode_paiement?: 'especes' | 'virement' | 'cheque' | 'mobile_money';
  document_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientMessage {
  id: string;
  user_id: string;
  sujet: string;
  message: string;
  type_demande?: 'information' | 'reclamation' | 'demande_service' | 'urgent';
  statut: 'nouveau' | 'en_cours' | 'traite' | 'ferme';
  priorite: 'faible' | 'normale' | 'haute' | 'urgente';
  reponse_admin?: string;
  date_reponse?: string;
  admin_id?: string;
  fichiers: any[];
  created_at: string;
  updated_at: string;
}

export interface ClientNotification {
  id: string;
  user_id?: string;
  titre: string;
  contenu: string;
  type_notification?: 'info' | 'rappel' | 'facture' | 'projet' | 'urgent';
  lu: boolean;
  date_envoi: string;
  date_lecture?: string;
  related_id?: string;
  related_type?: string;
  created_at: string;
}