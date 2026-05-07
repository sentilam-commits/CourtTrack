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

alter table public.students enable row level security;
alter table public.class_logs enable row level security;
alter table public.progress_scores enable row level security;

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
      ), '[]'::jsonb),
      'progress_score', (
        select to_jsonb(ps)
        from public.progress_scores ps
        where ps.student_id = s.id
        limit 1
      )
    )
  end
  from public.students s
  where s.id = public_student_id
  limit 1;
$$;

grant execute on function public.get_public_student(uuid) to anon, authenticated;
