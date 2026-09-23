-- Run this once in the Supabase SQL Editor for the current project.
-- It enables every post owner to approve or reject claims on their own posts.

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

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

alter table public.notifications enable row level security;

drop policy if exists "Users can view their notifications" on public.notifications;
create policy "Users can view their notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = recipient_id);

drop policy if exists "Claimants can notify post owners" on public.notifications;
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

drop policy if exists "Post owners can notify claimants" on public.notifications;
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

drop policy if exists "Users can mark their notifications as read" on public.notifications;
create policy "Users can mark their notifications as read"
on public.notifications
for update
to authenticated
using (auth.uid() = recipient_id)
with check (auth.uid() = recipient_id);

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
grant usage on schema public to authenticated;
grant execute on function public.review_claim_as_owner(uuid, text, text) to authenticated;

notify pgrst, 'reload schema';
