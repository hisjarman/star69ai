# HubSpot integration — first provider rollout

**Status: implementation foundation on a feature branch; not production-ready until secrets, D1 migration, OAuth app setup and end-to-end tests are complete.**

## What this branch adds
- Client-owned HubSpot OAuth authorization initiated from Mission Control.
- Single-use, hashed, tenant-bound state with a 10-minute expiry and exact redirect URI.
- HubSpot's current date-versioned OAuth token endpoint (`/oauth/2026-03/token`) for authorization-code exchange.
- AES-256-GCM application-layer encryption for access and refresh tokens. The 32-byte key is a Cloudflare Worker secret named `INTEGRATION_ENCRYPTION_KEY`; HubSpot app credentials are Worker secrets `HUBSPOT_CLIENT_ID` and `HUBSPOT_CLIENT_SECRET`.
- Tenant-scoped connection status and disconnect/revocation.
- Least-privilege initial scope: `oauth crm.objects.contacts.read`. No write scope, CRM mutation, bulk import or call-time Retell tool is enabled in this milestone.

## Required Cloudflare setup
1. Create a HubSpot public OAuth app in the Star69AI developer account.
2. Register exactly: `https://avr-platform-api.hisjarman.workers.dev/oauth/hubspot/callback`.
3. Configure only `oauth` and `crm.objects.contacts.read` for the first milestone.
4. Add Worker secrets `HUBSPOT_CLIENT_ID`, `HUBSPOT_CLIENT_SECRET`, and a randomly generated 32-byte key encoded as base64url named `INTEGRATION_ENCRYPTION_KEY`. Never commit or paste secrets into chat.
5. Apply `cloudflare/migrations/20261118_hubspot_oauth_connections.sql` to D1 before deploying this Worker.

## Current behavior and boundaries
- OAuth state binds the callback to the authenticated Star69AI customer and can be consumed only once.
- Tokens are encrypted with AES-GCM before D1 storage. Connection setup fails closed if the encryption secret is absent or malformed.
- The callback stores HubSpot's returned portal ID and granted scopes; it requires the contact-read scope.
- Disconnect calls HubSpot's current `/oauth/2026-03/token/revoke` endpoint before deleting local ciphertext. If revocation fails, local credentials remain so the operation can be retried.
- No contacts are fetched, imported, synchronized, created or updated. No customer data is sent to Retell in this milestone.

## Release gates
- Validate app registration and callback URL.
- Apply migration to a disposable D1 database and production only after review.
- Test two independent HubSpot portals against two Star69AI customers; prove no cross-tenant connection/status access.
- Test successful consent, denied consent, invalid/expired/replayed state, token exchange failure, encrypted persistence, token refresh/rotation, revoke and disconnect.
- Inspect logs and database rows to confirm no cleartext tokens, authorization codes or state values are retained.
- Run signed-in Mission Control QA at phone/tablet/desktop widths.
- Only after those gates should a separate milestone enable read-only contact lookup and Retell custom functions.

## Official HubSpot references
- [OAuth v1 deprecation and current date-versioned token, introspection and revoke endpoints](https://developers.hubspot.com/changelog/v1-oauth-api-deprecation)
- [Migration guide with exact form-encoded authorization-code and refresh requests, introspection and revoke contract](https://developers.hubspot.com/docs/api-reference/legacy/authentication/oauth-tokens/v1/migration-guide)
- [OAuth token lifecycle and secure token management](https://developers.hubspot.com/blog/oauth-token-management-hubspot-integrations)
