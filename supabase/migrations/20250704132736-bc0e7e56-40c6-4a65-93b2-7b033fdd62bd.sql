
-- Insérer l'administrateur principal avec les identifiants fournis
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
  'Admin',
  crypt('228@Fademgroupe', gen_salt('bf')),
  'super_admin'
);

-- Fonction pour vérifier les identifiants admin
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

-- Activer l'extension pgcrypto si pas déjà fait
CREATE EXTENSION IF NOT EXISTS pgcrypto;
