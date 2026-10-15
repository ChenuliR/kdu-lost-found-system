# Individual Portfolio – Campus Lost & Found Portal

## 1. Student Information

- **Name:** Nabil Mahmoor
- **Student ID:** D/BSE/24/0006
- **Degree Programme:** BSc (Hons) in Software Engineering
- **University:** General Sir John Kotelawala Defence University (KDU)
- **Project:** Campus Lost & Found Portal
- **Repository:** [Campus Lost & Found Portal](https://github.com/ChenuliR/kdu-lost-found-system)
- **Primary Role:** Developer

## 2. Project Overview

The Campus Lost & Found Portal is a web-based application that helps KDU students and staff report, browse, search and reclaim items lost or found on campus. Users publish lost/found posts, submit claim requests with proof of ownership, and track claim outcomes. Administrators review claims, moderate posts and manage item categories.

The system is built with Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui components and Supabase (authentication, database and file storage).

## 3. My Role and Responsibilities

I was a developer on the team. I built the application's foundation and most of its feature code, working from the team's user stories and the UI/UX designs prepared in Figma.

My main responsibilities included:

- Setting up the Next.js project, tooling and Supabase integration.
- Implementing authentication: sign-up, sign-in, logout, session handling and route protection.
- Building the application shell: sidebar navigation, shared page layout and user menu.
- Implementing lost/found post creation (with image upload), browsing, searching, filtering, viewing, editing and deletion.
- Implementing the claim system: claim submission, "My Claims", claim review and status tracking.
- Implementing the admin area: dashboard statistics, claim review, post moderation, post monitoring and category management.
- Implementing dark mode.

## 4. My Contributions

My work spans incrementally from project setup through to the admin tools.

### 4.1 Project Setup and Authentication

- Initialised the Next.js/TypeScript project with ESLint, Tailwind CSS and shadcn/ui configuration.
- Integrated Supabase with separate browser and server clients (`@supabase/ssr`).
- Implemented sign-in and sign-up on a single auth card, with redirect logic that sends signed-out users to `/auth` and signed-in users into the app.
- Added sign-up validation: registration is restricted to `@kdu.ac.lk` email addresses, and passwords must be at least 8 characters.
- Added logout and display of the signed-in user's details.
- Created a reusable `getAuthUser()` helper so every protected page and server action resolves the current user the same way.

### 4.2 Application Shell and Navigation

- Built the sidebar with navigation tabs and a user menu, following the client's preference for left-side navigation.
- Added a common page layout and an `(authenticated)` route group so all signed-in pages share one layout and one auth check.
- Fixed navbar transparency and added responsive behaviour through a mobile-detection hook.

### 4.3 Post Management

- Implemented creating lost and found posts, including image upload to Supabase Storage with server-side validation of file size and file type.
- Built the browse page, post cards, post detail view and a filter component (lost/found type, category and search).
- Implemented "My Posts" and later rearranged the page for clearer navigation.
- Added edit and delete flows, including a confirmation delete modal and loading states on action buttons.
- Added an image preview modal and fixed a bug where the file explorer did not open when the image upload area was clicked.

### 4.4 Claim System

- Implemented claim submission with server-side validation: required proof and contact details, a check that the post exists, and a rule that a user cannot claim the same item twice.
- Built the claim form, the "My Claims" page and a claims list showing each claim's status, reviewer comments and review date.
- Implemented the claim detail page and the admin claim review view, wired to the `review_claim_as_admin` database function so approving or rejecting a claim is handled in one controlled step. Already-reviewed claims are shown as locked.
- Added views for both claimants and post owners to see reviewed claims.

### 4.5 Admin Area

- Protected all admin pages with a `requireAdmin()` guard based on the user's role in `app_metadata`, enforced both in the admin layout and in every admin server action.
- Built the admin dashboard with live statistics (active posts, pending claims, resolved cases), a status-filtered and paginated claims list.
- Implemented post moderation: users can report a post with a reason, and admins see open reports alongside active posts older than 30 days, with options to dismiss a report or remove a post (and its stored image).
- Built an admin posts page with search, status and type filters, and pagination.
- Implemented admin category management (create, activate/deactivate, post counts per category) and made post forms and filters read categories from the database through a shared category-labels provider.

### 4.6 Dark Mode

- Implemented the dark-mode design in code using `next-themes`, with light, dark and system options and a theme toggle available on every page.
- Updated the post, filter, form, detail and admin components so they render correctly in both themes.

## 5. Challenges and How I Addressed Them

### Enforcing Permissions Reliably

**Challenge:** Admin-only actions had to be safe even if a user navigated directly to an admin URL or called an action manually.

**How I addressed it:** I centralised the checks in `getAuthUser()` and `requireAdmin()` and called them in the admin layout and in every admin server action. When removing posts, I also checked that the delete actually affected a row, so a delete blocked by database policies fails visibly instead of appearing to succeed.

### Keeping Data Consistent

**Challenge:** Categories were originally fixed in code, but admins needed to add and retire them without breaking existing posts.

**How I addressed it:** I moved categories into the database with an `active` flag, validated new posts against active categories only, and used a shared provider to resolve category labels everywhere in the UI.

### Recovering From a Code Rollback

**Challenge:** Part of the work needed to be restored to an earlier state after a rollback. This was due to adding a deprecated dependency which exposed our codebase to potential risks.

**How I addressed it:** I restored the affected files in a single commit and re-added the `.env.example` file so teammates could continue setting up the project.

## 6. Key Learning Outcomes

Through this project, I gained experience in:

- Building full-stack applications with the Next.js App Router and Supabase.
- Using server actions for validation and data access, and enforcing authorisation on the server rather than only in the UI.
- Implementing authentication, protected routes and role-based access control.
- Handling file uploads securely, including validation and storage cleanup.
- Designing multi-step workflows (post → claim → review) with clear status tracking.
- Translating Figma designs into reusable, theme-aware React components.
- Working incrementally with Git using small, focused commits.
- Communication, coordination, time management and teamwork.

## 7. Project Outcome

The Campus Lost & Found Portal completed all 17 planned user stories, and the final system was presented to and accepted by the client.

My contribution covered the application foundation (setup, authentication, layout) and the main feature areas (posts, claims and the admin tools), which together deliver the portal's core lost-and-found workflow from reporting an item to resolving a claim.

## 8. Evidence of Contributions

### 8.1 Setup and Authentication

| Evidence ID | Description | Evidence Link |
|---|---|---|
| E1 | Project setup | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/5fe05e191ba05662f3013762c168fe5b8d42653a) |
| E2 | Sign-in and sign-up with Supabase | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/5533051028f893342fc8d4e2afdd78c280c73351) |
| E3 | Redirect logic and logged-in user info | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/187ede27767cfa83ea58d0d22d00586a67c89879) |
| E4 | Sign-up validation | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/b0616441693f91e1219137344f3e40c17cc194de) |
| E5 | Logout functionality | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/e49e336eb89950867e1c902716b6b1a807871502) |
| E6 | Authenticated-user helper | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/1df167bcf2921ae13e275ccd8aefd1816ce2c559) |

