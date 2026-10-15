# MY_CONTRIBUTIONS.md

## 1. Project Overview

This project is a campus lost-and-found web application for KDU. The repository name is `ChenuliR/kdu-lost-found-system`, and the project documentation identifies it as a “Campus Lost & Found Portal.” The system is designed to allow users to create lost or found item posts, browse listings, submit claims with proof details, receive notifications, and allow administrators to review and resolve claims.

The architecture documentation in `docs/architecture.md` describes the project as a three-tier web application built around a presentation layer, an application layer, and a data layer. It also defines the main development modules as the Post Module, Search Module, Claim Module, and Admin Module.

The repository’s language composition is primarily TypeScript, with supporting CSS, which is consistent with a Next.js application using React components and Supabase for backend data access.

## 2. My Role in the Project

I contributed as a developer focused on core user workflows and project functionality. Based on the repository evidence, my verified work centered on the following responsibilities:

- implementing claim submission status tracking for users,
- integrating admin-side claim reviews and status updates,
- adding post editing functionality and validation,
- improving the user-facing My Posts and claim management flows.

This role is supported by the commit author metadata in the repository, which consistently identifies the GitHub account `IGS2002` and the email `sankharupasingha063@gmail.com` for my verified contributions.

## 3. Technologies Used

The project uses the following technologies, as evidenced in the repository code and configuration:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase SSR client and Supabase JS SDK
- Server actions for data operations
- File upload handling with Supabase storage
- Role-based authenticated application flow

Relevant evidence:

- `lib/supabase/server-client.ts` creates a Supabase server client from environment variables.
- `lib/auth/server.ts` checks the authenticated user and redirects unauthenticated users to `/auth`.
- `app/(authenticated)/posts/actions.ts` uses Supabase storage to upload images and inserts data into the `posts` table.
- `app/(authenticated)/claims/actions.ts` uses Supabase queries to fetch and update claim records and notifications.

## 4. Features I Personally Implemented

### 4.1 Claim status notifications and admin moderation

I implemented the live admin claim review flow and status notifications.

Verified evidence:

- Commit: `e29419caf9f34677e0d67495c0f0b71e78c17b0b`
- Message: `Implement claim status notifications and admin moderation features`
- Author: `IGS2002` (`sankharupasingha063@gmail.com`)
- Branch: `feature/claim-status-notifications`
- Relevant files:
  - `app/(authenticated)/admin/page.tsx`
  - `app/(authenticated)/claims/actions.ts`
  - `components/admin-moderation.tsx`

What this contribution did:

- moved the admin dashboard away from static mocked claim data toward real fetched claim records,
- added logic to approve or reject claims,
- integrated the moderation panel,
- introduced notification and status-related logic for claim updates.

This is visible in the final code where `app/(authenticated)/admin/page.tsx` imports `getAdminClaims` and renders `AdminModeration`, and `app/(authenticated)/claims/actions.ts` contains the relevant server actions for admin claim review and notifications.

### 4.2 User claim tracking and claim status viewing

I implemented functionality that allows a user to retrieve and view the claims they submitted and track their statuses.

Verified evidence:

- Commit: `b419de82cd0494b6b520c291dd8241992683ddb9`
- Message: `Add user claims retrieval and claims page for tracking status`
- Author: `IGS2002` (`sankharupasingha063@gmail.com`)
- Branch: `feature/claimant-claim-status-tracking`
- Relevant files:
  - `app/(authenticated)/claims/actions.ts`
  - `app/(authenticated)/claims/my-claims/page.tsx`

What this contribution did:

- added `getUserClaims()` in the server actions,
- retrieved claim records for the authenticated user,
- prepared the claim page for displaying the status and associated post information.

### 4.3 Post editing with validation

I contributed the post editing flow with form validation.

Verified evidence:

- Commit: `fad1c6ed1ffb8d0d3e7c05a9aa54623e6722d9a9`
- Message: `feat: Implement post editing functionality with form validation`
- Author: `IGS2002` (`sankharupasingha063@gmail.com`)
- Branch: `issue-8/editpost`
- Relevant files:
  - `app/(authenticated)/posts/my-posts/page.tsx`
  - `app/(authenticated)/posts/actions.ts`
  - `components/posts/post-form.tsx`

