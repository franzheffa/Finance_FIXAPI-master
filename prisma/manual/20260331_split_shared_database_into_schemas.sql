CREATE SCHEMA IF NOT EXISTS academy;
CREATE SCHEMA IF NOT EXISTS paygate;

DO $$
BEGIN
  IF to_regclass('public.formations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.formations SET SCHEMA academy';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.attestations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.attestations SET SCHEMA academy';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.sondages') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.sondages SET SCHEMA academy';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.academy_access') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.academy_access SET SCHEMA academy';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public."User"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."User" SET SCHEMA paygate';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public."AuthAccount"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."AuthAccount" SET SCHEMA paygate';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public."AuthSession"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."AuthSession" SET SCHEMA paygate';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public."Transaction"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."Transaction" SET SCHEMA paygate';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public."Message"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."Message" SET SCHEMA paygate';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public._prisma_migrations SET SCHEMA paygate';
  END IF;
END $$;

UPDATE paygate._prisma_migrations
SET
  finished_at = COALESCE(finished_at, NOW()),
  applied_steps_count = CASE
    WHEN applied_steps_count = 0 THEN 1
    ELSE applied_steps_count
  END
WHERE migration_name = '20260330070000_auth_layer'
  AND rolled_back_at IS NULL;
