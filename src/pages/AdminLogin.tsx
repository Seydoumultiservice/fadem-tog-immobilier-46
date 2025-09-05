
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, LogIn, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { verifyAdminSession } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Vérification sécurisée des identifiants
      if (username === 'AdminFadem' && password === 'Fadem2024!Admin') {
        const sessionData = {
          username: 'AdminFadem',
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          loginTime: new Date().toISOString(),
          nom: 'FADEM',
          prenom: 'Admin',
          role: 'super_admin'
        };

        localStorage.setItem('fadem_admin_session', JSON.stringify(sessionData));
        
        toast({
          title: "🎉 Connexion réussie",
          description: "Bienvenue dans le dashboard administrateur FADEM",
        });

        navigate('/admin/dashboard');
      } else {
        toast({
          title: "❌ Accès refusé",
          description: "Identifiants incorrects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si déjà connecté
  React.useEffect(() => {
    if (verifyAdminSession()) {
      navigate('/admin/dashboard');
    }
  }, [verifyAdminSession, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fadem-blue/10 to-fadem-gold/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-fadem-blue to-fadem-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-fadem-blue">
            Administration FADEM
          </CardTitle>
          <p className="text-muted-foreground">
            Accès sécurisé au dashboard administrateur
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                required
                disabled={loading}
                className="transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  disabled={loading}
                  className="pr-10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-fadem-blue hover:bg-fadem-blue-dark text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Accès sécurisé</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Seuls les administrateurs autorisés peuvent accéder à cette zone
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-fadem-blue hover:text-fadem-blue-dark"
            >
              ← Retour au site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
