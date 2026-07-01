## Context

`ChatBotWidget` supports a `draggable` launcher through `useChatBotWidget`. The launcher position is viewport-clamped, but the open panel currently reuses/clamps the same top-left coordinate. This means dragging the launcher into the center can make the panel appear disconnected, unexpectedly offset, or constrained in ways that do not feel intentional. The v0.1.8 release needs the widget to feel polished when the launcher has been moved anywhere in the viewport.

The change should stay within the existing React/TypeScript/Tailwind architecture and avoid breaking the public `ChatBotWidget` API or compound component customization model.

## Goals / Non-Goals

**Goals:**
- Compute a smart panel placement from the launcher position, launcher size, panel dimensions, viewport size, and safe margins.
- Prefer the side or quadrant with enough available space while keeping the panel fully visible.
- Keep the panel visually related to the launcher through transform-origin metadata and consistent spacing.
- Add smooth default animation classes/styles that work for draggable and non-draggable widgets.
- Preserve click-versus-drag suppression and viewport-constrained launcher dragging.
- Cover the behavior with tests suitable for jsdom/Vitest.

**Non-Goals:**
- Introducing a new positioning dependency such as Floating UI.
- Adding new public props for custom panel placement in v0.1.8.
- Persisting launcher position across page reloads.
- Implementing drag behavior for the open panel itself.
- Changing chatbot mode behavior, message handling, or provider APIs.

## Decisions

### Derive panel placement from launcher center and available viewport space

The hook should treat the launcher as an anchor rectangle, calculate the launcher center, and choose a panel position around that anchor. Preferred behavior:
- If there is enough horizontal room, open to the left or right of the launcher depending on which side has more room.
- If horizontal room is limited or the launcher is near the center, choose the side that keeps the panel most visible and clamp as needed.
- Choose vertical placement above or below the launcher depending on available space, with centered fallback when neither side fully fits.
- Always clamp the final panel position within the configured viewport margin.

This keeps the behavior deterministic and lightweight while giving centered launchers a natural placement instead of blindly using the launcher top-left.

### Keep sizing constants internal and compatible with current defaults

The implementation should continue using the current default launcher, panel, and margin constants as the calculation baseline. The panel dimensions should mirror existing Tailwind defaults: max width near `28rem` and max height near the current chat panel height. Tests can assert inline `left`, `top`, and CSS variable values rather than relying on real layout measurement, which jsdom does not provide reliably.

### Represent animation origin through CSS variables or inline styles

`panelStyle` should include placement metadata such as `transformOrigin` or CSS custom properties derived from the launcher-to-panel relationship. `ChatBotWidget.Panel` can then use Tailwind transition classes plus inline styles to animate scale/opacity from the nearest anchor side. This avoids expanding the public API while preserving `widgetClassNames.panel` and caller-supplied `style` overrides.

### Prefer CSS transitions/animations over JS animation state

The panel mounts/unmounts today when `isOpen` changes. For v0.1.8, a polished open transition can be achieved with core Tailwind transition, transform, opacity, and scale classes plus computed `transformOrigin`. If exit animation would require delayed unmount state, it should be considered optional unless already supported by the codebase.

## Risks / Trade-offs

- **Panel dimensions may differ from custom class overrides** → Use current defaults for deterministic positioning and allow custom styles/classes to override visual presentation; document that smart placement is based on default panel dimensions.
- **JSDOM cannot measure actual rendered layout** → Keep calculations pure/deterministic and test computed styles using controlled `window.innerWidth`/`window.innerHeight`.
- **Animation utilities may not exist in the configured Tailwind setup** → Prefer core Tailwind transition/transform classes or plain inline style properties rather than adding dependencies.
- **Centered anchors can have multiple acceptable placements** → Define a deterministic tie-breaker, such as preferring the side with more room and then right/bottom fallback, so tests remain stable.
- **Caller styles can override computed panel position** → Preserve existing behavior where caller-provided `style` merges after computed `panelStyle`.
