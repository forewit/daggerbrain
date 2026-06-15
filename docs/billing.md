# Billing Design Intent

This document describes the intended billing model for the app. It is about product and system boundaries, not implementation mechanics.

## Core Principles

- Clerk remains the authentication provider.
- Stripe is the billing provider.
- Convex is the source of truth for app access.
- Product features should check Convex entitlements, not Stripe or Clerk billing state directly.
- Billing should be replaceable without rewriting feature gates.

## Entitlements

Paid access is represented as feature slugs in Convex, currently:

- `unlimited_characters`
- `unlimited_homebrew`

Feature gates should ask "does this user have this entitlement?" They should not know which billing provider produced it.

Stripe subscriptions update Convex entitlements through webhook-driven sync. Normal product workflows should not call Stripe to decide whether a user can create characters, create homebrew, or use paid features.

## Plans

The first paid plan is `adventurer`.

Plan display details can live in app-owned code or Convex data. Stripe product and price metadata can help map billing records to app entitlements, but the client should never submit raw Stripe price IDs as authority.

## User Experience

The app owns the billing UI:

- `/subscribe` presents plans and starts Stripe Checkout.
- `/profile` shows current billing status and links subscribed users to the Stripe Customer Portal.
- Clerk account management remains available for authentication/profile concerns, but Clerk Billing UI should not be used.

Free users should be sent toward upgrade flows, not into an empty Stripe portal.

## Migration Stance

This migration replaces Clerk Billing with Stripe Billing. It does not replace Clerk auth.

Existing Clerk Billing subscribers are expected to be transferred manually. The app should not maintain a long-term dual-provider entitlement model unless that becomes necessary later.

After Stripe is verified and existing subscribers are transferred, Clerk Billing entitlement refresh should be disabled and removed.

## Identity Direction

The current app uses Clerk subject IDs as user keys in many records. Stripe billing should initially follow that existing key so the billing migration stays narrow.

Long term, the preferred direction is:

- use `identity.tokenIdentifier` for auth-linked lookup,
- use internal Convex `users._id` values for app ownership,
- keep provider-specific IDs as metadata, not as primary ownership keys.

That identity migration should be treated as separate from the Stripe billing migration.
