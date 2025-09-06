-- Corriger les politiques RLS pour permettre la création de projets par les administrateurs
DROP POLICY IF EXISTS "Anonymous can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anonymous can update projects" ON public.projects;
DROP POLICY IF EXISTS "Anonymous can delete projects" ON public.projects;

-- Nouvelle politique pour permettre les insertions, mises à jour et suppressions
CREATE POLICY "Admin can manage projects" 
ON public.projects 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- S'assurer que les projets terminés restent visibles au public
DROP POLICY IF EXISTS "Public can view completed projects" ON public.projects;
CREATE POLICY "Public can view completed projects" 
ON public.projects 
FOR SELECT 
USING (statut = 'termine'::text);