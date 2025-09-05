
-- Supprimer et recréer complètement la table des admins
DROP TABLE IF EXISTS public.admins CASCADE;

-- Créer la table admins avec la bonne structure
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.verify_admin_credentials(text, text);

-- Créer la nouvelle fonction de vérification
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  p_username TEXT,
  p_password TEXT
)
RETURNS TABLE(
  id UUID,
  username TEXT,
  email TEXT,
  nom TEXT,
  prenom TEXT,
  role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.username,
    a.email,
    a.nom,
    a.prenom,
    a.role
  FROM public.admins a
  WHERE a.username = p_username
    AND a.password_hash = crypt(p_password, a.password_hash);
END;
$$;

-- Insérer l'administrateur principal avec les identifiants corrects
INSERT INTO public.admins (
  username, 
  email, 
  nom, 
  prenom, 
  password_hash, 
  role
) VALUES (
  'AdminFadem',
  'admin@groupefadem.com',
  'FADEM',
  'Administrateur',
  crypt('Fadem2024!', gen_salt('bf')),
  'super_admin'
);

-- Vérifier que l'admin est bien créé
SELECT username, email, nom, role FROM public.admins;
