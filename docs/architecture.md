# Architecture Documentation
## Campus Lost & Found Portal

**Version:** 1.0
**Development Model:** Rapid Application Development (RAD)

---

## 1. System Architecture Overview

The Campus Lost & Found Portal follows a standard three-tier web application architecture, designed to support the RAD model's emphasis on modular, independent components.

### 1.1 Architecture Layers

```mermaid
flowchart TB
    subgraph Client["Presentation Layer"]
        UI[Web Browser Interface]
        CSS[Responsive CSS Framework]
        JS[Client-side JavaScript]
    end

    subgraph Server["Application Layer"]
        WebServer[Web Server]
        Router[Request Router]
        subgraph Modules["Modules (RAD Iterations)"]
            PostModule[Post Module]
            SearchModule[Search Module]
            ClaimModule[Claim Module]
            AdminModule[Admin Module]
        end
        AuthService[Authentication Service]
    end

    subgraph Data["Data Layer"]
        DB[(Relational Database)]
        Cache[Query Cache]
    end

    UI --> WebServer
    WebServer --> Router
    Router --> Modules
    Modules --> AuthService
    Modules --> DB
    DB --> Cache
    Cache --> Modules
```
## 1.2 Module Dependencies

```mermaid
flowchart LR
    subgraph RAD_Iterations["RAD Iteration Sequence"]
        direction LR
        Iter1[Iteration 1<br/>Post Module]
        Iter2[Iteration 2<br/>Search Module]
        Iter3[Iteration 3<br/>Claim Module]
        Iter4[Iteration 4<br/>Admin Module]
    end

    Iter1 --> Iter2
    Iter2 --> Iter3
    Iter3 --> Iter4
    
    Iter1 -.->|Shared| DB[(Database)]
    Iter2 -.->|Shared| DB
    Iter3 -.->|Shared| DB
    Iter4 -.->|Shared| DB
```
## 2. Database Design

### 2.1 Entity Relationship Diagram

```mermaid

erDiagram
    USERS {
        int user_id PK
        string university_email UK
        string university_id UK
        string full_name
        string password_hash
        string role "student/staff/admin"
        datetime created_at
        datetime last_login
        boolean is_active
    }

    POSTS {
        int post_id PK
        int user_id FK
        string title
        string category "electronics/books/keys/etc"
        string type "lost/found"
        string description
        string location
        datetime date_lost_found
        string photo_url
        string status "active/claimed/closed"
        datetime created_at
        datetime updated_at
        datetime closed_at
        int admin_updated_by FK
    }

    CLAIMS {
        int claim_id PK
        int post_id FK
        int claimant_user_id FK
        string proof_details
        string status "pending/approved/rejected"
        datetime created_at
        datetime updated_at
        int admin_reviewed_by FK
        datetime reviewed_at
        string admin_notes
    }

    USER_ACTIVITY {
        int activity_id PK
        int user_id FK
        string action_type "post_create/post_edit/claim_submit/etc"
        int reference_id "post_id or claim_id"
        datetime timestamp
        string ip_address
    }

    SYSTEM_CONFIG {
        string config_key PK
        string config_value
        string description
        datetime updated_at
    }

    USERS ||--o{ POSTS : "creates"
    USERS ||--o{ CLAIMS : "submits"
    POSTS ||--o{ CLAIMS : "receives"
    USERS ||--o{ USER_ACTIVITY : "generates"
    USERS ||--o{ POSTS : "moderates"
    USERS ||--o{ CLAIMS : "reviews"
```
### 2.2 Key Relationships
Users to Posts (1:M): One user can create many posts

Users to Claims (1:M): One user can submit many claims

Posts to Claims (1:M): One found post can receive many claims

Admin Users: Can moderate posts and review claims (self-referencing foreign keys)

## 3. State Transitions

### 3.1 Post Lifecycle

```mermaid

stateDiagram-v2
    [*] --> Draft: User creates a post

    state Draft {
        [*] --> Active: User submits/finalizes post
    }

    state Active {
        [*] --> Active_State: Post is live and searchable
        note right of Active_State
            Users can search and view this post.
            Claims can be submitted on Found posts.
        end note
    }

    state Claimed {
        [*] --> Claimed_State: Admin approves a claim
        note right of Claimed_State
            The item is pending handover.
            Post is no longer available for new claims.
        end note
    }

    state Closed {
        [*] --> Closed_State: Item is resolved
        note right of Closed_State
            Final state for audit/archival.
            Post is no longer active or searchable in main listings.
        end note
    }

    Active_State --> Claimed_State: Admin approves claim
    Active_State --> Closed_State: Admin closes (expired/duplicate/inappropriate)
    Claimed_State --> Closed_State: Admin closes after successful handover
    Claimed_State --> Active_State: Admin rejects claim

    Closed_State --> [*]: Archived
    Draft --> [*]: User discards/cancels post (Optional)
```
## 3.2 Claim Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: User submits a claim on a Found post.

    state Pending {
        [*] --> Waiting_Admin_Review: Claim is in the admin queue.
        note right of Waiting_Admin_Review
            Admin reviews the claim and proof of ownership.
            Claimant can track this status.
        end note
    }

    Waiting_Admin_Review --> Approved: Admin verifies ownership and approves.
    Waiting_Admin_Review --> Rejected: Admin finds proof insufficient or claim invalid.

    state Approved {
        [*] --> Approved_State: Claim is successful.
        note right of Approved_State
            The related post is marked as "Claimed".
            Claimant and finder are notified (FR-3.3).
        end note
    }

    state Rejected {
        [*] --> Rejected_State: Claim is denied.
        note right of Rejected_State
            The related post remains "Active".
            Claimant and finder are notified (FR-3.3).
        end note
    }

    Approved_State --> [*]: End of lifecycle.
    Rejected_State --> [*]: End of lifecycle.
