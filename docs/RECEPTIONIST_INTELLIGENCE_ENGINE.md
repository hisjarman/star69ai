# Receptionist Intelligence Engine

## Current implementation in this feature branch
- **Call Shield pre-answer screening:** the Retell inbound webhook HMAC-fingerprints the caller ID scoped to the client and dialed business line. More than eight attempts from the same caller ID to the same line in a fixed 10-minute burst window triggers a 15-minute temporary rejection window before the AI agent connects. Call IDs are deduplicated; the shield stores keyed hashes, not raw caller numbers, and prunes its operational history after 30 days. Withheld/invalid caller IDs are not automatically blocked. The screen fails open if its own tables/logic are unavailable so the existing minute reservation and billing protections continue to operate.
- **Minute-cost controls remain layered:** per-call reservations and the existing account overage/available-balance gate still run after screening. A pre-answer reject avoids AI-agent conversation minutes, but does not guarantee that a carrier or telephony provider will not charge for call delivery.
- **Caller-risk intelligence:** post-call Workers AI now returns a cautious `caller_risk_assessment` (`likely_spam`, `possibly_abusive`, `legitimate`, or `unclear`) plus evidence signals. The client API and Mission Control report expose these assessments and the 30-day count of repeat-call bursts rejected by Call Shield. AI risk labels are advisory only and never automatically blacklist callers or change live agents.
- Retell `call_analyzed` webhooks trigger server-side analysis of the stored transcript and provider summary.
- The Worker calls Cloudflare Workers AI through the native `env.AI.run()` binding. Default model: `@cf/zai-org/glm-4.7-flash`; optional Worker variable `INTELLIGENCE_MODEL` overrides it. No OpenAI account, API key or external AI credential is required.
- Structured output is persisted per call in `avr_call_intelligence`: caller intent, outcome, lead-capture assessment, confidence, friction points and recommendations.
- The authenticated client API scopes all results to the signed-in customer's D1 customer ID.
- Client Mission Control displays counts and per-call diagnostics/recommendations. A public page explains the managed optimization service.
- AI findings are assessments, not verified bookings, sales or revenue. CRM/booking integration is required for confirmed conversion attribution.

## Deployment requirements
1. Apply `cloudflare/migrations/20261118_receptionist_intelligence.sql` to the production D1 database before deploying the Worker.
2. In Cloudflare Dashboard, open **Workers & Pages → avr-platform-api → Settings → Bindings → Add → Workers AI**. Set the variable name to **AI**, save, and redeploy the Worker. If the Worker is deployed from a Wrangler configuration instead, add `"ai": {"binding":"AI"}` to that configuration.
3. Do not configure `OPENAI_API_KEY`; this implementation does not use OpenAI. Optional model override: `INTELLIGENCE_MODEL`, default `@cf/zai-org/glm-4.7-flash`.
4. Deploy `cloudflare/platform-worker.js` and publish the GitHub Pages changes.
5. Verify a real Retell `call_analyzed` event creates one intelligence row and only the matching client can read it. If the AI binding is absent or quota/model execution fails, the webhook logs the analysis failure and the call record itself remains stored.

## Safety boundary / next phase
This phase analyzes calls and creates recommendations; it does not automatically alter live Retell agents. The existing version-safe Retell prompt publishing route is admin-only and should remain the final approval/publish gate. Next phase: generate a versioned proposed prompt patch from aggregated evidence, run scenario tests against business-approved facts and guardrails, then require explicit Crew approval before publishing and support rollback. Business-critical settings must never be changed autonomously.
