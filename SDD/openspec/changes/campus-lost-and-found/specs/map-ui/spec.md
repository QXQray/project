## ADDED Requirements

### Requirement: Interactive Map Rendering
The system SHALL display a static campus map image with interactive landmark pins positioned using percentage coordinates.

#### Scenario: Displaying pins on the map
- **WHEN** the user visits the map page
- **THEN** the system renders the campus JPG image and overlays all defined landmark pins accurately.

### Requirement: Location Filtering
The system SHALL allow users to click a landmark pin to filter lost and found items.

#### Scenario: Clicking a campus building
- **WHEN** a user clicks on the "Library" pin
- **THEN** the map UI shows a drawer/popup listing only the lost items reported at the "Library".
