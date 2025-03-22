# Introduction

This project entails developing a comprehensive application designed for personal journaling. The application provides users with a secure and intuitive platform to capture daily thoughts, experiences, and reflections. It aims to offer not just a digital journal, but a rich experience with features for organizing, analyzing, and understanding personal writing habits and trends.

## What the Project Entails

- **User Authentication:**  
    The application will implement secure user registration and login mechanisms to ensure that user data remains private and protected. The API will detail authentication strategies, such as JWT tokens or session management, to suit the needs of a production environment.
    
- **Journal Entry Management:**  
    Users can create, edit, and delete journal entries. Each entry includes key attributes such as title, content, category, and dates. The system will support optimistic updates to provide a seamless and responsive user experience.
    
- **Journal View:**  
    The API will facilitate easy access to journal entries, allowing users to fetch and view their content through a well-structured and intuitive interface.
    
- **Categorization:**  
    A flexible tagging or categorization system will enable users to organize entries into various groups (e.g., Personal, Work, Travel), thus offering a personalized and organized journaling experience.
    
- **Summary View:**  
    The application will include endpoints to generate analytical summaries of journal entries over selected periods. These summaries aim to help users visualize patterns and trends in their writing, such as:
    
    - Calendar heatmaps showing entry frequency and writing consistency.
    - Pie charts or bar graphs for category distribution.
    - Trends in word count over time.
    - Average entry length by category.
    - Time-of-day writing pattern analysis.
    - Word/phrase frequency analysis with word clouds.
    - Mood tracking through sentiment analysis.
- **Settings:**  
    The API will provide endpoints for users to manage their profiles and preferences, ensuring a customizable experience that caters to individual needs.
### Intended Audience

This document is intended for

- **Developers and Architects:**  
    Responsible for implementing or maintaining the API, ensuring adherence to best practices and seamless integration with other systems.
- **Quality Assurance Teams:**  
    Who require a clear understanding of API functionalities for comprehensive testing and validation.
- **Product Managers and Stakeholders:**  
    Needing to align technical capabilities with business objectives and understand the feature set offered by the application.
- **Technical Writers and Documentarians:**  
    Who will use this specification as a reference to generate user manuals, integration guides, and training materials.


# Microservices

### Microservice: Authentication and Access Controls

This microservice is responsible for managing user authentication and session management. It provides endpoints for user registration, login, active session monitoring, session validation, session invalidation (with an event stream for real-time logout), user profile management and logging user sign-up/login activities.

#### 1. Register Route

- **Endpoint:** `POST /users/register`
- **Purpose:**  
    Registers a new user by accepting their credentials and basic profile information.
- **Request Payload:**
    
    ```json
    {
      "username": "string",      // Unique user identifier
      "password": "string"       // Secure password (client should enforce complexity rules)
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "userId": "string",        // Unique ID for the newly registered user
      "message": "User registered successfully."
    }
    ```
    
    On error:
    
    ```json
    {
    "message": [
        "Username is required"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
    ```
    

#### 2. Login Route

- **Endpoint:** `POST /api/auth/login`
- **Purpose:**  
    Authenticates a user and initiates a new session.
- **Request Payload:**
    
    ```json
    {
      "username": "string",   // Username or email
      "password": "string"    // Corresponding password
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "sessionId": "string",      // Unique session identifier
      "token": "string",          // JWT or session token for subsequent requests
      "user": {
        "userId": "string",
        "username": "string",
        "email": "string"
      },
      "message": "Login successful."
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Invalid credentials or account not found."
    }
    ```
    

#### 3. View Active Sessions Route

- **Endpoint:** `GET /api/auth/sessions`
- **Purpose:**  
    Retrieves a list of all active sessions for the authenticated user.
- **Authentication:**  
    Requires valid JWT or session token.
- **Response Format:**
    
    ```json
    {
      "status": "success",
      "sessions": [
        {
          "sessionId": "string",
          "device": "string",        // e.g., 'Chrome on Windows', 'Safari on iOS'
          "loginTime": "ISO8601 timestamp",
          "ipAddress": "string"
        },
        // Additional sessions...
      ]
    }
    ```
    

#### 4. Session Validation Event Route

- **Endpoint:** `GET /api/auth/session/validate`
- **Purpose:**  
    Provides a real-time event stream to check if the current session is still valid.  
    This can be implemented using Server-Sent Events (SSE) or WebSocket for real-time updates.
- **Authentication:**  
    Requires valid token upon connection.
