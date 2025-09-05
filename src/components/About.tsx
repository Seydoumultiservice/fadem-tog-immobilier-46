
import React from 'react';
import { Button } from '@/components/ui/button';
import { Award, Users, Target, ArrowRight } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-fadem-blue">
                À propos de
                <span className="block text-fadem-red">Groupe FADEM</span>
              </h2>
              <div className="w-24 h-1 bg-fadem-gold rounded-full"></div>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <strong className="text-fadem-blue">Groupe FADEM SARL-U</strong> est une entreprise togolaise de référence, spécialisée dans la construction, l'immobilier et les services multiples depuis sa création.
              </p>
              
              <p>
                Nous nous distinguons par notre expertise technique, notre approche client personnalisée et notre engagement à fournir des solutions de qualité supérieure. Notre équipe de professionnels qualifiés accompagne chaque projet avec rigueur et passion.
              </p>

              <div className="bg-fadem-blue/5 p-6 rounded-xl border-l-4 border-fadem-gold">
                <p className="text-fadem-blue font-medium italic">
                  "Notre mission est de transformer vos projets en réalités durables, en alliant savoir-faire traditionnel et innovations modernes."
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-fadem-red mb-2">150+</div>
                <div className="text-sm text-gray-600">Projets réalisés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-fadem-blue mb-2">10+</div>
                <div className="text-sm text-gray-600">Années d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-fadem-gold mb-2">100%</div>
                <div className="text-sm text-gray-600">Satisfaction client</div>
              </div>
            </div>

            {/* Valeurs */}
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-fadem-blue">Nos Valeurs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <Award className="w-8 h-8 text-fadem-gold flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-fadem-blue">Excellence</h4>
                    <p className="text-sm text-gray-600">Qualité irréprochable</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <Users className="w-8 h-8 text-fadem-red flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-fadem-blue">Proximité</h4>
                    <p className="text-sm text-gray-600">Relation client privilégiée</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <Target className="w-8 h-8 text-fadem-blue flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-fadem-blue">Innovation</h4>
                    <p className="text-sm text-gray-600">Solutions modernes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-fadem-blue hover:bg-fadem-blue-dark text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contactez-nous
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-fadem-gold text-fadem-blue hover:bg-fadem-gold hover:text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('realisations')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Nos réalisations
              </Button>
            </div>
          </div>

          {/* Image et logo */}
          <div className="relative">
            {/* Image de l'entreprise */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/lovable-uploads/baf4fa9f-b4a9-46b9-8143-ed778cbe7c12.png" 
                alt="Services BTP Groupe FADEM - Construction et travaux"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fadem-blue/20 to-transparent"></div>
            </div>

            {/* Logo animé flottant */}
            <div className="absolute -bottom-8 -right-8 lg:-right-12">
              <div className="bg-white rounded-full p-4 shadow-2xl">
                <AnimatedLogo className="w-24 h-24 lg:w-32 lg:h-32" />
              </div>
            </div>

            {/* Éléments décoratifs */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-fadem-gold/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-8 w-32 h-32 bg-fadem-red/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