What this contribution did:

- added validation for required fields,
- enabled user updates to existing lost/found posts,
- supported editing the item’s name, category, date, location, and description.

The final code still contains the update logic in `app/(authenticated)/posts/actions.ts`, including `updatePost(formData: FormData)`.

### 4.4 My Posts page improvements and post management flow

I also contributed to the user-facing post management flow on the My Posts page.

Verified evidence:

- Commit: `18fa83d876e4d73fadb9e535e13317393804c721`
- Message: `Merge branch 'main' into issue-10-post-update`
- Author: `IGS2002` (`sankharupasingha063@gmail.com`)
- Branch: `issue-10-post-update`
- Relevant file:
  - `app/(authenticated)/posts/my-posts/page.tsx`

This merge includes the user-post-management UI improvements, such as the “Create Post” action and updated badge layout for active posts. The final code confirms the presence of the page structure and navigation flow for post management.

## 5. Bug Fixes and Improvements

The repository shows several improvements associated with my work. These are verified by commit messages and final code presence.

### 5.1 Admin claim handling improvements

- Verified commit: `e29419caf9f34677e0d67495c0f0b71e78c17b0b`
- Improvement: replaced static/admin-demo behaviour with dynamic claim retrieval and review operations.
- Relevant files:
  - `app/(authenticated)/admin/page.tsx`
  - `app/(authenticated)/claims/actions.ts`

### 5.2 Claim tracking improvement for users

- Verified commit: `b419de82cd0494b6b520c291dd8241992683ddb9`
- Improvement: added a user-side claims retrieval function and claims page to track the status of submitted claims.
- Relevant files:
  - `app/(authenticated)/claims/actions.ts`
  - `app/(authenticated)/claims/my-claims/page.tsx`

### 5.3 Validated post update flow

- Verified commit: `fad1c6ed1ffb8d0d3e7c05a9aa54623e6722d9a9`
- Improvement: implemented post editing with form validation to reduce invalid or incomplete updates.
- Relevant files:
  - `app/(authenticated)/posts/actions.ts`
  - `app/(authenticated)/posts/my-posts/page.tsx`

### 5.4 Not verified / unavailable information

- Specific bug reproduction reports: Not verified
- Performance benchmark numbers: Not verified
- Detailed QA test results: Not verified
- Creation of pull requests: Not verified in GitHub API metadata; no PR metadata was returned for this repository

## 6. Branches and Pull Requests

### Branches associated with my work

- `feature/claim-status-notifications`
  - associated with commit `e29419caf9f34677e0d67495c0f0b71e78c17b0b`
- `feature/claimant-claim-status-tracking`
  - associated with commit `b419de82cd0494b6b520c291dd8241992683ddb9`
- `issue-8/editpost`
  - associated with commit `fad1c6ed1ffb8d0d3e7c05a9aa54623e6722d9a9`
- `issue-10-post-update`
  - associated with merge commit `18fa83d876e4d73fadb9e535e13317393804c721`

### Pull requests

- Pull request records for this repository were not returned by the available GitHub API metadata.
- Status: Not verified
- Conclusion: branch-based commit evidence is the authoritative source available in this environment.

## 7. Evidence-Based Commit History

The following commit history is verified from the repository metadata and is limited to the contributions clearly attributable to `IGS2002`.

| Date | Commit Hash | Commit Message | Branch | Relevant Files | Verified Outcome |
|---|---|---|---|---|---|
| 2026-09-13T07:26:23Z | `e29419caf9f34677e0d67495c0f0b71e78c17b0b` | `Implement claim status notifications and admin moderation features` | `feature/claim-status-notifications` | `app/(authenticated)/admin/page.tsx`, `app/(authenticated)/claims/actions.ts`, `components/admin-moderation.tsx` | Verified in final code |
| 2026-09-13T07:47:12Z | `b419de82cd0494b6b520c291dd8241992683ddb9` | `Add user claims retrieval and claims page for tracking status` | `feature/claimant-claim-status-tracking` | `app/(authenticated)/claims/actions.ts`, `app/(authenticated)/claims/my-claims/page.tsx` | Verified in final code |
| 2026-08-23T09:20:34Z | `fad1c6ed1ffb8d0d3e7c05a9aa54623e6722d9a9` | `feat: Implement post editing functionality with form validation` | `issue-8/editpost` | `app/(authenticated)/posts/actions.ts`, `app/(authenticated)/posts/my-posts/page.tsx`, `components/posts/post-form.tsx` | Verified in final code |
| 2026-08-24T12:24:46Z | `18fa83d876e4d73fadb9e535e13317393804c721` | `Merge branch 'main' into issue-10-post-update` | `issue-10-post-update` | `app/(authenticated)/posts/my-posts/page.tsx` | Verified in final code |

