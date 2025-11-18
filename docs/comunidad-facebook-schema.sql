-- Esquema avanzado para Comunidad estilo Facebook
-- Ejecuta esto en Supabase después del esquema básico

-- Extender tabla profiles con más información (PostgreSQL sintaxis)
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN avatar_url text;
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column avatar_url already exists';
  END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN bio text;
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column bio already exists';
  END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN location text;
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column location already exists';
  END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN eco_level text DEFAULT 'Principiante';
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column eco_level already exists';
  END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN is_public boolean DEFAULT true;
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column is_public already exists';
  END;
END $$;

-- Tabla de posts expandida
drop table if exists public.posts;
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  image_url text,
  post_type text default 'text' check (post_type in ('text', 'image', 'achievement', 'challenge')),
  likes_count integer default 0,
  comments_count integer default 0,
  shares_count integer default 0,
  is_public boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla de comentarios
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade, -- Para respuestas anidadas
  content text not null,
  likes_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla de likes/reacciones
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reaction_type text default 'like' check (reaction_type in ('like', 'love', 'eco', 'recycle', 'plant')),
  created_at timestamp with time zone default now(),
  unique(user_id, post_id, comment_id) -- Un usuario solo puede reaccionar una vez
);

-- Tabla de seguidores/amigos
create table public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references auth.users(id) on delete cascade,
  following_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

-- Tabla de notificaciones
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('like', 'comment', 'follow', 'mention', 'achievement')),
  title text not null,
  message text,
  read boolean default false,
  related_post_id uuid references public.posts(id) on delete cascade,
  related_user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS en las nuevas tablas
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;

-- Políticas RLS

-- Posts: todos pueden leer públicos, autenticados pueden crear
create policy "read public posts" on public.posts for select using (is_public = true);
create policy "read own posts" on public.posts for select using (auth.uid() = user_id);
create policy "insert own posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "update own posts" on public.posts for update using (auth.uid() = user_id);
create policy "delete own posts" on public.posts for delete using (auth.uid() = user_id);

-- Comments: todos pueden leer, autenticados pueden crear
create policy "read comments" on public.comments for select using (true);
create policy "insert comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "update own comments" on public.comments for update using (auth.uid() = user_id);
create policy "delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- Reactions: todos pueden leer, autenticados pueden crear/editar las suyas
create policy "read reactions" on public.reactions for select using (true);
create policy "manage own reactions" on public.reactions for all using (auth.uid() = user_id);

-- Follows: usuarios pueden gestionar sus propios follows
create policy "read follows" on public.follows for select using (true);
create policy "manage own follows" on public.follows for all using (auth.uid() = follower_id);

-- Notifications: solo el usuario puede ver sus notificaciones
create policy "read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Funciones para actualizar contadores automáticamente

-- Función para actualizar contador de likes en posts
create or replace function update_post_likes_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' and NEW.post_id is not null then
    update public.posts 
    set likes_count = likes_count + 1 
    where id = NEW.post_id;
  elsif TG_OP = 'DELETE' and OLD.post_id is not null then
    update public.posts 
    set likes_count = greatest(0, likes_count - 1) 
    where id = OLD.post_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$;

-- Función para actualizar contador de comentarios en posts
create or replace function update_post_comments_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts 
    set comments_count = comments_count + 1 
    where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.posts 
    set comments_count = greatest(0, comments_count - 1) 
    where id = OLD.post_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$;

-- Función para crear notificaciones automáticas
create or replace function create_notification()
returns trigger
language plpgsql
as $$
declare
  post_owner_id uuid;
  notification_title text;
  notification_message text;
