# Client-owned provider authorization — Integrations Hub

**Status: architecture and release requirements; not an implemented OAuth feature.**

## Product contract

Star69AI's Integrations Hub is a managed service. A client chooses a business system and asks the Crew to prepare the integration. Before any live access is established, the client must authorize the specific provider account and approve the requested permissions. Star69AI must never ask a client to paste a provider password, private API key, or refresh token into Mission Control, email, chat, or a support request.

The provider catalog is illustrative until each provider's OAuth app, scopes, review requirements, supported API operations, and tenant isolation have been verified. A submitted request is not a connection. The UI must not show "Connected" unless a verified provider authorization and server-side connection record exist.

## Required authorization lifecycle

1. An authenticated client starts a connection from Mission Control. The Worker derives the customer ID from the verified Clerk identity and the existing customer link; it must never trust a customer ID supplied by the browser.
2. The Worker creates a cryptographically random, single-use OAuth state value bound to the authenticated customer, provider, exact redirect URI, requested scopes, and a short expiry. Use PKCE (S256) when supported by the provider. Persist only what is needed to validate and complete the transaction; hash the state at rest where practical.
3. Redirect the client to the provider's official authorization endpoint. The client signs in at the provider and sees the provider's own consent screen. Never collect provider credentials in Star69AI.
4. The Worker callback validates state, expiry, provider, redirect URI, and one-time use; exchanges the authorization code server-side; validates the returned provider identity/account; and rejects mismatched or ambiguous account bindings.
5. Store access/refresh tokens only as application-encrypted ciphertext in D1. Use authenticated encryption (for example AES-GCM), a key held only as a Cloudflare Worker secret, unique nonces, key versioning, and rotation/re-encryption procedures. D1 encryption at rest is an additional layer, not a substitute for application-layer token encryption. Never return tokens to the browser, include them in Retell prompts, or write them to logs.
6. Every later provider operation derives the tenant from the authenticated customer and queries a connection owned by that same tenant. Enforce provider, account, scopes, and operation allowlists server-side. Do not accept a client-supplied tenant/connection owner as authority.
7. Request the minimum scopes. Default to read-only. Ask for additional write scopes only when the user explicitly chooses a workflow that requires them and explain the specific records/fields that may be changed. No delete, payment, refund, or financial mutation permissions by default.
8. For calls, retrieve only the specific relevant record after an authorized lookup. Do not inject a full CRM export or entire customer database into a Retell prompt. Caller ID alone is not identity verification; require an appropriate verification step before exposing sensitive customer information or changing records.
9. Provide visible connection owner/account, granted scopes, last successful sync/use, status, reconnect, and disconnect controls. Disconnect immediately blocks further use, removes stored ciphertext and pending jobs, and invokes the provider revocation endpoint when available. Record a tenant-scoped audit event without recording secrets.
10. Apply rate limits, timeouts, idempotency, pagination limits, webhook signature validation, retry controls, data minimization, retention, export/deletion procedures, and monitoring. Fail closed for provider data access when authorization or tenant ownership cannot be proven.

## Retell integration boundary

Do not assume a Retell-native OAuth integration is safely isolated per Star69AI customer merely because Retell lists that provider. Before using a native integration, verify from current Retell documentation/API and a test account that each customer's provider authorization is independently owned, scoped, revocable, and cannot be selected by another tenant under Star69AI's shared agency account. If that guarantee cannot be demonstrated, keep provider OAuth and data access in the Star69AI Worker and expose narrowly scoped, authenticated custom functions to Retell. Retell receives only the minimum result needed for the current call.

## Provider rollout gate

Do not build a generic multi-provider OAuth engine or advertise live support until each provider has:
- a registered Star69AI OAuth application and approved redirect URI;
- confirmed official authorization/token/revocation endpoints and scope definitions;
- documented refresh-token rotation, expiry, account identity, rate-limit, and webhook behavior;
- verified tenant-isolation tests using two separate customer accounts;
- tested connect, callback, token refresh, least-privilege access, reconnect, revoke, disconnect, and failure handling;
- published privacy/consent language and retention/deletion behavior;
- confirmed required provider verification or app-review approval.

Start with one provider only after credentials and provider-specific requirements are available. CSV import is a separate feature and must have explicit upload consent, field mapping, validation, tenant isolation, and deletion controls.

## Current PR #276 scope

PR #276 currently adds a Crew-managed integration request catalog using the existing tenant-scoped agent-change-request workflow. It does **not** implement OAuth, provider credentials, token storage, a provider callback, live connections, customer-data import/sync, Retell custom functions, or production configuration. The catalog and request history must remain clearly labeled as requests until the full provider-specific authorization path is implemented and tested. Do not merge or deploy this PR as a live integrations feature.
