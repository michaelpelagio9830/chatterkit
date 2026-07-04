## 1. Dependencies and Rendering Architecture

- [x] 1.1 Add markdown rendering dependencies, likely `react-markdown` and `remark-gfm`, and update the lockfile.
- [x] 1.2 Create a dedicated chat markdown renderer/helper that accepts message string content and renders safe React markdown without enabling raw HTML execution.
- [x] 1.3 Configure rendered anchor elements to preserve safe external-link behavior and consistent link styling.

## 2. Chat Bubble Integration and Styling

- [x] 2.1 Integrate markdown rendering into `src/components/chat-bot/ChatBotMessageItem.tsx` for string message content while preserving explicit custom `children` behavior.
- [x] 2.2 Evaluate whether the legacy `src/components/MessageItem.tsx` path is public/active and apply the same markdown behavior if required for consistency.
- [x] 2.3 Add scoped Chatterkit markdown styles for paragraphs, headings, lists, inline code, fenced code blocks, blockquotes, and links within chat bubbles.

## 3. Tests and Documentation

- [x] 3.1 Add component tests for markdown formatting, plain text rendering, autolink/link safety attributes, and unsafe raw HTML behavior.
- [x] 3.2 Add or update tests confirming custom React `children` are preserved without markdown parsing over arbitrary nodes.
- [x] 3.3 Update README/examples to document markdown support, supported syntax, and raw HTML safety behavior.

## 4. Verification

- [x] 4.1 Run unit tests and type checking.
- [x] 4.2 Build the package and verify markdown styles are included without introducing global CSS leakage.
