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

The completed Sprint 2 functionality provides the core foundation required for the next development phase. The team will proceed to **Sprint 3: Integration & Iterative Enhancements**, focusing on the Claim Management workflow and further system integration based on client feedback.

---

## Sprint 3: Claim Management & Integration

**Sprint Duration:** Week 4-5 (August 25 – September 8 , 2026)

**Sprint Goal:** Implement and integrate the core Claim Management workflow and respond to client feedback from Milestone 1.

---

### Key Activities

#### 1. Sprint 3 Planning

Sprint 3 began with a review of the Claim Management requirements and the remaining work from the previous sprint.

The following User Stories were planned for Sprint 3:

- **US-12:** Submit Claim Request — 5 points
- **US-13:** Track Claim Status — 3 points
- **US-14:** Receive Claim Notifications — 5 points
- **US-15:** Review Claim Requests — 5 points

**Total Planned Story Points: 18**

**Sprint Goal:**

> "Implement and integrate the core Claim Management workflow and respond to client feedback from Milestone 1."

---

#### 2. Planned Claim Management Development

The main development activities planned for Sprint 3 were:

- Implement claim submission for Found Items.
- Allow users to track their claim status.
- Implement claim status notifications.
- Allow administrators to review and approve/reject claims.
- Integrate claims with existing Found Item posts.
- Integrate claim information with the existing database.
- Address client feedback received during Milestone 1.

---

#### 3. Sprint Progress

Although the Claim Management tasks were planned for Sprint 3, the team was unable to complete the implementation during the sprint.

The main reason was the team's **academic workload and assignment commitments**, which significantly limited the time available for development.

As a result, none of the planned User Stories reached the Definition of Done during Sprint 3.

The User Stories were therefore **not marked as completed** and were carried forward to the next sprint.

---

#### 4. Claim Management Work

The following Claim Management features were planned but remained incomplete during Sprint 3:

- Submit Claim Request
- Track Claim Status
- Receive Claim Notifications
- Review Claim Requests
- Approve or Reject Claims
- Integrate claims with Found Item posts
- Integrate claims with the database

These features will be continued in the next sprint.

---

### Sprint 3 Deliverable

No planned User Stories were completed during Sprint 3.

The Claim Management functionality remains as outstanding work and will be carried forward to the next sprint.

The planned user workflow is:

> **Login → View Found Item → Submit Claim → Track Claim Status → Receive Notification**

The planned administrator workflow is:

> **Login → View Claim Requests → Review Claim → Approve/Reject → Update Claim Status**

---


### Sprint 3 Review

The team reviewed the planned Claim Management functionality at the end of the sprint.

However, none of the four planned User Stories were completed according to the Definition of Done.

Therefore, no User Story was marked as completed during Sprint 3.

The remaining Claim Management work was reviewed and planned to be carried forward to the next sprint.

---

### Sprint 3 Outcome

Sprint 3 did not achieve the planned Sprint Goal.

The following User Stories remain incomplete:

- **US-12:** Submit Claim Request — **5 points**
- **US-13:** Track Claim Status — **3 points**
- **US-14:** Receive Claim Notifications — **5 points**
- **US-15:** Review Claim Requests — **5 points**

All four User Stories will be carried forward to Sprint 4.

The team did not mark incomplete work as completed in order to maintain an accurate representation of the Sprint progress.

---

### Client Feedback

The Claim Management requirements and previously received client feedback were reviewed by the team.

The remaining requirements will be addressed during the next sprint when development continues.

The team will prioritize completing the Claim Management workflow and integrating it with the existing Lost & Found system.

---

### Sprint 3 Reflection

| **Metric** | **Status** |
|---|---:|
| **Stories Planned** | 4 |
| **Stories Completed** | 0 |
| **Total Story Points Planned** | 18 |
| **Story Points Completed** | 0 |
| **Velocity** | 0 |

**Completion Rate:** 0%

### Planned User Stories

- **US-12:** Submit Claim Request — **5 points**
- **US-13:** Track Claim Status — **3 points**
- **US-14:** Receive Claim Notifications — **5 points**
- **US-15:** Review Claim Requests — **5 points**

**Total Planned Story Points: 18**

### Carried Forward to Sprint 4

All **4 User Stories (18 Story Points)** will be carried forward to Sprint 4.

The team will prioritize completing the Claim Management workflow, integrating it with the existing posts and database, and addressing the remaining client feedback.


---
## Sprint 4: Integration & Iterative Enhancements (Carry-over Claim Management)

