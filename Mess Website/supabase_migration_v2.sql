-- ==============================================================================
-- Supabase Migration V2: Market Duration, Default Days, and Manager Delete Policies
-- Date: 2026-10-15
-- Instructions: Run this script directly in your Supabase SQL Editor.
-- It is safe and idempotent (will not overwrite or delete existing records).
-- ==============================================================================

-- 1. Profiles Table: Add preferred language support (bn / en)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_language text NOT NULL DEFAULT 'bn'
  CHECK (preferred_language IN ('bn', 'en'));

-- 2. Messes Table: Add market schedule default days configuration
ALTER TABLE public.messes 
ADD COLUMN IF NOT EXISTS default_market_days integer NOT NULL DEFAULT 3 
  CHECK (default_market_days > 0);

ALTER TABLE public.messes 
ADD COLUMN IF NOT EXISTS enable_breakfast boolean NOT NULL DEFAULT true;

ALTER TABLE public.messes 
ADD COLUMN IF NOT EXISTS enable_lunch boolean NOT NULL DEFAULT true;

ALTER TABLE public.messes 
ADD COLUMN IF NOT EXISTS enable_dinner boolean NOT NULL DEFAULT true;

ALTER TABLE public.messes 
ADD COLUMN IF NOT EXISTS meal_input_mode text NOT NULL DEFAULT 'detailed'
  CHECK (meal_input_mode IN ('detailed', 'direct_total'));

-- 3. Market Assignments Table: Add duration and end_date support
ALTER TABLE public.market_assignments 
ADD COLUMN IF NOT EXISTS end_date date;

ALTER TABLE public.market_assignments 
ADD COLUMN IF NOT EXISTS days_count integer NOT NULL DEFAULT 3 
  CHECK (days_count > 0);

-- Backfill any existing records where end_date is null
UPDATE public.market_assignments
SET end_date = (assignment_date + ((COALESCE(days_count, 3) - 1) * interval '1 day'))::date
WHERE end_date IS NULL;

-- Safely add end_date constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'market_assignments_end_date_check'
  ) THEN
    ALTER TABLE public.market_assignments
    ADD CONSTRAINT market_assignments_end_date_check
    CHECK (end_date IS NULL OR end_date >= assignment_date);
  END IF;
END $$;

-- 4. Enable DELETE RLS Policies for Managers & Owners
-- Market Assignments DELETE
DROP POLICY IF EXISTS market_delete_manager ON public.market_assignments;
CREATE POLICY market_delete_manager ON public.market_assignments
FOR DELETE TO authenticated
USING (public.has_mess_role(mess_id, ARRAY['owner','manager']::public.mess_role[]));

-- Deposits DELETE
DROP POLICY IF EXISTS deposits_delete_manager ON public.deposits;
CREATE POLICY deposits_delete_manager ON public.deposits
FOR DELETE TO authenticated
USING (public.has_mess_role(mess_id, ARRAY['owner','manager']::public.mess_role[]));

-- Expenses DELETE
DROP POLICY IF EXISTS expenses_delete_manager ON public.expenses;
CREATE POLICY expenses_delete_manager ON public.expenses
FOR DELETE TO authenticated
USING (public.has_mess_role(mess_id, ARRAY['owner','manager']::public.mess_role[]));

-- 5. Performance Index on market_assignments for fast sorting
CREATE INDEX IF NOT EXISTS market_assignments_mess_sort_idx 
ON public.market_assignments (mess_id, sort_order, assignment_date);

-- ==============================================================================
-- End of Migration Script
-- ==============================================================================