- **Response Format:**
    - **Initial Connection:**  
        A stream connection is established.
    - **Event Payload Example (SSE format):**
        
        ```json
        {
          "event": "session_status",
          "data": {
            "sessionId": "string",
            "valid": true,              // Boolean indicating current validity
            "message": "Session is active."
          }
        }
        ```
        
        If a session is invalidated, an event is pushed:
        
        ```json
        {
          "event": "session_status",
          "data": {
            "sessionId": "string",
            "valid": false,
            "message": "Session has been invalidated. Please log in again."
          }
        }
        ```
        

#### 5. Invalidate Session Route

- **Endpoint:** `POST /api/auth/session/invalidate`
- **Purpose:**  
    Allows a user to explicitly invalidate a specific session, triggering a real-time logout on the front end via the event stream.
- **Authentication:**  
    Requires valid token.
- **Request Payload:**
    
    ```json
    {
      "sessionId": "string"   // The ID of the session to invalidate
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "message": "Session invalidated successfully."
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Session invalidation failed. Please try again."
    }
    ```
    
- **Event Stream Impact:**  
    Once the session is invalidated, the corresponding event stream for that session will push an event notifying the client of the invalidation for real-time logout.

#### 6. View User Login Information Route

- **Endpoint:** `GET /api/auth/logs`
- **Purpose:**  
    Retrieves a log of sign-ups and login activities, including device information and timestamps.
- **Authentication:**  
    Requires valid token.
- **Response Format:**
    
    ```json
    {
      "status": "success",
      "logs": [
        {
          "action": "signup",            // Or "login"
          "timestamp": "ISO8601 timestamp",
          "device": "string",            // e.g., "Chrome on Windows"
          "ipAddress": "string"
        },
        // Additional log entries...
      ]
    }
    ```

#### 7. View User Information Route

- **Endpoint:** `GET /api/auth/user`
- **Purpose:**  
    Retrieves the current authenticated user's profile information, such as their username, email, and other relevant details.
- **Authentication:**  
    Requires a valid JWT or session token.
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "user": {
        "userId": "string",
        "username": "string",
        "email": "string",
        "profilePic": "string",      // Optional profile picture URL
        "createdAt": "ISO8601 timestamp"
      }
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Unable to fetch user information."
    }
    ```
    

---

#### 8. Update User Information Route

- **Endpoint:** `PUT /api/auth/user`
- **Purpose:**  
    Allows the authenticated user to update their profile details, such as username, email, or profile picture.
- **Authentication:**  
    Requires a valid JWT or session token.
- **Request Payload:**
    
    ```json
    {
      "username": "string",       // Optional new username
      "email": "string",          // Optional new email address
      "profilePic": "string"      // Optional new profile picture URL
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "message": "User profile updated successfully.",
      "user": {
        "userId": "string",
        "username": "string",
        "email": "string",
        "profilePic": "string",
        "updatedAt": "ISO8601 timestamp"
      }
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Profile update failed. Please check the provided data."
    }
    ```

#### 9. Validate User Session Endpoint

- **Endpoint:** `POST /api/auth/validate`
- **Purpose:**  
    This endpoint allows other microservices to verify that a provided session token is valid and that the user is authenticated. It ensures inter-service communication can reliably confirm user authentication status.
- **Authentication:**  
    Called by internal services; requires the session token (e.g., JWT) in the request payload.
- **Request Payload:**
    
    ```json
    {
      "token": "string"  // The JWT or session token to be validated
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "authenticated": true,
      "user": {
        "userId": "string",
        "username": "string"
      },
      "message": "User session is valid."
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "authenticated": false,
      "error": "Invalid or expired session token."
    }
    ```


### Microservice: Journal API

This microservice is responsible for managing journal entries. It provides endpoints to create, view, update, delete, and tag journal entries. Each journal entry contains key attributes such as title, content, category, createdAt, and updatedAt timestamps. Additionally, any time a journal entry is created, updated, or deleted, the system will publish an event message via RabbitMQ to the Analysis Service. This event-driven approach ensures that analytical insights remain up-to-date with the latest user data.

#### 1. Create Journal Route

- **Endpoint:** `POST /api/journals`
- **Purpose:**  
    Allows the user to create a new journal entry.
- **Request Payload:**
    
    ```json
    {
      "title": "string",         // Title of the journal entry
      "content": "string",       // Main content of the entry
      "category": "string"       // Category or tag (e.g., Personal, Work, Travel)
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "journal": {
        "journalId": "string",    // Unique identifier for the journal entry
        "title": "string",
        "content": "string",
        "category": "string",
        "createdAt": "ISO8601 timestamp",
        "updatedAt": "ISO8601 timestamp"
      },
      "message": "Journal entry created successfully."
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Unable to create journal entry. Please check the provided data."
    }
    ```
    
- **Event Publishing:**  
    Upon successful creation, publish an event message to RabbitMQ:
    
    ```json
    {
      "action": "create",
      "journal": {
        "journalId": "string",
        "title": "string",
        "content": "string",
        "category": "string",
        "createdAt": "ISO8601 timestamp",
        "updatedAt": "ISO8601 timestamp"
      }
    }
    ```
    

---

#### 2. View Journals Route (with Pagination)

- **Endpoint:** `GET /api/journals`
- **Purpose:**  
    Retrieves a paginated list of journal entries for the authenticated user.
- **Query Parameters:**
    - `page`: Integer indicating the page number (default: 1).
    - `limit`: Integer indicating the number of entries per page (default: 10).
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "journals": [
        {
          "journalId": "string",
          "title": "string",
          "category": "string",
          "createdAt": "ISO8601 timestamp",
          "updatedAt": "ISO8601 timestamp"
        }
        // Additional journal entries...
      ]
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Unable to fetch journals."
    }
    ```
    

