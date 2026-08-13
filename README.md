Keyloop Sales Lead Management Tool

Keyloop Technical Assessment — Scenario C: The Sales Lead Management Tool (Demand domain).

A lightweight tool that lets salespeople see incoming website leads, drill into a lead's
full details and activity history, and log new follow-up activities (calls, emails, SMS).

This submission implements the frontend service layer in full, talking directly to a real
Supabase project (Postgres + Auth + Row Level Security) instead of a mocked/stubbed
backend. That's a deliberate deviation from the assessment's Frontend-path default of
mocking the backend — no custom backend service was written for this submission, Supabase
is consumed the same way a mock would have been, and it demonstrates real persistence and
database-enforced authorization instead of simulating it. The reasoning is written up in
full in System Design Document (Keyloop_System_Design_Document_Ngo_Ngoc_Long.pdf).


Core requirements covered

Lead Inbox (list of all incoming leads)
[LeadInboxPage](src/pages/leads/LeadInboxPage.tsx) renders
[LeadsTable](src/pages/leads/components/LeadsTable.tsx), backed by
[useLeads](src/apis/leads/useLeads.ts) — server-side pagination, search, filter, sort.

Lead Details View (full details + chronological activity log)
[LeadDetailPage](src/pages/leads/LeadDetailPage.tsx) shows lead details plus an activity
timeline sourced from [useTimeLineLeadAct](src/apis/leads/useTimeLineLeadAct.ts).

Activity Logging (persisted follow-up activity)
The "Log activity" form on the lead detail page calls
[useCreateActivity](src/apis/leads/useCreateActivity.ts), which inserts into Supabase and
invalidates both the timeline and inbox caches.

Beyond the three required features, the app also includes lead status transitions
(useUpdateLeadStatus), lead assignment (useAssignLead), next-follow-up scheduling
(useUpdateNextFollowUp), and cross-tab real-time sync via a Supabase broadcast channel
(useLeadsRealtime).

It also includes an admin-gated Create Lead screen (CreateLeadPage) — a manual, supporting
extension for adding a lead by hand (tagged `source = MANUAL`), separate from the Lead
Inbox's core website-sourced leads. Building an actual dealership website is out of scope
for this assessment, so the leads that satisfy Scenario C's "incoming sales leads from the
dealership's website" requirement (`source = WEBSITE`, the `leads` table's column default)
were seeded directly into the database instead of arriving through a live integration.



Prerequisites

- Node.js 20+ and npm
- A Supabase project (or the Supabase local dev stack) with the leads / activities tables
  and enums described in [src/apis/leads/types.ts](src/apis/leads/types.ts) and
  [src/constants/leads.ts](src/constants/leads.ts)


Getting started

npm install

.env.development is already committed in this repo with a working sandbox Supabase
project's URL and anon key — no setup required, the app runs as-is.

To point the app at a different Supabase project instead, edit .env.development with your
own project's URL and anon key (Project Settings > API in the Supabase dashboard).
VITE_IS_SANDBOX toggles a "quick demo login" button on the login screen (see
src/pages/auth/components/LoginForm.tsx) and is independent of which project you're
pointed at.

Then start the dev server:

npm run dev

The app runs at http://localhost:3809 (see vite.config.ts).


Build & preview

npm run build     — tsc -b && vite build
npm run preview   — serve the production build locally


Lint

npm run lint


Tests

npm run test        — vitest run, single pass (suitable for a CI step; no CI pipeline
                       is configured in this repo)
npm run test:watch  — vitest, watch mode for local development

Vitest is configured in vite.config.ts with environment: "jsdom" and
setupFiles: "./vitest.setup.ts" (wires up @testing-library/jest-dom). .env.test supplies
placeholder Supabase env vars purely so importing @/constants / @/lib doesn't crash at
module load time (VITE_IS_SANDBOX is read unconditionally) — no local Supabase instance is
started or expected. Every test that exercises Supabase-backed code mocks @/lib directly
via vi.mock, so no test ever makes a real network call.

Current coverage targets the business logic most likely to silently break in a refactor:

- src/apis/leads/useLeads.test.ts — the query-building/filter logic behind the Lead Inbox
- src/apis/leads/useTimeLineLeadAct.test.tsx — the Lead Details View's chronological
  activity fetch (newest-occurred-first ordering, disabled-until-leadId, error handling)
- src/apis/leads/useCreateActivity.test.tsx — the Activity Logging insert, cache
  invalidation, and error-handling path
- src/store/useAuthStore.test.ts — the admin/salesperson RBAC logic (isAdmin derivation,
  session clearing resetting profile/isAdmin)
- src/routes/AdminRoute.test.tsx — the route-level RBAC gate (loading state, salesperson
  redirect, admin access)


AI Collaboration Narrative

High-level strategy for guiding the AI

I used Claude Code as an assistant rather than an autopilot. I wrote and owned the core
structure of the app myself — the module layout, the Supabase schema shape, routing, and
the overall design of each screen — and brought Claude Code in for well-scoped,
self-contained pieces of that structure: individual React Query hooks in src/apis/leads/
(e.g. useLeads, useCreateActivity, useTimeLineLeadAct), page-local components under
src/pages/leads/components/, and repetitive boilerplate (antd form wiring, barrel
exports). I described the target shape — types, expected Supabase table/columns, how the
hook should invalidate related queries — and let it draft the implementation, rather than
handing over whole features to be designed end-to-end by the model.

On the data side, Claude Code was also used with the Supabase MCP connector to design and
apply the schema, RLS policies, and the LEAD_RECEIVED trigger directly against the real
Supabase development project — proposing SQL, applying it as a migration, running test
queries, and checking RLS behavior against live Postgres rather than producing untested
SQL text. That workflow, and the reasoning for using a real Supabase backend instead of a
mock, is documented in System Design Document (Keyloop_System_Design_Document_Ngo_Ngoc_Long.pdf).

Verifying and refining AI output

Verification happened in three passes for every piece of AI-assisted code.

First, a manual code read-through: I checked each diff against this project's own
conventions before accepting anything — barrel-export pattern, the @/* alias,
import/order, Kl*-prefixed base components, one-component-per-file, and that no
unnecessary useMemo/useCallback was added, since the project relies on the React
Compiler. Anything that didn't match the established style was rewritten or sent back.

Second, a manual run-through in the dev server: after a feature landed, I ran npm run dev
and exercised the actual user flow in the browser — creating a lead, opening a lead's
detail view, logging an activity, watching the timeline and inbox update — rather than
trusting that type-correct code meant behaviorally-correct code.

Third, automated tests: once a flow was confirmed working by hand, I used Vitest to lock
the behavior in as a regression check, focusing on the business logic most likely to
silently break in future refactors — the Lead Inbox filter/query-building logic
(useLeads.test.ts), the Lead Details View's chronological activity fetch
(useTimeLineLeadAct.test.tsx), the Activity Logging insert, cache-invalidation, and error
path (useCreateActivity.test.tsx), and the admin/salesperson RBAC logic at both the store
and route level (useAuthStore.test.ts, AdminRoute.test.tsx).

Ensuring final code quality

npm run lint (ESLint + Prettier via eslint-plugin-prettier) and tsc -b (via npm run
build) were run as a final gate before treating any AI-assisted change as done, catching
style and type issues the manual read-through might have missed. Code I didn't fully
trust after review was rewritten by hand rather than patched around — the goal was that
the final code reads as if one person wrote it to this repo's conventions, not as a
patchwork of AI-generated snippets.