```

## 3.3 Combined User & Admin Action Flow


```mermaid

stateDiagram-v2
    [*] --> User_Creates_Post

    state "Post Creation" as PC {
        [*] --> Draft
        Draft --> Active: User Publishes
    }

    state "Active Post" as AP {
        [*] --> Available
        Available --> Has_Claim: User Submits Claim
        Has_Claim --> Pending_Claim
        note right of Pending_Claim
            State: Post remains 'Active', Claim is 'Pending'
        end note
    }

    state "Admin Moderation" as AM {
        [*] --> Review_Claim: Admin Opens Claim
        Review_Claim --> Approve_Claim
        Review_Claim --> Reject_Claim
        Reject_Claim --> Post_Returns_To_Active

        Approve_Claim --> Post_Marked_Claimed
        Post_Marked_Claimed --> Admin_Closes_Post: Admin finalizes handover
    }

    state "Terminal States" as TS {
        [*] --> Archived
        note right of Archived
            Post is closed/archived.
            Claim is completed (Approved or Rejected).
        end note
    }

    Pending_Claim --> AM
    Post_Returns_To_Active --> AP
    Post_Marked_Claimed --> TS
    Admin_Closes_Post --> TS
    Reject_Claim --> TS: (Claim rejected, post stays active)

```
## 4. API Flow Diagrams
   
### 4.1 Claim Submission Flow

```mermaid

sequenceDiagram
    participant User
    participant Browser
    participant WebServer
    participant AuthService
    participant PostModule
    participant ClaimModule
    participant Database

    User->>Browser: Clicks "Submit Claim" on Found Post
    Browser->>WebServer: POST /api/claims
    WebServer->>AuthService: Validate JWT token
    AuthService-->>WebServer: User authenticated
    WebServer->>ClaimModule: Process claim request
    
    ClaimModule->>Database: Check post status (must be 'active')
    Database-->>ClaimModule: Post status = 'active'
    
    ClaimModule->>Database: Insert new claim (status = 'pending')
    Database-->>ClaimModule: Claim created with ID
    
    ClaimModule->>Database: Update post (no change yet)
    ClaimModule->>PostModule: Schedule status update (if approved later)
    
    ClaimModule-->>WebServer: Return claim details
    WebServer-->>Browser: 201 Created (Claim submitted)
    Browser-->>User: Show "Pending" status
```

### 4.2 Admin Claim Review Flow

```mermaid

sequenceDiagram
    participant Admin
    participant Browser
    participant WebServer
    participant AuthService
    participant ClaimModule
    participant PostModule
    participant NotificationService
    participant Database

    Admin->>Browser: Navigates to Pending Claims
    Browser->>WebServer: GET /admin/claims/pending
    WebServer->>AuthService: Validate admin privileges
    AuthService-->>WebServer: Admin verified
    
    WebServer->>ClaimModule: Get pending claims
    ClaimModule->>Database: Query pending claims
    Database-->>ClaimModule: List of pending claims
    ClaimModule-->>WebServer: Return claims
    WebServer-->>Browser: Display claims
    Browser-->>Admin: Shows pending claims list

    Admin->>Browser: Selects claim and clicks "Approve"
    Browser->>WebServer: PUT /admin/claims/{id}/approve
    WebServer->>AuthService: Validate admin privileges
    AuthService-->>WebServer: Admin verified
    
    WebServer->>ClaimModule: Approve claim
    ClaimModule->>Database: Update claim status = 'approved'
    
    ClaimModule->>PostModule: Update post status = 'claimed'
    PostModule->>Database: Update post status
    
    ClaimModule->>NotificationService: Send notifications
    NotificationService->>Database: Log notifications
    
    NotificationService-->>ClaimModule: Notifications sent
    ClaimModule-->>WebServer: Success
    WebServer-->>Browser: Claim approved
    Browser-->>Admin: Shows success message
```

