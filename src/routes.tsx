
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import GalleryPage from '@/pages/GalleryPage';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/admin',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
  },
  // Routes pour la galerie
  {
    path: '/galerie',
    element: <GalleryPage />,
  },
  {
    path: '/gallery',
    element: <GalleryPage />,
  },
  // Routes pour les autres sections (redirection vers l'accueil avec ancre)
  {
    path: '/biens',
    element: <Index />,
  },
  {
    path: '/properties',
    element: <Index />,
  },
  {
    path: '/immobilier',
    element: <Index />,
  },
  {
    path: '/realisations',
    element: <Index />,
  },
  {
    path: '/projets',
    element: <Index />,
  },
  {
    path: '/btp',
    element: <Index />,
  },
  {
    path: '/services',
    element: <Index />,
  },
  {
    path: '/nos-services',
    element: <Index />,
  },
  {
    path: '/appartements-meubles',
    element: <Index />,
  },
  {
    path: '/furnished-apartments',
    element: <Index />,
  },
  {
    path: '/vehicules',
    element: <Index />,
  },
  {
    path: '/vehicles',
    element: <Index />,
  },
  {
    path: '/gerance',
    element: <Index />,
  },
  {
    path: '/property-management',
    element: <Index />,
  },
  {
    path: '/temoignages',
    element: <Index />,
  },
  {
    path: '/testimonials',
    element: <Index />,
  },
  {
    path: '/contact',
    element: <Index />,
  },
  {
    path: '/contactez-nous',
    element: <Index />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
