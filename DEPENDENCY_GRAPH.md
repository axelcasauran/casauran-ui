# Dependency Graph

Allowed direction: platform/native → core capabilities → domain engines → public React components → patterns → blocks → templates → apps.

No cycles. Internal packages never depend on high-level React components unless explicitly React-facing. Cross-package `/src` or `/internal` imports are forbidden. Apps use supported exports. Dependency Cruiser + custom validators enforce structure.
