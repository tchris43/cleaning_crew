create extension if not exists pgcrypto;

do $$
begin
  create type service_tier as enum ('BASIC_REFRESH', 'DEEP_CLEAN', 'PREMIUM_RESTORE');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type time_block as enum ('MORNING', 'AFTERNOON', 'EVENING');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text null,
  email text null,
  service_tier service_tier not null,
  vehicle_make text not null,
  vehicle_model text not null,
  appointment_date date not null,
  appointment_time time not null,
  time_block time_block not null,
  block_capacity_snapshot integer not null default 3,
  photo_permission boolean not null,
  notes text null,
  status text not null default 'booked',
  constraint appointments_contact_method_check check (phone is not null or email is not null),
  constraint appointments_status_check check (status in ('booked', 'completed', 'cancelled')),
  constraint appointments_notes_length_check check (notes is null or char_length(notes) <= 500),
  constraint appointments_capacity_snapshot_check check (block_capacity_snapshot = 3)
);

create index if not exists appointments_block_lookup_idx
  on public.appointments (appointment_date, time_block, status);

create or replace function public.create_appointment(
  p_name text,
  p_phone text,
  p_email text,
  p_service_tier service_tier,
  p_vehicle_make text,
  p_vehicle_model text,
  p_appointment_date date,
  p_appointment_time time,
  p_time_block time_block,
  p_block_capacity_snapshot integer,
  p_photo_permission boolean,
  p_notes text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
  inserted_appointment_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_appointment_date::text || ':' || p_time_block::text, 0));

  select count(*)
    into current_count
    from public.appointments
   where appointment_date = p_appointment_date
     and time_block = p_time_block
     and status = 'booked';

  if current_count >= p_block_capacity_snapshot then
    return jsonb_build_object('success', false, 'code', 'BLOCK_FULL');
  end if;

  insert into public.appointments (
    name,
    phone,
    email,
    service_tier,
    vehicle_make,
    vehicle_model,
    appointment_date,
    appointment_time,
    time_block,
    block_capacity_snapshot,
    photo_permission,
    notes,
    status
  ) values (
    p_name,
    p_phone,
    p_email,
    p_service_tier,
    p_vehicle_make,
    p_vehicle_model,
    p_appointment_date,
    p_appointment_time,
    p_time_block,
    p_block_capacity_snapshot,
    p_photo_permission,
    p_notes,
    'booked'
  ) returning id into inserted_appointment_id;

  return jsonb_build_object('success', true, 'appointmentId', inserted_appointment_id::text);
exception
  when others then
    return jsonb_build_object('success', false, 'code', 'SERVER_ERROR');
end;
$$;
