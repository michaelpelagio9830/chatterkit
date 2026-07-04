## ADDED Requirements

### Requirement: Chat bubbles render markdown message content
Chat bubble components SHALL render string message content as markdown while preserving readable chat bubble layout.

#### Scenario: Basic markdown formatting is displayed
- **WHEN** a chat message contains markdown syntax for emphasis, strong text, inline code, headings, lists, blockquotes, or fenced code blocks
- **THEN** the chat bubble displays the corresponding formatted React elements within the bubble instead of showing raw markdown markers as plain text

#### Scenario: Plain text remains readable
- **WHEN** a chat message contains text without markdown syntax
- **THEN** the chat bubble displays the same readable text content without requiring consumer changes

### Requirement: Markdown links and autolinks are safe
Chat bubble markdown rendering SHALL convert markdown links and plain URL/email autolinks into safe anchors without executing message-provided scripts or raw HTML.

#### Scenario: Markdown links open safely
- **WHEN** a chat message contains a markdown link or plain URL
- **THEN** the rendered anchor uses safe external-link attributes such as `target="_blank"` and `rel="noopener noreferrer"` where applicable

#### Scenario: Raw HTML is not executed
- **WHEN** a chat message contains raw HTML or script-like content
- **THEN** the chat bubble does not execute that HTML or script content as active DOM behavior

### Requirement: Custom bubble children remain supported
Chat bubble components SHALL preserve existing support for custom React `children` passed by consumers.

#### Scenario: Consumer passes custom children
- **WHEN** a consumer renders a message item with explicit React children
- **THEN** the component renders those children without forcing markdown parsing over arbitrary React nodes

### Requirement: Markdown styling is scoped to Chatterkit bubbles
Markdown-specific visual styling SHALL be scoped to Chatterkit-owned chat bubble selectors and SHALL NOT introduce global markdown element styles.

#### Scenario: Markdown styles are applied inside chat bubbles
- **WHEN** markdown content renders paragraphs, lists, code, blockquotes, links, or headings inside a chat bubble
- **THEN** those elements have spacing, colors, and wrapping appropriate for the existing chat bubble design

#### Scenario: Host app elements are not globally styled
- **WHEN** a host application imports the Chatterkit stylesheet
- **THEN** markdown styles do not apply to unrelated host application markdown or HTML elements outside Chatterkit chat bubbles
