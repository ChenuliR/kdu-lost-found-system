# Sprint Journals
## Sprint 1: Discovery, Setup & Backlog Creation
Sprint Duration: Weeks 1–2 (August 4 – August 18, 2026)

Sprint Goal: Establish developer–client alignment and configure the technical foundation for the Lost & Found application.

---

### Key Activities
#### 1. Requirement Gathering
The Product Owner met with the Client Team to extract high-level feature requirements. The following Epics were identified:

User Management (Authentication)

Reporting Lost Items

Reporting Found Items

Search & Matching

Claims & Verification

Admin & Moderation

Notifications

---

#### 2. Tooling Setup
GitHub Repository: Initialized private repo.

GitHub Project Board: Configured with columns: Todo, In Progress, Review/QA, Done.

Collaborators: Add colloaborators and Course lecturer invited with read-only access.

Labels Created: Priority (High priority, Medium priority)

Milestones: Created Sprint 1 milestones.

---

#### 3. Product Backlog Creation
Total Issues Created: 17 User Stories across 7 Epics.

File Created: docs/product-backlog.md as an indexed list of all stories with links to GitHub Issues.

Each Issue includes: User Story format, Given-When-Then Acceptance Criteria, Labels, and Milestone assignment.

---

#### 4. Sprint 1 Planning
Stories Assigned to Sprint 1: 6 issues (P1 priorities):

Story 1: User Login
Story 2: User Logout
Story 3: Create Lost Item Post
Story 4: Create Found Item Post
Story 5: Upload Item Photo
Story 11: View Item Details

Sprint Goal: "Enable users to register, report a lost/found item, and browse the feed."

Remaining 11 stories placed in Product Backlog for future sprints.
However, during the sprint, development progressed more slowly than initially planned. 
By the current sprint review, User Login and User Logout have been successfully completed.
The remaining stories have not yet been completed and will require further development.

---

#### 5. UI/UX Design Finalization
Figma Design: UI/UX Designer created high-fidelity mockups for all major screens.

Client Approval: The Product Owner presented the designs to the clients, and their feedback was incorporated. The design was officially approved with minor changes to the navigation bar and a request to add a dark mode feature.

Handoff: Assets exported and Figma link shared with Frontend Developer.

The initial UI/UX designs were implemented based on the approved Figma designs.

---

#### 6. Frontend Development Kickoff
Tech Stack: React (frontend) with routing and state management configured.

First Screens: Sign-up and Login pages started, following pixel-perfect Figma designs.

The following authentication features have been completed:
User Login
User Logout

The remaining frontend screens and functionalities are still under development.

---

### Ceremonies
Sprint Planning 1
Date: August 6, 2026
Attendees: Scrum Master, Product Owner, Developers (Frontend & Backend), UI/UX Designer
Outcome: 6 stories pulled into Sprint 1. Estimates assigned. Sprint Goal defined.

---

### Daily Standup Logs

| Date | Key Updates | Blockers |
| :--- | :--- | :--- |
| **August 6, 2026** | Tooling setup complete. GitHub board, labels, and milestones created. Sprint Planning conducted. | None. |
| **August 10, 2026** | Figma designs approved by client. Frontend setup complete. Backend API for Sign-up in progress. | Frontend waiting on Backend API. |
| **August 16, 2026** | User Login and Logout functionalities were completed. The client reviewed the implemented UI and requested changes to the navigation bar. | Navigation bar requires modifications based on client feedback. |

---
### Sprint 1 Reflection 

| Metric | Status |
| :--- | :--- |
| Stories Planned | 6 |
| Stories Completed | 2 |
| Total Story Points | 20 |
| Velocity | 4 |

## Sprint 2: Core Posting & Search

**Sprint Duration:** Week 3 (August 18 – August 25, 2026)

**Sprint Goal:** Complete the core Lost & Found functionality and allow users to find relevant listings.

---

### Key Activities

#### 1. Sprint 2 Planning

Sprint 2 began with a review of the unfinished work from Sprint 1.

The following stories were carried forward from Sprint 1:

- **US-03:** Create Lost Item Post
- **US-04:** Create Found Item Post
- **US-05:** Upload Item Photo
- **US-11:** View Item Details

The following additional stories were selected from the Product Backlog:

- **US-06:** Edit Own Post
- **US-07:** Delete Own Post
- **US-08:** Update Post Status
- **US-09:** Search Items
- **US-10:** Filter Listings

**Sprint Goal:**

> "Complete the core Lost & Found functionality and allow users to find relevant listings."

---

#### 2. Post Module Development

The team completed the core Post Module functionality.

The following features were implemented:

- Create Lost Item Post
- Create Found Item Post
- Item name and category selection
- Item description
- Lost/Found date
- Location information
- Item photo upload
- Post status handling

The posting functionality was integrated with the backend and database.

---

#### 3. Post Management

The team implemented functionality that allows users to manage posts they have created.

The following features were completed:

- Edit Own Post
- Delete Own Post
- Update Post Status

Users can manage their own active posts while maintaining the defined post status workflow.

---

#### 4. Search Module

The Search Module was implemented to allow users to find relevant Lost & Found listings.

The following functionality was completed:

- Keyword-based search
- Search by item name
- Search by item description
- Search across Lost and Found listings

---

#### 5. Filter Module

Filtering functionality was implemented to help users narrow down search results.

The following filters were completed:

- Category
- Lost/Found status
- Date
- Location

The search and filtering functionality was integrated with the item listing interface.

---

#### 6. Item Details

The Item Details functionality was completed.

Users can open an individual listing and view the complete information associated with the reported item, including:

- Item name
- Category
- Description
- Date
- Location
- Lost/Found status
- Item photograph
- Post status

---

#### 7. UI/UX Improvements

