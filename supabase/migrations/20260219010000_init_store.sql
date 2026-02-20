create table if not exists public.contact_info (
  id bigint primary key generated always as identity,
  name text not null,
  tagline text not null,
  support_email text not null,
  support_phone text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id text primary key,
  name text not null,
  address text not null,
  phone text not null,
  hours text not null,
  maps_url text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(10,2) not null,
  updated_at timestamptz not null default now()
);

alter table public.contact_info enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read contact info" on public.contact_info;
create policy "Public can read contact info"
on public.contact_info for select
using (true);

drop policy if exists "Public can read stores" on public.stores;
create policy "Public can read stores"
on public.stores for select
using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
using (true);

insert into public.contact_info (name, tagline, support_email, support_phone)
select
  'OG Hustlers Smoke Shop',
  'Premium glass, vapes, wraps, and accessories',
  'support@oghustlers.com',
  '+1 (555) 010-2424'
where not exists (
  select 1 from public.contact_info
);

update public.contact_info
set
  name = 'OG Hustlers Smoke Shop',
  tagline = 'Premium glass, vapes, wraps, and accessories',
  support_email = 'support@oghustlers.com',
  support_phone = '+1 (555) 010-2424',
  updated_at = now()
where id = (
  select id from public.contact_info order by id asc limit 1
);

insert into public.stores (id, name, address, phone, hours, maps_url)
values
  ('stl-01', 'OG Hustlers - Spring Garden', '2500 Spring Garden St, Greensboro, NC 27403, United States', '+1 (336) 555-0101', 'Mon-Sat 10:00 AM-10:00 PM, Sun 11:00 AM-8:00 PM', 'https://maps.google.com/?q=2500+Spring+Garden+St+Greensboro+NC+27403+United+States'),
  ('stl-02', 'OG Hustlers - East Bessemer A', '1700 E Bessemer Ave suit B, Greensboro, NC 27405, United States', '+1 (336) 555-0102', 'Daily 9:00 AM-11:00 PM', 'https://maps.google.com/?q=1700+E+Bessemer+Ave+suit+B+Greensboro+NC+27405+United+States'),
  ('stl-03', 'OG Hustlers - East Bessemer B', '2400 E Bessemer Ave, Greensboro, NC 27405, USA', '+1 (336) 555-0103', 'Daily 9:00 AM-11:00 PM', 'https://maps.google.com/?q=2400+E+Bessemer+Ave+Greensboro+NC+27405+USA'),
  ('stl-04', 'OG Hustlers - East Market', '2204 E Market St, Greensboro, NC 27401, USA', '+1 (336) 555-0104', 'Daily 9:00 AM-11:00 PM', 'https://maps.google.com/?q=2204+E+Market+St+Greensboro+NC+27401+USA')
on conflict (id) do update
set
  name = excluded.name,
  address = excluded.address,
  phone = excluded.phone,
  hours = excluded.hours,
  maps_url = excluded.maps_url,
  updated_at = now();

insert into public.products (id, name, price)
values
  ('p-001', 'Disposable Vape', 19.99),
  ('p-002', 'Glass Water Pipe', 49.99),
  ('p-003', 'Rolling Papers', 2.99),
  ('p-004', 'Butane Refill', 6.99),
  ('p-005', 'Premium Hookah Flavor', 14.99),
  ('p-006', 'Cigar Wrap 2-Pack', 3.49)
on conflict (id) do update
set
  name = excluded.name,
  price = excluded.price,
  updated_at = now();