**Due Date:** September 15, 2026

**Sprint Status:** Completed

**Sprint Goal:** Complete and integrate the core Claim Management workflow carried forward from the previous sprint, while addressing remaining client feedback.

---

### Key Activities

#### 1. Sprint 4 Planning

Sprint 4 began with a review of the remaining Claim Management work carried forward from the previous sprint.

The following User Stories were selected for Sprint 4:

- **US-12:** Submit Claim Request
- **US-13:** Track Claim Status
- **US-14:** Receive Claim Notifications
- **US-15:** Review Claim Requests

The team prioritized the Claim Management workflow because it is a core part of the system and required integration with the existing Lost & Found posting functionality.

**Sprint Goal:**

> "Complete and integrate the core Claim Management workflow carried forward from the previous sprint, while addressing remaining client feedback."

---

### 2. Claim Submission Development

The team implemented the functionality that allows users to submit claims for Found items.

The completed functionality includes:

- Selecting a Found item to claim
- Submitting a claim request
- Providing proof of ownership details
- Validating claim information
- Storing claim details in the database
- Associating the claim with the relevant Found item and claimant

**User Story:**  
**US-12 – Submit Claim Request**

**Story Points:** 5

**Status:** Completed

---

### 3. Claim Status Tracking

The team implemented functionality that allows users to track the progress of their submitted claims.

The claim status workflow was integrated into the system so that users can view the current status of their requests.

The supported claim statuses include:

- Pending
- Approved
- Rejected

**User Story:**  
**US-13 – Track Claim Status**

**Story Points:** 3

**Status:** Completed

---

### 4. Claim Notifications

The notification functionality was implemented to inform relevant users when the status of a claim changes.

The system supports notifications related to claim status updates and connects the notification process with the Claim Management workflow.

**User Story:**  
**US-14 – Receive Claim Notifications**

**Story Points:** 5

**Status:** Completed

---

### 5. Admin Claim Review

The team completed the administrative functionality required to review submitted claim requests.

The administrator can:

- View submitted claim requests
- Review the claimant's provided information
- Review the relevant Found item
- Approve a claim
- Reject a claim
- Update the claim status

The claim review process was integrated with the existing item and user information.

**User Story:**  
**US-15 – Review Claim Requests**

**Story Points:** 5

**Status:** Completed

---

### 6. Claim Management Integration

The Claim Management workflow was integrated with the existing Lost & Found system.

The integration included:

- Connecting claims with Found item posts
- Connecting claims with authenticated users
- Storing claim information in the database
- Updating claim status
- Linking admin decisions with claim status
- Updating the relevant item workflow
- Connecting claim status changes with notifications

The complete workflow was tested from claim submission through administrative review and status notification.

---

### 7. Client Feedback and Improvements

The team reviewed the remaining feedback and issues identified during the previous milestone.

The identified improvements were incorporated into the Claim Management workflow and related system components.

The team also tested the updated functionality to ensure that the new features worked correctly with the existing system.

---

### 8. Testing and Bug Fixing

Testing was conducted on the Claim Management workflow.

The team tested:

- Claim submission
- Claim validation
- Claim status tracking
- Claim approval
- Claim rejection
- Claim notifications
- Integration between claims and Found item posts
- Database operations
- User and administrator access

Identified issues were reviewed and fixed during the sprint.

---

## Story Point Estimation

The team used the Fibonacci story-point scale:

**1, 2, 3, 5, 8, 13**

Story points were estimated based on relative complexity, development effort, integration requirements, uncertainty, and testing requirements.

| User Story | Story Points | Reason | Status |
| :--- | :---: | :--- | :--- |
| **US-12 Submit Claim Request** | 5 | Claim form, validation, database integration, and ownership details | Completed |
| **US-13 Track Claim Status** | 3 | Retrieve and display claim status | Completed |
| **US-14 Receive Claim Notifications** | 5 | Notification workflow and integration with claim status changes | Completed |
| **US-15 Review Claim Requests** | 5 | Admin review, approval/rejection workflow, and database integration | Completed |
| **Total** | **18** | | **Completed** |

---

## Sprint 4 Deliverable

By the end of Sprint 4, the system supports the complete core Claim Management workflow:

Found Item
     ↓
Submit Claim Request
     ↓
Claim Status: Pending
     ↓
Admin Reviews Claim
     ↓
Approve / Reject
     ↓
Claim Status Updated
     ↓
User Receives Notification
     ↓
User Tracks Claim Status
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


