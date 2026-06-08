## Context

This project is starting from an OpenSpec-only planning state and will evolve into a reusable chatbot package for React applications. The intended consumer is a developer who wants to embed a chatbot component in an app and configure it as either a simple FAQ bot or a bot connected to an external service through an adapter.

The primary constraints are:

- The UI must be built with React and Tailwind CSS.
- The package should be suitable for npm distribution.
- The public API should be strongly typed with TypeScript.
- The chatbot should not be locked into a single LLM vendor, API provider, or backend shape.
- The MVP should support either FAQ mode or adapter mode, but not prioritize hybrid FAQ-to-adapter fallback behavior.
- The package should support both embedded chat panel usage and floating widget usage.
- Floating widget usage should support an optional `draggable` prop for users who want to reposition the launcher bubble.

## Goals / Non-Goals

**Goals:**

- Provide a reusable React chatbot component with composable UI pieces.
- Define a mode-based API with `faq` and `adapter` modes.
- Keep chat state, message schema, and provider contracts modular and testable.
- Use Tailwind CSS as the default styling approach while allowing consumers to override classes or compose their own UI later.
- Support external OpenAPI/LLM services through a generic provider contract rather than a vendor-specific SDK.
- Prepare the project for npm distribution with type declarations, peer dependencies, documentation, and examples.
- Provide a `ChatBotWidget` wrapper for floating launcher use cases.
- Allow the floating launcher bubble to be draggable when `draggable` is enabled.
- Provide a lightweight showcase page that demonstrates core chatbot options.

**Non-Goals:**

- Do not implement hybrid FAQ-to-adapter fallback in the MVP.
- Do not directly couple the package to OpenAI, Anthropic, Gemini, or any other LLM vendor.
- Do not require Redux, Zustand, or another external state manager for the initial version.
- Do not include a production backend service inside the React package.
- Do not expose secret API keys directly in the browser as a recommended production integration strategy.
- Do not make draggable behavior required for every widget consumer.
- Do not build a full Storybook/docs site as part of the MVP showcase.

## Decisions

### Use React + TypeScript as the component foundation

The package will use React for UI composition and TypeScript for public API safety.

- **Rationale:** npm component libraries benefit from typed props, message models, provider contracts, and adapter configuration. TypeScript also improves consumer DX because IDEs can guide integration.
- **Alternative considered:** JavaScript-only implementation. This would be simpler initially but weaker for a reusable developer-facing library.

### Use Tailwind CSS for default UI styling

The ready-made chatbot UI will use Tailwind classes as the default styling approach.

- **Rationale:** Tailwind matches the project requirement and enables lightweight, utility-first styling without introducing a heavy component framework.
- **Alternative considered:** CSS modules or a full UI framework such as MUI. These would either reduce Tailwind alignment or add unnecessary dependency weight.

### Use a mode-based public API

The chatbot will be configured to run in either `faq` mode or `adapter` mode.

Conceptual API:

```tsx
<ChatBot mode="faq" faqItems={faqItems} />
```

```tsx
<ChatBot mode="adapter" provider={provider} />
```

- **Rationale:** This keeps the MVP simple and explicit. Developers can choose the behavior they need without the package guessing fallback behavior.
- **Alternative considered:** Hybrid FAQ-first then adapter fallback. This remains a useful future enhancement but adds matching priority, fallback control, and debugging complexity too early.

### Introduce `ChatBotWidget` for floating launcher usage

The package will keep `ChatBot` focused on the embedded chat panel and add a separate `ChatBotWidget` wrapper for website-style floating launcher behavior.

Conceptual API:

```tsx
<ChatBotWidget mode="faq" faqItems={faqItems} />
```

```tsx
<ChatBotWidget mode="adapter" provider={provider} />
```

- **Rationale:** Separating the panel from the launcher shell keeps embedded usage simple while still supporting the common lower-right support bubble UX.
- **Alternative considered:** Add `variant="floating"` to `ChatBot`. This is possible, but it mixes layout/widget responsibilities into the base chat panel API.

### Control draggable launcher behavior with a prop

`ChatBotWidget` will expose a `draggable?: boolean` prop. When enabled, the launcher bubble can be dragged to a custom viewport position. When disabled or omitted, the launcher remains fixed at its default placement.

Conceptual API:

```tsx
<ChatBotWidget mode="faq" faqItems={faqItems} draggable />
```

The draggable behavior should:

- support pointer-based dragging where feasible;
- prevent the launcher from being dragged off-screen;
- distinguish a click/tap from a drag so opening the chat panel remains predictable;
- keep persistence optional and defer localStorage persistence unless explicitly added later.

- **Rationale:** Dragging is useful but should be opt-in because it adds interaction complexity and may not be wanted in every app.
- **Alternative considered:** Always draggable. This could surprise users and complicate accessibility/mobile behavior for consumers who only need a fixed launcher.

### Separate core logic from React UI concerns

The implementation should separate:

