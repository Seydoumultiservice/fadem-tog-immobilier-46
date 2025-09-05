
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '@/components/AdminPanel';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, User, Clock, Settings, Home, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { isAdmin, adminData, verifyAdminSession, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = () => {
    console.log('🔍 Vérification des accès dashboard admin');
    
    const hasValidSession = verifyAdminSession();
    
    if (!hasValidSession) {
      console.log('❌ Accès non autorisé au dashboard');
      toast({
        title: "🔒 Accès refusé",
        description: "Connexion requise pour accéder au dashboard",
        variant: "destructive",
      });
      navigate('/admin');
      return;
    }

    console.log('✅ Accès autorisé au dashboard admin');
    toast({
      title: "👋 Accès autorisé",
      description: `Bienvenue ${adminData?.prenom} ${adminData?.nom}`,
    });
    
    setLoading(false);
  };

  const handleSecureLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la redirection même en cas d'erreur
      window.location.href = '/admin';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fadem-blue/10 to-fadem-gold/10">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-fadem-blue to-fadem-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-fadem-blue mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-fadem-blue mb-2">Vérification sécurisée</h3>
            <p className="text-muted-foreground">Validation des accès administrateur...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin || !adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fadem-blue/10 to-fadem-gold/10">
        <Card className="w-full max-w-md shadow-2xl border-red-200">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Accès non autorisé</h3>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas les privilèges nécessaires pour accéder à cette zone.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-fadem-blue hover:bg-fadem-blue-dark flex-1"
              >
                <Shield className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sécurisé du dashboard */}
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-fadem-blue to-fadem-gold rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-fadem-blue truncate">
                Dashboard Admin FADEM - Sécurisé
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-fadem-blue truncate">
                    {adminData?.prenom} {adminData?.nom}
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {adminData?.role === 'super_admin' ? 'Super Admin' : adminData?.role}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">
                    Session: {new Date(adminData?.loginTime).toLocaleTimeString('fr-FR')}
                  </span>
                  <span className="sm:hidden">Connecté</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-xs">Session sécurisée</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-fadem-blue/20 text-fadem-blue hover:bg-fadem-blue/5 flex-1 sm:flex-none"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Site</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast({
                title: "⚙️ Paramètres",
                description: "Fonctionnalité en développement",
              })}
              className="border-fadem-blue/20 text-fadem-blue hover:bg-fadem-blue/5 flex-1 sm:flex-none"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Paramètres</span>
            </Button>
            <Button 
              onClick={handleSecureLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Panel admin principal avec vérification de sécurité */}
      <AdminPanel onClose={handleSecureLogout} />
    </div>
  );
};

export default AdminDashboard;
