
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navigation = [
    { name: 'Accueil', href: '/', section: 'home' },
    { name: 'À Propos', href: '/about', section: 'about' },
    { name: 'Services', href: '/', section: 'services' },
    { name: 'Biens Immobiliers', href: '/', section: 'properties' },
    { name: 'Réalisations', href: '/', section: 'realisations' },
    { name: 'Véhicules', href: '/', section: 'vehicles' },
    { name: 'Galerie', href: '/', section: 'galerie' },
    { name: 'Contact', href: '/', section: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img 
              src="/lovable-uploads/4b4310f1-f8a0-4790-8d35-38d4cc4e6958.png" 
              alt="GROUPE FADEM SARL-U Logo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.href === '/') {
                    scrollToSection(item.section);
                  } else {
                    navigate(item.href);
                  }
                }}
                className="text-gray-700 hover:text-fadem-blue px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Boutons Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Button
                  onClick={() => navigate('/admin-dashboard')}
                  variant="outline"
                  size="sm"
                  className="border-fadem-blue text-fadem-blue hover:bg-fadem-blue hover:text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/admin')}
                className="bg-fadem-blue hover:bg-fadem-blue-dark text-white"
                size="sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menu Mobile Déroulant */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.href === '/') {
                      scrollToSection(item.section);
                    } else {
                      navigate(item.href);
                    }
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-fadem-blue hover:bg-gray-50 rounded-md"
                >
                  {item.name}
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {isAdmin ? (
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        navigate('/admin-dashboard');
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-fadem-blue text-fadem-blue hover:bg-fadem-blue hover:text-white"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/admin');
                      setIsOpen(false);
                    }}
                    className="w-full bg-fadem-blue hover:bg-fadem-blue-dark text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
