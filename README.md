# Campus Lost & Found Portal

## Overview

The **Campus Lost & Found Portal** is a web-based application designed to help university students and staff report, search for, and recover lost belongings within the university community. The system provides a centralized platform for managing lost and found item listings, submitting claim requests, and tracking claim statuses.

It also includes administrative features that allow authorized administrators to review claims, moderate item listings, and monitor system activities through a dashboard.

## Problem Statement

Lost belongings are often difficult to recover when information is shared through informal methods such as notice boards, group chats, or word of mouth. These methods can make it difficult to find relevant information, verify ownership, and track recovery requests.

The Campus Lost & Found Portal addresses these challenges by providing a centralized and organized system for reporting items, searching listings, and managing the recovery process.

## Objectives

- Provide a centralized platform for lost and found item reporting.
- Help users locate items through keyword searches and filters.
- Enable users to submit and track item claim requests.
- Support communication and status updates throughout the claiming process.
- Allow administrators to verify claims and moderate listings.
- Improve the organization and efficiency of campus lost property management.

## Key Features

### 1. User Authentication
- Allow authorized users to access the system.
- Provide login and logout functionality.

### 2. Lost and Found Item Management
- Create lost item reports and found item listings.
- Upload item photographs where supported.
- Edit or delete users' own listings.
- Update listing statuses, such as Active, Claimed, or Closed.

### 3. Search and Filtering
- Search for items using keywords.
- Filter listings by relevant categories, status, date, and location.
- Browse item listings and view individual item details.

### 4. Claim Management
- Submit claim requests for listed items.
- Track claim statuses, including Pending, Approved, and Rejected.
- Allow administrators to review and manage claim requests.

### 5. Notifications
- Provide claim-related status notifications where implemented.
- Help users stay informed about the progress of their requests.

### 6. Administrative Dashboard
- Review and moderate item listings.
- Verify and manage claim requests.
- View relevant system information through an administrative dashboard.

## User Roles

**Student / Staff**
- Access the portal.
- Report lost or found items.
- Search and filter listings.
- View item details.
- Submit claim requests.
- Track claim statuses and receive available notifications.
- Manage their own listings.

**Administrator**
- Review and manage claim requests.
- Moderate inappropriate or invalid listings.
- Monitor system information through the dashboard.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack React web application framework |
| React 19 | User interface development |
| TypeScript | Application development language |
| Tailwind CSS | User interface styling |
| Supabase | Authentication, PostgreSQL database, and backend services |
| ESLint | Code quality checks |
| Git and GitHub | Version control and source code hosting |

## System Benefits

- **Centralized information:** Keeps lost and found listings in one place.
- **Efficient searching:** Helps users find relevant items using search and filters.
- **Organized recovery process:** Provides a structured way to submit and review claims.
- **Improved transparency:** Enables users to track claim progress.
- **Administrative control:** Supports claim verification and listing moderation.
- **Convenience:** Reduces reliance on scattered, informal communication methods.

## Getting Started

### Prerequisites

Install or obtain access to the following:

- [Node.js](https://nodejs.org/) 20 or newer
- npm
- Git
- A Supabase project

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/ChenuliR/kdu-lost-found-system.git
cd kdu-lost-found-system
npm install
```

### Environment Configuration

Create a `.env.local` file in the project root. Add the Supabase project URL and anonymous key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Do not commit `.env.local` or any service-role key to the repository. The anonymous key is intended for the browser; a Supabase service-role key must remain private and is not required by the application.

### Database Setup

1. Open the Supabase SQL Editor for the project.
2. Run [`docs/initialschema.sql`](docs/initialschema.sql) for a new database.
3. For an existing database that needs the claim-review functionality, run [`docs/claim-review-migration.sql`](docs/claim-review-migration.sql) after reviewing the migration.
4. Confirm that Row Level Security is enabled for `posts`, `claims`, `comments`, and `notifications`.

The schema creates the application tables, access policies, claim-review function, and notification rules.

### Run the Application

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, normally `http://localhost:3000`.

For a production-style local run:

```bash
npm run build
npm run start
```

### Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint checks |

## Administrator Setup

Administrator access is controlled through Supabase Auth `app_metadata`. The administrator user's role must be set to:

```json
{
  "role": "admin"
}
```

Set this value only through an approved server-side or Supabase administrative process. Do not store the role in ordinary user-editable metadata. After assigning the role, sign out and sign in again so the updated token is used.

## Main User Workflows

1. A student or staff member signs in and creates a lost or found post.
2. Other authenticated users search listings and submit claims with proof details and contact information.
3. The post owner or an administrator reviews each pending claim.
4. An approved claim changes the post status to `Claimed`; competing pending claims are rejected.
5. Claimants receive notifications when their claim status changes.

## Documentation

- [Client handover note](docs/client-handover-note.md) — Deployment, operations, ownership, security, and sign-off.
- [Architecture documentation](docs/architecture.md) — System architecture, database design, and workflow links.
- [Mermaid system and database diagrams](docs/diagrams/) — Complete visual documentation for the viva.
- [Initial database schema](docs/initialschema.sql) — Tables, constraints, and Row Level Security policies.
- [Claim review migration](docs/claim-review-migration.sql) — Claim-owner review and notification migration.
- [User journey flows](docs/user-journey-flows.md) — Main user and administrator journeys.
- [Product backlog](docs/product-backlog.md) — Features and user stories.
- [Sprint journals](docs/sprint-journals.md) — Development progress and sprint records.
- [Definition of done](docs/definition-of-done.md) — Completion criteria.

## Troubleshooting

### Missing Supabase environment variables

Confirm that `.env.local` exists in the repository root and contains both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Restart the development server after changing environment variables.

### Administrator pages are unavailable

Confirm that the signed-in user's Supabase Auth `app_metadata.role` is exactly `admin`, then sign out and sign in again.

### Database or claim errors

Confirm that the required SQL script has been run in the correct Supabase project and that Row Level Security policies are present. Check the Supabase project logs for the exact database error.

## Project Status

The Campus Lost & Found Portal has completed its planned user stories and includes the implementation, architecture diagrams, database scripts, setup guide, and client handover documentation required for delivery.

## Repository

[Campus Lost & Found Portal on GitHub](https://github.com/ChenuliR/kdu-lost-found-system)

## Acknowledgements

Developed as a university software engineering project to improve the management and recovery of lost and found belongings within the campus community.
