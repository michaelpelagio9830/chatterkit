## ADDED Requirements

### Requirement: FAQ data configuration
The system SHALL allow consuming applications to provide FAQ items for FAQ mode.

#### Scenario: FAQ items supplied
- **WHEN** a developer configures the chatbot in `faq` mode with FAQ items
- **THEN** the chatbot uses those FAQ items as its source of responses

### Requirement: FAQ response resolution
The system SHALL resolve user messages against the configured FAQ data and return the matching FAQ answer.

#### Scenario: User question matches FAQ
- **WHEN** a user submits a message that matches a configured FAQ item
- **THEN** the chatbot displays the matching FAQ answer

#### Scenario: User question does not match FAQ
- **WHEN** a user submits a message that does not match any configured FAQ item
- **THEN** the chatbot displays a configurable fallback response

### Requirement: Configurable FAQ resolver
The system SHALL allow developers to provide a custom FAQ resolver function.

#### Scenario: Custom resolver provided
- **WHEN** a developer provides a custom FAQ resolver
- **THEN** the chatbot uses the custom resolver instead of only relying on the default matching behavior

### Requirement: FAQ mode independent from adapter mode
The system SHALL run FAQ mode without requiring an external adapter provider.

#### Scenario: FAQ mode without provider
- **WHEN** the chatbot is configured in `faq` mode without an adapter provider
- **THEN** the chatbot still answers using the configured FAQ behavior