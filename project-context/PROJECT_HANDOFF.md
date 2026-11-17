## Business Intelligence & Receptionist Performance Center — 2026-11-17

- Feature branch: `feature/business-intelligence-performance-center`. Enhances the existing authenticated THE COCKPIT Overview; no duplicate dashboard, navigation, API route or database table.
- Adds a customer-scoped performance summary to the existing `/api/client/dashboard` response using aggregate queries over `avr_calls`: current UTC calendar-month call count and call duration, average call duration, provider-analyzed positive/neutral/negative sentiment counts, previous-month call count, and daily call counts for the last 14 days.
- Timestamp aggregation normalizes existing second- and millisecond-based `start_timestamp` values. It does not read another customer's calls; every query is filtered by the authenticated customer ID.
- Adds an Overview panel with current-month calls, total call minutes, average duration, positive sentiment share among calls with a recognized sentiment, a 14-day call-volume chart, and a sentiment breakdown. Missing sentiment is excluded from the sentiment denominator.
- Clearly labels sentiment as provider analysis, not a measure of lead quality or customer satisfaction. Explicitly discloses that bookings, qualified leads, missed-call classifications and revenue are not currently captured as structured outcomes and are not inferred.
- No D1 migration, schema change, new route, third-party integration, billing behavior, Retell behavior, customer records or production configuration is changed.
- Verification required before merge/deploy: JavaScript syntax parse for Worker and client bundle; HTML/CSS structural checks; SQL execution against a representative SQLite/D1 schema including mixed seconds/milliseconds timestamps; customer-isolation review; authenticated desktop/mobile browser QA; production Worker and GitHub Pages deployment remain separate approvals.
- Preserve all existing portal pages, authentication, customer scoping, minute vault and fixed 75% overage enforcement.
## Previous dashboard enhancement follow-through — 2026-11-16

