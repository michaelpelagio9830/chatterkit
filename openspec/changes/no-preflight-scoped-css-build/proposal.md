## Why

Chatterkit currently ships Tailwind-generated base styles through `@tailwind base`, which can emit preflight/reset CSS that affects host applications beyond the chat widget. As a reusable package, its distributed stylesheet should be safe to import into existing apps without globally changing page defaults.

## What Changes

- Remove Tailwind preflight/base reset output from the package stylesheet build.
- Scope Chatterkit package CSS so component styles and animations are limited to Chatterkit-owned selectors/containers.
- Preserve the existing consumer import path: `import 'chatterkit/style.css';`.
- Keep component APIs and runtime behavior backward compatible while improving CSS isolation.
- Add verification that the built CSS does not include Tailwind preflight/global reset rules.

## Capabilities

### New Capabilities
- `scoped-css-build`: Defines the package stylesheet contract for no-preflight output and scoped Chatterkit styles.

### Modified Capabilities

## Impact

- Affected package styling entry point: `src/style.css`.
- Affected Tailwind configuration/build behavior: `tailwind.config.ts`, `vite.config.ts`, and package build output under `dist/style.css`.
- Affected documentation: `README.md` package CSS import guidance may mention that styles are no-preflight/scoped.
- No expected changes to exported React component APIs or peer dependencies.