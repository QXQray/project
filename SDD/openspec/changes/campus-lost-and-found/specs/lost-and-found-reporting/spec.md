## ADDED Requirements

### Requirement: Item Reporting
The system SHALL allow logged-in users (students and admins) to report a lost item with a description, location, and an image upload.

#### Scenario: Student reports a lost item
- **WHEN** a logged-in student submits the item reporting form with valid data and an image
- **THEN** the system saves the item with the default status "保存中" and shows it at the selected location on the map.

### Requirement: Status Management
The system SHALL strictly limit modifying an item's status to administrators.

#### Scenario: Admin updates an item status
- **WHEN** an admin logs in and changes an item's status from "保存中" to "已認領"
- **THEN** the item's status is successfully updated in the database and visible to all users.