---

#### 3. View One Journal Route

- **Endpoint:** `GET /api/journals/{journalId}`
- **Purpose:**  
    Retrieves detailed information for a single journal entry specified by its unique identifier.
- **URL Parameter:**
    - `journalId`: Unique identifier of the journal entry.
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "journal": {
        "journalId": "string",
        "title": "string",
        "content": "string",
        "category": "string",
        "createdAt": "ISO8601 timestamp",
        "updatedAt": "ISO8601 timestamp"
      }
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Journal entry not found."
    }
    ```
    

---

#### 4. Update Journal Route

- **Endpoint:** `PUT /api/journals/{journalId}`
- **Purpose:**  
    Allows the user to update an existing journal entry.
- **URL Parameter:**
    - `journalId`: Unique identifier of the journal entry.
- **Request Payload:**
    
    ```json
    {
      "title": "string",        // Optional updated title
      "content": "string",      // Optional updated content
      "category": "string"      // Optional updated category
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "journal": {
        "journalId": "string",
        "title": "string",
        "content": "string",
        "category": "string",
        "createdAt": "ISO8601 timestamp",
        "updatedAt": "ISO8601 timestamp"  // Updated timestamp reflecting the changes
      },
      "message": "Journal entry updated successfully."
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Failed to update journal entry."
    }
    ```
    
- **Event Publishing:**  
    Upon successful update, publish an event message to RabbitMQ:
    
    ```json
    {
      "action": "update",
      "journal": {
        "journalId": "string",
        "title": "string",
        "content": "string",
        "category": "string",
        "createdAt": "ISO8601 timestamp",
        "updatedAt": "ISO8601 timestamp"
      }
    }
    ```
    

---

#### 5. Delete Journal Route

- **Endpoint:** `DELETE /api/journals/{journalId}`
- **Purpose:**  
    Enables the user to delete an existing journal entry.
- **URL Parameter:**
    - `journalId`: Unique identifier of the journal entry to be deleted.
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "message": "Journal entry deleted successfully."
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Failed to delete journal entry."
    }
    ```
    
- **Event Publishing:**  
    Upon successful deletion, publish an event message to RabbitMQ:
    
    ```json
    {
      "action": "delete",
      "journal": {
        "journalId": "string"
      }
    }
    ```
    

---

#### 6. Tag a Journal Route

- **Endpoint:** `POST /api/journals/{journalId}/tags`
- **Purpose:**  
    Allows users to add or update tags/categories associated with a journal entry.
- **URL Parameter:**
    - `journalId`: Unique identifier of the journal entry.
- **Request Payload:**
    
    ```json
    {
      "tags": ["string"]  // Array of tags to be associated with the journal entry
    }
    ```
    
- **Response Format:**  
    On success:
    
    ```json
    {
      "status": "success",
      "journal": {
        "journalId": "string",
        "tags": ["string"],
        "updatedAt": "ISO8601 timestamp"
      },
      "message": "Tags updated successfully."
    }
    ```
    
    On error:
    
    ```json
    {
      "status": "error",
      "error": "Failed to update tags for the journal entry."
    }
    ```
    
- **Event Publishing:**  
    Tag updates can be considered an update event. Upon successful tag update, an event message can be published:
    
    ```json
    {
      "action": "update",
      "journal": {
        "journalId": "string",
        "tags": ["string"],
        "updatedAt": "ISO8601 timestamp"
      }
    }
    ```
    

---

### Event Publishing with RabbitMQ

