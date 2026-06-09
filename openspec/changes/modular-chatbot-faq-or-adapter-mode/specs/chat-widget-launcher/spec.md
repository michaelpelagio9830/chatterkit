## ADDED Requirements

### Requirement: Floating widget launcher
The system SHALL provide a floating chatbot widget component that displays a launcher bubble by default and opens the chat panel when activated.

#### Scenario: Render collapsed widget launcher
- **WHEN** a developer renders the floating chatbot widget with valid configuration
- **THEN** the system displays a launcher bubble fixed near the lower-right of the viewport by default

#### Scenario: Open chat panel from launcher
- **WHEN** a user activates the launcher bubble
- **THEN** the system opens the chatbot panel while preserving the configured chatbot mode behavior

#### Scenario: Close chat panel
- **WHEN** a user activates the close or minimize control on the open widget
- **THEN** the system hides the chatbot panel and keeps the launcher bubble available

### Requirement: Widget mode compatibility
The floating widget SHALL support the same `faq` and `adapter` mode configurations as the embedded chatbot component.

#### Scenario: Floating FAQ widget
- **WHEN** the widget is configured with `mode` set to `faq` and valid FAQ items
- **THEN** the opened chat panel answers using FAQ mode behavior

#### Scenario: Floating adapter widget
- **WHEN** the widget is configured with `mode` set to `adapter` and a valid provider
- **THEN** the opened chat panel answers using adapter mode behavior

### Requirement: Draggable launcher option
The floating widget SHALL expose a `draggable` prop that enables or disables launcher bubble dragging.

#### Scenario: Draggable launcher enabled
- **WHEN** the widget is rendered with `draggable` enabled
- **THEN** the user can drag the launcher bubble to a different viewport position

#### Scenario: Draggable launcher disabled
- **WHEN** the widget is rendered without `draggable` enabled
- **THEN** the launcher bubble remains at its configured or default fixed position

### Requirement: Viewport-constrained dragging
The system SHALL prevent a draggable launcher bubble from being positioned outside the visible viewport.

#### Scenario: User drags launcher toward viewport edge
- **WHEN** the user drags the launcher bubble beyond a viewport boundary
- **THEN** the system clamps the launcher position so the bubble remains visible and reachable

### Requirement: Click versus drag behavior
The system SHALL distinguish launcher activation from dragging so that moving the bubble does not accidentally open the chat panel.

#### Scenario: User drags launcher
- **WHEN** the user moves the launcher bubble beyond the drag threshold and releases it
- **THEN** the system updates the launcher position without opening the chat panel

#### Scenario: User clicks launcher
- **WHEN** the user activates the launcher without dragging beyond the threshold
- **THEN** the system opens the chat panel

### Requirement: Widget styling customization
The floating widget SHALL provide Tailwind-based default styles and customization hooks for the launcher, panel shell, and close/minimize controls.

#### Scenario: Default floating widget styles
- **WHEN** the widget is rendered without custom widget class overrides
- **THEN** the launcher and opened chat panel use usable Tailwind-styled defaults

#### Scenario: Custom widget classes supplied
- **WHEN** a developer provides supported widget class overrides
- **THEN** the launcher, panel shell, or controls use the provided custom classes