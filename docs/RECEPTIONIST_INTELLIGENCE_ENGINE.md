# Receptionist Intelligence Engine

## Current implementation in this feature branch
- Retell `call_analyzed` webhooks trigger server-side analysis of the stored transcript and provider summary.
- The Worker sends only call text needed for analysis to the configured OpenAI API secret (`OPENAI_API_KEY`); model defaults to `gpt-4.1-mini`, overridable with `INTELLIGENCE_MODEL`.
- Structured output is persisted per call in `avr_call_intelligence`: caller intent, outcome, lead-capture assessment, confidence, friction points and recommendations.
- The authenticated client API scopes all results to the signed-in customer's D1 customer ID.
- Client Mission Control displays counts and per-call diagnostics/recommendations. A public page explains the managed optimization service.
- AI findings are assessments, not verified bookings, sales or revenue. CRM/booking integration is required for confirmed conversion attribution.

## Deployment requirements
1. Apply `cloudflare/migrations/20261118_receptionist_intelligence.sql` to the production D1 database before deploying the Worker.
2. Set Cloudflare Worker secret `OPENAI_API_KEY` (and optionally `INTELLIGENCE_MODEL`) for the platform Worker.
3. Deploy `cloudflare/platform-worker.js`.
4. Publish the GitHub Pages changes.
5. Verify a real Retell `call_analyzed` event creates one intelligence row and only the matching client can read it.

## Safety boundary / next phase
This phase analyzes calls and creates recommendations; it does not automatically alter live Retell agents. The existing version-safe Retell prompt publishing route is admin-only and should remain the final approval/publish gate. Next phase: generate a versioned proposed prompt patch from aggregated evidence, run scenario tests against business-approved facts and guardrails, then require explicit Crew approval before publishing and support rollback. Business-critical settings must never be changed autonomously.
