## Why

The draggable widget launcher currently anchors the opened panel directly to the launcher coordinates, which can feel awkward or break down when the launcher is moved toward the center or other constrained areas of the viewport. For v0.1.8, the widget should open the chat panel in an intelligent, seamless position that remains visible, visually connected to the launcher, and pleasant to use after dragging.

## What Changes

- Improve draggable launcher panel positioning so the opened chat panel chooses a viewport-safe placement around the launcher instead of blindly using the launcher origin.
- Add intelligent placement behavior that prefers available space near the launcher and falls back/clamps when the launcher is centered or near viewport edges.
- Add smooth open/close and repositioning animation defaults for draggable widget panels while preserving customization hooks.
- Preserve existing click-versus-drag behavior so dragging does not accidentally open the panel.
- Add tests covering centered launcher placement, edge placement, viewport clamping, and animation class/style behavior.

## Capabilities

### New Capabilities
- `smart-widget-panel-positioning`: Intelligent draggable widget panel placement and seamless animation behavior for the floating chat widget.

### Modified Capabilities
- None.

## Impact

- Affects `src/hooks/useChatBotWidget.ts` positioning calculations and returned panel styling metadata.
- Affects `src/components/ChatBotWidget.tsx` panel classes/styles for transform origin and animation behavior.
- Affects `src/components/ChatBotWidget.test.tsx` with new regression tests for draggable panel positioning.
- May affect demo usage in `examples/demo.tsx` if additional release-facing showcase coverage is useful.
- No breaking public API changes are expected; existing `draggable`, class name overrides, and composed widget patterns should continue to work.
