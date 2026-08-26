## User Journey Flows

### User Registration & Authentication

```mermaid
flowchart TD

    A([START]) --> B[Open Lost and Found Portal]
    B --> C[Login Page]

    C --> D{Select Sign Up?}

    D -->|No| E[Enter University Email
         Enter Password]
    E --> F[Click Login]
    F --> G{Are Login Credentials Valid}
 
    G -->|No| H[Display Login Error]
    H --> C

    G -->|Yes| I[Identify User Role]
    I --> J{Is User an Admin}

    J -->|No| K[Student / Staff User]
    J -->|Yes| L[Admin User]

    K --> M[Lost and Found Home Page]
    L --> M

    D -->|Yes| N[Sign Up Page]
    N --> O[Enter University Email
         Enter Password]
    O --> P[Click Create Account]
    P --> Q[Create User Account]
    Q --> C

    M --> S([END])
```
<br>

### Browse, Search, Filter & View Post Details

```mermaid
flowchart TD

    A[Successful Login] --> B[Browse Page]

    B --> C[Display All Lost and Found Posts]

    C --> D{Search or Filter Posts}

    D -->|No| E[Browse Available Posts]

    D -->|Yes| F[Search or Apply Filters]

    F --> G[Display Matching Posts]

    G --> H{Select a Post}

    E --> H

    H -->|Yes| I[View Item Details]

    I --> J[Display Category]
    J --> K[Display Date]
    K --> L[Display Location]
    L --> M[Display Description]

    H -->|No| E
```
<br>

### Create and Manage Posts

```mermaid
flowchart TD

    A[Browse Page] --> B[Click New Post]

    B --> C[New Post Form]

    C --> D{Select Post Type}

    D -->|Lost Something| E[Enter Item Name]
    D -->|Found Something| E

    E --> F[Select Category]
    F --> G[Enter Date]
    G --> H[Enter Location]
    H --> I[Enter Description]
    I --> J[Upload Photo]

    J --> K[Click Create Post]
    K --> L[Create Lost or Found Post]

    L --> M[My Posts Page]
    M --> N[Display User Created Posts]

    N --> O{Select a Post ?}

    O -->|Yes| P[Item Details]

    P --> Q{Choose Action}

    Q -->|Edit| R[Edit Post]
    R --> S[Update Post]
    S --> M

    Q -->|Delete| T[Confirm Delete]
    T --> U{Confirm Deletion}

    U -->|No| P
    U -->|Yes| V[Delete Post]
    V --> M

    O -->|No| N
```
<br>

### Student/Staff Profile Management

```mermaid
flowchart TD

    A[Browse Page] --> B[Click Profile Icon]

    B --> C[Profile Menu]

    C --> D{Select Option}

    D -->|My Profile| E[My Profile Page]
    D -->|Logout| F[Logout]

    E --> G[Display Profile Details]

    E --> H[Display Quick Status]

    H --> I[Items Reported]
    H --> J[Successfully Claimed]

    G --> K[View Profile Information]
    I --> L[View Number of Items Reported]
    J --> M[View Number of Successfully Claimed Items]

    F --> N[Login Page]
```
<br>

### Admin Profile

```mermaid
flowchart TD

    A[Browse Page] --> B[Click Profile Icon]

    B --> C[Profile Menu]

    C --> D{Select Option}

    D -->|My Profile| E[My Profile Page]
    D -->|Admin Portal| F[Admin Dashboard]
    D -->|Logout| G[Logout]

    E --> H[Display Profile Details]

    F --> I[Display Dashboard Statistics]

    I --> J[Active Posts]
    I --> K[Pending Claims]
    I --> L[Resolved Cases]

    F --> M[Claim Requests Awaiting Verification]

    M --> N[View Claim Request Details]

    N --> O{Approve Claim?}

    O -->|Yes| P[Approve Claim Request]
    O -->|No| Q[Reject Claim Request]

    P --> R[Update Claim Status to Approved]
    Q --> S[Update Claim Status to Rejected]

    R --> T[Update Post Status]
    S --> U[Notify Claimant]

    T --> V[Notify Claimant]
    V --> W[Admin Dashboard]

    U --> W

    G --> X[Login Page]
