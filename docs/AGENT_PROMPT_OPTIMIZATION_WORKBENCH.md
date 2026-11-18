# Star69AI — Controlled Retell Prompt Optimization Workbench

## Purpose
Turn real call intelligence into a proposed improvement to a customer-specific Retell LLM prompt. This is an admin-only workflow. A suggestion never changes a live agent on its own.

## Workflow
1. Select an assigned Retell LLM agent and one of that agent's analyzed calls.
2. Cloudflare Workers AI drafts the smallest evidence-based prompt change and four to six caller scenarios.
3. An administrator reviews and can edit the complete proposed prompt.
4. Run offline scenario simulation. The test is explicitly model-based QA, not a live Retell call or guarantee of production behavior. The test fails closed when the model returns missing, uncertain, medium-risk or high-risk results.
5. Only a proposal with passing low-risk scenarios can be approved. The approval action requires a confirmation and publishes a new Retell agent version.
6. The Worker re-reads the Retell configuration and verifies that the exact prompt is live before recording publication.
7. Rollback publishes the stored previous prompt as another new Retell version. It refuses rollback if the live prompt has changed since the proposal was published.

## Guardrails
- Admin-only API routes; proposals are tied to one customer, agent, source call and source intelligence record.
- The call analysis must belong to the selected agent.
- The current Retell prompt must still exactly match the saved base prompt at test and approval time. If it changed, the proposal is stale and must be regenerated.
- The model is instructed to preserve business facts, pricing, guarantees, legal/policy language, appointment availability, emergency routing, escalation rules and false-booking safeguards.
- Credential-like strings are rejected.
- Only Retell LLM agents with a readable `general_prompt` are supported. Conversation Flow graph changes are out of scope.
- The old prompt is stored for rollback; the live prompt is never overwritten without explicit admin approval.
- AI scenario simulation is not a substitute for a real call, human review, integration checks or monitoring after release.

## Deployment
1. Apply `cloudflare/migrations/20261118_agent_prompt_optimization.sql` to the production D1 database after the Receptionist Intelligence migration.
2. Deploy the updated `cloudflare/platform-worker.js`.
3. Publish `admin/index.html` and `admin/admin.js` to GitHub Pages.
4. Sign in to the admin Command Center, open **Agents & numbers**, and use the **AI prompt optimization workbench**.
5. Test on a non-critical agent before enabling the process for customer production agents.

## API routes
- `GET /api/admin/agent-prompt-proposals`: proposals and eligible call intelligence.
- `POST /api/admin/agent-prompt-proposals`: generate a proposal from an agent and call analysis.
- `POST /api/admin/agent-prompt-proposals/:id/test`: save edits and run offline scenario simulation.
- `POST /api/admin/agent-prompt-proposals/:id/approve`: create and publish a new Retell version after passing tests and admin approval.
- `POST /api/admin/agent-prompt-proposals/:id/rollback`: publish the saved base prompt as a new Retell version.
- `POST /api/admin/agent-prompt-proposals/:id/reject`: reject an unpublished proposal.
