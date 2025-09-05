
-- Corriger la fonction pour utiliser p_username au lieu de p_identifier
DROP FUNCTION IF EXISTS public.verify_admin_credentials(text, text);

-- Créer la fonction avec le bon nom de paramètre attendu par TypeScript
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
  WHERE (a.username = p_username OR a.email = p_username)
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
