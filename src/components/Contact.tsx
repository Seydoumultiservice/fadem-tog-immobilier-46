import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [rateLimitCount, setRateLimitCount] = useState(0);

  // Fonction de nettoyage et validation des entrées
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>\"']/g, '');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Protection contre le spam (rate limiting basique)
    if (rateLimitCount >= 3) {
      toast.error('Trop de tentatives. Veuillez attendre avant de renvoyer un message.');
      return;
    }

    // Validation et nettoyage des données
    const sanitizedData = {
      nom: sanitizeInput(formData.nom),
      email: sanitizeInput(formData.email),
      telephone: sanitizeInput(formData.telephone),
      sujet: sanitizeInput(formData.sujet),
      message: sanitizeInput(formData.message)
    };

    // Validations
    if (!sanitizedData.nom || sanitizedData.nom.length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères.');
      return;
    }

    if (!validateEmail(sanitizedData.email)) {
      toast.error('Veuillez saisir une adresse email valide.');
      return;
    }

    if (sanitizedData.telephone && !validatePhone(sanitizedData.telephone)) {
      toast.error('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    if (!sanitizedData.sujet || sanitizedData.sujet.length < 5) {
      toast.error('Le sujet doit contenir au moins 5 caractères.');
      return;
    }

    if (!sanitizedData.message || sanitizedData.message.length < 10) {
      toast.error('Le message doit contenir au moins 10 caractères.');
      return;
    }

    if (sanitizedData.message.length > 1000) {
      toast.error('Le message ne peut pas dépasser 1000 caractères.');
      return;
    }

    setLoading(true);
    setRateLimitCount(prev => prev + 1);

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert([{
          nom: sanitizedData.nom,
          email: sanitizedData.email,
          telephone: sanitizedData.telephone || null,
          sujet: sanitizedData.sujet,
          message: sanitizedData.message,
          statut: 'nouveau'
        }]);

      if (error) {
        console.error('Erreur lors de l\'envoi:', error);
        throw error;
      }

      toast.success('Message envoyé avec succès ! Nous vous contacterons bientôt.');
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' });
      
      // Réinitialiser le compteur de rate limiting après succès
      setTimeout(() => setRateLimitCount(0), 300000); // 5 minutes
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = "Bonjour Groupe FADEM ! Je souhaite obtenir des informations sur vos services. Merci !";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/22891005317?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-fadem-blue to-fadem-blue-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Contactez-nous
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans vos projets immobiliers et de construction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 mx-auto mb-4 text-fadem-gold" />
                  <h3 className="font-semibold mb-2">Téléphone</h3>
                  <p className="text-sm">Direction</p>
                  <p className="font-semibold">+228 91 00 53 17</p>
                  <p className="text-sm mt-2">Secrétariat</p>
                  <p className="font-semibold">+228 92 71 66 41</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-4 text-fadem-gold" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm">contact@groupefadem.tech</p>
                  <p className="text-sm">info@groupefadem.tech</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-4 text-fadem-gold" />
                  <h3 className="font-semibold mb-2">Adresse</h3>
                  <p className="text-sm">Lomé, Togo</p>
                  <p className="text-sm">Quartier d'affaires</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-4 text-fadem-gold" />
                  <h3 className="font-semibold mb-2">Horaires</h3>
                  <p className="text-sm">Lun - Ven: 8h - 18h</p>
                  <p className="text-sm">Sam: 8h - 14h</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Discuter sur WhatsApp
              </Button>
            </div>
          </div>

          {/* Formulaire de contact sécurisé */}
          <Card className="bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-fadem-blue text-center">
                Envoyez-nous un message
              </CardTitle>
              <p className="text-sm text-center text-gray-600">
                🔒 Formulaire sécurisé - Vos données sont protégées
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Nom complet *"
                      value={formData.nom}
                      onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                      required
                      maxLength={100}
                      className="border-gray-300 focus:border-fadem-blue"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      maxLength={100}
                      className="border-gray-300 focus:border-fadem-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Téléphone"
                      value={formData.telephone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                      maxLength={20}
                      className="border-gray-300 focus:border-fadem-blue"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Sujet *"
                      value={formData.sujet}
                      onChange={(e) => setFormData(prev => ({ ...prev, sujet: e.target.value }))}
                      required
                      maxLength={200}
                      className="border-gray-300 focus:border-fadem-blue"
                    />
                  </div>
                </div>

                <div>
                  <Textarea
                    placeholder="Votre message *"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={5}
                    maxLength={1000}
                    className="border-gray-300 focus:border-fadem-blue resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/1000 caractères
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || rateLimitCount >= 3}
                  className="w-full bg-fadem-gold hover:bg-fadem-gold-light text-fadem-blue font-semibold py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fadem-blue mr-3"></div>
                      Envoi sécurisé...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Envoyer le message
                    </>
                  )}
                </Button>

                {rateLimitCount > 0 && (
                  <p className="text-xs text-orange-600 text-center">
                    {rateLimitCount}/3 tentatives utilisées
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
