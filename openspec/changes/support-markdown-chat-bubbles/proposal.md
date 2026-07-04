## Why

Chat responses often include structured content such as headings, lists, emphasis, inline code, fenced code blocks, and links. Chatterkit currently renders message text as plain text with URL/email linkification, which makes markdown-formatted assistant responses harder to read in chat bubbles.

## What Changes

- Add markdown rendering support for chat bubble message content.
- Preserve safe rendering by avoiding raw HTML execution from message content.
- Keep existing automatic URL/email link behavior for plain URLs where markdown links are not used.
- Style rendered markdown elements so they fit naturally inside user and bot chat bubbles.
- Maintain backward compatibility for existing `children`, plain-text messages, and public chat component APIs unless an opt-in API is added during implementation.

## Capabilities

### New Capabilities
- `markdown-chat-bubbles`: Defines how chat bubbles render supported markdown syntax safely and consistently.

### Modified Capabilities

## Impact

- Affected message rendering: `src/components/chat-bot/ChatBotMessageItem.tsx` and possibly the legacy `src/components/MessageItem.tsx` path if still exposed.
- Affected utilities: `src/utils/linkify.tsx` may be replaced or integrated with markdown rendering.
- Affected styling: `src/style.css` and/or bubble utility classes for markdown spacing, lists, code, blockquotes, and links.
- Affected dependencies: likely add a lightweight React markdown renderer and, if needed, plugins for GitHub-flavored markdown and URL autolinks.
- Affected tests/docs: add coverage for markdown rendering and document supported syntax and safety behavior.
