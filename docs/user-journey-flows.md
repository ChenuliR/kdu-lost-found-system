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

