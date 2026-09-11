# Quant Student Portal: Claude Project Brief

## Project Identity

Quant is a student academic portal built with Next.js App Router. Students can sign in, manage their profile, browse courses, view grades and timetable data, upload academic documents, earn points, redeem rewards, and review account activity.

This repository is the frontend only. The production API is external:

`https://quant-production-1004.up.railway.app/api/v1`

The GitHub repository is `https://github.com/USEQUANT/Quant-admin.git`.

## Stack And Commands

- Next.js `16.3.0`, React `19.2.8`, TypeScript `5`, Tailwind CSS `4`
- Icons: `lucide-react`
- Path alias: `@/*` maps to the repository root
- Development: `npm run dev`
- Production build: `npm run build`
- Production server: `npm start`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`

Use PowerShell-friendly commands on Windows. Do not commit `.next` output or `tsconfig.tsbuildinfo` unless explicitly requested. Generated `.next` artifacts can retain deleted routes; remove `.next` before typechecking if stale route diagnostics appear.

## Repository Layout

```text
app/
	page.tsx                         Sign in
	sign-up/page.tsx                 Multi-step registration
	verify-email/page.tsx            Email verification instructions
	verify-otp/page.tsx              Six-digit email OTP verification
	email-verified/page.tsx          Verification success
	forgot-password/page.tsx         Request password reset code
	reset-password/page.tsx          Set password with email and code
	dashboard/page.tsx               Main points, history, uploads, leaderboard, wins
	uploads/page.tsx                 User upload list
	upload/page.tsx                  Upload a document with multipart FormData
	courses/page.tsx                 Enrolled and browse courses
	assignments/page.tsx             Assignment list and completion updates
	grades/page.tsx                  Grades and CGPA
	timetable/page.tsx               Timetable
	rewards/page.tsx                 Reward catalog and redemption
	account/page.tsx                 Profile, badges, activity, settings, logout
	account/*                        Recovery-email flows

components/
	Header.tsx                       Public/auth page header
	StepIndicator.tsx                Auth step indicator
	dashboard/Navbar.tsx             Authenticated navigation and user summary
	dashboard/PageFilters.tsx        Shared level and semester dropdown UI
	dashboard/*                      Dashboard cards, tables, banners, leaderboard

lib/
	api.ts                           Shared authenticated API helpers
	dashboard-data.ts                Legacy placeholder data; do not use for new live features

public/images/                     UI imagery and icons
fonts/                             Codec Pro font files
```

The HOC Hub feature is being removed. `app/hoc-hub/page.tsx` is currently deleted and `Navbar` no longer contains an HOC Hub link. Do not recreate that route or remove unrelated announcement APIs if they are later used elsewhere.

## API Rules

Always use `apiFetch` from `@/lib/api` for JSON requests. It automatically:

- Reads `quant_token` from `localStorage` in the browser.
- Adds `Authorization: Bearer <token>` when a token exists.
- Adds `Content-Type: application/json`.
- Parses error details and throws an `Error` whose message should normally be shown to the user.

Use `apiFetchFormData` for multipart uploads. Do not manually duplicate the API base URL, token lookup, or error parsing.

Current endpoint usage:

| Area | Endpoint(s) |
| --- | --- |
| Sign in | `POST /auth/student-login` |
| Sign up | `POST /auth/register` |
| Email OTP | `POST /auth/verify-email` |
| Forgot password | `POST /auth/forgot-password` |
| Reset password | `POST /auth/reset-password` with `{ email, code, newPassword }` |
| Logout | `POST /auth/logout` |
| Profile | `GET/PATCH /students/me` |
| Points | `GET /points/mine`, `GET /points/mine/history` |
| Leaderboard | `GET /leaderboard?limit=20` |
| Badges | `GET /badges/mine` |
| Documents | `GET /documents/mine?...`, multipart `POST /documents/mine` |
| Courses | `GET /courses/mine`, `GET /courses`, `POST /courses/enroll` |
| Assignments | `GET /assignments/mine`, `POST /assignments/:id/status` |
| Grades | `GET /grades/mine`, `GET /grades/mine/cgpa` |
| Timetable | `GET /timetable/mine` |
| Rewards | `GET /rewards`, `GET /rewards/mine/history`, `POST /rewards/:id/redeem` |

When adding a fetch, unwrap responses consistently with the existing pattern: `response.data ?? response`. Arrays should fall back to `[]` where appropriate.

## Authentication Behavior

- Sign in stores `res.data.token` as `localStorage` key `quant_token`, then routes to `/dashboard`.
- Sign up stores the email in `sessionStorage` key `quant_signup_email`, then routes to email verification.
- Logout must attempt `POST /auth/logout`, but must always remove `quant_token` and redirect to `/` in a `finally` block, even if the API/network fails.
- Password reset errors from `apiFetch` should be displayed as returned; do not replace invalid/expired-code messages with guesses.
- Auth pages are client components when they need state, browser storage, router navigation, or API calls.

## UI And Styling Conventions

- Existing UI uses Tailwind utility classes, white content surfaces, `#fbfbfb` page backgrounds, orange primary actions (`#f60`), blue navigation/links (`#006dff`), and Codec Pro.
- Reuse existing visual patterns and assets before introducing new abstractions.
- `Navbar` is shared by the authenticated portal pages. `PageFilters` currently renders level and semester dropdowns globally; its selections are UI state only and are not yet wired into every page's API query.
- Keep responsive behavior aligned with existing `lg:` breakpoints.
- Use `lucide-react` icons rather than hand-drawn SVGs for controls.
- Preserve empty, loading, success, and error states when changing data-driven panels.

## Data And Known Incomplete Areas

- `components/dashboard/RecentWinsCard.tsx` uses live `/points/mine/history` transactions passed from the Dashboard. Do not reintroduce hardcoded win entries or make a second history request on that page.
- `lib/dashboard-data.ts` still contains legacy placeholder uploads/progress/leaderboard datasets. Confirm whether a requested surface is live before replacing or extending these values.
- Some pages use hardcoded session/semester query values such as `2024/2025` and `first`.
- The shared level/semester dropdowns do not yet control backend filtering. Treat wiring those filters as a separate feature, not as an assumed existing capability.
- `app/account/page.tsx` has an existing unused `rankValue` warning. Avoid unrelated cleanup unless requested.
- The project has had stale Next generated route/type artifacts after deleting a page. Delete `.next` and rerun validation when diagnostics mention a route that no longer exists.

## Working Agreement For Claude

1. Read the nearest owning page/component and its neighboring call sites before editing.
2. Prefer the smallest change that follows the existing page-level state and `apiFetch` patterns.
3. Do not invent backend endpoints or response fields; inspect current usage or ask for the contract when uncertain.
4. Keep unrelated user changes in the worktree. Never reset or checkout files to discard them.
5. After the first edit, run the narrowest relevant lint, typecheck, or behavior check immediately.
6. Before finishing, run at least one executable validation command and report any pre-existing warnings or blocked browser/API tests.
7. Do not commit or push unless explicitly requested.

## Current Worktree Context

At the time this brief was written, the worktree includes uncommitted changes for:

- Account logout using `POST /auth/logout`, guaranteed local token removal, and redirect to `/`.
- Removal of `app/hoc-hub/page.tsx`.
- HOC Hub removal from `components/dashboard/Navbar.tsx`.
- A generated `tsconfig.tsbuildinfo` change may be present and should normally not be committed.

Treat the actual `git status` as authoritative if this section becomes stale.
@AGENTS.md
