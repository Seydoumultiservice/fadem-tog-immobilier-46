
import React from 'react';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import About from '@/components/About';
import Services from '@/components/Services';
import Properties from '@/components/Properties';
import Realisations from '@/components/Realisations';
import FurnishedApartments from '@/components/FurnishedApartments';
import Vehicles from '@/components/Vehicles';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingCallButton from '@/components/FloatingCallButton';
import SecretariatButton from '@/components/SecretariatButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <About />
      <Services />
      <Properties />
      <Realisations />
      <FurnishedApartments />
      <Vehicles />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingCallButton />
      <SecretariatButton />
    </div>
  );
};

export default Index;