## 8. Technical Skills Demonstrated

The verified work demonstrates the following technical skills:

- full-stack web development using Next.js and TypeScript,
- server-side data access with Supabase,
- authentication-aware data access patterns,
- form validation and user input handling,
- admin workflow design and claim management,
- UI implementation for authenticated dashboards and user pages,
- integration between front-end components and database operations.

These skills are evidenced by the repository files and server actions used in the project:

- `lib/supabase/server-client.ts`
- `lib/auth/server.ts`
- `app/(authenticated)/posts/actions.ts`
- `app/(authenticated)/claims/actions.ts`
- `app/(authenticated)/admin/page.tsx`
- `components/admin-moderation.tsx`

## 9. Challenges and Solutions (Only when Supported by Evidence)

### Challenge: Handling claim review and notifications reliably

Evidence: the project’s claim actions include logic to prevent duplicate notifications and to handle missing database tables carefully.

Relevant file:

- `app/(authenticated)/claims/actions.ts`

The code includes a notification-safety function and checks for the `notifications` table being absent. This shows a practical solution designed to keep the claim notifications flow resilient during incomplete database setup.

### Challenge: Post management and validation

Evidence: the post actions file includes thorough validation for required fields, image uploads, and file size/type restrictions.

Relevant file:

- `app/(authenticated)/posts/actions.ts`

This demonstrates a practical approach to reducing invalid user submissions and ensuring data integrity in the lost-and-found system.

## 10. Viva Preparation: Questions and Answers about My Verified Contributions

### Q1. What was your main contribution to the project?

A: My verified contributions focused on the claim review workflow, user claim status tracking, and post editing functionality. The evidence is in the repository commit history and final code.

### Q2. Which commit proves your work on claim status notifications?

A: `e29419caf9f34677e0d67495c0f0b71e78c17b0b` — `Implement claim status notifications and admin moderation features`.

### Q3. Which commit proves your work on claim tracking for users?

A: `b419de82cd0494b6b520c291dd8241992683ddb9` — `Add user claims retrieval and claims page for tracking status`.

### Q4. Which commit proves your work on editing posts?

A: `fad1c6ed1ffb8d0d3e7c05a9aa54623e6722d9a9` — `feat: Implement post editing functionality with form validation`.

### Q5. Did you create pull requests for these contributions?

A: Not verified. The repository metadata available to me did not return pull request records, so branch and commit evidence is the primary recorded proof.

### Q6. How do you distinguish your work from other team members’ work?

A: I used the Git author metadata in the repository to attribute work to the GitHub user `IGS2002` and matched that to the final implementation files. Work by other contributors remains separate and is not claimed as mine.

## 11. Conclusion

Based on the verified repository evidence, my contributions to the KDU Lost & Found System were focused on critical user workflow features and project functionality. I implemented claim status tracking, admin moderation logic, post editing with validation, and user-side post management improvements. These contributions are directly supported by commit metadata, branch names, and final repository files.

The work is verified, professional, and aligned with the project’s operational requirements. However, certain project artifacts such as pull request records are not available in the repository metadata and are therefore marked as “Not verified” rather than assumed.

This report reflects only the evidence available in the repository and is suitable for a university assessment, viva preparation, and contribution documentation.

---

Prepared for: `IGS2002`  
Repository: `ChenuliR/kdu-lost-found-system`  
Branch used for this report: `feature/IGS2002-my-contributions`  
Status: Document created in a separate branch and not merged into the default branch.

Note: Pull request creation was not available through the tools available in this environment; the document was created in a new branch as requested, and the repository default branch was not modified.