For each of the following operations—creation, update, deletion (and tag update, as part of update)—the Journal API must publish an event message to the RabbitMQ message queue to notify the Analysis Service. The message will include the action type (create, update, delete) and the relevant journal data. This ensures that the Analysis Service can process these changes in near real-time to update analytical summaries and visualizations.

### Microservice: Analysis Service

This microservice aggregates journal data and computes analytical insights for visualization. It exposes endpoints that return structured data for different chart types, ensuring that the front-end has access to near real-time statistics. Each endpoint returns data in a format tailored to a specific chart, as described below.

#### 1. Calendar Heatmap Data Endpoint

- **Endpoint:** `GET /api/analysis/calendar-heatmap`
- **Purpose:**  
    Returns data for a calendar heatmap chart that displays journal entry frequency over time.
- **Response Format:**
    
    ```json
    [
      { "date": "2016-01-01", "count": 12 },
      { "date": "2016-01-22", "count": 122 },
      { "date": "2016-01-30", "count": 38 }
      // ... additional entries
    ]
    ```
    
- **Example Explanation:**  
    Each object in the response array represents a specific date and the number of journal entries (or events) recorded on that day.

---

#### 2. Category Distribution Chart Endpoint

- **Endpoint:** `GET /api/analysis/category-distribution`
- **Purpose:**  
    Provides data for visualizing the distribution of journal entries across categories, either as a pie chart or a bar graph.
- **Response Format:**
    
    ```json
    [
  { "category": "Personal", "count": 15 },
  { "category": "Work", "count": 8 },
  { "category": "Travel", "count": 4 },
  { "category": "Health", "count": 3 }
]
    ```
    
- **Example Explanation:**  
    Each object represents a category (the `name` field) with associated metrics (`uv` and `pv`), which could be adapted to represent entry counts or other relevant statistics.

---

#### 3. Word Count Trends Line Chart Endpoint

- **Endpoint:** `GET /api/analysis/word-count-trends`
- **Purpose:**  
    Returns data for a line chart that tracks word count trends over time.
- **Response Format:**
    
    ```json
    [
      { "date": "2025-01-01", "value": 250 },
      { "date": "2025-01-02", "value": 300 },
      { "date": "2025-01-03", "value": 280 }
      // ... additional entries
    ]
    ```
    
- **Example Explanation:**  
    Each object contains a date and a corresponding `value` representing the total word count of journal entries on that day.

---

#### 4. Entry Length Averages by Category Endpoint

- **Endpoint:** `GET /api/analysis/entry-length-averages`
- **Purpose:**  
    Provides data for a bar chart that shows the average length (word count or character count) of journal entries grouped by category.
- **Response Format:**
    
    ```json
    [
      { "category": "Personal", "averageLength": 350 },
      { "category": "Work", "averageLength": 420 },
      { "category": "Travel", "averageLength": 300 }
    ]
    ```
    
- **Example Explanation:**  
    Each object details a category along with its computed average entry length.

---

#### 5. Time-of-Day Writing Pattern Analysis Endpoint

- **Endpoint:** `GET /api/analysis/time-of-day`
- **Purpose:**  
    Provides data for a bar chart analyzing writing patterns during different times of the day over a specified month.
- **Query Parameter:**
    - `month`: Month in `YYYY-MM` format (e.g., `2025-03`) to filter the data.
- **Response Format:**
    
    ```json
    [
      { "timeOfDay": "Morning", "count": 150 },
      { "timeOfDay": "Afternoon", "count": 200 },
      { "timeOfDay": "Evening", "count": 180 },
      { "timeOfDay": "Night", "count": 90 }
    ]
    ```
    
- **Example Explanation:**  
    Each object represents a time segment (e.g., Morning, Afternoon, Evening, Night) with the `count` indicating the number of journal entries written during that period in the specified month.

---

#### 6. Word/Phrase Frequency Analysis for Word Clouds Endpoint

- **Endpoint:** `GET /api/analysis/word-frequency`
- **Purpose:**  
    Returns data for generating a word cloud that visualizes the frequency of words or phrases found in journal entries.
- **Response Format:**
    
    ```json
    [
      { "word": "life", "frequency": 50 },
      { "word": "work", "frequency": 30 },
      { "word": "travel", "frequency": 20 }
      // ... additional entries
    ]
    ```
    
- **Example Explanation:**  
    Each object includes a `word` and its corresponding `frequency`, which can be used to size words appropriately in a word cloud visualization.

---

### Integration Note

The Analysis Service continuously updates its data by consuming event messages from the Journal API via RabbitMQ. This event-driven architecture ensures that all analytical endpoints reflect the most current journal activity, providing timely insights through interactive charts and graphs.

### Microservice: Machine Learning
To-do
