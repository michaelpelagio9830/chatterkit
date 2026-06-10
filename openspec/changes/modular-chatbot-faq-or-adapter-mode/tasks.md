## 1. Project Setup

- [x] 1.1 Initialize a React + TypeScript library project structure using Vite.
- [x] 1.2 Add Tailwind CSS setup for default chatbot UI styling.
- [x] 1.3 Add library build configuration for distributable JavaScript and TypeScript declaration output.
- [x] 1.4 Configure Vitest and React Testing Library for unit and component tests.
- [x] 1.5 Add package metadata with React as a peer dependency.

## 2. Core Types and Public API

- [x] 2.1 Define TypeScript types for chatbot modes, message roles, messages, chat context, and bot responses.
- [x] 2.2 Define discriminated component props so `faq` mode requires FAQ configuration and `adapter` mode requires a provider.
- [x] 2.3 Define the provider contract used by adapter mode.
- [x] 2.4 Create public package exports for components, hooks, types, and provider contracts.

## 3. Core Chat Behavior

- [x] 3.1 Implement the core `useChatbot` hook for message state, submission, loading state, and error state.
- [x] 3.2 Route submitted user messages to the configured mode behavior.
- [x] 3.3 Add fallback/error handling so failed response flows do not crash the React application.
- [x] 3.4 Add tests for message submission, loading behavior, and error handling.

## 4. Chatbot UI Components

- [x] 4.1 Implement the main `ChatBot` container component.
- [x] 4.2 Implement message list and message item rendering components.
- [x] 4.3 Implement the message input/composer component.
- [x] 4.4 Implement default loading, empty, and error UI states.
- [x] 4.5 Apply Tailwind-based default styling with customization-friendly class props or slots.
- [x] 4.6 Add component rendering tests for the default chatbot UI.

## 5. FAQ Mode

- [x] 5.1 Define the FAQ item data structure and FAQ mode configuration options.
- [x] 5.2 Implement default FAQ matching behavior.
- [x] 5.3 Support a configurable fallback response for unmatched FAQ questions.
- [x] 5.4 Support a developer-provided custom FAQ resolver function.
- [x] 5.5 Add tests for matched FAQ responses, unmatched fallback responses, and custom resolver behavior.

## 6. Adapter Mode

- [x] 6.1 Implement adapter mode using the provider contract.
- [x] 6.2 Pass the submitted user message and current chat context to the configured provider.
- [x] 6.3 Convert successful provider results into bot messages.
- [x] 6.4 Implement provider failure handling with a safe error or fallback response.
- [x] 6.5 Add OpenAPI-compatible adapter example code using `fetch`.
- [x] 6.6 Add tests for provider success, provider failure, and response mapping behavior.

## 7. Documentation and Examples

- [x] 7.1 Document installation and basic usage for the package.
- [x] 7.2 Document FAQ mode configuration with an example FAQ dataset.
- [x] 7.3 Document adapter mode configuration with an OpenAPI-compatible external service example.
- [x] 7.4 Document security guidance for using backend/proxy services instead of exposing production API secrets in browser code.
- [x] 7.5 Document Tailwind setup requirements and styling customization options for consuming applications.

## 8. Verification

- [x] 8.1 Run the automated test suite and resolve failures.
- [x] 8.2 Run the package build and verify distributable files and TypeScript declarations are generated.
- [x] 8.3 Verify documented FAQ mode and adapter mode examples compile against the public API.
- [x] 8.4 Review public exports to ensure only intended APIs are exposed.

## 9. Floating Widget Launcher

- [x] 9.1 Define `ChatBotWidget` public props, including `draggable`, launcher labels, default open state, and widget class customization hooks.
- [x] 9.2 Implement a lower-right floating launcher bubble that opens the chat panel when activated.
- [x] 9.3 Implement close/minimize behavior that hides the chat panel and keeps the launcher available.
- [x] 9.4 Reuse the existing `ChatBot` panel inside `ChatBotWidget` so FAQ and adapter modes behave consistently.
- [x] 9.5 Implement optional draggable launcher behavior controlled by the `draggable` prop.
- [x] 9.6 Constrain draggable launcher positioning to the visible viewport.
- [x] 9.7 Prevent drag interactions from accidentally opening the chat panel by distinguishing click versus drag behavior.
- [x] 9.8 Add Tailwind-based default widget styling and customization-friendly class props for the launcher, widget shell, and controls.
- [x] 9.9 Add tests for fixed launcher rendering, open/close behavior, draggable behavior, viewport constraints, and click-versus-drag behavior.

