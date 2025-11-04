-- Esquema mínimo para EcoHack (Supabase)
-- Ejecuta esto en el SQL editor de tu proyecto Supabase

-- Habilitar extensión pgcrypto para gen_random_uuid()
create extension if not exists pgcrypto;

-- Perfiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  points integer not null default 0,
  created_at timestamp with time zone default now()
);

-- Retos
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  points integer not null default 10,
  active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Relación usuario-reto completado
create table if not exists public.user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  completed_at timestamp with time zone default now(),
  unique(user_id, challenge_id)
);

-- Feed comunidad (simple)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  content text not null,
  likes integer not null default 0,
  created_at timestamp with time zone default now()
);

-- Políticas RLS
alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.user_challenges enable row level security;
alter table public.posts enable row level security;

-- Profiles: cada usuario ve/edita su perfil
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- Challenges: todos pueden leer, sólo admin debería escribir (por simplicidad, permitir lectura global)
create policy "read challenges" on public.challenges for select using (true);

-- User_challenges: cada uno ve/crea los suyos
create policy "insert own user_challenge" on public.user_challenges for insert with check (auth.uid() = user_id);
create policy "read own user_challenge" on public.user_challenges for select using (auth.uid() = user_id);

-- Posts: cualquiera autenticado puede leer/crear, likes como update abierto
create policy "read posts" on public.posts for select using (true);
create policy "insert posts" on public.posts for insert with check (auth.role() = 'authenticated');
create policy "update likes" on public.posts for update using (true);

-- Función opcional para sumar puntos de forma atómica
create or replace function public.increment_points(p_user_id uuid, p_delta int)
returns setof profiles
language sql
as $$
  update public.profiles
  set points = greatest(0, points + p_delta)
  where id = p_user_id
  returning *;
$$;
