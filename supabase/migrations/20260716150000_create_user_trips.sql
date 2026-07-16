create extension if not exists pgcrypto;

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 80),
  start_date date not null,
  end_date date not null,
  traveller_count smallint not null check (traveller_count between 1 and 20),
  fuel_type text not null check (fuel_type in ('gasoline', 'diesel', 'hybrid')),
  fuel_price_override_cents_per_litre integer check (
    fuel_price_override_cents_per_litre is null
    or fuel_price_override_cents_per_litre between 1 and 1000
  ),
  food_budget_cents integer not null default 0 check (food_budget_cents >= 0),
  activities_budget_cents integer not null default 0 check (activities_budget_cents >= 0),
  estimate_status text not null default 'pending' check (
    estimate_status in ('pending', 'ready', 'failed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_date_order check (end_date >= start_date)
);

create table public.trip_members (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create table public.trip_stops (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  position smallint not null check (position between 0 and 9),
  google_place_id text not null check (char_length(google_place_id) between 3 and 255),
  place_label text not null check (char_length(place_label) between 2 and 160),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  nights smallint not null default 0 check (nights between 0 and 30),
  accommodation_budget_cents integer not null default 0 check (
    accommodation_budget_cents >= 0
  ),
  parking_budget_cents integer not null default 0 check (parking_budget_cents >= 0),
  selected_parking_place_id text check (
    selected_parking_place_id is null
    or char_length(selected_parking_place_id) between 3 and 255
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, position)
);

create table public.trip_route_estimates (
  trip_id uuid primary key references public.trips(id) on delete cascade,
  distance_metres integer not null check (distance_metres >= 0),
  duration_seconds integer not null check (duration_seconds >= 0),
  encoded_polyline text,
  major_roads text[] not null default '{}',
  fuel_consumption_microlitres bigint check (fuel_consumption_microlitres >= 0),
  fuel_price_cents_per_litre integer check (fuel_price_cents_per_litre >= 0),
  fuel_price_source_date date,
  fuel_cost_cents integer check (fuel_cost_cents >= 0),
  toll_amounts jsonb not null default '[]'::jsonb,
  has_unpriced_tolls boolean not null default false,
  provider_generated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  updated_at timestamptz not null default now()
);

create index trips_owner_id_idx on public.trips(owner_id);
create index trip_members_user_id_idx on public.trip_members(user_id);
create index trip_stops_trip_id_idx on public.trip_stops(trip_id);
create index trip_route_estimates_expires_at_idx
  on public.trip_route_estimates(expires_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_set_updated_at
before update on public.trips
for each row execute function public.set_updated_at();

create trigger trip_stops_set_updated_at
before update on public.trip_stops
for each row execute function public.set_updated_at();

create trigger trip_route_estimates_set_updated_at
before update on public.trip_route_estimates
for each row execute function public.set_updated_at();

create or replace function public.is_trip_member(target_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.trip_members
    where trip_id = target_trip_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_trip_owner(target_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.trips
    where id = target_trip_id
      and owner_id = (select auth.uid())
  );
$$;

revoke all on function public.is_trip_member(uuid) from public;
revoke all on function public.is_trip_owner(uuid) from public;
grant execute on function public.is_trip_member(uuid) to authenticated;
grant execute on function public.is_trip_owner(uuid) to authenticated;

alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_stops enable row level security;
alter table public.trip_route_estimates enable row level security;

grant select, update, delete on public.trips to authenticated;
grant select on public.trip_members to authenticated;
grant select, update on public.trip_stops to authenticated;
grant select, insert, update, delete on public.trip_route_estimates to authenticated;

create policy "members can read trips"
on public.trips for select to authenticated
using (public.is_trip_member(id) or owner_id = (select auth.uid()));

create policy "owners can update trips"
on public.trips for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "owners can delete trips"
on public.trips for delete to authenticated
using (owner_id = (select auth.uid()));

create policy "members can read memberships"
on public.trip_members for select to authenticated
using (public.is_trip_member(trip_id));

create policy "members can read stops"
on public.trip_stops for select to authenticated
using (public.is_trip_member(trip_id));

create policy "owners can update stops"
on public.trip_stops for update to authenticated
using (public.is_trip_owner(trip_id))
with check (public.is_trip_owner(trip_id));

create policy "members can read estimates"
on public.trip_route_estimates for select to authenticated
using (public.is_trip_member(trip_id));

create policy "owners can manage estimates"
on public.trip_route_estimates for all to authenticated
using (public.is_trip_owner(trip_id))
with check (public.is_trip_owner(trip_id));

create or replace function public.create_trip_with_stops(
  p_title text,
  p_start_date date,
  p_end_date date,
  p_traveller_count smallint,
  p_fuel_type text,
  p_food_budget_cents integer,
  p_activities_budget_cents integer,
  p_stops jsonb,
  p_fuel_price_override_cents_per_litre integer default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  created_trip_id uuid;
  stop jsonb;
  stop_count integer := jsonb_array_length(p_stops);
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if stop_count < 2 or stop_count > 10 then
    raise exception 'A trip requires between 2 and 10 stops';
  end if;

  insert into public.trips (
    owner_id,
    title,
    start_date,
    end_date,
    traveller_count,
    fuel_type,
    fuel_price_override_cents_per_litre,
    food_budget_cents,
    activities_budget_cents
  ) values (
    current_user_id,
    p_title,
    p_start_date,
    p_end_date,
    p_traveller_count,
    p_fuel_type,
    p_fuel_price_override_cents_per_litre,
    p_food_budget_cents,
    p_activities_budget_cents
  ) returning id into created_trip_id;

  insert into public.trip_members (trip_id, user_id, role)
  values (created_trip_id, current_user_id, 'owner');

  for stop in select value from jsonb_array_elements(p_stops)
  loop
    insert into public.trip_stops (
      trip_id,
      position,
      google_place_id,
      place_label,
      country_code,
      nights,
      accommodation_budget_cents,
      parking_budget_cents
    ) values (
      created_trip_id,
      (stop->>'position')::smallint,
      stop->>'googlePlaceId',
      stop->>'placeLabel',
      upper(stop->>'countryCode'),
      (stop->>'nights')::smallint,
      (stop->>'accommodationBudgetCents')::integer,
      (stop->>'parkingBudgetCents')::integer
    );
  end loop;

  return created_trip_id;
end;
$$;

revoke all on function public.create_trip_with_stops(
  text, date, date, smallint, text, integer, integer, jsonb, integer
) from public;
grant execute on function public.create_trip_with_stops(
  text, date, date, smallint, text, integer, integer, jsonb, integer
) to authenticated;
