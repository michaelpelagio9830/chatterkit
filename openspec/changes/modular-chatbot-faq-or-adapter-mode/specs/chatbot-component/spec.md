## ADDED Requirements

### Requirement: Reusable React chatbot component
The system SHALL provide a reusable React chatbot component that can be embedded in a consuming React application.

#### Scenario: Render chatbot in consuming app
- **WHEN** a developer imports and renders the chatbot component with valid configuration
- **THEN** the chatbot UI is displayed with a message area and user input composer

#### Scenario: Submit user message
- **WHEN** a user enters text and submits the composer
- **THEN** the chatbot records the user message and starts the configured response flow

### Requirement: Typed message schema
The system SHALL define TypeScript types for chatbot messages, including sender role, content, unique identifier, and timestamp metadata.

#### Scenario: Consumer uses message types
- **WHEN** a developer imports the public message type
- **THEN** TypeScript provides the required fields for creating or handling chatbot messages

### Requirement: Mode-based component configuration
The system SHALL expose a mode-based configuration model that supports `faq` mode and `adapter` mode.

#### Scenario: FAQ mode selected
- **WHEN** the chatbot is configured with `mode` set to `faq`
- **THEN** the chatbot uses FAQ mode behavior for message responses

#### Scenario: Adapter mode selected
- **WHEN** the chatbot is configured with `mode` set to `adapter`
- **THEN** the chatbot uses the configured provider for message responses

### Requirement: Tailwind default UI
The system SHALL provide default chatbot UI styling using Tailwind CSS classes.

#### Scenario: Default styled chatbot
- **WHEN** the chatbot is rendered without custom styling overrides
- **THEN** the component displays a usable Tailwind-styled interface

### Requirement: Loading and error states
The system SHALL display loading and error states during chatbot response flows.

#### Scenario: Response is pending
- **WHEN** the chatbot is waiting for a FAQ resolution or adapter provider response
- **THEN** the UI indicates that a response is loading

#### Scenario: Response fails
- **WHEN** the configured response flow fails
- **THEN** the UI displays an error state or configured fallback message