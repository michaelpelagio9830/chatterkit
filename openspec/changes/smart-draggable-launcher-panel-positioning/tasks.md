## 1. Positioning Logic

- [x] 1.1 Add pure helper logic in `src/hooks/useChatBotWidget.ts` to derive panel placement from launcher position, viewport dimensions, default launcher size, default panel dimensions, and safe margins.
- [x] 1.2 Update draggable `panelStyle` to use smart placement coordinates instead of directly clamping the launcher coordinate.
- [x] 1.3 Include transform-origin or CSS custom property metadata in `panelStyle` so the panel can animate from the launcher-facing side.
- [x] 1.4 Preserve existing launcher drag clamping and click-versus-drag suppression behavior.

## 2. Widget Panel Presentation

- [x] 2.1 Update `ChatBotWidget.Panel` default classes/styles to support seamless open animation using existing Tailwind/core CSS capabilities.
- [x] 2.2 Ensure caller-provided `style`, `className`, and `widgetClassNames.panel` overrides still merge correctly with computed smart placement styles.
- [x] 2.3 Confirm non-draggable widget placement remains lower-right and backward compatible.

## 3. Tests and Release Readiness

- [x] 3.1 Add tests for centered draggable launcher placement opening the panel adjacent to the launcher and inside viewport bounds.
- [x] 3.2 Add tests for edge/overflow placement clamping and small viewport fallback.
- [x] 3.3 Add tests for launcher-connected animation metadata and preservation of custom panel overrides.
- [x] 3.4 Run the relevant test suite and build checks for v0.1.8 readiness.
