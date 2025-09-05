
-- Supprimer l'ancienne fonction avec tous ses variants
DROP FUNCTION IF EXISTS public.verify_admin_credentials(text, text);
DROP FUNCTION IF EXISTS public.verify_admin_credentials(character varying, character varying);

-- Créer la fonction finale avec les bons paramètres
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  p_identifier TEXT,
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
  WHERE (a.username = p_identifier OR a.email = p_identifier)
    AND a.password_hash = crypt(p_password, a.password_hash);
END;
$$;

-- S'assurer que l'admin principal existe avec les bons identifiants
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
  crypt('Fadem2024@@', gen_salt('bf')),
  'super_admin'
) ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;
