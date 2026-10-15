# Individual Project Portfolio

## Campus Lost & Found Portal

- **Student:** Jaliya Wijesinghe (D/BSE/24/0019)
- **Degree Programme:** BSc (Hons) in Software Engineering
- **University:** General Sir John Kotelawala Defence University (KDU)

---

## 1. Student Information

| Field | Details |
|---|---|
| Student Name | Jaliya Wijesinghe |
| Student ID | D/BSE/24/0019 |
| Degree Programme | BSc (Hons) in Software Engineering |
| University | General Sir John Kotelawala Defence University (KDU) |
| Project Name | Campus Lost & Found Portal |
| Repository Name | Campus Lost & Found Portal |
| Primary Role | Product Owner & Full-Stack Developer |
| GitHub Username | Rankethz |
| Tech Stack | TypeScript, JavaScript, CSS, Supabase (PostgreSQL & Auth), Git & GitHub |

---

## 2. Project Overview

### 2.1 System Overview

The Campus Lost & Found Portal is a web-based platform that centralizes the reporting, searching, filtering, and claiming of lost items for university students and staff. The system replaces ad hoc communication channels with a single, structured repository of lost and found listings, and includes an administrative review workflow that verifies ownership claims before an item is released to a claimant.

### 2.2 Project Scope and Delivery

The project was delivered by a team of five members under the Agile/Scrum framework. In total, **17 user stories were delivered across 6 sprints**. Technical decisions are documented in the [Architecture Documentation](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/architecture.md), and the persistent data model is captured in the [Database Schema](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/initialschema.sql).

### 2.3 My Position in the Team

Within the five-member team, I served concurrently as the **Product Owner** and as a core **Software Developer**. As Product Owner, I owned the product vision and the content and priority of the backlog. As a developer, I implemented the search, filtering, and administrative claim review features described in this portfolio.  

---

## 3. My Role and Responsibilities

I held two roles at once. Ownership of the backlog gave me direct insight into the intent behind each requirement, and hands-on development allowed me to assess the feasibility and cost of those requirements firsthand.

### 3.1 Product Owner Responsibilities

1. Defining the overarching product vision, domain scope, and user personas.
2. Authoring, refining, and prioritizing all 17 user stories in the product backlog.
3. Formulating granular Acceptance Criteria and the Definition of Done (DoD) for sprint increments.
4. Leading sprint reviews, demonstrating feature increments, and validating user story acceptance.
5. Collaborating with the Scrum Master on sprint planning and managing carry-over dependencies.

### 3.2 Developer Responsibilities

1. Full-stack development using TypeScript, JavaScript, and Supabase client queries.
2. Directly building item search, multi-criteria filtering, and admin moderation workflows.
3. Git workflow management: creating feature branches, writing conventional commits, raising Pull Requests, and participating in code review.

---

## 4. My Contributions

### 4.1 Product Backlog & User Stories

As Product Owner, I was responsible for the content and priority of the product backlog. My contributions included:

- Authoring all 17 user stories and expressing each in terms of user value.
- Prioritizing the backlog so that each sprint produced a coherent, demonstrable increment.
- Defining the Acceptance Criteria for each story and the shared Definition of Done, which established a consistent quality standard.
- Making the acceptance decision for each story during sprint reviews, based on whether it met its criteria.
- Deciding the priority of carry-over stories during sprint planning.

The resulting artifacts are available in the [Product Backlog](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/product-backlog.md) and the [Definition of Done](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/definition-of-done.md).

### 4.2 Feature Development

I delivered three user stories through merged Pull Requests, spanning both the user-facing discovery experience and the administrative moderation workflow.

#### US-09: Search Items

