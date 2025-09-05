
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import FloatingCallButton from '@/components/FloatingCallButton';
import SecretariatButton from '@/components/SecretariatButton';

const GalleryPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page principale avec l'ancre galerie
    navigate('/#galerie', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <Gallery />
      <Footer />
      <FloatingCallButton />
      <SecretariatButton />
    </div>
  );
};

export default GalleryPage;
