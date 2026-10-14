-- Mess Management System: starter schema for Supabase PostgreSQL
-- Version 1.0 | 2026-10-14
-- Run in a DEVELOPMENT project first. Review/test all RLS policies before production.
-- Phone numbers are TEXT to preserve leading zeroes and +country codes.

create extension if not exists pgcrypto;

create type public.mess_role as enum ('owner', 'manager', 'member');
create type public.meal_type as enum ('breakfast', 'lunch', 'dinner', 'total', 'other');
create type public.period_status as enum ('open', 'review', 'closed', 'locked');
create type public.expense_category as enum ('market', 'utilities', 'rent', 'internet', 'cleaning', 'repair', 'other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_language text not null default 'bn'
    check (preferred_language in ('bn', 'en')),
  preferred_theme text not null default 'system'
    check (preferred_theme in ('system','day','night')),
  preferred_accent text not null default 'blue'
    check (preferred_accent in ('blue','red','green','purple','yellow','teal','rose','orange')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  address text,
  phone text,
  currency_code text not null default 'BDT' check (currency_code ~ '^[A-Z]{3}$'),
  timezone text not null default 'Asia/Dhaka',
  breakfast_meal_value numeric(6,2) not null default 0.50 check (breakfast_meal_value >= 0),
  enable_breakfast boolean not null default true,
  enable_lunch boolean not null default true,
  enable_dinner boolean not null default true,
  meal_input_mode text not null default 'detailed'
    check (meal_input_mode in ('detailed', 'direct_total')),
  default_market_days integer not null default 3 check (default_market_days > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mess_memberships (
  id uuid primary key default gen_random_uuid(),
  mess_id uuid not null references public.messes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.mess_role not null default 'member',
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (mess_id, user_id)
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  mess_id uuid not null references public.messes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  member_code text,
  name text not null check (length(trim(name)) > 0),
  nickname text,
  room_no text,
  mobile text,
  whatsapp text,
  email text,
  joining_date date not null default current_date,
  leaving_date date,
  is_active boolean not null default true,
  profile_note text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (leaving_date is null or leaving_date >= joining_date),
  unique (mess_id, member_code)
);

create table public.monthly_periods (
  id uuid primary key default gen_random_uuid(),
  mess_id uuid not null references public.messes(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status public.period_status not null default 'open',
  total_meals numeric(12,2),
  eligible_expenses numeric(12,2),
  meal_rate numeric(12,4),
  closed_by uuid references auth.users(id) on delete set null,
  closed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start),
  unique (mess_id, period_start, period_end)
);

create table public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  mess_id uuid not null references public.messes(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete restrict,
  meal_date date not null,
  meal_type public.meal_type not null,
  meal_count numeric(6,2) not null default 1 check (meal_count >= 0 and meal_count <= 10),
  note text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One row per member/date/type. Update this constraint if multiple sittings are required.
  unique (member_id, meal_date, meal_type)
);

create table public.market_assignments (
  id uuid primary key default gen_random_uuid(),
  mess_id uuid not null references public.messes(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete restrict,
  assignment_date date not null,
  end_date date,
  days_count integer not null default 3 check (days_count > 0),
  slot_label text not null default 'market',
  sort_order integer not null default 1 check (sort_order > 0),
  status text not null default 'assigned'
    check (status in ('assigned','completed','swapped','cancelled')),
  note text,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= assignment_date)
);

create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  mess_id uuid not null references public.messes(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  deposit_date date not null default current_date,
  payment_method text not null default 'cash'
    check (payment_method in ('cash','bank','mobile_banking','other')),
  reference_note text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  mess_id uuid not null references public.messes(id) on delete cascade,
  category public.expense_category not null default 'market',
  title text not null check (length(trim(title)) > 0),
  amount numeric(12,2) not null check (amount > 0),
  expense_date date not null default current_date,
  paid_by_member_id uuid references public.members(id) on delete set null,
  include_in_meal_rate boolean not null default true,
  receipt_path text,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  mess_id uuid not null references public.messes(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Helpful indexes for growing member counts and month-based queries.
create index members_mess_active_idx on public.members (mess_id, is_active, name);
create index members_user_id_idx on public.members (user_id);
create index meal_entries_mess_date_idx on public.meal_entries (mess_id, meal_date);
create index meal_entries_member_date_idx on public.meal_entries (member_id, meal_date);
create index market_assignments_mess_date_idx on public.market_assignments (mess_id, assignment_date, sort_order);
create index deposits_mess_date_idx on public.deposits (mess_id, deposit_date);
create index deposits_member_date_idx on public.deposits (member_id, deposit_date);
create index expenses_mess_date_idx on public.expenses (mess_id, expense_date);
create index expenses_meal_rate_idx on public.expenses (mess_id, expense_date) where include_in_meal_rate = true;
create index periods_mess_start_idx on public.monthly_periods (mess_id, period_start);
create index audit_logs_mess_created_idx on public.audit_logs (mess_id, created_at desc);

-- Generic updated_at helper.
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger messes_updated_at before update on public.messes
for each row execute function public.set_updated_at();
create trigger members_updated_at before update on public.members
for each row execute function public.set_updated_at();
create trigger monthly_periods_updated_at before update on public.monthly_periods
for each row execute function public.set_updated_at();
create trigger meal_entries_updated_at before update on public.meal_entries
for each row execute function public.set_updated_at();
create trigger market_assignments_updated_at before update on public.market_assignments
for each row execute function public.set_updated_at();
create trigger deposits_updated_at before update on public.deposits
for each row execute function public.set_updated_at();
create trigger expenses_updated_at before update on public.expenses
for each row execute function public.set_updated_at();

-- Automatically create a profile after a Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Membership helper functions. SECURITY DEFINER avoids recursive RLS checks on membership lookup.
create or replace function public.is_mess_member(p_mess_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mess_memberships mm
    where mm.mess_id = p_mess_id
      and mm.user_id = (select auth.uid())
      and mm.is_active = true
  );
$$;

create or replace function public.has_mess_role(p_mess_id uuid, p_roles public.mess_role[])
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mess_memberships mm
    where mm.mess_id = p_mess_id
      and mm.user_id = (select auth.uid())
      and mm.is_active = true
      and mm.role = any(p_roles)
  );
$$;

grant execute on function public.is_mess_member(uuid) to authenticated;
grant execute on function public.has_mess_role(uuid, public.mess_role[]) to authenticated;

-- Profiles: a user can see/update only their own profile.
alter table public.profiles enable row level security;
create policy profiles_select_own on public.profiles
for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles
for update to authenticated using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Mess rows: members can read their mess; owner/manager can update.
alter table public.messes enable row level security;
create policy messes_select_member on public.messes
for select to authenticated using (public.is_mess_member(id));
create policy messes_update_manager on public.messes
for update to authenticated using (public.has_mess_role(id, array['owner','manager']::public.mess_role[]))
with check (public.has_mess_role(id, array['owner','manager']::public.mess_role[]));
-- Create a mess and first owner membership through a trusted onboarding RPC/server flow.
-- Do not add an unrestricted client INSERT policy on messes or memberships.

alter table public.mess_memberships enable row level security;
create policy memberships_select_same_mess on public.mess_memberships
for select to authenticated using (public.is_mess_member(mess_id));
-- No direct INSERT/UPDATE/DELETE policies: role changes must use a trusted owner-only workflow.

alter table public.members enable row level security;
create policy members_select_mess on public.members
for select to authenticated using (public.is_mess_member(mess_id));
create policy members_insert_manager on public.members
for insert to authenticated
with check (
  public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[])
  and (user_id is null or user_id in (
    select mm.user_id from public.mess_memberships mm
    where mm.mess_id = members.mess_id and mm.is_active = true
  ))
);
create policy members_update_manager on public.members
for update to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]))
with check (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
-- No member DELETE policy; deactivate members to preserve history.

alter table public.monthly_periods enable row level security;
create policy periods_select_member on public.monthly_periods
for select to authenticated using (public.is_mess_member(mess_id));
create policy periods_insert_manager on public.monthly_periods
for insert to authenticated
with check (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
create policy periods_update_manager on public.monthly_periods
for update to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]))
with check (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));

