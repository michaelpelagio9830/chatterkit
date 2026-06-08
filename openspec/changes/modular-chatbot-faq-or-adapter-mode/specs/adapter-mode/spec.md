## ADDED Requirements

### Requirement: Provider contract
The system SHALL define a TypeScript provider contract for adapter mode that accepts user input and chat context, then returns a chatbot response.

#### Scenario: Provider receives message
- **WHEN** a user submits a message in `adapter` mode
- **THEN** the chatbot calls the configured provider with the user message and current chat context

#### Scenario: Provider returns response
- **WHEN** the configured provider resolves successfully
- **THEN** the chatbot displays the provider response as a bot message

### Requirement: OpenAPI-compatible adapter configuration
The system SHALL support OpenAPI-compatible adapter configuration patterns for connecting to external services.

#### Scenario: Developer configures external endpoint
- **WHEN** a developer provides an adapter configuration for an external OpenAPI-compatible service
- **THEN** the adapter can format a request to that endpoint and map the response into a chatbot message

### Requirement: Request and response mapping
The system SHALL allow developers to customize adapter request formatting and response parsing.

#### Scenario: Custom payload mapper provided
- **WHEN** a developer provides a custom request mapper
- **THEN** adapter mode uses the mapper to build the external service payload

#### Scenario: Custom response mapper provided
- **WHEN** a developer provides a custom response mapper
- **THEN** adapter mode uses the mapper to convert the external service response into chatbot output

### Requirement: Adapter error handling
The system SHALL handle adapter failures without crashing the React application.

#### Scenario: External service request fails
- **WHEN** the provider rejects or returns an invalid response
- **THEN** the chatbot displays an error or fallback response and keeps the component usable

### Requirement: Secret handling guidance
The system SHALL document that production API secrets should generally be handled through a developer-owned backend or proxy.

#### Scenario: Developer reads adapter documentation
- **WHEN** a developer reviews adapter mode setup guidance
- **THEN** the documentation warns against exposing production API secrets directly in browser code