# Daggerbrain

Daggerbrain is a DNDBeyond-style set of digital tools for the Daggerheart TTRPG. This software is available through the MIT license (see the license in the repo).

Daggerbrain includes materials from the Daggerheart System Reference Document 1.0, © Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL) License. More information can be found at https://www.daggerheart.com. There are no previous modifications by others

This repo includes character, campaign, encounter, homebrew, and stream overlay tools, as well as a markdown style Blog, subscriptions through Clerk billing, and more.

Basic Stack:
- Convex (backend and DB)
- Sveltekit (fullstack framework)
- Cloudflare Workers (deploy target)
- Cloudflare R2 (image storing)
- Clerk (Auth and Billing)

## Prerequisites
- NPM (node 24 or later)
- A Convex account or local Convex dev deployment
- A Clerk application for authentication

## Install

```bash
npm install
```

## Environment
There is an `env.example` file in the repo that you can use as a template to set up your own `.env.local` environment file.

## Clerk Setup

Create a Clerk application and copy its publishable key, secret key, and frontend
API/issuer URL into `.env.local`.

Convex auth expects Clerk tokens from a JWT template named `convex`. In Clerk,
create that JWT template and make sure its audience matches `convex`.

## Convex Setup

Start the Convex dev process in one terminal:

```bash
npm run convex:dev
```

On the first run, Convex will prompt you to log in and select or create a dev
deployment. Keep this process running while working on the app.

After setup, confirm `.env.local` contains `CONVEX_DEPLOYMENT` and
`PUBLIC_CONVEX_URL`. If Convex does not add `PUBLIC_CONVEX_URL` automatically,
copy the Convex client URL printed by the dev process into that variable.

The app does not need a separate seed step for normal local use. When a user
signs in for the first time, the app creates the user record.

## Run The App

Start the SvelteKit dev server in a second terminal:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Cloudflare And R2

The normal Vite dev server is enough for most frontend and Convex work. Image
upload and image proxy routes depend on Cloudflare platform bindings for
`R2_IMAGES` and `R2_USERCONTENT`; without those bindings, those routes will
return a dependency unavailable response.

To test closer to the Cloudflare runtime, build first and then run Wrangler:

```bash
npm run build
npx wrangler dev
```

You will also need Cloudflare credentials and R2 bucket bindings configured for
your own account.

## Sentry
You will need to update `/src/hooks.server.ts` with your Sentry DSN url.
Also you will need to update `/vite.config.ts` with your sentry org and project names

## Troubleshooting

- `PUBLIC_ORIGIN environment variable is not set`: add `PUBLIC_ORIGIN=http://localhost:5173`
  to `.env.local` and restart the dev server.
- Convex auth returns unauthenticated: confirm the Clerk JWT template is named
  `convex`, `PUBLIC_CLERK_FRONTEND_API_URL` matches the Clerk issuer/frontend API
  URL, and `pnpm convex:dev` was restarted after env changes.
- The app redirects to `/maintenance`: set `MAINTENANCE_MODE=false`, or set
  `ADMIN_CLERK_ID` to the signed-in Clerk user id.
- Image upload fails locally: run with Cloudflare/R2 bindings or avoid upload
  features during normal Vite development.
