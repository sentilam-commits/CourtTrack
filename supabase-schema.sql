create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email_or_phone text,
  level text,
  main_goal text,
  class_frequency text,
  start_date date,
  next_class date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.class_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  coach_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  class_type text,
  today_focus text,
  what_improved text,
  main_correction text,
  homework text,
  next_focus text,
  coach_note text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.progress_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  coach_id uuid not null references auth.users(id) on delete cascade,
  forehand integer default 1,
  backhand integer default 1,
  volley integer default 1,
  bandeja integer default 1,
  positioning integer default 1,
  decision_making integer default 1,
  consistency integer default 1,
  match_confidence integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(student_id)
);

create table if not exists public.coach_payments (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid references public.students(id) on delete set null,
  title text not null default 'Clase',
  amount numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  due_date date,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.class_bonuses (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  name text not null,
  total_classes integer not null default 10 check (total_classes > 0),
  remaining_classes integer not null default 10 check (remaining_classes >= 0),
  alert_at integer not null default 3 check (alert_at > 0),
  status text not null default 'active' check (status in ('active', 'exhausted', 'cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.scheduled_classes (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid references public.students(id) on delete set null,
  title text not null default 'Clase',
  class_date date not null,
  start_time time not null,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  court text,
  status text not null default 'scheduled' check (status in ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.student_feedback (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  coach_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'general'
    check (category in ('clase','reporte','videos','general')),
  message text not null check (char_length(message) between 1 and 1000),
  created_at timestamptz default now(),
  read_at timestamptz
);

create index if not exists student_feedback_coach_idx
  on public.student_feedback (coach_id, read_at);

alter table public.students
  add column if not exists next_class date;

alter table public.students enable row level security;
alter table public.class_logs enable row level security;
alter table public.progress_scores enable row level security;
alter table public.coach_payments enable row level security;
alter table public.class_bonuses enable row level security;
alter table public.scheduled_classes enable row level security;
alter table public.student_feedback enable row level security;

drop policy if exists "Coaches manage own students" on public.students;
create policy "Coaches manage own students"
on public.students for all
using (auth.uid() = coach_id)
with check (auth.uid() = coach_id);

drop policy if exists "Coaches manage own class logs" on public.class_logs;
create policy "Coaches manage own class logs"
on public.class_logs for all
using (auth.uid() = coach_id)
with check (
  auth.uid() = coach_id
  and exists (
    select 1 from public.students
    where students.id = class_logs.student_id
    and students.coach_id = auth.uid()
  )
);

drop policy if exists "Coaches manage own progress scores" on public.progress_scores;
create policy "Coaches manage own progress scores"
on public.progress_scores for all
using (auth.uid() = coach_id)
with check (
  auth.uid() = coach_id
  and exists (
    select 1 from public.students
    where students.id = progress_scores.student_id
    and students.coach_id = auth.uid()
  )
);

drop policy if exists "Coaches manage own payments" on public.coach_payments;
create policy "Coaches manage own payments"
on public.coach_payments for all
using (auth.uid() = coach_id)
with check (
  auth.uid() = coach_id
  and (
    student_id is null
    or exists (
      select 1 from public.students
      where students.id = coach_payments.student_id
      and students.coach_id = auth.uid()
    )
  )
);

drop policy if exists "Coaches manage own class bonuses" on public.class_bonuses;
create policy "Coaches manage own class bonuses"
on public.class_bonuses for all
using (auth.uid() = coach_id)
with check (
  auth.uid() = coach_id
  and exists (
    select 1 from public.students
    where students.id = class_bonuses.student_id
    and students.coach_id = auth.uid()
  )
);

drop policy if exists "Coaches manage own scheduled classes" on public.scheduled_classes;
create policy "Coaches manage own scheduled classes"
on public.scheduled_classes for all
using (auth.uid() = coach_id)
with check (
  auth.uid() = coach_id
  and (
    student_id is null
    or exists (
      select 1 from public.students
      where students.id = scheduled_classes.student_id
      and students.coach_id = auth.uid()
    )
  )
);

drop policy if exists "Coaches read own feedback" on public.student_feedback;
create policy "Coaches read own feedback"
on public.student_feedback for all
using (auth.uid() = coach_id)
with check (auth.uid() = coach_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists set_class_logs_updated_at on public.class_logs;
create trigger set_class_logs_updated_at
before update on public.class_logs
for each row execute function public.set_updated_at();

drop trigger if exists set_progress_scores_updated_at on public.progress_scores;
create trigger set_progress_scores_updated_at
before update on public.progress_scores
for each row execute function public.set_updated_at();

drop trigger if exists set_coach_payments_updated_at on public.coach_payments;
create trigger set_coach_payments_updated_at
before update on public.coach_payments
for each row execute function public.set_updated_at();

drop trigger if exists set_class_bonuses_updated_at on public.class_bonuses;
create trigger set_class_bonuses_updated_at
before update on public.class_bonuses
for each row execute function public.set_updated_at();

drop trigger if exists set_scheduled_classes_updated_at on public.scheduled_classes;
create trigger set_scheduled_classes_updated_at
before update on public.scheduled_classes
for each row execute function public.set_updated_at();

create or replace function public.submit_student_feedback(
  public_student_id uuid, fb_category text, fb_message text
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_coach uuid;
begin
  if fb_message is null or char_length(trim(fb_message)) = 0 then
    return;
  end if;

  select coach_id into v_coach
  from public.students
  where id = public_student_id;

  if v_coach is null then
    return;
  end if;

  insert into public.student_feedback (student_id, coach_id, category, message)
  values (
    public_student_id,
    v_coach,
    case when fb_category in ('clase','reporte','videos','general') then fb_category else 'general' end,
    left(trim(fb_message), 1000)
  );
end;
$$;

grant execute on function public.submit_student_feedback(uuid, text, text) to anon, authenticated;

create or replace function public.get_public_student(public_student_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select case
    when s.id is null then null
    else jsonb_build_object(
      'student', to_jsonb(s),
      'class_logs', coalesce((
        select jsonb_agg(to_jsonb(cl) order by cl.date desc, cl.created_at desc)
        from public.class_logs cl
        where cl.student_id = s.id
          and cl.deleted_at is null
      ), '[]'::jsonb),
      'progress_score', (
        select to_jsonb(ps)
        from public.progress_scores ps
        where ps.student_id = s.id
        limit 1
      ),
      'scheduled_classes', coalesce((
        select jsonb_agg(to_jsonb(sc) order by sc.class_date asc, sc.start_time asc)
        from (
          select sc.*
          from public.scheduled_classes sc
          where sc.student_id = s.id
            and sc.status in ('scheduled', 'confirmed')
            and sc.class_date >= current_date
          order by sc.class_date asc, sc.start_time asc
          limit 10
        ) sc
      ), '[]'::jsonb),
      'coach', (
        select jsonb_build_object('display_name', p.display_name, 'club_name', p.club_name)
        from public.profiles p
        where p.id = s.coach_id
        limit 1
      )
    )
  end
  from public.students s
  where s.id = public_student_id
  limit 1;
$$;

grant execute on function public.get_public_student(uuid) to anon, authenticated;

-- Coach profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  display_name text,
  phone text,
  club_name text,
  city text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
