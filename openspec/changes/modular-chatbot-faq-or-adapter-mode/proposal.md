## Why

Developers need a reusable chatbot component that can be embedded in React applications without being locked into a single backend, AI vendor, or fixed support workflow. This change establishes a modular React + Tailwind chatbot foundation that can operate either as a lightweight FAQ bot or as a frontend component connected to a developer-provided external OpenAPI/LLM service.

## What Changes

- Introduce a reusable chatbot component architecture intended for npm distribution.
- Define a mode-based configuration model where the chatbot runs as either `faq` mode or `adapter` mode.
- Add FAQ mode for answering from predefined FAQ data supplied by the consuming application.
- Add adapter mode for connecting to developer-provided external services through a provider contract, including OpenAPI-compatible LLM services.
- Add a floating chat widget launcher that can show a lower-right chat bubble, open/close the chat panel, and optionally allow the bubble to be dragged through a `draggable` prop.
- Add a lightweight showcase page that demonstrates the main chatbot options and variants.
- Establish a recommended implementation stack: React, TypeScript, Tailwind CSS, Vite, Vitest, and React Testing Library.
- Define npm package readiness expectations, including public exports, TypeScript types, peer dependencies, examples, and documentation.
- De-prioritize hybrid FAQ-to-adapter fallback behavior for the MVP; hybrid behavior may be added later as a future enhancement.

## Capabilities

### New Capabilities
- `chatbot-component`: Reusable React chatbot component, public props, message schema, state behavior, and Tailwind-based UI composition.
- `faq-mode`: FAQ chatbot mode using predefined question/answer data and configurable resolution behavior.
- `adapter-mode`: Provider-based adapter mode for connecting the chatbot to external services, including OpenAPI-compatible LLM APIs.
- `chat-widget-launcher`: Floating chatbot widget shell with a launcher bubble, open/close behavior, optional draggable positioning, and Tailwind-based launcher/panel styling.
- `library-packaging`: npm-ready package structure, build outputs, TypeScript declarations, peer dependency expectations, and example documentation.

### Modified Capabilities
- None.

## Impact

- Affects the future React component source structure, package exports, and public API design.
- Adds TypeScript contracts for messages, modes, FAQ data, provider adapters, and component props.
- Adds TypeScript contracts for floating widget props, including `draggable` behavior and launcher positioning options.
- Introduces Tailwind CSS as the default styling approach for the ready-made UI.
- Introduces Vite-based development/build expectations and Vitest/React Testing Library testing expectations.
- Requires documentation and examples that show FAQ mode and adapter mode integration patterns.
- Requires a showcase/demo page covering embedded FAQ, embedded adapter, fixed floating widget, and draggable floating widget variants.
- Requires security guidance that external API credentials should generally be handled through a developer-owned backend/proxy rather than exposed directly in the browser.