
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Gestion des routes avec anchors pour rediriger vers les sections
    const handleRouteWithHash = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // Si on est sur une route qui correspond à une section, rediriger vers l'accueil avec l'anchor
      const sectionRoutes = [
        '/biens', '/properties', '/immobilier',
        '/realisations', '/projets', '/btp',
        '/services', '/nos-services',
        '/galerie', '/gallery',
        '/appartements-meubles', '/furnished-apartments',
        '/vehicules', '/vehicles',
        '/gerance', '/property-management',
        '/temoignages', '/testimonials',
        '/contact', '/contactez-nous'
      ];
      
      if (sectionRoutes.includes(path)) {
        const sectionMap: { [key: string]: string } = {
          '/biens': '#biens',
          '/properties': '#biens',
          '/immobilier': '#biens',
          '/realisations': '#realisations',
          '/projets': '#realisations',
          '/btp': '#realisations',
          '/services': '#services',
          '/nos-services': '#services',
          '/galerie': '#galerie',
          '/gallery': '#galerie',
          '/appartements-meubles': '#appartements',
          '/furnished-apartments': '#appartements',
          '/vehicules': '#vehicules',
          '/vehicles': '#vehicules',
          '/gerance': '#gerance',
          '/property-management': '#gerance',
          '/temoignages': '#temoignages',
          '/testimonials': '#temoignages',
          '/contact': '#contact',
          '/contactez-nous': '#contact'
        };
        
        const targetHash = sectionMap[path];
        if (targetHash && window.location.pathname !== '/') {
          window.history.replaceState({}, '', `/${targetHash}`);
          
          // Attendre que la page se charge puis scroller vers la section
          setTimeout(() => {
            const element = document.querySelector(targetHash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
      
      // Si on a un hash sur la page d'accueil, scroller vers la section
      if (path === '/' && hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };
    
    handleRouteWithHash();
    
    // Écouter les changements de route
    window.addEventListener('popstate', handleRouteWithHash);
    
    return () => {
      window.removeEventListener('popstate', handleRouteWithHash);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
