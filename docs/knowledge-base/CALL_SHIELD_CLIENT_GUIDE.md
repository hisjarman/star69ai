# Call Shield — Client Guide

Audience: Star69AI customers and authorized business-team members.
Status: Source-level guide based on the 2026-11-18 implementation. Full live-call and browser rollout QA remains outstanding. Your accepted order and saved Mission Control configuration govern your account.

## What it does
Call Shield screens repeated inbound attempts from the same caller to the same business number before connecting the caller to your AI receptionist. When the configured attempt threshold is exceeded, later attempts can be rejected during a cooldown. This can reduce repeated-call abuse and unnecessary AI-agent conversation time.

It is not a universal spam filter or a guarantee against robocalls, harassment, caller-ID spoofing or carrier charges. A rejected call may still incur carrier or telephony delivery charges.

## Find Call Shield
1. Sign in to Mission Control.
2. Open Call Shield in the client navigation.
3. Review the protection preset, saved limits, 30-day screening/rejection totals and recent event history.
4. Change the settings available to your account and save.
5. Reopen the page to confirm the saved values.

If the page is unavailable, contact Crew Support. Do not assume a setting changed live call handling until the saved configuration is confirmed.

## Presets
- Standard: balanced starting point for ordinary business call patterns.
- Strict: more restrictive; may reject legitimate callers who retry frequently.
- Business Friendly: less restrictive starting point for businesses where customers commonly call back.

A preset is a starting configuration. Review the resulting numeric settings before saving.

## Settings
| Setting | Meaning | Current source-level range |
|---|---|---:|
| Repeat attempts | Same-caller attempts allowed before subsequent attempts are rejected | 3–20 |
| Detection window | Period in which attempts are counted | 1–60 minutes |
| Cooldown | How long repeat-caller rejection remains in effect | 1–120 minutes |
| Maximum AI call duration | Upper limit for an AI-agent conversation | 1–30 minutes |

The server validates these values. The effective call duration can be lower when plan minutes, wallet balance or usage reservations require a shorter call. The configured maximum is not guaranteed talk time.

## What happens to a caller
- Early attempts within the configured window may proceed normally.
- Once the threshold is exceeded, subsequent same-caller attempts can be rejected for the cooldown.
- After cooldown expiry, a later attempt may be screened again under the current settings.
- Screening is scoped to the customer and dialed business number.
- Recent event history is designed not to display raw caller phone numbers.

Call Shield uses a privacy-preserving caller fingerprint rather than writing raw caller numbers to its screening tables. Withheld or invalid caller IDs are not automatically blocked by this repeat-caller rule. Caller-ID spoofing cannot be reliably identified.

## Star69AI safeguards
Client controls cannot disable screening, bypass authorization, exceed validated ranges, raise the 75% plan overage ceiling, bypass plan/Minute Vault/Flex wallet checks or automatically create permanent denylist entries. Permanent caller blocking requires Crew review. AI caller-risk labels are advisory only and do not independently trigger permanent blocking.

## Troubleshooting
**A legitimate caller cannot get through:** note the approximate time and business number, review screening history and contact Crew Support. Avoid asking the caller to repeatedly redial while a cooldown may be active.

**A setting will not save:** check the displayed ranges, save again, refresh and confirm the values. If it persists, open a support request with the setting name and approximate time. Never send passwords or payment details.

**A call ended sooner than the configured maximum:** the maximum is only an upper bound. Plan minutes, wallet balance and reservations can impose a shorter duration.

**A spam call still got through:** this is a repeat-attempt control, not universal spam detection. Different, withheld or spoofed caller IDs limit what it can recognize.

## Privacy
Screening event history is operational metadata, not a full call recording or transcript. Limit access to authorized account users. Recording, transcription, consent, carrier billing, retention and deletion follow your account configuration, provider terms and applicable law.

For help, use Mission Control → Crew Support. Include the approximate time, affected business number and what happened. Do not include unnecessary personal data, passwords or payment details.

This guide describes source behavior recorded on November 18, 2026. Live browser and inbound-call verification across all modes remains a rollout task.