- chat/message models
- chatbot state hooks
- mode-specific behavior
- provider contracts
- rendered UI components

- **Rationale:** A separation between core behavior and presentation makes the package easier to test, customize, and eventually split into `core`, `react`, and `adapters` packages if needed.
- **Alternative considered:** Build one monolithic `ChatBot` component. This is faster initially but makes later customization and package splitting harder.

### Use React state and custom hooks for MVP state management

The initial state layer should use React state and custom hooks such as `useChatbot`, `useFaqMode`, and `useAdapterMode`.

- **Rationale:** This keeps the dependency footprint small and avoids forcing a state library on npm consumers.
- **Alternative considered:** Zustand or Redux. These may be useful later for advanced persistence or cross-app state, but they are not necessary for the MVP.

### Use provider contracts instead of vendor-specific SDKs

Adapter mode will accept a provider with a typed `sendMessage` contract. An OpenAPI-friendly helper can be added, but the core package should remain vendor-neutral.

Conceptual contract:

```ts
interface ChatProvider {
  sendMessage(input: UserMessage, context: ChatContext): Promise<BotResponse>;
}
```

- **Rationale:** Developers can connect their own API subscription, backend proxy, or LLM service without the package depending on one vendor SDK.
- **Alternative considered:** Bundle a first-party LLM SDK integration. This would reduce flexibility and may increase bundle size or security risk.

### Use fetch for default adapter examples

OpenAPI-compatible examples should use the native `fetch` API.

- **Rationale:** `fetch` keeps the package lightweight and avoids requiring Axios or another HTTP client.
- **Alternative considered:** Axios-based adapter. Axios can still be used by consumers inside their own provider, but it should not be required by the package.

### Use Vite, Vitest, and React Testing Library

The recommended project toolchain is Vite for development/build, Vitest for unit tests, and React Testing Library for component behavior tests.

- **Rationale:** This stack fits React + TypeScript library development, supports fast local iteration, and can provide demo/example workflows.
- **Alternative considered:** Rollup-only or tsup-only packaging. These are valid for focused library builds, but Vite gives a stronger starting developer experience for examples and UI work.

### Use a lightweight showcase page before Storybook

The MVP will include a Vite-powered showcase page that renders the main chatbot variants: embedded FAQ, embedded adapter, fixed floating widget, and draggable floating widget.

- **Rationale:** A showcase page makes the configurable component easier to inspect and test without adding the overhead of a full documentation system.
- **Alternative considered:** Add Storybook immediately. Storybook is useful later, but it is more setup and maintenance than needed for the first showcase.

## Risks / Trade-offs

- **[Risk] Tailwind classes may not work automatically in consuming apps** → Document required Tailwind content scanning and provide compiled CSS or clear setup guidance if needed.
- **[Risk] Adapter mode could encourage exposing API keys in the browser** → Document that production secrets should be handled through a developer-owned backend/proxy.
- **[Risk] FAQ matching can become subjective or overly complex** → Keep MVP matching simple and configurable, then add advanced matching later.
- **[Risk] One package may grow too broad over time** → Start with one package for MVP speed, then split into `core`, `react`, and `adapters` packages only when real usage requires it.
- **[Risk] Mode-specific props may become confusing** → Use discriminated TypeScript prop types so `faq` mode requires FAQ inputs and `adapter` mode requires a provider.
- **[Risk] Draggable launcher behavior may cause accidental opens or awkward mobile behavior** → Keep dragging opt-in, use pointer movement thresholds, and add tests for click versus drag behavior.
- **[Risk] Floating panels can appear off-screen near viewport edges** → Constrain launcher movement to the viewport and use safe default lower-right panel placement for the MVP.
- **[Risk] Showcase examples may become stale** → Keep examples small and compile them as part of verification.

## Migration Plan

Because there is no existing implementation, this change can be introduced as new source, test, and documentation files. No data migration or backward compatibility migration is required.

Recommended implementation order:

1. Initialize the React + TypeScript + Tailwind library project structure.
2. Define shared types for messages, modes, provider contracts, and component props.
3. Build the core chat hook and UI components.
4. Implement FAQ mode.
5. Implement adapter mode contract and OpenAPI-friendly examples.
6. Implement the floating `ChatBotWidget` launcher shell.
7. Add optional `draggable` launcher behavior.
8. Add a lightweight showcase page for embedded and widget variants.
9. Add tests, examples, documentation, and package build configuration.

Rollback strategy: remove the new package source/configuration and keep the OpenSpec artifacts for future reconsideration.

## Open Questions

- What package name or npm scope should be used?
- Should the first release ship as a single package only, or should the package split be planned immediately?
- What FAQ matching strategy should be used first: exact match, keyword matching, or developer-supplied resolver function?
- Should adapter mode include streaming response support in a later release?
- Should draggable widget positions persist in localStorage in a later release?
- Should floating widgets support edge snapping or advanced panel collision handling later?