alter table public.meal_entries enable row level security;
create policy meals_select_mess on public.meal_entries
for select to authenticated using (public.is_mess_member(mess_id));
create policy meals_insert_manager on public.meal_entries
for insert to authenticated
with check (
  public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[])
  and exists (select 1 from public.members m where m.id = meal_entries.member_id and m.mess_id = meal_entries.mess_id)
);
create policy meals_update_manager on public.meal_entries
for update to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]))
with check (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
-- Optional self-entry feature should be added with a separate, carefully tested policy.

alter table public.market_assignments enable row level security;
create policy market_select_mess on public.market_assignments
for select to authenticated using (public.is_mess_member(mess_id));
create policy market_insert_manager on public.market_assignments
for insert to authenticated
with check (
  public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[])
  and exists (select 1 from public.members m where m.id = market_assignments.member_id and m.mess_id = market_assignments.mess_id)
);
create policy market_update_manager on public.market_assignments
for update to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]))
with check (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
create policy market_delete_manager on public.market_assignments
for delete to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));

alter table public.deposits enable row level security;
create policy deposits_select_manager_or_own on public.deposits
for select to authenticated using (
  public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[])
  or exists (select 1 from public.members m where m.id = deposits.member_id and m.mess_id = deposits.mess_id and m.user_id = (select auth.uid()))
);
create policy deposits_insert_manager on public.deposits
for insert to authenticated
with check (
  public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[])
  and exists (select 1 from public.members m where m.id = deposits.member_id and m.mess_id = deposits.mess_id)
);
create policy deposits_update_manager on public.deposits
for update to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]))
with check (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
create policy deposits_delete_manager on public.deposits
for delete to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));

