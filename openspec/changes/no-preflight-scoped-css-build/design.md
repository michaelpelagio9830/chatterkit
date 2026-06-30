## Context

Chatterkit is distributed as a React component library with a CSS entry point exported as `chatterkit/style.css`. The current stylesheet source includes `@tailwind base`, `@tailwind components`, and `@tailwind utilities`; when built, Tailwind base can include preflight/reset rules that target global elements such as `html`, `body`, `button`, `input`, and universal selectors. Those rules are useful in an application stylesheet but risky for a library stylesheet because importing Chatterkit can unexpectedly change host application styling.

The package already relies heavily on Tailwind utility classes in component `className` strings, so the implementation must still emit the utilities needed by Chatterkit while avoiding global reset output.

## Goals / Non-Goals

**Goals:**

- Ship `dist/style.css` without Tailwind preflight/global reset rules.
- Keep the public CSS import path `chatterkit/style.css` unchanged.
- Scope Chatterkit-authored CSS, such as animations and helper classes, to Chatterkit-owned selectors or containers.
- Preserve component API compatibility and existing visual behavior as much as possible.
- Add build/test verification that prevents accidental reintroduction of preflight rules.

**Non-Goals:**

- Replace Tailwind utilities with hand-written CSS.
- Introduce a CSS-in-JS runtime or new styling dependency.
- Force consumers to configure Tailwind in their own applications.
- Redesign the visual theme or component API.

## Decisions

1. **Disable Tailwind preflight instead of removing Tailwind utilities.**
   - Set `corePlugins.preflight = false` in Tailwind configuration and remove `@tailwind base` from the library stylesheet if needed.
   - Rationale: Chatterkit still needs Tailwind utilities generated from source usage, but does not need Tailwind's global reset in the distributed package CSS.
   - Alternative considered: keep preflight and document the side effects. Rejected because library styles should be safe by default.

2. **Keep the existing `./style.css` package export.**
   - The implementation will change the contents of the built CSS, not the import path.
   - Rationale: Consumers already import `chatterkit/style.css`; preserving this path avoids a breaking change.
   - Alternative considered: add a second `no-preflight.css` export. Rejected for this change because the desired package behavior is safe-by-default styling.

3. **Scope Chatterkit-authored selectors with Chatterkit naming/container conventions.**
   - Animation helper classes already use a `chatbot-` prefix and widget/root components provide natural Chatterkit-owned boundaries. Implementation should avoid unqualified element selectors and global selectors in `src/style.css`.
   - Rationale: Explicit Chatterkit selectors reduce collision risk while preserving existing Tailwind utility behavior.
   - Alternative considered: prefix all Tailwind utilities. Rejected because it would require changing every component utility class and could complicate consumer override patterns.

4. **Verify CSS output after build.**
   - Add an automated check that inspects the built stylesheet for common preflight/reset selectors and confirms Chatterkit CSS is still emitted.
   - Rationale: preflight output can be reintroduced accidentally by configuration or stylesheet changes.
   - Alternative considered: rely on manual inspection. Rejected because build output regressions are easy to miss.

## Risks / Trade-offs

- **Host app does not provide base element styles** → Chatterkit components must include explicit utility classes for layout, typography, borders, and form controls where required.
- **Some browser-normalization behavior from preflight disappears** → Review interactive controls and inputs to ensure existing component utility classes cover necessary visual styling.
- **False positives in CSS verification** → Use targeted checks for known Tailwind preflight/reset patterns rather than banning every element selector indiscriminately.
- **Consumer overrides depend on existing utility selectors** → Keep Tailwind utility generation unprefixed and preserve the public stylesheet export to minimize migration impact.

## Migration Plan

1. Update Tailwind/library stylesheet configuration to produce no-preflight CSS.
2. Ensure Chatterkit-owned custom CSS remains prefixed/scoped.
3. Build the package and inspect `dist/style.css` for absence of Tailwind preflight reset rules.
4. Run existing tests and add CSS-output verification.
5. Document that the package stylesheet is safe to import without Tailwind preflight/global reset side effects.

Rollback is straightforward: revert the Tailwind/style/test changes if visual regressions appear before release.

## Open Questions

- Should a future release expose an optional fully-prefixed Tailwind utility build for consumers with very strict CSS isolation requirements?