
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Quote, Plus, X, MessageCircle, Phone, Globe, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  client_nom: string;
  client_email?: string;
  contenu: string;
  service?: string;
  note?: number;
  statut?: string;
  pays?: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client_nom: '',
    client_email: '',
    contenu: '',
    service: '',
    note: 5,
    pays: ''
  });
  const { toast } = useToast();

  // Témoignages par défaut avec des noms simples et ordinaires
  const defaultTestimonials = [
    {
      id: '1',
      client_nom: 'Marie Lomé',
      client_email: 'marie@email.tg',
      contenu: 'Excellent service ! J\'ai trouvé mon appartement parfait à Lomé grâce à Groupe FADEM. Très professionnel et rapide.',
      service: 'immobilier',
      note: 5,
      statut: 'approuve'
    },
    {
      id: '2',
      client_nom: 'Jean Kara',
      client_email: 'jean@email.tg',
      contenu: 'Ma maison à Kara a été construite parfaitement. Équipe sérieuse et travail de qualité. Je recommande !',
      service: 'btp',
      note: 5,
      statut: 'approuve'
    },
    {
      id: '3',
      client_nom: 'Fatou Sokodé',
      client_email: 'fatou@email.tg',
      contenu: 'Gérance de mes biens impeccable. Aucun souci depuis 2 ans. Service client excellent !',
      service: 'gerance',
      note: 5,
      statut: 'approuve'
    },
    {
      id: '4',
      client_nom: 'Paul Aneho',
      client_email: 'paul@email.tg',
      contenu: 'Bureau rénové à Aneho avec un résultat magnifique. Travail soigné et dans les délais.',
      service: 'btp',
      note: 4,
      statut: 'approuve'
    },
    {
      id: '5',
      client_nom: 'Awa Dapaong',
      client_email: 'awa@email.tg',
      contenu: 'Villa construite à Dapaong dépassant toutes mes attentes. Finitions parfaites !',
      service: 'btp',
      note: 5,
      statut: 'approuve'
    },
    {
      id: '6',
      client_nom: 'Pierre Lomé',
      client_email: 'pierre@email.tg',
      contenu: 'Location d\'appartement meublé parfait pour mon séjour à Lomé. Tout était nickel !',
      service: 'immobilier',
      note: 5,
      statut: 'approuve'
    },
    // Témoignages de la diaspora
    {
      id: '7',
      client_nom: 'Koffi France',
      client_email: 'koffi@email.fr',
      contenu: 'Depuis Paris, j\'ai fait construire ma maison à Lomé. Suivi vidéo chaque semaine, transparence totale. Groupe FADEM a respecté chaque détail !',
      service: 'diaspora',
      note: 5,
      statut: 'approuve',
      pays: 'France'
    },
    {
      id: '8',
      client_nom: 'Ama USA',
      client_email: 'ama@email.us',
      contenu: 'De New York, j\'ai acheté un terrain et fait construire. L\'équipe m\'a accompagnée du début à la fin. Service exceptionnel !',
      service: 'diaspora',
      note: 5,
      statut: 'approuve',
      pays: 'États-Unis'
    },
    {
      id: '9',
      client_nom: 'Kofi UK',
      client_email: 'kofi@email.uk',
      contenu: 'Depuis Londres, projet géré parfaitement. Photos et vidéos régulières, budget respecté. Je recommande vivement !',
      service: 'diaspora',
      note: 5,
      statut: 'approuve',
      pays: 'Royaume-Uni'
    },
    {
      id: '10',
      client_nom: 'Akossi Allemagne',
      client_email: 'akossi@email.de',
      contenu: 'Villa construite à Kara depuis Berlin. Équipe professionnelle, suivi excellent. Merci Groupe FADEM !',
      service: 'diaspora',
      note: 5,
      statut: 'approuve',
      pays: 'Allemagne'
    },
    {
      id: '11',
      client_nom: 'Edem Canada',
      client_email: 'edem@email.ca',
      contenu: 'Depuis Toronto, j\'ai investi dans l\'immobilier togolais. Service diaspora parfait, accompagnement total !',
      service: 'diaspora',
      note: 5,
      statut: 'approuve',
      pays: 'Canada'
    }
  ];

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('statut', 'approuve')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setTestimonials(defaultTestimonials);
      } else {
        setTestimonials([...defaultTestimonials, ...data]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      setTestimonials(defaultTestimonials);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          ...formData,
          statut: 'en_attente'
        }]);

      if (error) throw error;

      toast({
        title: "✅ Avis soumis",
        description: "Votre avis a été soumis et sera publié après validation.",
      });

      setFormData({
        client_nom: '',
        client_email: '',
        contenu: '',
        service: '',
        note: 5,
        pays: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la soumission de votre avis.",
        variant: "destructive",
      });
    }
  };

  const handleDiasporaWhatsApp = () => {
    const message = encodeURIComponent("Bonjour ! Je suis membre de la diaspora togolaise et j'aimerais partager mon expérience avec les services de Groupe FADEM. Pouvez-vous m'aider à témoigner ?");
    const phoneNumber = "22892716641";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current animate-pulse' : 'text-gray-300'}`}
      />
    ));
  };

  // Séparer les témoignages locaux et diaspora
  const localTestimonials = testimonials.filter(t => !t.pays);
  const diasporaTestimonials = testimonials.filter(t => t.pays);

  return (
    <section id="temoignages" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-16 w-36 h-36 bg-fadem-gold rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-fadem-blue rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-fadem-gold rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl font-bold text-fadem-blue mb-4 hover:scale-105 transition-transform duration-300">
            Témoignages de nos Clients
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez ce que nos clients pensent de nos services
          </p>
          
          {/* Appels à l'action multiples */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-fadem-gold hover:bg-fadem-gold-light text-fadem-blue font-semibold hover:scale-105 transition-all duration-300 animate-pulse"
            >
              <Plus className="w-4 h-4 mr-2" />
              Laisser un Avis
            </Button>
            
            <Button 
              onClick={handleDiasporaWhatsApp}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              <Globe className="w-4 h-4 mr-2" />
              Vous êtes de la Diaspora ? Témoignez !
            </Button>
            
            <Button 
              onClick={() => window.open('tel:+22892716641', '_self')}
              variant="outline"
              className="border-fadem-blue text-fadem-blue hover:bg-fadem-blue hover:text-white hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              Appeler pour témoigner
            </Button>
          </div>
        </div>

        {/* Section Témoignages Diaspora */}
        {diasporaTestimonials.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-fadem-gold mr-3 animate-pulse" />
                <h3 className="font-serif text-3xl font-bold text-fadem-blue">
                  Témoignages de la Diaspora
                </h3>
                <Heart className="w-8 h-8 text-red-500 ml-3 animate-pulse" />
              </div>
              <p className="text-lg text-gray-600">
                Nos clients de la diaspora togolaise partagent leur expérience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {diasporaTestimonials.slice(0, 6).map((testimonial, index) => (
                <Card 
                  key={testimonial.id} 
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in group hover:-rotate-1 border-2 border-fadem-gold/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Quote className="w-8 h-8 text-fadem-gold mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      <div className="flex">
                        {renderStars(testimonial.note || 5)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 italic group-hover:text-gray-900 transition-colors duration-300">
                      "{testimonial.contenu}"
                    </p>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-fadem-blue group-hover:text-fadem-gold transition-colors duration-300">
                            {testimonial.client_nom}
                          </p>
                          {testimonial.service && (
                            <p className="text-sm text-gray-500 capitalize">
                              Service {testimonial.service}
                            </p>
                          )}
                        </div>
                        {testimonial.pays && (
                          <div className="flex items-center text-sm text-fadem-gold font-semibold">
                            <Globe className="w-4 h-4 mr-1" />
                            {testimonial.pays}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA spécial diaspora */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 via-fadem-blue to-fadem-gold p-8 rounded-2xl text-white animate-fade-in shadow-2xl">
                <Globe className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-4">Diaspora Togolaise : Partagez votre Expérience !</h3>
                <p className="text-lg mb-6">Vous avez fait appel à nos services depuis l'étranger ? Aidez d'autres membres de la diaspora</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleDiasporaWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold hover:scale-110 transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Témoigner via WhatsApp
                  </Button>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-white text-fadem-blue hover:bg-gray-100 font-semibold hover:scale-110 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Écrire un témoignage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Témoignages Locaux */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl font-bold text-fadem-blue mb-4">
              Témoignages Locaux
            </h3>
            <p className="text-lg text-gray-600">
              Nos clients au Togo partagent leur satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {localTestimonials.slice(0, 6).map((testimonial, index) => (
              <Card 
                key={testimonial.id} 
                className="hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in group hover:-rotate-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-fadem-gold mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="flex">
                      {renderStars(testimonial.note || 5)}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic group-hover:text-gray-900 transition-colors duration-300">
                    "{testimonial.contenu}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-fadem-blue group-hover:text-fadem-gold transition-colors duration-300">
                      {testimonial.client_nom}
                    </p>
                    {testimonial.service && (
                      <p className="text-sm text-gray-500 capitalize">
                        Service {testimonial.service}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Appel à l'action final */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-fadem-blue to-fadem-gold p-8 rounded-2xl text-white animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Vous aussi, partagez votre expérience !</h3>
            <p className="text-lg mb-6">Aidez d'autres clients à nous découvrir</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-white text-fadem-blue hover:bg-gray-100 font-semibold hover:scale-110 transition-all duration-300"
              >
                Écrire un témoignage
              </Button>
              <Button 
                onClick={() => window.open('https://diaspora.groupefadem.tech', '_blank')}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-fadem-blue hover:scale-110 transition-all duration-300"
              >
                Découvrir l'Espace Diaspora
              </Button>
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout d'avis */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="w-full max-w-md animate-scale-in">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-xl font-bold text-fadem-blue">
                    Laisser un Avis
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="hover:scale-110 transition-transform">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <Input
                      value={formData.client_nom}
                      onChange={(e) => setFormData(prev => ({ ...prev, client_nom: e.target.value }))}
                      required
                      placeholder="Ex: Koffi France"
                      className="hover:border-fadem-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email (optionnel)</label>
                    <Input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                      placeholder="votre@email.com"
                      className="hover:border-fadem-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Pays (si diaspora)</label>
                    <Input
                      value={formData.pays}
                      onChange={(e) => setFormData(prev => ({ ...prev, pays: e.target.value }))}
                      placeholder="Ex: France, États-Unis, Canada..."
                      className="hover:border-fadem-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Service utilisé</label>
                    <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                      <SelectTrigger className="hover:border-fadem-gold transition-colors">
                        <SelectValue placeholder="Sélectionner un service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immobilier">Immobilier</SelectItem>
                        <SelectItem value="btp">BTP/Construction</SelectItem>
                        <SelectItem value="gerance">Gérance Locative</SelectItem>
                        <SelectItem value="vehicules">Véhicules</SelectItem>
                        <SelectItem value="diaspora">Service Diaspora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Note</label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 cursor-pointer hover:scale-125 transition-transform ${i < formData.note ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          onClick={() => setFormData(prev => ({ ...prev, note: i + 1 }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Votre avis</label>
                    <Textarea
                      value={formData.contenu}
                      onChange={(e) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
                      required
                      placeholder="Partagez votre expérience avec nous..."
                      rows={4}
                      className="hover:border-fadem-gold transition-colors"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-fadem-blue hover:bg-fadem-gold hover:text-fadem-blue transition-all duration-300 hover:scale-105">
                    Soumettre l'Avis
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
