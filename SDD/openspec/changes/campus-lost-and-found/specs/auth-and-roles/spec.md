## ADDED Requirements

### Requirement: Role-Based Access Control
The system SHALL strictly enforce access control based on user roles: visitor (no login), student, and admin. Visitors cannot submit items, students can submit items, and admins can edit status and moderate content.

#### Scenario: Visitor attempts to access protected routes
- **WHEN** an unauthenticated user attempts to submit a lost item
- **THEN** they are redirected to the login page.

### Requirement: Student Authentication
The system SHALL allow students to register and log in using their student ID.

#### Scenario: Student registration
- **WHEN** a student provides a valid student ID and password
- **THEN** the system creates their account and allows them to log in.
