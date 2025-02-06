-- Create newsletter table
create table if not exists public.newsletter_subscribers (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.newsletter_subscribers enable row level security;

-- Create policy to allow anyone to insert
create policy "Anyone can subscribe to newsletter" on public.newsletter_subscribers
    for insert
    to public
    with check (true);

-- Create policy to allow system to check existing subscriptions
create policy "Anyone can check existing subscriptions" on public.newsletter_subscribers
    for select
    to public
    using (true); 