- **Pull Request:** [#39](https://github.com/ChenuliR/kdu-lost-found-system/pull/39) — "added search bar with search by name funtionality."
- **Merged:** August 24, 2026
- **Scope:**
  - Keyword and text matching across item titles, descriptions, and locations.
  - Debounced client-side input handling to limit unnecessary query requests while the user types.

#### US-10: Filter Listings

- **Pull Request:** [#40](https://github.com/ChenuliR/kdu-lost-found-system/pull/40) — "added search filters for search bar"
- **Merged:** August 24, 2026
- **Scope:**
  - Dynamic multi-attribute filtering by category, post status (Lost/Found), campus location, and date range.
  - Supabase query construction that composes the active filters into a single request.
  - Reset controls that return the listing view to its default state.

#### US-15: Review Claim Requests

- **Pull Request:** [#47](https://github.com/ChenuliR/kdu-lost-found-system/pull/47) — "added claim reviewing to admin panel"
- **Merged:** September 14, 2026
- **Scope:**
  - An administrative verification interface for reviewing claimant proof and details.
  - State updates for approving or rejecting claims.
  - Securing role-restricted admin actions so that only authorized users can change claim status.

The supporting database changes are recorded in the [Claim Review Migration SQL](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/claim-review-migration.sql). The corresponding workflows are documented in the [Claim Submission Flow Diagram](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/diagrams/07-claim-submission-flow.md) and the [Admin Claim Review Flow Diagram](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/diagrams/08-admin-claim-review-flow.md).

### 4.3 Git Workflow

I followed a consistent, branch-based workflow throughout the project:

1. **Feature branches:** Each user story was developed on a dedicated branch, isolating work in progress from the main codebase.
2. **Conventional commits:** Commit messages followed a conventional format, keeping the history readable and traceable to individual changes.
3. **Pull Requests:** Completed work was raised as a Pull Request for team review prior to merging.
4. **Code review:** Changes were reviewed before integration, supporting code quality and shared understanding of the codebase.

My full contribution history is available in the [Commit History](https://github.com/ChenuliR/kdu-lost-found-system/commits?author=Rankethz).

---

## 5. Challenges and How I Addressed Them

### 5.1 Dual-Role Time Management

**Challenge:** Balancing Product Owner duties, such as backlog refinement and acceptance validation, against daily programming tasks created competing demands on limited time.

**Solution:** I conducted backlog refinement before each sprint kickoff. Completing story clarification and acceptance criteria ahead of time reduced mid-sprint interruptions and protected uninterrupted time for development.

### 5.2 Dynamic Query Optimization in Supabase (US-10)

**Challenge:** The filtering feature required many possible combinations of criteria (category, status, location, and date range). Handling each combination with ad hoc logic risked producing duplicated and difficult-to-maintain query code.

**Solution:** I wrote modular query-builder helpers that apply each filter conditionally to a single Supabase query. This kept the construction logic clean, reusable, and straightforward to extend.

### 5.3 Administrative Authorization & Security (US-15)

**Challenge:** Claim approval and rejection are sensitive operations, and unauthorized status transitions could allow items to be released to the wrong person.

**Solution:** I enforced role checks at two levels: within the UI views and within the database policies. Applying the restriction at the database layer ensures that the protection holds even if the client-side checks are bypassed.

---

## 6. Key Learning Outcomes

1. **Agile product ownership:** I learned how to translate a product vision into well-formed user stories with testable Acceptance Criteria, and how a clear Definition of Done supports consistent delivery.
2. **Bridging requirements and implementation:** Holding both the Product Owner and developer roles showed me how requirement clarity directly affects implementation effort and quality.
3. **Backend-integrated front-end development:** I strengthened my skills in building TypeScript and JavaScript interfaces backed by Supabase (PostgreSQL and Auth) queries.
4. **Defense in depth for security:** I learned the importance of enforcing authorization in both the interface and the database, rather than relying on a single layer.
5. **Disciplined version control:** I gained practical experience with feature branching, conventional commits, Pull Requests, and code review in a collaborative setting.
6. **Maintainable query design:** I learned to use modular helper functions to manage complexity as feature requirements grow.
7. **Team collaboration:** I gained experience coordinating priorities and acceptance decisions with a team of five.

---

## 7. Project Outcome

The team delivered **17 user stories across 6 sprints**, producing a functioning web-based Campus Lost & Found Portal. The final system was presented to the client and accepted.

The system allows students and staff to report, search, filter, and claim lost items, and provides administrators with a review workflow to verify claims. My direct technical contributions were the search capability (US-09), the multi-attribute filtering system (US-10), and the administrative claim review interface (US-15). In my Product Owner capacity, I owned the product backlog content and validated each sprint increment against its Acceptance Criteria and the Definition of Done, which supported the final acceptance of the system.

---

## 8. Evidence of Contributions

### 8.1 Merged Pull Requests

| User Story | Pull Request | Merged |
|---|---|---|
| US-09: Search Items | [Pull Request #39](https://github.com/ChenuliR/kdu-lost-found-system/pull/39) | Aug 24, 2026 |
| US-10: Filter Listings | [Pull Request #40](https://github.com/ChenuliR/kdu-lost-found-system/pull/40) | Aug 24, 2026 |
| US-15: Review Claim Requests | [Pull Request #47](https://github.com/ChenuliR/kdu-lost-found-system/pull/47) | Sep 14, 2026 |

- [Commit History](https://github.com/ChenuliR/kdu-lost-found-system/commits?author=Rankethz)

### 8.2 Repository Documentation

- [Project Repository](https://github.com/ChenuliR/kdu-lost-found-system)
- [Product Backlog](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/product-backlog.md)
- [Definition of Done](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/definition-of-done.md)
- [Database Schema](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/initialschema.sql)
- [Claim Review Migration SQL](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/claim-review-migration.sql)
- [Claim Submission Flow Diagram](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/diagrams/07-claim-submission-flow.md)
- [Admin Claim Review Flow Diagram](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/diagrams/08-admin-claim-review-flow.md)
- [Architecture Documentation](https://github.com/ChenuliR/kdu-lost-found-system/blob/main/docs/architecture.md)

---

## 9. Reflection

Undertaking the Product Owner and Developer roles simultaneously was the most instructive aspect of this project. As Product Owner, I was accountable for what the system should do and why; as a developer, I was accountable for how it was built and whether it worked. Holding both responsibilities made the consequences of vague requirements immediately apparent, and it reinforced the value of precise acceptance criteria and a shared Definition of Done.

On the technical side, the filtering and claim review features taught me that complexity is best managed through structure: modular query builders kept the filtering logic maintainable, and layered authorization kept the administrative workflow secure. These lessons extend beyond this project and reflect practices I intend to apply in future engineering work.

Working within a team of five also showed me that good outcomes depend on clear ownership. Knowing exactly which decisions and deliverables were mine allowed me to focus on product direction and implementation while the rest of the team did the same in their areas.

If I were to repeat the project, I would begin backlog refinement even earlier and define the Acceptance Criteria for every story before the first sprint, so that more development time is protected in later sprints. Overall, the project strengthened both my technical competence and my understanding of how Scrum roles interact in practice.
