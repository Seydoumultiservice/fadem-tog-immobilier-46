
-- Supprimer l'ancienne fonction et recréer avec la bonne structure
DROP FUNCTION IF EXISTS public.verify_admin_credentials(text, text);

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

-- S'assurer que l'administrateur principal existe avec vos identifiants exacts
DELETE FROM public.admins WHERE username = 'AdminFadem';

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
);

-- Vérifier que l'admin a bien été créé
SELECT username, email, nom, role FROM public.admins WHERE username = 'AdminFadem';
