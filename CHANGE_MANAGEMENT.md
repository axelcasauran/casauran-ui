# Change Management

Ordinary implementation changes follow active stage workflow.
Public API changes follow API governance/versioning.
Dependency changes follow dependency evaluation.
Architecture changes follow ADR workflow.
Reference scope changes follow reference sync.
Breaking stable behavior follows migration workflow.

This separation prevents a component PR from quietly changing architecture, support or product scope.
