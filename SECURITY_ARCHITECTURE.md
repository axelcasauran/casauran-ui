# Security Architecture

Treat HTML, URLs, SVG, clipboard/paste, drag payloads, uploaded files/metadata, serialized external state and AI/model output as untrusted.

Escape text by default. Avoid arbitrary HTML rendering. Validate URL protocols. Never trust extension/MIME alone. Avoid executing serialized content. Keep AI output outside privileged tool execution unless validated. Document CSP requirements.

Editor, Upload, PDF, SVG/Diagram, Spreadsheet import and AI stages require explicit security review and negative tests.

Accessibility announcements treat message strings as untrusted text. Shared live-region utilities
write only `textContent`; they do not accept HTML, URLs, or executable callbacks from message data.

Collection text values and metadata are untrusted caller data. The collection engine only copies
item records and compares normalized text; it does not render HTML, execute metadata, inspect URLs,
serialize state, access storage, or cross a network boundary.

Overlay portal scope synchronization copies only the fixed `data-theme`, `data-density`, and `dir`
plain-text attributes from same-document elements. The engine never copies arbitrary attributes,
IDs, HTML, handlers, URLs, or content; dismissal validates event targets against the supplied
document, and all listeners/owned DOM mutations are explicitly disposable.
