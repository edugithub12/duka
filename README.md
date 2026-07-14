# SecureLink — CCTV, Networking & Access Control storefront

Next.js + Supabase e-commerce site. No shopping cart or checkout form —
customers tap "Order on WhatsApp" on any product, which opens a
pre-filled WhatsApp message, and pay via your M-Pesa Buy Goods Till.
Customers can also create an account to see their order history.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase (free tier)

1. Create a project at https://supabase.com
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
   This creates the `products` and `orders` tables, security policies, and
   5 sample products so you have something to look at immediately.
3. Go to **Authentication → Providers** and make sure **Email** is enabled
   (it is by default). This powers customer sign up / sign in.
4. Go to **Project Settings → API** and copy your **Project URL** and
   **anon public key**.

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from step 2
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — your WhatsApp Business number, digits only,
  international format (e.g. `254712345678`)
- `NEXT_PUBLIC_MPESA_TILL` — your M-Pesa Buy Goods Till number

## 4. Run it locally

```bash
npm run dev
```

Visit http://localhost:3000

## 5. Give yourself admin access

1. Sign up for a customer account on the site itself (`/account`), or
   in Supabase → **Authentication → Users**.
2. Copy that user's UUID, then in **SQL Editor** run:
   ```sql
   insert into admins (user_id) values ('paste-the-uuid-here');
   ```
3. Visit `/admin` and sign in — you'll now see the dashboard.

## 6. Add your real products

You can add products either from `/admin` → **Products**, or directly
in Supabase → **Table Editor** → `products`. Key fields:

- `category` must be one of: `cctv`, `networking`, `access-control`,
  `electric-fence`, `alarms` (matches `lib/siteConfig.ts`)
- `specs` is a JSON object shown as a spec sheet on the product page, e.g.
  `{"Resolution": "4MP", "Channels": "8"}`
- `image_url` — upload images in Supabase **Storage** (make the bucket
  public), then paste the public URL here

## 7. Rebrand

Edit `lib/siteConfig.ts` — business name, tagline, and category list all
live in one place. Colors and fonts are in `tailwind.config.ts` and
`app/globals.css` if you want to adjust the look further once you share
your logo.

## 8. Deploy for free

Push this to GitHub, then import the repo at https://vercel.com (free tier).
Add the same environment variables from `.env.local` in Vercel's project
settings. Done — you get a free `.vercel.app` URL, or connect your own
domain later.

## What's not built yet (next steps)

- Automatic M-Pesa STK Push (currently: customer pays your Till manually,
  confirms via WhatsApp) — see Daraja API once your business + Till are
  registered.

## Updating an existing project

If you already ran `supabase/schema.sql` before and are pulling in a
newer version of this project (e.g. the **Customers** admin page), just
paste the *whole* updated `schema.sql` into the SQL Editor and run it
again — every statement is written to be safely re-runnable (`create
table if not exists`, `drop policy if exists` before each `create
policy`, etc.), so it won't error on things that already exist. Running
it adds the new `profiles` table (used to show customer emails in
`/admin/customers`) and backfills it for any accounts that signed up
before this table existed.
