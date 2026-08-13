# API Governance
Project-wide consistency is mandatory.

Conventions:
- controlled/uncontrolled pairs use predictable names such as `value/defaultValue`, `open/defaultOpen`;
- callbacks describe state/change intent with stable typed payloads;
- avoid dual sources of truth;
- imperative refs expose only durable needs;
- slots/renderers preserve accessibility responsibilities;
- styling hooks are intentional and do not make undocumented DOM stable;
- data attributes may expose stable state hooks deliberately;
- ARIA passthrough must not contradict internal semantics;
- supported APIs never leak third-party types.

Every stable API documents defaults, state ownership, events, a11y implications, rendering behavior and deprecation path. Breaking stable APIs require semver + migration guidance.
