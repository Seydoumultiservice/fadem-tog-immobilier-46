
-- Mettre à jour la fonction pour accepter username OU email
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
