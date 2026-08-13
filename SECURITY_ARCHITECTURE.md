# Security Architecture
Treat HTML, URLs, SVG, clipboard/paste, drag payloads, uploaded files/metadata, serialized external state and AI/model output as untrusted.

Escape text by default. Avoid arbitrary HTML rendering. Validate URL protocols. Never trust extension/MIME alone. Avoid executing serialized content. Keep AI output outside privileged tool execution unless validated. Document CSP requirements.

Editor, Upload, PDF, SVG/Diagram, Spreadsheet import and AI stages require explicit security review and negative tests.
