export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nom: string
          password_hash: string
          prenom: string | null
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nom: string
          password_hash: string
          prenom?: string | null
          role?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nom?: string
          password_hash?: string
          prenom?: string | null
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          client_email: string
          client_nom: string
          client_telephone: string | null
          created_at: string
          date_rdv: string
          duree_minutes: number | null
          id: string
          lieu: string | null
          notes: string | null
          project_id: string | null
          property_id: string | null
          service: string | null
          statut: string | null
          type_rdv: string | null
          updated_at: string
        }
        Insert: {
          client_email: string
          client_nom: string
          client_telephone?: string | null
          created_at?: string
          date_rdv: string
          duree_minutes?: number | null
          id?: string
          lieu?: string | null
          notes?: string | null
          project_id?: string | null
          property_id?: string | null
          service?: string | null
          statut?: string | null
          type_rdv?: string | null
          updated_at?: string
        }
        Update: {
          client_email?: string
          client_nom?: string
          client_telephone?: string | null
          created_at?: string
          date_rdv?: string
          duree_minutes?: number | null
          id?: string
          lieu?: string | null
          notes?: string | null
          project_id?: string | null
          property_id?: string | null
          service?: string | null
          statut?: string | null
          type_rdv?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          categorie: string | null
          contenu: string
          created_at: string
          date_publication: string | null
          extrait: string | null
          id: string
          image_principale: string | null
          images: string[] | null
          slug: string
          statut: string | null
          tags: string[] | null
          titre: string
          updated_at: string
          video_url: string | null
          vues: number | null
        }
        Insert: {
          categorie?: string | null
          contenu: string
          created_at?: string
          date_publication?: string | null
          extrait?: string | null
          id?: string
          image_principale?: string | null
          images?: string[] | null
          slug: string
          statut?: string | null
          tags?: string[] | null
          titre: string
          updated_at?: string
          video_url?: string | null
          vues?: number | null
        }
        Update: {
          categorie?: string | null
          contenu?: string
          created_at?: string
          date_publication?: string | null
          extrait?: string | null
          id?: string
          image_principale?: string | null
          images?: string[] | null
          slug?: string
          statut?: string | null
          tags?: string[] | null
          titre?: string
          updated_at?: string
          video_url?: string | null
          vues?: number | null
        }
        Relationships: []
      }
      client_invoices: {
        Row: {
          created_at: string | null
          date_echeance: string | null
          date_emission: string
          date_paiement: string | null
          document_url: string | null
          id: string
          mode_paiement: string | null
          montant_ht: number
          montant_ttc: number
          notes: string | null
          numero_facture: string
          related_id: string | null
          related_type: string | null
          statut: string | null
          tva: number | null
          type_service: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_echeance?: string | null
          date_emission?: string
          date_paiement?: string | null
          document_url?: string | null
          id?: string
          mode_paiement?: string | null
          montant_ht: number
          montant_ttc: number
          notes?: string | null
          numero_facture: string
          related_id?: string | null
          related_type?: string | null
          statut?: string | null
          tva?: number | null
          type_service: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_echeance?: string | null
          date_emission?: string
          date_paiement?: string | null
          document_url?: string | null
          id?: string
          mode_paiement?: string | null
          montant_ht?: number
          montant_ttc?: number
          notes?: string | null
          numero_facture?: string
          related_id?: string | null
          related_type?: string | null
          statut?: string | null
          tva?: number | null
          type_service?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      client_messages: {
        Row: {
          admin_id: string | null
          created_at: string | null
          date_reponse: string | null
          fichiers: Json | null
          id: string
          message: string
          priorite: string | null
          reponse_admin: string | null
          statut: string | null
          sujet: string
          type_demande: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          date_reponse?: string | null
          fichiers?: Json | null
          id?: string
          message: string
          priorite?: string | null
          reponse_admin?: string | null
          statut?: string | null
          sujet: string
          type_demande?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          date_reponse?: string | null
          fichiers?: Json | null
          id?: string
          message?: string
          priorite?: string | null
          reponse_admin?: string | null
          statut?: string | null
          sujet?: string
          type_demande?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      client_notifications: {
        Row: {
          contenu: string
          created_at: string | null
          date_envoi: string | null
          date_lecture: string | null
          id: string
          lu: boolean | null
          related_id: string | null
          related_type: string | null
          titre: string
          type_notification: string | null
          user_id: string | null
        }
        Insert: {
          contenu: string
          created_at?: string | null
          date_envoi?: string | null
          date_lecture?: string | null
          id?: string
          lu?: boolean | null
          related_id?: string | null
          related_type?: string | null
          titre: string
          type_notification?: string | null
          user_id?: string | null
        }
        Update: {
          contenu?: string
          created_at?: string | null
          date_envoi?: string | null
          date_lecture?: string | null
          id?: string
          lu?: boolean | null
          related_id?: string | null
          related_type?: string | null
          titre?: string
          type_notification?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      client_projects: {
        Row: {
          adresse: string | null
          budget_prevu: number | null
          budget_reel: number | null
          created_at: string | null
          date_debut: string | null
          date_fin_prevue: string | null
          date_fin_reelle: string | null
          description: string | null
          documents: Json | null
          id: string
          images: Json | null
          notes_internes: string | null
          pourcentage_avancement: number | null
          statut: string | null
          titre: string
          type_projet: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adresse?: string | null
          budget_prevu?: number | null
          budget_reel?: number | null
          created_at?: string | null
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          images?: Json | null
          notes_internes?: string | null
          pourcentage_avancement?: number | null
          statut?: string | null
          titre: string
          type_projet: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adresse?: string | null
          budget_prevu?: number | null
          budget_reel?: number | null
          created_at?: string | null
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          images?: Json | null
          notes_internes?: string | null
          pourcentage_avancement?: number | null
          statut?: string | null
          titre?: string
          type_projet?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      client_properties: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_confie: string
          description: string | null
          documents: Json | null
          id: string
          notes_internes: string | null
          revenus_generes: number | null
          statut: string | null
          titre: string
          type_bien: string
          type_gestion: string | null
          updated_at: string | null
          user_id: string
          valeur_estimee: number | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_confie: string
          description?: string | null
          documents?: Json | null
          id?: string
          notes_internes?: string | null
          revenus_generes?: number | null
          statut?: string | null
          titre: string
          type_bien: string
          type_gestion?: string | null
          updated_at?: string | null
          user_id: string
          valeur_estimee?: number | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_confie?: string
          description?: string | null
          documents?: Json | null
          id?: string
          notes_internes?: string | null
          revenus_generes?: number | null
          statut?: string | null
          titre?: string
          type_bien?: string
          type_gestion?: string | null
          updated_at?: string | null
          user_id?: string
          valeur_estimee?: number | null
        }
        Relationships: []
      }
      client_rentals: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_debut: string
          date_fin: string | null
          description: string | null
          documents: Json | null
          id: string
          notes_internes: string | null
          prix_mensuel: number | null
          statut: string | null
          titre: string
          type_location: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_debut: string
          date_fin?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          notes_internes?: string | null
          prix_mensuel?: number | null
          statut?: string | null
          titre: string
          type_location: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          documents?: Json | null
          id?: string
          notes_internes?: string | null
          prix_mensuel?: number | null
          statut?: string | null
          titre?: string
          type_location?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          assigne_a: string | null
          budget_estime: number | null
          created_at: string
          date_reponse: string | null
          email: string
          entreprise: string | null
          id: string
          message: string
          nom: string
          notes_internes: string | null
          prenom: string | null
          property_id: string | null
          service_demande: string | null
          statut: string | null
          sujet: string
          telephone: string | null
          updated_at: string
          urgence: string | null
        }
        Insert: {
          assigne_a?: string | null
          budget_estime?: number | null
          created_at?: string
          date_reponse?: string | null
          email: string
          entreprise?: string | null
          id?: string
          message: string
          nom: string
          notes_internes?: string | null
          prenom?: string | null
          property_id?: string | null
          service_demande?: string | null
          statut?: string | null
          sujet: string
          telephone?: string | null
          updated_at?: string
          urgence?: string | null
        }
        Update: {
          assigne_a?: string | null
          budget_estime?: number | null
          created_at?: string
          date_reponse?: string | null
          email?: string
          entreprise?: string | null
          id?: string
          message?: string
          nom?: string
          notes_internes?: string | null
          prenom?: string | null
          property_id?: string | null
          service_demande?: string | null
          statut?: string | null
          sujet?: string
          telephone?: string | null
          updated_at?: string
          urgence?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          categorie: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          ordre: number | null
          statut: string | null
          titre: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          categorie?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          ordre?: number | null
          statut?: string | null
          titre: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          categorie?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          ordre?: number | null
          statut?: string | null
          titre?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          nom: string
          secteur: string | null
          site_web: string | null
          statut: string | null
          telephone: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          nom: string
          secteur?: string | null
          site_web?: string | null
          statut?: string | null
          telephone?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          nom?: string
          secteur?: string | null
          site_web?: string | null
          statut?: string | null
          telephone?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          adresse: string | null
          budget_prevu: number | null
          budget_reel: number | null
          categorie: string
          client_email: string | null
          client_nom: string | null
          client_telephone: string | null
          created_at: string
          date_debut: string | null
          date_fin_prevue: string | null
          date_fin_reelle: string | null
          description: string
          id: string
          images: string[] | null
          notes_internes: string | null
          pourcentage_avancement: number | null
          statut: string | null
          superficie: number | null
          titre: string
          type_projet: string | null
          updated_at: string
          video_url: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          budget_prevu?: number | null
          budget_reel?: number | null
          categorie: string
          client_email?: string | null
          client_nom?: string | null
          client_telephone?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          description: string
          id?: string
          images?: string[] | null
          notes_internes?: string | null
          pourcentage_avancement?: number | null
          statut?: string | null
          superficie?: number | null
          titre: string
          type_projet?: string | null
          updated_at?: string
          video_url?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          budget_prevu?: number | null
          budget_reel?: number | null
          categorie?: string
          client_email?: string | null
          client_nom?: string | null
          client_telephone?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          description?: string
          id?: string
          images?: string[] | null
          notes_internes?: string | null
          pourcentage_avancement?: number | null
          statut?: string | null
          superficie?: number | null
          titre?: string
          type_projet?: string | null
          updated_at?: string
          video_url?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          climatisation: boolean | null
          created_at: string
          date_disponibilite: string | null
          description: string
          id: string
          images: string[] | null
          jardin: boolean | null
          localisation: string
          nombre_chambres: number | null
          nombre_pieces: number | null
          nombre_salles_bain: number | null
          parking: boolean | null
          piscine: boolean | null
          prix: number
          quartier: string | null
          securite: boolean | null
          statut: string | null
          surface_habitable: number | null
          surface_totale: number | null
          titre: string
          type_bien: string
          type_transaction: string
          updated_at: string
          video_url: string | null
          ville: string | null
        }
        Insert: {
          climatisation?: boolean | null
          created_at?: string
          date_disponibilite?: string | null
          description: string
          id?: string
          images?: string[] | null
          jardin?: boolean | null
          localisation: string
          nombre_chambres?: number | null
          nombre_pieces?: number | null
          nombre_salles_bain?: number | null
          parking?: boolean | null
          piscine?: boolean | null
          prix: number
          quartier?: string | null
          securite?: boolean | null
          statut?: string | null
          surface_habitable?: number | null
          surface_totale?: number | null
          titre: string
          type_bien: string
          type_transaction: string
          updated_at?: string
          video_url?: string | null
          ville?: string | null
        }
        Update: {
          climatisation?: boolean | null
          created_at?: string
          date_disponibilite?: string | null
          description?: string
          id?: string
          images?: string[] | null
          jardin?: boolean | null
          localisation?: string
          nombre_chambres?: number | null
          nombre_pieces?: number | null
          nombre_salles_bain?: number | null
          parking?: boolean | null
          piscine?: boolean | null
          prix?: number
          quartier?: string | null
          securite?: boolean | null
          statut?: string | null
          surface_habitable?: number | null
          surface_totale?: number | null
          titre?: string
          type_bien?: string
          type_transaction?: string
          updated_at?: string
          video_url?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          created_at: string
          date_stat: string
          demandes_contact: number | null
          id: string
          rendez_vous: number | null
          vues_biens: number | null
          vues_blog: number | null
          vues_projets: number | null
          vues_totales: number | null
        }
        Insert: {
          created_at?: string
          date_stat?: string
          demandes_contact?: number | null
          id?: string
          rendez_vous?: number | null
          vues_biens?: number | null
          vues_blog?: number | null
          vues_projets?: number | null
          vues_totales?: number | null
        }
        Update: {
          created_at?: string
          date_stat?: string
          demandes_contact?: number | null
          id?: string
          rendez_vous?: number | null
          vues_biens?: number | null
          vues_blog?: number | null
          vues_projets?: number | null
          vues_totales?: number | null
        }
        Relationships: []
      }
      site_text_content: {
        Row: {
          content: string
          created_at: string
          id: string
          key: string
          section: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          key: string
          section: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          key?: string
          section?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_email: string | null
          client_entreprise: string | null
          client_nom: string
          contenu: string
          created_at: string
          id: string
          note: number | null
          project_id: string | null
          property_id: string | null
          service: string | null
          statut: string | null
        }
        Insert: {
          client_email?: string | null
          client_entreprise?: string | null
          client_nom: string
          contenu: string
          created_at?: string
          id?: string
          note?: number | null
          project_id?: string | null
          property_id?: string | null
          service?: string | null
          statut?: string | null
        }
        Update: {
          client_email?: string | null
          client_entreprise?: string | null
          client_nom?: string
          contenu?: string
          created_at?: string
          id?: string
          note?: number | null
          project_id?: string | null
          property_id?: string | null
          service?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_images: {
        Row: {
          created_at: string
          filename: string
          id: string
          mime_type: string
          original_name: string
          public_url: string
          related_id: string | null
          related_type: string | null
          size_bytes: number
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          mime_type: string
          original_name: string
          public_url: string
          related_id?: string | null
          related_type?: string | null
          size_bytes: number
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string
          original_name?: string
          public_url?: string
          related_id?: string | null
          related_type?: string | null
          size_bytes?: number
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_inscription: string | null
          id: string
          nom: string
          pays: string | null
          prenom: string | null
          statut: string | null
          telephone: string | null
          type_client: string | null
          updated_at: string | null
          user_id: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_inscription?: string | null
          id?: string
          nom: string
          pays?: string | null
          prenom?: string | null
          statut?: string | null
          telephone?: string | null
          type_client?: string | null
          updated_at?: string | null
          user_id: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_inscription?: string | null
          id?: string
          nom?: string
          pays?: string | null
          prenom?: string | null
          statut?: string | null
          telephone?: string | null
          type_client?: string | null
          updated_at?: string | null
          user_id?: string
          ville?: string | null
        }
        Relationships: []
      }
      vehicle_sell_requests: {
        Row: {
          annee: number | null
          carburant: string | null
          couleur: string | null
          created_at: string
          date_evaluation: string | null
          description: string | null
          email: string
          etat_vehicule: string | null
          id: string
          images: string[] | null
          kilometrage: number | null
          marque: string
          modele: string
          nom: string
          notes_internes: string | null
          prenom: string | null
          prix_propose: number | null
          prix_souhaite: number | null
          statut: string | null
          telephone: string | null
          transmission: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          annee?: number | null
          carburant?: string | null
          couleur?: string | null
          created_at?: string
          date_evaluation?: string | null
          description?: string | null
          email: string
          etat_vehicule?: string | null
          id?: string
          images?: string[] | null
          kilometrage?: number | null
          marque: string
          modele: string
          nom: string
          notes_internes?: string | null
          prenom?: string | null
          prix_propose?: number | null
          prix_souhaite?: number | null
          statut?: string | null
          telephone?: string | null
          transmission?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          annee?: number | null
          carburant?: string | null
          couleur?: string | null
          created_at?: string
          date_evaluation?: string | null
          description?: string | null
          email?: string
          etat_vehicule?: string | null
          id?: string
          images?: string[] | null
          kilometrage?: number | null
          marque?: string
          modele?: string
          nom?: string
          notes_internes?: string | null
          prenom?: string | null
          prix_propose?: number | null
          prix_souhaite?: number | null
          statut?: string | null
          telephone?: string | null
          transmission?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          annee: number | null
          bluetooth: boolean | null
          carburant: string | null
          climatisation: boolean | null
          couleur: string | null
          created_at: string
          description: string | null
          gps: boolean | null
          id: string
          images: string[] | null
          kilometrage: number | null
          localisation: string | null
          marque: string
          modele: string
          nombre_places: number | null
          notes_internes: string | null
          prix: number
          prix_location_jour: number | null
          proprietaire_nom: string | null
          proprietaire_telephone: string | null
          statut: string | null
          titre: string
          transmission: string | null
          type_transaction: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          annee?: number | null
          bluetooth?: boolean | null
          carburant?: string | null
          climatisation?: boolean | null
          couleur?: string | null
          created_at?: string
          description?: string | null
          gps?: boolean | null
          id?: string
          images?: string[] | null
          kilometrage?: number | null
          localisation?: string | null
          marque: string
          modele: string
          nombre_places?: number | null
          notes_internes?: string | null
          prix: number
          prix_location_jour?: number | null
          proprietaire_nom?: string | null
          proprietaire_telephone?: string | null
          statut?: string | null
          titre: string
          transmission?: string | null
          type_transaction: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          annee?: number | null
          bluetooth?: boolean | null
          carburant?: string | null
          climatisation?: boolean | null
          couleur?: string | null
          created_at?: string
          description?: string | null
          gps?: boolean | null
          id?: string
          images?: string[] | null
          kilometrage?: number | null
          localisation?: string | null
          marque?: string
          modele?: string
          nombre_places?: number | null
          notes_internes?: string | null
          prix?: number
          prix_location_jour?: number | null
          proprietaire_nom?: string | null
          proprietaire_telephone?: string | null
          statut?: string | null
          titre?: string
          transmission?: string | null
          type_transaction?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_admin_credentials: {
        Args: { p_password: string; p_username: string }
        Returns: {
          email: string
          id: string
          nom: string
          prenom: string
          role: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
