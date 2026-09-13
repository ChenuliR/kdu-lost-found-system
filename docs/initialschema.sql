-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('lost', 'found')),
  item_name text not null,
  category text not null,
  date date not null,
  location text not null,
  description text not null,
  image_url text,
  status text not null default 'Active'
    check (status in ('Active', 'Claimed', 'Closed')),
  created_at timestamptz not null default now()
);

-- Add status if posts already existed
alter table public.posts
add column if not exists status text not null default 'Active';

-- Claims table
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  claimant_id uuid not null references auth.users(id) on delete cascade,
  proof_details text not null,
  contact_info text not null,
  status text not null default 'Pending'
    check (status in ('Pending', 'Approved', 'Rejected')),
  admin_comments text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  claim_id uuid references public.claims(id) on delete cascade,
  type text not null default 'claim_status_changed',
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.posts enable row level security;
alter table public.claims enable row level security;
alter table public.notifications enable row level security;

-- Posts policies
create policy "Authenticated users can view posts"
on public.posts
for select
to authenticated
using (true);

create policy "Users can create their own posts"
on public.posts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own posts"
on public.posts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
on public.posts
for delete
to authenticated
using (auth.uid() = user_id);

-- Admins can update post status
create policy "Admins can update post status"
on public.posts
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Claims policies
create policy "Users can submit claims"
on public.claims
for insert
to authenticated
with check (auth.uid() = claimant_id);

create policy "Claimants can view their claims"
on public.claims
for select
to authenticated
using (auth.uid() = claimant_id);

create policy "Post owners can view claims"
on public.claims
for select
to authenticated
using (
  exists (
    select 1
    from public.posts
    where posts.id = claims.post_id
      and posts.user_id = auth.uid()
  )
);

create policy "Admins can view claims"
on public.claims
for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can approve or reject claims"
on public.claims
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Users can only view and mark their own notifications as read
create policy "Users can view their notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = recipient_id);

create policy "Users can mark their notifications as read"
on public.notifications
for update
to authenticated
using (auth.uid() = recipient_id)
with check (auth.uid() = recipient_id);

-- Automatically update post status when claim is approved
create or replace function public.update_post_status_after_claim()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'Approved' then
    update public.posts
    set status = 'Claimed'
    where id = new.post_id;
  end if;

  return new;
end;
$$;

drop trigger if exists claim_status_update on public.claims;

create trigger claim_status_update
after update of status on public.claims
for each row
when (new.status = 'Approved')
execute function public.update_post_status_after_claim();

-- Notify the claimant and post owner only when the claim status changes
create or replace function public.notify_claim_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.notifications (recipient_id, claim_id, type, message)
    select distinct recipients.recipient_id,
      new.id,
      'claim_status_changed',
      'Your claim status has been updated to ' || new.status || '.'
    from (
      values
        (new.claimant_id),
        ((select user_id from public.posts where id = new.post_id))
    ) as recipients(recipient_id)
    where recipients.recipient_id is not null;
  end if;

  return new;
end;
$$;

drop trigger if exists claim_status_notification on public.claims;

create trigger claim_status_notification
after update of status on public.claims
for each row
when (old.status is distinct from new.status)
execute function public.notify_claim_status_change();