The team continued improving the user interface based on feedback received during Sprint 1.

The following improvements were implemented:

- Navigation bar improvements
- Improved page navigation
- Consistent UI components
- Form validation
- Error handling
- Responsive interface improvements

The UI was aligned with the approved Figma designs and the feedback received from the Client Team.

---

#### 8. Backend & Database Integration

The frontend features were integrated with the backend and database.

The team completed:

- Storing Lost and Found item records
- Retrieving item listings
- Updating post information
- Deleting posts
- Updating post status
- Searching stored listings
- Filtering stored listings

---

### Sprint 2 Deliverable

By the end of Sprint 2, users can:

> **Login → Create Lost/Found Post → Upload Photo → Search → Filter → View → Edit/Delete**

The core posting and search functionality was successfully completed.

---

### Ceremonies

#### Sprint Planning 2

**Date:** August 18, 2026

**Attendees:** Scrum Master, Product Owner, Developers (Frontend & Backend), UI/UX Designer

**Outcome:**

The team reviewed the unfinished Sprint 1 stories and carried them forward into Sprint 2. Additional stories related to post management, search, and filtering were selected from the Product Backlog. Sprint priorities and responsibilities were discussed, and the Sprint Goal was established.

---

### Daily Standup Logs

| Date | Key Updates | Blockers |
| :--- | :--- | :--- |
| **August 18, 2026** | Sprint 2 planning completed. Sprint 1 unfinished stories were reviewed and carried forward. Additional stories for post management, search, and filtering were selected. | None |
| **August 20, 2026** | Development continued on Lost and Found post creation. Backend and database integration for posts was progressed., Lost and Found posting functionality and item photo upload were completed. | None |
| **August 25, 2026** | Sprint 2 functionality was finalized and tested. All planned Sprint 2 User Stories were completed. | None |

---

### Sprint 2 Review

The completed Sprint 2 functionality was reviewed and demonstrated to the Client Team.

#### Demonstrated Functionality

- User Login
- User Logout
- Create Lost Item Post
- Create Found Item Post
- Upload Item Photo
- View Item Details
- Edit Own Post
- Delete Own Post
- Update Post Status
- Search Listings
- Filter Listings

#### Sprint 2 Outcome

All **9 planned User Stories** for Sprint 2 were completed.

The Sprint 2 deliverable successfully provides the core posting, management, search, filtering, and viewing functionality required for the Campus Lost & Found Portal.

#### Client Feedback

The Client Team reviewed and demonstrated the features implemented during Sprint 2. The client accepted the implemented functionality and confirmed that the developed features meet the expected requirements for the current sprint.

The following features were reviewed and accepted:

- Create Lost Item Post
- Create Found Item Post
- Upload Item Photo
- View Item Details
- Edit Own Post
- Delete Own Post
- Update Post Status
- Search Listings
- Filter Listings

The Client Team approved the implemented features and provided no major changes to the completed Sprint 2 functionality. The team can therefore proceed with the next sprint, focusing on the Claim Management and Integration features.

---

### Sprint 2 Reflection

| Metric | Status |
| :--- | :--- |
| **Stories Planned** | 9 |
| **Stories Completed** | 9 |
| **Total Story Points** | 31 |
| **Velocity** | 31 |

**Completion Rate:** 100%

### Completed User Stories

- **US-03:** Create Lost Item Post — **5 points**
- **US-04:** Create Found Item Post — **5 points**
- **US-05:** Upload Item Photo — **3 points**
- **US-06:** Edit Own Post — **3 points**
- **US-07:** Delete Own Post — **2 points**
- **US-08:** Update Post Status — **2 points**
- **US-09:** Search Items — **3 points**
- **US-10:** Filter Listings — **5 points**
- **US-11:** View Item Details — **3 points**

**Total Completed Story Points: 31**

---

### Sprint 2 Completion Status

**Sprint Status:** Completed

**Stories Planned:** 9

**Stories Completed:** 9

---

# Story Point Estimation

The development team uses the Fibonacci sequence to estimate the relative effort and complexity of User Stories.

The Story Point scale used by the team is:

| Story Points | Meaning |
| :---: | :--- |
| **1** | Very simple |
| **2** | Simple |
| **3** | Moderate |
| **5** | Medium/High complexity |
| **8** | Complex |
| **13** | Very large; should ideally be split into smaller stories |

Story points are assigned based on:

- Technical complexity
- Amount of development effort
- Integration requirements
- Uncertainty or risk
- Testing effort

Story points represent **relative complexity and effort rather than development hours**. The team discusses and agrees on the estimated points during Sprint Planning.

### Story Point Estimates

| User Story | Story Points |
| :--- | :---: |
| **US-01 User Login** | 3 |
| **US-02 User Logout** | 1 |
| **US-03 Create Lost Item Post** | 5 |
| **US-04 Create Found Item Post** | 5 |
| **US-05 Upload Item Photo** | 3 |
| **US-06 Edit Own Post** | 3 |
| **US-07 Delete Own Post** | 2 |
| **US-08 Update Post Status** | 2 |
| **US-09 Search Items** | 3 |
| **US-10 Filter Listings** | 5 |
| **US-11 View Item Details** | 3 |
| **US-12 Submit Claim Request** | 5 |
| **US-13 Track Claim Status** | 3 |
| **US-14 Receive Claim Notifications** | 5 |
| **US-15 Review Claim Requests** | 5 |
| **US-16 Moderate Posts** | 5 |
| **US-17 View Dashboard** | 5 |

**Completion Rate:** 100%

**Sprint Velocity:** 31 Story Points

The completed Sprint 2 functionality provides the core foundation required for the next development phase. The team will proceed to **Sprint 3: Integration & Iterative Enhancements**, focusing on the Claim Management workflow and further system integration based on client feedback.