## 10. Showcase Page

- [ ] 10.1 Create a lightweight showcase page using the Vite examples app.
- [ ] 10.2 Add showcase sections for embedded FAQ chatbot and embedded adapter chatbot.
- [x] 10.3 Add showcase sections for fixed floating widget and draggable floating widget.
- [x] 10.4 Update documentation to explain the showcase page and widget usage examples.
- [x] 10.5 Verify the showcase examples compile against the public package API.

## 11. Follow-up Verification

- [x] 11.1 Run `npm run typecheck` after widget and showcase updates.
- [x] 11.2 Run `npm test` after widget and showcase updates.
- [x] 11.3 Run `npm run build` after widget and showcase updates.
- [x] 11.4 Review package exports to ensure `ChatBotWidget` and widget-related types are exposed intentionally.

## 12. ChatBotWidget Composition and Hook Refactor

- [x] 12.1 Extract widget state, positioning, and draggable pointer behavior into `useChatBotWidget`.
- [x] 12.2 Add a widget context so compound components can share open/close state, styles, handlers, and chat props.
- [x] 12.3 Implement compound components: `ChatBotWidget.Root`, `ChatBotWidget.Launcher`, `ChatBotWidget.Panel`, `ChatBotWidget.CloseButton`, and `ChatBotWidget.ChatBot`.
- [x] 12.4 Rebuild the existing `<ChatBotWidget />` preset using the compound components while preserving current props.
- [x] 12.5 Add or update public types and exports for composed widget usage.
- [x] 12.6 Add a custom-designed composed widget demo using `className`, `classNames`, and custom children.
- [x] 12.7 Add tests for default widget behavior and custom composed widget behavior.
- [x] 12.8 Update documentation for simple widget and composed widget usage.
- [x] 12.9 Run `npm run typecheck`, `npm test`, and `npm run build`.

## 13. ChatBot Compound Component API

- [x] 13.1 Add `ChatBot.Root` as the behavior owner for `faq` and `adapter` mode props.
- [x] 13.2 Add `ChatBot` context for messages, loading state, error state, labels, input state, and submit behavior.
- [x] 13.3 Implement compound components: `Header`, `Title`, `Messages`, `MessageItem`, `Empty`, `Loading`, `Error`, `Composer`, `Input`, and `SubmitButton`.
- [x] 13.4 Support function-as-children render props in `ChatBot.Messages` for per-message customization.
- [x] 13.5 Rebuild the existing `<ChatBot />` preset using compound components while preserving backward compatibility.
- [x] 13.6 Update `ChatBotWidget.ChatBot` so it accepts custom `ChatBot` children and bridges widget mode props into `ChatBot.Root`.
- [x] 13.7 Add extensive demos and documentation for customizing each component slot.
- [x] 13.8 Add tests for custom submit button icon, custom messages, custom header, and widget bridge usage.
- [x] 13.9 Run `npm run typecheck`, `npm test`, and `npm run build`.

## 14. Future Developer Tooling for Compound Component Safety

- [ ] 14.1 Research feasibility of an ESLint rule that detects `ChatBot.*` slots rendered outside `ChatBot.Root` or `ChatBotWidget.ChatBot`.
- [ ] 14.2 Define invalid nesting cases the rule should catch, such as `ChatBot.Header` directly inside `ChatBotWidget.Panel`.
- [ ] 14.3 Define valid nesting cases the rule should allow, including embedded `ChatBot.Root` usage and widget `ChatBotWidget.ChatBot` bridging usage.
- [ ] 14.4 Decide whether the package should ship an ESLint plugin, an ESLint config, or only documentation for now.
- [ ] 14.5 Investigate support for import aliases, such as `import { ChatBot as Bot }`, so linting works with renamed components.
- [ ] 14.6 Consider a scoped render-function API as an optional alternative or complement to ESLint-based validation.
- [ ] 14.7 Document the trade-off between runtime guards, TypeScript limitations, and custom lint tooling.
- [ ] 14.8 Add examples/tests for any selected developer tooling approach before implementation.