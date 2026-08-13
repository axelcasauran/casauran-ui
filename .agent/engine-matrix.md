# Engine Matrix

Shared capabilities: state, focus/keyboard, collections/selection, overlay/positioning, data
operations, virtualization, drag/drop, date math, recurrence, commands/history, serialization,
formula, drawing, charting, files/export. Engines exist for concrete reuse, not architectural
ornament.

The F0.07 accessibility owner implements focus/tabbability inspection, stateless roving focus,
direction-aware keyboard intent, live-region text delivery, and visually-hidden CSS. It explicitly
does not absorb F0.08 React state, F0.09 collection registration/selection, or F0.10 overlay focus
lifecycle.