begin
  -- Solo para INSERTs
  if TG_OP != 'INSERT' then
    return NEW;
  end if;

  if TG_TABLE_NAME = 'reactions' and NEW.post_id is not null then
    -- Obtener el dueño del post
    select user_id into post_owner_id from public.posts where id = NEW.post_id;
    
    -- No notificar si reaccionas a tu propio post
    if post_owner_id != NEW.user_id then
      notification_title := 'Nuevo Me Gusta';
      notification_message := 'Alguien reaccionó a tu publicación';
      
      insert into public.notifications (user_id, type, title, message, related_post_id, related_user_id)
      values (post_owner_id, 'like', notification_title, notification_message, NEW.post_id, NEW.user_id);
    end if;
    
  elsif TG_TABLE_NAME = 'comments' then
    -- Obtener el dueño del post
    select user_id into post_owner_id from public.posts where id = NEW.post_id;
    
    -- No notificar si comentas tu propio post
    if post_owner_id != NEW.user_id then
      notification_title := 'Nuevo Comentario';
      notification_message := 'Alguien comentó en tu publicación';
      
      insert into public.notifications (user_id, type, title, message, related_post_id, related_user_id)
      values (post_owner_id, 'comment', notification_title, notification_message, NEW.post_id, NEW.user_id);
    end if;
    
  elsif TG_TABLE_NAME = 'follows' then
    notification_title := 'Nuevo Seguidor';
    notification_message := 'Alguien comenzó a seguirte';
    
    insert into public.notifications (user_id, type, title, message, related_user_id)
    values (NEW.following_id, 'follow', notification_title, notification_message, NEW.follower_id);
  end if;
  
  return NEW;
end;
$$;

-- Triggers para actualizar contadores
create trigger update_post_likes_trigger
  after insert or delete on public.reactions
  for each row execute function update_post_likes_count();

create trigger update_post_comments_trigger
  after insert or delete on public.comments
  for each row execute function update_post_comments_count();

-- Triggers para notificaciones automáticas
create trigger create_like_notification_trigger
  after insert on public.reactions
  for each row execute function create_notification();

create trigger create_comment_notification_trigger
  after insert on public.comments
  for each row execute function create_notification();

create trigger create_follow_notification_trigger
  after insert on public.follows
  for each row execute function create_notification();

-- Vista para posts con información del usuario
create view public.posts_with_user as
select 
  p.*,
  pr.full_name,
  pr.avatar_url,
  pr.eco_level,
  -- Verificar si el usuario actual ya reaccionó
  exists(
    select 1 from public.reactions r 
    where r.post_id = p.id and r.user_id = auth.uid()
  ) as user_has_reacted
from public.posts p
left join public.profiles pr on pr.id = p.user_id
where p.is_public = true or p.user_id = auth.uid()
order by p.created_at desc;

-- Vista para comentarios con información del usuario
create view public.comments_with_user as
select 
  c.*,
  pr.full_name,
  pr.avatar_url,
  pr.eco_level
from public.comments c
left join public.profiles pr on pr.id = c.user_id
order by c.created_at asc;

-- Función para obtener feed personalizado
create or replace function get_user_feed(limit_posts int default 20, offset_posts int default 0)
returns table(
  id uuid,
  user_id uuid,
  content text,
  image_url text,
  post_type text,
  likes_count int,
  comments_count int,
  is_public boolean,
  created_at timestamptz,
  full_name text,
  avatar_url text,
  eco_level text,
  user_has_reacted boolean
)
language sql
as $$
  select 
    p.id,
    p.user_id,
    p.content,
    p.image_url,
    p.post_type,
    p.likes_count,
    p.comments_count,
    p.is_public,
    p.created_at,
    pr.full_name,
    pr.avatar_url,
    pr.eco_level,
    exists(
      select 1 from public.reactions r 
      where r.post_id = p.id and r.user_id = auth.uid()
    ) as user_has_reacted
  from public.posts p
  left join public.profiles pr on pr.id = p.user_id
  where 
    p.is_public = true 
    or p.user_id = auth.uid()
    or p.user_id in (
      select following_id from public.follows 
      where follower_id = auth.uid()
    )
  order by p.created_at desc
  limit limit_posts
  offset offset_posts;
$$;