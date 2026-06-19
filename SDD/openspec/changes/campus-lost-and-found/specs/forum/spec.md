## ADDED Requirements

### Requirement: Creating Forum Posts
The system SHALL allow logged-in students and admins to create posts in the forum under predefined categories like "尋找中" or "其他".

#### Scenario: Student posts a search request
- **WHEN** a logged-in student submits a post titled "[尋找中] 我的水壺" 
- **THEN** the post is visible on the forum board immediately.

### Requirement: Admin Moderation
The system SHALL allow admins to delete forum posts or comments.

#### Scenario: Admin deletes inappropriate post
- **WHEN** an admin clicks delete on a forum post
- **THEN** the post is permanently removed from the system.
