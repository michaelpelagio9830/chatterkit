## ADDED Requirements

### Requirement: Package stylesheet excludes Tailwind preflight
The package stylesheet exported as `chatterkit/style.css` SHALL NOT include Tailwind preflight or global reset CSS rules that target host application elements outside Chatterkit.

#### Scenario: Built CSS has no preflight reset rules
- **WHEN** the package build generates `dist/style.css`
- **THEN** the stylesheet MUST NOT contain Tailwind preflight reset selectors such as universal reset rules, `html` reset rules, `body` reset rules, or unscoped form element reset rules

#### Scenario: Consumer import path remains stable
- **WHEN** a consumer imports `chatterkit/style.css`
- **THEN** the import MUST resolve to the no-preflight package stylesheet without requiring a new import path

### Requirement: Chatterkit CSS remains scoped to package-owned selectors
Chatterkit-authored custom CSS SHALL be limited to package-owned selectors or Chatterkit component boundaries and SHALL NOT introduce unqualified global element styling.

#### Scenario: Custom animation classes are package-owned
- **WHEN** Chatterkit defines custom animation helper classes
- **THEN** those classes MUST use Chatterkit-owned names such as the existing `chatbot-` prefix

#### Scenario: Host application elements are unaffected
- **WHEN** a host application imports the Chatterkit stylesheet
- **THEN** unrelated host elements outside Chatterkit components MUST NOT receive Chatterkit-authored global element styles from the package stylesheet

### Requirement: Component styling continues to render without consumer Tailwind setup
Chatterkit components SHALL continue to render their default styles from the distributed package stylesheet without requiring consumers to install or configure Tailwind CSS.

#### Scenario: Default component utilities are emitted
- **WHEN** the package stylesheet is built from Chatterkit source files
- **THEN** the stylesheet MUST include the Tailwind utility classes used by Chatterkit default components

#### Scenario: Existing component APIs continue to work
- **WHEN** consumers render existing `ChatBot` or `ChatBotWidget` components and import `chatterkit/style.css`
- **THEN** the components MUST retain their public props and default styled presentation without API changes