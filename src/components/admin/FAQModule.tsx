
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Home, 
  Image, 
  Building, 
  Car, 
  MessageCircle, 
  BarChart3,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const FAQModule = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const faqData = {
    biens: {
      title: "Gestion des Biens Immobiliers",
      icon: <Home className="w-5 h-5" />,
      color: "bg-blue-500",
      items: [
        {
          question: "Comment ajouter un nouveau bien immobilier ?",
          answer: "1. Cliquez sur l'onglet 'Biens Immobiliers'\n2. Cliquez sur 'Ajouter un Bien'\n3. Remplissez tous les champs obligatoires (titre, type, prix, localisation)\n4. Uploadez des images via le bouton 'Upload'\n5. Cliquez sur 'Enregistrer' - le bien apparaîtra immédiatement sur le site"
        },
        {
          question: "Pourquoi mes images ne s'affichent pas ?",
          answer: "Vérifiez que :\n- L'image fait moins de 5MB\n- Le format est JPG/PNG/WEBP\n- Vous avez cliqué sur 'Enregistrer' après l'upload\n- Votre connexion internet est stable"
        },
        {
          question: "Comment modifier ou supprimer un bien ?",
          answer: "Dans la liste des biens :\n- Cliquez sur l'icône crayon (✏️) pour modifier\n- Cliquez sur l'icône poubelle (🗑️) pour supprimer\n- Les changements sont instantanés sur le site"
        }
      ]
    },
    projets: {
      title: "Gestion des Réalisations BTP",
      icon: <Building className="w-5 h-5" />,
      color: "bg-green-500",
      items: [
        {
          question: "Comment publier une nouvelle réalisation ?",
          answer: "1. Allez dans l'onglet 'Réalisations BTP'\n2. Cliquez sur 'Ajouter une Réalisation'\n3. Remplissez le titre, description, catégorie\n4. Ajoutez des images de qualité\n5. Définissez le statut du projet\n6. Sauvegardez - visible instantanément"
        },
        {
          question: "Quelles catégories de projets puis-je créer ?",
          answer: "Catégories disponibles :\n- Construction (nouveaux bâtiments)\n- Rénovation (remise à neuf)\n- Réhabilitation (restauration)\n- Aménagement (espaces extérieurs)"
        },
        {
          question: "Comment suivre l'avancement d'un projet ?",
          answer: "Utilisez le pourcentage d'avancement :\n- 0-25% : Début\n- 26-50% : En cours\n- 51-75% : Avancé\n- 76-100% : Terminé"
        }
      ]
    },
    galerie: {
      title: "Gestion de la Galerie Photo",
      icon: <Image className="w-5 h-5" />,
      color: "bg-purple-500",
      items: [
        {
          question: "Comment organiser les photos dans la galerie ?",
          answer: "1. Dans 'Galerie Photo', ajoutez vos images\n2. Utilisez le champ 'Ordre' pour classer (0 = premier)\n3. Ajoutez des titres et descriptions\n4. Publiez - synchronisation automatique"
        },
        {
          question: "Quelle est la différence entre 'Publié' et 'Brouillon' ?",
          answer: "- Publié ✅ : Visible sur le site immédiatement\n- Brouillon 📝 : Sauvegardé mais non visible\n- Archive 📦 : Masqué mais conservé"
        },
        {
          question: "Comment optimiser mes images ?",
          answer: "Bonnes pratiques :\n- Résolution : 1200x800px minimum\n- Poids : Moins de 2MB\n- Format : JPG pour photos, PNG pour logos\n- Noms descriptifs et titres clairs"
        }
      ]
    },
    vehicules: {
      title: "Gestion des Véhicules",
      icon: <Car className="w-5 h-5" />,
      color: "bg-orange-500",
      items: [
        {
          question: "Comment ajouter un véhicule à vendre/louer ?",
          answer: "1. Section 'Véhicules'\n2. 'Ajouter un Véhicule'\n3. Remplissez marque, modèle, année, prix\n4. Définissez vente ou location\n5. Ajoutez photos et caractéristiques\n6. Publiez instantanément"
        },
        {
          question: "Comment gérer les demandes de vente ?",
          answer: "Les demandes apparaissent dans 'Demandes de Vente' :\n- Nouveau : À traiter\n- En cours : En négociation\n- Accepté : Validé\n- Vendu : Finalisé"
        }
      ]
    },
    contacts: {
      title: "Gestion des Contacts",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-red-500",
      items: [
        {
          question: "Comment traiter les demandes de contact ?",
          answer: "1. Onglet 'Contacts et Messages'\n2. Triez par urgence (Faible → Urgente)\n3. Changez le statut : Nouveau → En cours → Traité\n4. Ajoutez des notes internes\n5. Assignez à un collaborateur"
        },
        {
          question: "Comment prioriser les demandes ?",
          answer: "Niveaux d'urgence :\n🟢 Faible : Information générale\n🟡 Normale : Demande standard\n🟠 Haute : Client pressé\n🔴 Urgente : À traiter immédiatement"
        }
      ]
    },
    stats: {
      title: "Statistiques et Rapports",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-indigo-500",
      items: [
        {
          question: "Comment interpréter les statistiques ?",
          answer: "Dashboard principal :\n- Vues totales : Trafic global\n- Demandes : Leads générés\n- Conversions : Taux de succès\n- Tendances : Évolution mensuelle"
        },
        {
          question: "Comment exporter les données ?",
          answer: "Fonctionnalité en développement :\n- Export Excel prévu\n- Rapports automatiques\n- Tableaux de bord personnalisés"
        }
      ]
    }
  };

  const generalTips = [
    {
      title: "Synchronisation Temps Réel",
      content: "Tous vos changements apparaissent instantanément sur le site. Pas besoin d'actualiser !",
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    {
      title: "Images Optimisées",
      content: "Utilisez des images de bonne qualité (min 1200px) et compressées (max 2MB) pour un meilleur rendu",
      icon: <Lightbulb className="w-4 h-4 text-yellow-500" />
    },
    {
      title: "SEO Automatique",
      content: "Les titres et descriptions sont automatiquement optimisés pour le référencement Google",
      icon: <CheckCircle className="w-4 h-4 text-blue-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-fadem-blue" />
            Centre d'Aide - Dashboard FADEM
          </CardTitle>
          <p className="text-muted-foreground">
            Guide complet pour utiliser toutes les fonctionnalités du dashboard
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {generalTips.map((tip, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {tip.icon}
                  <h4 className="font-semibold text-sm">{tip.title}</h4>
                </div>
                <p className="text-xs text-gray-600">{tip.content}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="biens" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {Object.entries(faqData).map(([key, section]) => (
                <TabsTrigger key={key} value={key} className="flex items-center gap-1 text-xs">
                  {section.icon}
                  <span className="hidden sm:inline">{section.title.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(faqData).map(([key, section]) => (
              <TabsContent key={key} value={key} className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${section.color} text-white`}>
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {section.items.length} questions fréquentes
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {section.items.map((item, index) => (
                        <Card key={index} className="border-l-4 border-l-fadem-blue">
                          <CardContent className="p-4">
                            <Button
                              variant="ghost"
                              onClick={() => toggleSection(`${key}-${index}`)}
                              className="w-full justify-between p-0 h-auto text-left font-semibold text-fadem-blue hover:text-fadem-blue-dark"
                            >
                              {item.question}
                              {openSection === `${key}-${index}` ? 
                                <ChevronDown className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                            </Button>
                            
                            {openSection === `${key}-${index}` && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                  {item.answer}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 p-6 bg-gradient-to-r from-fadem-blue/10 to-fadem-gold/10 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-fadem-blue" />
              <h3 className="font-semibold text-fadem-blue">Besoin d'aide supplémentaire ?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Si vous ne trouvez pas la réponse à votre question, contactez l'équipe technique FADEM
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => window.open('https://wa.me/22892716641?text=Bonjour, j\'ai besoin d\'aide avec le dashboard FADEM', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Support WhatsApp
              </Button>
              <Button 
                onClick={() => window.open('tel:+22892716641', '_self')}
                variant="outline"
                className="border-fadem-blue text-fadem-blue hover:bg-fadem-blue/5"
              >
                📞 +228 92 71 66 41
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQModule;
