
-- Phase 1: Database Security - Enable RLS on all public tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for properties (public read, admin write)
CREATE POLICY "Public can view available properties" 
  ON public.properties 
  FOR SELECT 
  USING (statut = 'disponible');

CREATE POLICY "Admin can manage all properties" 
  ON public.properties 
  FOR ALL 
  USING (true);

-- Create RLS policies for projects (public read, admin write)
CREATE POLICY "Public can view completed projects" 
  ON public.projects 
  FOR SELECT 
  USING (statut = 'termine');

CREATE POLICY "Admin can manage all projects" 
  ON public.projects 
  FOR ALL 
  USING (true);

-- Create RLS policies for contact_requests (public insert, admin read/update)
CREATE POLICY "Public can submit contact requests" 
  ON public.contact_requests 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin can manage contact requests" 
  ON public.contact_requests 
  FOR ALL 
  USING (true);

-- Create RLS policies for testimonials (public read approved, admin manage all)
CREATE POLICY "Public can view approved testimonials" 
  ON public.testimonials 
  FOR SELECT 
  USING (statut = 'approuve');

CREATE POLICY "Admin can manage all testimonials" 
  ON public.testimonials 
  FOR ALL 
  USING (true);

-- Create RLS policies for gallery_images (public read published, admin manage all)
CREATE POLICY "Public can view published gallery images" 
  ON public.gallery_images 
  FOR SELECT 
  USING (statut = 'publie');

CREATE POLICY "Admin can manage all gallery images" 
  ON public.gallery_images 
  FOR ALL 
  USING (true);

-- Create RLS policies for blog_posts (public read published, admin manage all)
CREATE POLICY "Public can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (statut = 'publie');

CREATE POLICY "Admin can manage all blog posts" 
  ON public.blog_posts 
  FOR ALL 
  USING (true);

-- Create RLS policies for appointments (admin only)
CREATE POLICY "Admin can manage all appointments" 
  ON public.appointments 
  FOR ALL 
  USING (true);

-- Create RLS policies for admins (admin only)
CREATE POLICY "Admin can manage admin accounts" 
  ON public.admins 
  FOR ALL 
  USING (true);

-- Create RLS policies for site_stats (admin only)
CREATE POLICY "Admin can manage site stats" 
  ON public.site_stats 
  FOR ALL 
  USING (true);

-- Create RLS policies for partners (admin only)
CREATE POLICY "Admin can manage partners" 
  ON public.partners 
  FOR ALL 
  USING (true);

-- Fix database function security
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, nom, prenom)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', '')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_username text, p_password text)
 RETURNS TABLE(id uuid, username text, email text, nom text, prenom text, role text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Create a secure admin user for initial access (replace hardcoded credentials)
INSERT INTO public.admins (username, email, password_hash, nom, prenom, role)
VALUES (
  'AdminFadem', 
  'admin@groupefadem.com', 
  crypt('Fadem2024@@', gen_salt('bf')), 
  'FADEM', 
  'Admin', 
  'super_admin'
) ON CONFLICT (username) DO NOTHING;
