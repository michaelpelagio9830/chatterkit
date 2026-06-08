## ADDED Requirements

### Requirement: npm-ready package build
The system SHALL provide a package build suitable for npm distribution.

#### Scenario: Build package
- **WHEN** the package build command is executed
- **THEN** distributable JavaScript output and TypeScript declaration files are generated

### Requirement: Public exports
The system SHALL expose public exports for the chatbot component, hooks, types, and provider contracts needed by consuming applications.

#### Scenario: Consumer imports package API
- **WHEN** a developer imports documented APIs from the package entrypoint
- **THEN** the chatbot component, relevant hooks, and TypeScript types are available

### Requirement: Peer dependency strategy
The system SHALL treat React as a peer dependency for the npm package.

#### Scenario: Package installed in React app
- **WHEN** a consuming React application installs the chatbot package
- **THEN** the package uses the consuming application's React version instead of bundling its own duplicate React runtime

### Requirement: Usage examples
The system SHALL include usage examples for FAQ mode and adapter mode.

#### Scenario: Developer reviews examples
- **WHEN** a developer reads the package examples or documentation
- **THEN** they can see how to configure both FAQ mode and adapter mode

### Requirement: Showcase page
The system SHALL include a lightweight showcase page that demonstrates the main chatbot variants and configuration options.

#### Scenario: Developer opens showcase page
- **WHEN** a developer runs the local demo or showcase app
- **THEN** they can view embedded FAQ, embedded adapter, fixed floating widget, and draggable floating widget examples

#### Scenario: Showcase examples use public API
- **WHEN** the showcase page is compiled
- **THEN** each showcase example uses documented public package APIs

### Requirement: Test coverage for package behavior
The system SHALL include automated tests for core chatbot behavior, FAQ mode, adapter mode, and component rendering.

#### Scenario: Run automated tests
- **WHEN** the test command is executed
- **THEN** the tests verify core behavior and mode-specific response flows