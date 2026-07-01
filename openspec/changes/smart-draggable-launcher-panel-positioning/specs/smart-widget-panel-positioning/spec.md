## ADDED Requirements

### Requirement: Smart draggable panel placement
The system SHALL position the opened draggable widget panel relative to the launcher using available viewport space instead of directly reusing the launcher top-left coordinate.

#### Scenario: Open panel from centered launcher
- **WHEN** a user drags the launcher near the center of the viewport and activates it
- **THEN** the system positions the chat panel in a viewport-safe location adjacent to the launcher rather than overlapping the launcher origin unnecessarily

#### Scenario: Open panel near viewport edge
- **WHEN** a user activates a draggable launcher near a viewport edge
- **THEN** the system places the chat panel on the side with enough available space when possible

### Requirement: Viewport-safe draggable panel
The system SHALL keep the opened draggable widget panel fully within the visible viewport safe margin whenever the viewport can contain the default panel dimensions.

#### Scenario: Panel would overflow viewport
- **WHEN** a launcher position would cause the default panel to overflow the viewport
- **THEN** the system clamps the panel position so the panel remains visible and reachable

#### Scenario: Small viewport fallback
- **WHEN** the viewport is smaller than the default panel dimensions plus safe margins
- **THEN** the system sizes and positions the panel using the available viewport area without placing it outside the safe margin

### Requirement: Launcher-connected animation
The system SHALL animate the opened widget panel in a way that visually connects the panel to the draggable launcher position.

#### Scenario: Open panel after dragging launcher
- **WHEN** a user activates a launcher after dragging it to a new position
- **THEN** the panel opens with a transform origin or equivalent animation metadata derived from the launcher-to-panel relationship

#### Scenario: Custom panel classes remain supported
- **WHEN** a developer supplies widget panel class overrides or inline styles
- **THEN** the system preserves those overrides while still providing default seamless animation behavior

### Requirement: Drag activation behavior remains unchanged
The system SHALL continue distinguishing dragging from clicking when smart draggable panel placement is enabled.

#### Scenario: User drags launcher before opening
- **WHEN** the user moves the launcher beyond the drag threshold and releases it
- **THEN** the system updates the launcher position without opening the chat panel

#### Scenario: User clicks launcher after drag settles
- **WHEN** the user subsequently activates the launcher without dragging beyond the threshold
- **THEN** the system opens the chat panel using smart placement from the latest launcher position
