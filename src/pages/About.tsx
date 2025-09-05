
import React from 'react';
import { ArrowLeft, Users, Award, Target, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Eye className="w-8 h-8 text-fadem-gold" />,
      title: "Notre Vision",
      description: "Être le leader du marché immobilier et BTP au Togo, reconnu pour notre excellence et notre innovation."
    },
    {
      icon: <Target className="w-8 h-8 text-fadem-gold" />,
      title: "Notre Mission",
      description: "Accompagner nos clients dans leurs projets immobiliers avec professionnalisme et transparence."
    },
    {
      icon: <Heart className="w-8 h-8 text-fadem-gold" />,
      title: "Nos Valeurs",
      description: "Intégrité, Excellence, Innovation et Satisfaction client sont au cœur de notre démarche."
    }
  ];

  const team = [
    {
      name: "Direction Générale",
      role: "Leadership & Stratégie",
      image: "/lovable-uploads/8ab4fdca-37dc-441b-aebe-aee42fe5c4e6.png"
    },
    {
      name: "Équipe Commerciale",
      role: "Ventes & Relations Client",
      image: "/lovable-uploads/09c437d5-9b16-45fa-ab93-c9656e8e6b23.png"
    },
    {
      name: "Équipe Technique",
      role: "Construction & Rénovation",
      image: "/lovable-uploads/0d0f09d4-82ca-4e87-8245-5dd69bf4d4f6.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-fadem-blue text-white">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-8 text-white hover:text-fadem-gold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <div className="max-w-4xl">
              <h1 className="font-serif text-5xl font-bold mb-6">
                À Propos du Groupe FADEM
              </h1>
              <p className="text-xl leading-relaxed">
                Depuis notre création, le Groupe FADEM s'est imposé comme un acteur 
                incontournable du secteur immobilier et BTP au Togo. Notre expertise 
                couvre l'ensemble de la chaîne immobilière : de la construction à la 
                gérance locative, en passant par la vente et la location de biens.
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-4xl font-bold text-fadem-blue mb-6">
                  Notre Histoire
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Le Groupe FADEM Sarl-U a été fondé avec une vision claire : 
                    révolutionner le marché immobilier togolais en apportant 
                    professionnalisme, transparence et innovation.
                  </p>
                  <p>
                    Nos années d'expérience nous ont permis de développer une 
                    expertise reconnue dans trois domaines clés : l'immobilier, 
                    le BTP et la gérance locative.
                  </p>
                  <p>
                    Aujourd'hui, nous sommes fiers d'avoir accompagné des centaines 
                    de clients dans la réalisation de leurs projets immobiliers, 
                    des particuliers aux grandes entreprises.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src="/lovable-uploads/4d062b92-8af0-402f-a250-7626bf02b286.png"
                  alt="Groupe FADEM"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision, Mission, Values */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-fadem-blue mb-4">
                Nos Principes Fondamentaux
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-fadem-blue mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-fadem-blue mb-4">
                Notre Équipe
              </h2>
              <p className="text-xl text-gray-600">
                Des professionnels expérimentés à votre service
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6 text-center">
                    <h3 className="font-serif text-xl font-bold text-fadem-blue mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-20 bg-fadem-blue text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">
                Nos Réalisations en Chiffres
              </h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-fadem-gold mb-2">500+</div>
                <p>Biens Vendus/Loués</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-fadem-gold mb-2">150+</div>
                <p>Projets BTP Réalisés</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-fadem-gold mb-2">300+</div>
                <p>Biens en Gérance</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-fadem-gold mb-2">98%</div>
                <p>Clients Satisfaits</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl font-bold text-fadem-blue mb-6">
              Prêt à Commencer Votre Projet ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins
            </p>
            <Button 
              onClick={() => navigate('/#contact')}
              className="bg-fadem-gold hover:bg-fadem-gold-dark text-fadem-blue text-lg px-8 py-3"
            >
              Nous Contacter
            </Button>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
