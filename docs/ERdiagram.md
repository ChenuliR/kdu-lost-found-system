---
title: Campus Lost & Found Portal ER Diagram
config:
  flowchart:
    htmlLabels: true
    curve: linear
---
flowchart TB

    TITLE["Campus Lost & Found Portal ER Diagram"]

    %% =========================
    %% ENTITIES
    %% =========================

    USER["User"]
    POST["Post"]
    CLAIM["ClaimRequest"]
    NOTIFICATION["Notification"]

    STUDENT["Student"]
    STAFF["Staff"]
    ADMIN["Admin"]

    %% =========================
    %% USER ATTRIBUTES
    %% =========================

    U_ID(["<u>u_id</u>"])
    EMAIL(["email"])
    U_NAME(["u_name"])
    U_TYPE(["u_type"])

    USER --- U_ID
    USER --- EMAIL
    USER --- U_NAME
    USER --- U_TYPE

    %% =========================
    %% STUDENT AND STAFF ATTRIBUTES
    %% =========================

    S_MAJOR(["s_major"])
    S_DEPT(["s_dept"])

    STUDENT --- S_MAJOR
    STAFF --- S_DEPT

    %% =========================
    %% POST ATTRIBUTES
    %% =========================

    P_ID(["<u>p_id</u>"])
    ITEM_NAME(["item_name"])
    CATEGORY(["category"])
    DESCRIPTION(["description"])
    DATE_POSTED(["date_posted"])
    LOCATION(["location"])
    PHOTO_URL(["p_photo_url"])
    P_TYPE(["p_type<br/>(Lost / Found)"])
    P_STATUS(["p_status<br/>(Active / Claimed / Closed)"])
    ARCHIVED(["archived<br/>(Yes / No)"])

    POST --- P_ID
    POST --- ITEM_NAME
    POST --- CATEGORY
    POST --- DESCRIPTION
    POST --- DATE_POSTED
    POST --- LOCATION
    POST --- PHOTO_URL
    POST --- P_TYPE
    POST --- P_STATUS
    POST --- ARCHIVED

    %% =========================
    %% CLAIM ATTRIBUTES
    %% =========================

    C_ID(["<u>c_id</u>"])
    PROOF_DETAILS(["proof_details"])
    CLAIM_DATE(["claim_date"])
    C_STATUS(["c_status<br/>(Pending / Approved / Rejected)"])
    REVIEW_DATE(["review_date"])
    ADMIN_COMMENTS(["admin_comments"])

    CLAIM --- C_ID
    CLAIM --- PROOF_DETAILS
    CLAIM --- CLAIM_DATE
    CLAIM --- C_STATUS
    CLAIM --- REVIEW_DATE
    CLAIM --- ADMIN_COMMENTS

    %% =========================
    %% NOTIFICATION ATTRIBUTES
    %% =========================

    N_ID(["<u>n_id</u>"])
    MESSAGE(["message"])
    NOTIFICATION_DATE(["notification_date"])
    IS_READ(["is_read"])

    NOTIFICATION --- N_ID
    NOTIFICATION --- MESSAGE
    NOTIFICATION --- NOTIFICATION_DATE
    NOTIFICATION --- IS_READ

    %% =========================
    %% ISA SPECIALIZATION
    %% =========================

    ISA{{"ISA"}}

    USER --- ISA
    ISA --- STUDENT
    ISA --- STAFF
    ISA --- ADMIN

    %% =========================
    %% RELATIONSHIPS
    %% =========================

    CREATES{"creates"}
    SUBMITS{"submits"}
    RELATES_TO{"relates_to"}
    VERIFIES{"verifies"}
    MODERATES{"moderates"}
    RECEIVES{"receives"}
    GENERATES{"generates"}

    USER --- CREATES
    CREATES --- POST

    USER --- SUBMITS
    SUBMITS --- CLAIM

    CLAIM --- RELATES_TO
    RELATES_TO --- POST

    ADMIN --- VERIFIES
    VERIFIES --- CLAIM

    ADMIN --- MODERATES
    MODERATES --- POST

    USER --- RECEIVES
    RECEIVES --- NOTIFICATION

    CLAIM --- GENERATES
    GENERATES --- NOTIFICATION

    %% =========================
    %% CARDINALITIES
    %% =========================

    C1(["1"])
    C2(["M"])
    C3(["1"])
    C4(["M"])
    C5(["M"])
    C6(["1"])
    C7(["1"])
    C8(["M"])
    C9(["1"])
    C10(["M"])
    C11(["1"])
    C12(["M"])
    C13(["1"])
    C14(["M"])

    USER --- C1 --- CREATES
    CREATES --- C2 --- POST

    USER --- C3 --- SUBMITS
    SUBMITS --- C4 --- CLAIM

    CLAIM --- C5 --- RELATES_TO
    RELATES_TO --- C6 --- POST

    ADMIN --- C7 --- VERIFIES
    VERIFIES --- C8 --- CLAIM

    ADMIN --- C9 --- MODERATES
    MODERATES --- C10 --- POST

    USER --- C11 --- RECEIVES
    RECEIVES --- C12 --- NOTIFICATION

    CLAIM --- C13 --- GENERATES
    GENERATES --- C14 --- NOTIFICATION

    %% =========================
    %% LAYOUT
    %% =========================

    TITLE ~~~ USER
    USER ~~~ POST
    POST ~~~ CLAIM
    CLAIM ~~~ NOTIFICATION

    %% =========================
    %% STYLES
    %% =========================

    classDef title fill:#ffffff,stroke:#ffffff,color:#111,font-size:28px,font-weight:bold;
    classDef entity fill:#b9e6f5,stroke:#1565c0,stroke-width:2px,color:#111,font-size:18px,font-weight:bold;
    classDef attribute fill:#d9cce8,stroke:#7566b3,stroke-width:2px,color:#173b70,font-size:15px;
    classDef relationship fill:#c9e89b,stroke:#267326,stroke-width:2px,color:#111,font-size:16px,font-weight:bold;
    classDef isa fill:#ffcdd2,stroke:#e0002a,stroke-width:2px,color:#a00020,font-size:18px,font-weight:bold;
    classDef cardinality fill:#ffffff,stroke:#ffffff,color:#333,font-size:13px,font-weight:bold;

    class TITLE title;
    class USER,POST,CLAIM,NOTIFICATION,STUDENT,STAFF,ADMIN entity;
    class U_ID,EMAIL,U_NAME,U_TYPE,S_MAJOR,S_DEPT,P_ID,ITEM_NAME,CATEGORY,DESCRIPTION,DATE_POSTED,LOCATION,PHOTO_URL,P_TYPE,P_STATUS,ARCHIVED,C_ID,PROOF_DETAILS,CLAIM_DATE,C_STATUS,REVIEW_DATE,ADMIN_COMMENTS,N_ID,MESSAGE,NOTIFICATION_DATE,IS_READ attribute;
    class CREATES,SUBMITS,RELATES_TO,VERIFIES,MODERATES,RECEIVES,GENERATES relationship;
    class ISA isa;
    class C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,C14 cardinality;