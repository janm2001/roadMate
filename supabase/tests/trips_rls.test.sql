begin;

create extension if not exists pgtap with schema extensions;
select plan(4);

insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'owner@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'other@example.com');

set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select lives_ok(
  $$
    select public.create_trip_with_stops(
      'Private road trip',
      '2026-09-12',
      '2026-09-15',
      2::smallint,
      'gasoline',
      10000,
      5000,
      '[{"position":0,"googlePlaceId":"manual:zagreb-hr","placeLabel":"Zagreb","countryCode":"HR","nights":0,"accommodationBudgetCents":0,"parkingBudgetCents":0},{"position":1,"googlePlaceId":"manual:graz-at","placeLabel":"Graz","countryCode":"AT","nights":3,"accommodationBudgetCents":30000,"parkingBudgetCents":3000}]'::jsonb
    )
  $$,
  'an authenticated owner can create a trip atomically'
);

select is((select count(*) from public.trips), 1::bigint, 'owner can read own trip');

set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

select is((select count(*) from public.trips), 0::bigint, 'another user cannot read the trip');
select is((select count(*) from public.trip_stops), 0::bigint, 'another user cannot read its stops');

select * from finish();
rollback;
