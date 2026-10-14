
# Entity Relationship Diagram (ERD)

This diagram represents the proposed entities and relationships for the Campus Lost & Found Portal.

```mermaid
erDiagram
    USERS {
        int user_id PK
        string university_email UK
        string university_id UK
        string full_name
        string password_hash
        string role
        datetime created_at
        datetime last_login
        boolean is_active
    }

    POSTS {
        int post_id PK
        int user_id FK
        string title
        string category
        string type
        string description
        string location
        datetime date_lost_found
        string photo_url
        string status
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
        string status
        datetime created_at
        datetime updated_at
        int admin_reviewed_by FK
        datetime reviewed_at
        string admin_notes
    }

    USER_ACTIVITY {
        int activity_id PK
        int user_id FK
        string action_type
        int reference_id
        datetime timestamp
        string ip_address
    }

    SYSTEM_CONFIG {
        string config_key PK
        string config_value
        string description
        datetime updated_at
    }

    USERS ||--o{ POSTS : creates
    USERS ||--o{ CLAIMS : submits
    POSTS ||--o{ CLAIMS : receives
    USERS ||--o{ USER_ACTIVITY : generates
    USERS ||--o{ POSTS : moderates
    USERS ||--o{ CLAIMS : reviews
```

## Key Relationships

- One user can create multiple posts.
- One user can submit multiple claims.
- One post can receive multiple claims.
- Users can generate multiple activity records.
- Administrators can moderate posts and review claims.
```

