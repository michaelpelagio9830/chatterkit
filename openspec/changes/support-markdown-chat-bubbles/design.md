## Context

Chatterkit renders chat messages through `src/components/chat-bot/ChatBotMessageItem.tsx`. Message string content currently passes through `linkify`, which converts plain URLs and email addresses into anchors while leaving the rest of the content as plain text. This is safe because React escapes text content, but it does not render common markdown syntax used by assistant responses.

The library is distributed as a reusable React package, so markdown support must preserve consumer safety and compatibility. The implementation should not require host applications to configure markdown, Tailwind, or CSS processing. Markdown rendering must also work inside the existing no-preflight/scoped styling direction for package CSS.

## Goals / Non-Goals

**Goals:**

- Render common markdown syntax inside chat bubbles, including paragraphs, emphasis, strong text, inline code, fenced code blocks, headings, lists, blockquotes, links, and hard/soft line breaks as supported by the selected renderer.
- Keep rendering safe by not executing raw HTML embedded in message content.
- Preserve existing plain-text message behavior as much as possible, including automatic linking for plain URLs/emails.
- Add bubble-scoped styles so markdown content remains readable in user and bot messages.
- Cover markdown behavior with tests and document supported syntax.

**Non-Goals:**

- Building a custom markdown parser from scratch.
- Adding syntax highlighting for fenced code blocks in this change.
- Supporting arbitrary raw HTML rendering in chat messages.
- Changing the public message data model or requiring consumers to pass React nodes for markdown.
- Replacing the existing chat UI layout or visual theme.

## Decisions

1. **Use a maintained React markdown renderer rather than a custom parser.**
   - Add a lightweight markdown rendering dependency such as `react-markdown` and plugins only as needed, likely `remark-gfm` for GitHub-flavored markdown features and autolink literals.
   - Rationale: Markdown parsing has many edge cases; a maintained renderer reduces security and compatibility risks.
   - Alternative considered: extend `linkify` with regexes for markdown. Rejected because regex-based markdown parsing is fragile and hard to secure.

2. **Disable raw HTML rendering by default.**
   - Render markdown without `rehype-raw`; raw HTML in message content remains escaped or ignored according to renderer defaults.
   - Rationale: Chat content can originate from users or external providers, so executing embedded HTML would increase XSS risk.
   - Alternative considered: sanitize then render raw HTML. Rejected for this change because it adds dependency and policy complexity without being required for markdown chat bubbles.

3. **Integrate markdown rendering at the chat bubble content boundary.**
   - Replace the string `linkify(message.content)` path in `ChatBotMessageItem` with a dedicated markdown renderer component/helper.
   - Preserve `children` behavior by continuing to render supplied React children without forcing markdown parsing over arbitrary React nodes; string children can continue to be linkified or be handled consistently if implementation chooses a documented path.
   - Rationale: Message content is the stable boundary for text rendering, and preserving `children` avoids surprising consumers who provide custom React content.
   - Alternative considered: parse all descendants with markdown. Rejected because markdown parsers operate on strings and should not transform arbitrary React component trees.

4. **Keep links safe and visually consistent.**
   - Render markdown links and autolinked URLs/emails as anchors with `target="_blank"` and `rel="noopener noreferrer"` for external/http links, with consistent link styling in both user and bot bubbles.
   - Rationale: Existing `linkify` opens URLs in a new tab and uses safe rel attributes; markdown links should not regress that behavior.
   - Alternative considered: leave renderer default anchors untouched. Rejected because security attributes and styling would be inconsistent.

5. **Scope markdown styling to chat bubbles.**
   - Add a Chatterkit-owned class to rendered markdown content or message bubbles and style descendant markdown elements through package CSS/Tailwind utilities.
   - Rationale: Lists, paragraphs, and code blocks need spacing and readable colors, while styles must not leak into host applications.
   - Alternative considered: rely entirely on browser defaults. Rejected because the package intentionally avoids preflight and defaults may vary across hosts.

## Risks / Trade-offs

- **Bundle size increases due to markdown dependencies** → Keep dependencies minimal and avoid optional heavy features such as syntax highlighting.
- **Markdown output changes plain text spacing** → Add tests for plain text, multiline text, and links; tune renderer components/styles for compact chat bubbles.
- **Security regressions from unsafe HTML or links** → Do not enable raw HTML rendering; normalize anchors with safe `target`/`rel` behavior.
- **Styling conflicts with host apps** → Scope custom markdown CSS under Chatterkit-owned classes/selectors and avoid global element selectors.
- **Different expectations for user-authored messages** → Render both user and bot message strings consistently unless implementation introduces a documented opt-out or role-specific policy.

## Migration Plan

1. Add markdown renderer dependency/dependencies and commit lockfile updates.
2. Implement a chat-bubble markdown rendering helper/component and integrate it into `ChatBotMessageItem`.
3. Add scoped markdown styles for paragraphs, lists, code, blockquotes, headings, and links.
4. Add tests for supported markdown, plain text/autolinks, unsafe HTML, and custom `children` preservation.
5. Update README/examples to show markdown-capable responses.
6. Run typecheck, tests, and build verification.

Rollback is straightforward: remove markdown dependencies and restore the previous `linkify(message.content)` rendering path if unexpected regressions appear before release.

## Open Questions

- Should markdown rendering be always enabled for all message strings, or should the implementation expose an opt-out prop for consumers who require plain-text-only rendering?
- Should the legacy non-`chat-bot` `MessageItem` component also receive markdown support in the same implementation pass if it remains part of the public API?
