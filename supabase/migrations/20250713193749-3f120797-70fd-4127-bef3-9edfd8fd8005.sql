
-- Mettre à jour le mot de passe admin avec le bon caractère
UPDATE public.admins 
SET password_hash = crypt('Fadem2024@@', gen_salt('bf'))
WHERE username = 'AdminFadem';

-- Vérifier que la mise à jour s'est bien passée
SELECT username, email, nom, role FROM public.admins WHERE username = 'AdminFadem';
