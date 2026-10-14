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
| TypeScript | Main application development language |
| CSS | User interface styling |
| JavaScript | Additional application functionality |
| Supabase | Backend services and database integration |
| Git | Version control |
| GitHub | Source code hosting and collaboration |

## System Benefits

- **Centralized information:** Keeps lost and found listings in one place.
- **Efficient searching:** Helps users find relevant items using search and filters.
- **Organized recovery process:** Provides a structured way to submit and review claims.
- **Improved transparency:** Enables users to track claim progress.
- **Administrative control:** Supports claim verification and listing moderation.
- **Convenience:** Reduces reliance on scattered, informal communication methods.

## Getting Started

### Prerequisites

Ensure that the following are available:

- [Node.js](https://nodejs.org/)
- npm
- Git
- Access to the project's Supabase configuration

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ChenuliR/kdu-lost-found-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd kdu-lost-found-system
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Configure the required Supabase environment variables according to the project configuration.

5. Start the development server using the command specified in `package.json`, commonly:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in the terminal to access the application.

## Project Structure

The repository includes documentation relating to the system, such as:

- `README.md` — Project overview and setup instructions.
- `docs/product-backlog.md` — Planned system features and user stories.
- `docs/architecture.md` — System architecture documentation.
- `docs/sprint-journals.md` — Development progress and sprint records.
- `docs/definition-of-done.md` — Criteria used to determine when work is complete.

*Note: The exact source-code directory structure and configuration names should be checked against the current repository.*

## Project Status

The Campus Lost & Found Portal has completed its planned user stories, and the completed system has been presented to and accepted by the client.

## Repository

[Campus Lost & Found Portal on GitHub](https://github.com/ChenuliR/kdu-lost-found-system)

## Acknowledgements

Developed as a university software engineering project to improve the management and recovery of lost and found belongings within the campus community.
