-- FIBRO Textile Agency: run this script in Supabase SQL Editor.
-- 1. Creates public catalog/settings and a private admin allow-list.
-- 2. Only accounts explicitly listed in admin_users can modify content.
-- 3. Public visitors can read published products and public settings only.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text not null default '',
  description text not null default '',
  category text not null default 'Текстильное сырьё',
  image_url text,
  published boolean not null default false,
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.is_fibro_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_fibro_admin() from public;
grant execute on function public.is_fibro_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admins can view admin allowlist" on public.admin_users;
create policy "Admins can view admin allowlist"
on public.admin_users for select to authenticated
using (public.is_fibro_admin());

drop policy if exists "Anyone can view published products" on public.products;
create policy "Anyone can view published products"
on public.products for select to anon, authenticated
using (published = true or public.is_fibro_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert to authenticated
with check (public.is_fibro_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update to authenticated
using (public.is_fibro_admin())
with check (public.is_fibro_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete to authenticated
using (public.is_fibro_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select to anon, authenticated
using (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
on public.site_settings for insert to authenticated
with check (public.is_fibro_admin());

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
on public.site_settings for update to authenticated
using (public.is_fibro_admin())
with check (public.is_fibro_admin());

-- Public read-only bucket for product photos. Admin allow-list controls writes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_fibro_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_fibro_admin())
with check (bucket_id = 'product-images' and public.is_fibro_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_fibro_admin());

-- Starter catalog. These are sample entries; verify actual stock/specifications before publishing.
insert into public.products (name, subtitle, description, category, published, sort_order)
values
('Полиэстер PSF','POLYESTER STAPLE FIBRE','Универсальное синтетическое волокно для текстильного производства.','Синтетические волокна',true,1),
('Вискоза VSF','VISCOSE STAPLE FIBRE','Мягкое волокно для материалов с комфортной фактурой.','Целлюлозные волокна',true,2),
('Акриловая пряжа','ACRYLIC FIBRE & YARN','Практичный материал для разнообразных текстильных изделий.','Синтетические волокна',true,3),
('Специальные волокна','BAMBOO · MODAL · ELASTANE','Специализированные материалы под различные задачи производства.','Специальные материалы',true,4)
on conflict do nothing;

insert into public.site_settings(key, value) values
('phone', '+998 91 464 46 63'),
('whatsapp', '998914644663'),
('address', 'Building 17A, Yangiul, dead end street 2, 111800, Tashkent, Uzbekistan'),
('email', ''),
('tagline', 'TEXTURE · TECHNOLOGY · TRUST')
on conflict (key) do nothing;
