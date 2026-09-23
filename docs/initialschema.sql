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
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

alter table public.claims
add column if not exists reviewed_by uuid references auth.users(id);

-- Comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- Notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  claim_id uuid references public.claims(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  type text not null default 'claim_status_changed',
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.posts enable row level security;
alter table public.claims enable row level security;
alter table public.comments enable row level security;
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

drop policy if exists "Post owners can approve or reject claims" on public.claims;

create policy "Post owners can approve or reject claims"
on public.claims
for update
to authenticated
using (
  exists (
    select 1
    from public.posts
    where posts.id = claims.post_id
      and posts.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.posts
    where posts.id = claims.post_id
      and posts.user_id = auth.uid()
  )
);

-- Owner review RPC: bypasses client-side RLS after validating auth.uid() owns the post.
drop function if exists public.review_claim_as_owner(uuid, text, text);

create or replace function public.review_claim_as_owner(
  p_claim_id uuid,
  p_status text,
  p_comments text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_claim public.claims%rowtype;
  competing_claim public.claims%rowtype;
begin
  if p_status not in ('Approved', 'Rejected') then
    raise exception 'Invalid claim status';
  end if;

  select claims.*
  into selected_claim
  from public.claims
  join public.posts on posts.id = claims.post_id
  where claims.id = p_claim_id
    and claims.status = 'Pending'
    and posts.user_id = auth.uid();

  if not found then
    raise exception 'Claim is not pending or you do not own this post';
  end if;

  update public.claims
  set status = p_status,
      admin_comments = p_comments,
      reviewed_at = now(),
      reviewed_by = auth.uid()
  where id = selected_claim.id;

  insert into public.notifications (recipient_id, claim_id, type, message)
  values (
    selected_claim.claimant_id,
    selected_claim.id,
    'claim_status_changed',
    'Your claim status has been updated to ' || p_status || '.'
  );

  if p_status = 'Approved' then
    update public.posts
    set status = 'Claimed'
    where id = selected_claim.post_id;

    for competing_claim in
      select *
      from public.claims
      where post_id = selected_claim.post_id
        and status = 'Pending'
        and id <> selected_claim.id
    loop
      update public.claims
      set status = 'Rejected',
          admin_comments = 'Another claim for this item was approved.',
          reviewed_at = now(),
          reviewed_by = auth.uid()
      where id = competing_claim.id;

      insert into public.notifications (recipient_id, claim_id, type, message)
      values (
        competing_claim.claimant_id,
        competing_claim.id,
        'claim_status_changed',
        'Your claim status has been updated to Rejected.'
      );
    end loop;
  end if;
end;
$$;

revoke all on function public.review_claim_as_owner(uuid, text, text) from public;
grant execute on function public.review_claim_as_owner(uuid, text, text) to authenticated;

notify pgrst, 'reload schema';

-- Comments policies
create policy "Authenticated users can view comments"
on public.comments
for select
to authenticated
using (true);

create policy "Users can create their own comments"
on public.comments
for insert
to authenticated
with check (auth.uid() = author_id);

-- Users can only view and mark their own notifications as read
create policy "Users can view their notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = recipient_id);

create policy "Claimants can notify post owners"
on public.notifications
for insert
to authenticated
with check (
  type = 'claim_submitted'
  and exists (
    select 1
    from public.claims
    join public.posts on posts.id = claims.post_id
    where claims.id = notifications.claim_id
      and claims.claimant_id = auth.uid()
      and posts.user_id = notifications.recipient_id
  )
);

create policy "Post owners can notify claimants"
on public.notifications
for insert
to authenticated
with check (
  type = 'claim_status_changed'
  and exists (
    select 1
    from public.claims
    join public.posts on posts.id = claims.post_id
    where claims.id = notifications.claim_id
      and claims.claimant_id = notifications.recipient_id
      and posts.user_id = auth.uid()
  )
);

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

create or replace function public.notify_claim_submission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, claim_id, type, message)
  select posts.user_id,
    new.id,
    'claim_submitted',
    'A new claim was submitted for your post: ' || posts.item_name || '.'
  from public.posts
  where posts.id = new.post_id;

  return new;
end;
$$;

drop trigger if exists claim_submission_notification on public.claims;

create trigger claim_submission_notification
after insert on public.claims
for each row
execute function public.notify_claim_submission();

create or replace function public.notify_comment_submission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (
    recipient_id,
    post_id,
    comment_id,
    type,
    message
  )
  select posts.user_id,
    new.post_id,
    new.id,
    'comment_submitted',
    'A new comment was posted on your item: ' || posts.item_name || '.'
  from public.posts
  where posts.id = new.post_id
    and posts.user_id <> new.author_id;

  return new;
end;
$$;

drop trigger if exists comment_submission_notification on public.comments;

create trigger comment_submission_notification
after insert on public.comments
for each row
execute function public.notify_comment_submission();

-- Reject other pending claims when one claim is approved for an item
create or replace function public.reject_other_claims_after_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.claims
  set status = 'Rejected',
      admin_comments = 'Another claim for this item was approved.',
      reviewed_at = now(),
      reviewed_by = new.reviewed_by
  where post_id = new.post_id
    and id <> new.id
    and status = 'Pending';

  return new;
end;
$$;

drop trigger if exists reject_other_claims_after_approval on public.claims;

create trigger reject_other_claims_after_approval
after update of status on public.claims
for each row
when (new.status = 'Approved')
execute function public.reject_other_claims_after_approval();