alter table public.expenses enable row level security;
create policy expenses_select_manager on public.expenses
for select to authenticated using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
create policy expenses_insert_manager on public.expenses
for insert to authenticated
with check (
  public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[])
  and (paid_by_member_id is null or exists (
    select 1 from public.members m where m.id = expenses.paid_by_member_id and m.mess_id = expenses.mess_id
  ))
);
create policy expenses_update_manager on public.expenses
for update to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]))
with check (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
create policy expenses_delete_manager on public.expenses
for delete to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));

alter table public.audit_logs enable row level security;
create policy audit_select_manager on public.audit_logs
for select to authenticated
using (public.has_mess_role(mess_id, array['owner','manager']::public.mess_role[]));
-- No client INSERT/UPDATE/DELETE policies; use trusted server-side audit writes/RPC.

-- View for monthly meal totals by member. Caller still needs SELECT access to source table.
create or replace view public.member_meal_totals
with (security_invoker = true)
as
select
  me.mess_id,
  me.member_id,
  date_trunc('month', me.meal_date)::date as month_start,
  sum(me.meal_count)::numeric(12,2) as total_meals
from public.meal_entries me
group by me.mess_id, me.member_id, date_trunc('month', me.meal_date)::date;

-- IMPORTANT:
-- 1. This is a starter schema, not a complete accounting engine.
-- 2. Before production, test RLS with separate auth users and separate messes.
-- 3. Add trusted onboarding RPC for creating a mess + first owner membership atomically.
-- 4. Add atomic month-close RPC and a documented ledger/adjustment model.
-- 5. Deposits are visible to managers and the linked member for that deposit; expenses are manager-only.
--    Build a secure statement RPC/view for member-facing balances, exposing only required aggregates.
-- 6. A policy's same-named columns can be ambiguous in SQL subqueries; verify policies in
--    the target Supabase project and qualify references if needed.
