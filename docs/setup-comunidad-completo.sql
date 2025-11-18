-- ==============================================
-- ESQUEMA COMPLETO PARA COMUNIDAD ECOHACK
-- Ejecuta esto paso a paso en tu Supabase SQL Editor
-- ==============================================

-- PASO 1: Extender tabla profiles existente
DO $$ 
BEGIN
  -- Agregar columnas nuevas solo si no existen
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
    ALTER TABLE public.profiles ADD COLUMN location text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'eco_level') THEN
    ALTER TABLE public.profiles ADD COLUMN eco_level text DEFAULT 'Principiante';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_public') THEN
    ALTER TABLE public.profiles ADD COLUMN is_public boolean DEFAULT true;
  END IF;
END $$;

-- PASO 2: Recrear tabla posts con nueva estructura
DROP TABLE IF EXISTS public.posts CASCADE;
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  post_type text DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'achievement', 'challenge')),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PASO 3: Tabla de comentarios
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PASO 4: Tabla de reacciones/likes
CREATE TABLE IF NOT EXISTS public.reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  reaction_type text DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'eco', 'recycle', 'plant')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id, comment_id)
);

-- PASO 5: Tabla de seguidores
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- PASO 6: Tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'achievement')),
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  related_post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  related_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- PASO 7: Habilitar Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PASO 8: Políticas de seguridad para posts
CREATE POLICY "read_public_posts" ON public.posts FOR SELECT USING (is_public = true);
CREATE POLICY "read_own_posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- PASO 9: Políticas para comentarios
CREATE POLICY "read_comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "insert_comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- PASO 10: Políticas para reacciones
CREATE POLICY "read_reactions" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "manage_own_reactions" ON public.reactions FOR ALL USING (auth.uid() = user_id);

-- PASO 11: Políticas para follows
CREATE POLICY "read_follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "manage_own_follows" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- PASO 12: Políticas para notificaciones
CREATE POLICY "read_own_notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "update_own_notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- PASO 13: Función para actualizar contadores de likes
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.post_id IS NOT NULL THEN
    UPDATE public.posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND OLD.post_id IS NOT NULL THEN
    UPDATE public.posts 
    SET likes_count = GREATEST(0, likes_count - 1) 
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- PASO 14: Función para actualizar contadores de comentarios
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts 
    SET comments_count = GREATEST(0, comments_count - 1) 
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- PASO 15: Crear triggers
DROP TRIGGER IF EXISTS update_post_likes_trigger ON public.reactions;
CREATE TRIGGER update_post_likes_trigger
  AFTER INSERT OR DELETE ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

DROP TRIGGER IF EXISTS update_post_comments_trigger ON public.comments;
CREATE TRIGGER update_post_comments_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- PASO 16: Datos de ejemplo para probar
INSERT INTO public.posts (user_id, content, post_type, is_public) VALUES
(auth.uid(), '🌱 ¡Bienvenidos a la nueva comunidad de EcoHack! Aquí podremos compartir nuestros logros ecológicos y motivarnos mutuamente.', 'text', true),
(auth.uid(), '🏆 ¡Completé mi primer desafío de reciclaje! Logré separar correctamente todos mis residuos durante una semana completa.', 'achievement', true),
(auth.uid(), '💪 Propongo un nuevo reto: ¿Quién se anima a usar solo transporte público o bicicleta durante los próximos 7 días?', 'challenge', true)
ON CONFLICT DO NOTHING;

-- ¡LISTO! Tu base de datos está configurada para la comunidad estilo Facebook