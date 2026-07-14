-- Run this in your Supabase project's SQL editor:
-- Project → SQL Editor → New query → paste → Run

-- 1. PRODUCTS -----------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_kes integer not null,
  sale_price_kes integer,
  image_url text,
  category text not null, -- 'cctv' | 'networking' | 'access-control' | 'electric-fence' | 'alarms'
  specs jsonb, -- e.g. {"Resolution": "4MP", "Channels": "8", "Storage": "2TB HDD"}
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

-- Anyone can read products (it's a public storefront).
create policy "Public can read products"
  on products for select
  using (true);

-- Only server-side/service-role writes are allowed by default —
-- add an authenticated "admin" policy later once you build an admin panel.


-- 2. ORDERS ---------------------------------------------------------
-- A lightweight record of "order intents" created when a signed-in
-- customer taps "Order on WhatsApp". The real payment happens via
-- M-Pesa Buy Goods and is confirmed manually (or later, via Daraja).
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  price_kes integer not null,
  status text not null default 'pending', -- 'pending' | 'paid' | 'fulfilled' | 'cancelled'
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- Customers can only see their own orders.
create policy "Users can read own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Customers can only create orders under their own account.
create policy "Users can insert own orders"
  on orders for insert
  with check (auth.uid() = user_id);


-- 2b. ADMINS ---------------------------------------------------------
-- Membership table for the admin panel (app/admin). Add a row here
-- (user_id from Authentication → Users) for anyone who should get
-- access to /admin.
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- A signed-in user can check whether THEY are an admin (powers the
-- checkIsAdmin() gate) but can't list other admins.
create policy "Users can check own admin status"
  on admins for select
  using (auth.uid() = user_id);

-- Small helper used by the policies below so admin-only writes on
-- products/orders don't need to repeat the subquery everywhere.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admins where user_id = auth.uid()
  );
$$;

-- Admins can add/edit/delete products from the admin panel (public
-- read access from earlier is unaffected).
create policy "Admins can insert products"
  on products for insert
  with check (is_admin());

create policy "Admins can update products"
  on products for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete products"
  on products for delete
  using (is_admin());

-- Admins can see and update every order (customers still only see
-- their own, per the policies above).
create policy "Admins can read all orders"
  on orders for select
  using (is_admin());

create policy "Admins can update orders"
  on orders for update
  using (is_admin())
  with check (is_admin());


-- 3. SAMPLE DATA ------------------------------------------------
insert into products (name, description, price_kes, sale_price_kes, image_url, category, specs, in_stock)
values
  (
    '4-Channel 4MP CCTV Kit with 2TB DVR',
    'Complete kit: 4x outdoor bullet cameras, night vision, DVR with pre-installed 2TB HDD, cabling included.',
    24500,
    null,
    null,
    'cctv',
    '{"Resolution": "4MP", "Channels": "4", "Storage": "2TB HDD", "Night vision": "30m IR"}',
    true
  ),
  (
    'Cat6 UTP Cable (305m box)',
    'Pure copper Cat6 cable, indoor/outdoor rated, 305m pull box.',
    8900,
    7900,
    null,
    'networking',
    '{"Category": "Cat6", "Length": "305m", "Conductor": "Pure copper"}',
    true
  ),
  (
    'Biometric Fingerprint Access Control Terminal',
    'Standalone fingerprint + card + PIN access terminal for doors and gates, supports up to 3000 users.',
    18500,
    null,
    null,
    'access-control',
    '{"Users": "3000", "Unlock methods": "Fingerprint, Card, PIN", "Power": "12V DC"}',
    true
  ),
  (
    '6-Wire Electric Fence Energizer Kit',
    'Perimeter electric fence energizer with 6 strands of galvanized wire, suitable for up to 100m coverage.',
    32000,
    null,
    null,
    'electric-fence',
    '{"Coverage": "100m", "Wire strands": "6", "Output": "9000V pulse"}',
    true
  ),
  (
    'Wireless Alarm System with Motion Sensors',
    'GSM alarm panel, 2x door/window sensors, 1x motion sensor, remote control, app notifications.',
    15900,
    null,
    null,
    'alarms',
    '{"Connectivity": "GSM + WiFi", "Sensors included": "3", "App control": "Yes"}',
    true
  );