### 8.2 Application Shell

| Evidence ID | Description | Evidence Link |
|---|---|---|
| E7 | Sidebar with navigation tabs | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/e53aa700bceedce5e8fc5b2e24d1315814c3c738) |
| E8 | Common page layout | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/2d5f57139bda5f793e172b8a5e1555603cb700ba) |
| E9 | Navbar transparency fix | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/75f2f3d1296f403f385c046f2603421fcb210c99) |

### 8.3 Posts

| Evidence ID | Description | Evidence Link |
|---|---|---|
| E10 | Create lost/found posts with image upload | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/6034a3e90994a6038f1a3c8683f8cedcfd66eb62) |
| E11 | Restore code after rollback | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/ce6ac3fd6b85542aeb30135b6ebc1b35bc0746cb) |
| E12 | Rearranged My Posts page | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/f7fd74dd72ab23e907b9a0aeec037ab641689992) |
| E13 | Delete modal and button loading states | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/bc60b642d12a9bdd9ce7a2ff85771e49bc1fa886) |
| E14 | Image upload click fix | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/a83e7763f8e9b096da46665c2a653b29faa4d964) |
| E15 | Browse page for all posts | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/e3c9b2aa6d11de23fde13f2e44a63126a21b3fb8) |

### 8.4 Dark Mode

| Evidence ID | Description | Evidence Link |
|---|---|---|
| E16 | Dark mode theme implementation | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/8615957aada91e512b9c0a58f77df777bf372e5f) |

### 8.5 Claims and Admin

| Evidence ID | Description | Evidence Link |
|---|---|---|
| E17 | Claim submission system | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/fff182486ba78502e0944d82d95613a461d52816) |
| E18 | Admin post moderation, monitoring and category management | [View Commit](https://github.com/ChenuliR/kdu-lost-found-system/commit/c811672d7e794441f94a931cf97d86ee87b8a348) |

### 8.6 Project Documentation and Git History

- **Project Repository:** [View GitHub Repository](https://github.com/ChenuliR/kdu-lost-found-system)
- **Git Commit History:** [View All My Commits](https://github.com/ChenuliR/kdu-lost-found-system/commits/main/?author=nabil-mahmoor)

## 9. Reflection

This project showed me that a feature is only finished when its failure cases are handled. Building the claim and admin flows meant deciding what should happen when a user claims the same item twice, when a delete is blocked by a database policy, or when someone opens an admin URL without admin rights. Putting those checks on the server instead of relying on the interface made the system noticeably more dependable.

Working from the team's Figma designs also taught me how much smoother implementation is when design decisions, such as the left-side navigation and dark mode, are settled early and reflected in shared components. Delivering in small commits, from authentication to layout, posts, claims and finally the admin tools, let the team review and test each stage before the next one depended on it.

If I did this again, I would agree on the database schema and access rules with the team earlier, and add automated tests for the claim and moderation logic, since those are the areas where small mistakes matter most.