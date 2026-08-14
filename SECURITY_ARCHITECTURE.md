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

Animation keyframes and easing are trusted internal application configuration, not a sanitizer
boundary. The engine renders no HTML/content and performs no URL, SVG, serialization, storage,
network, or dynamic-code operation. Public components must not forward untrusted strings into
browser keyframe or easing processing.

Internationalization catalogs and resolved messages are untrusted plain text. F0.13 copies only
own string entries into frozen null-prototype records, interpolates only own string/number/bigint
values, and returns strings without rendering. It accepts no HTML-safe marker, rich template,
callback, URL, DOM sink, storage, network, or dynamic code; rendering owners must escape output.

Data filter/state descriptors may be untrusted serialized structures. The F0.12 engine validates
operator/logic enums, nonempty field keys, paging integers, recursive depth, and cycles; it reads
only own properties and performs no dynamic paths, expression execution, prototype writes, HTML,
URLs, storage, network, or query generation. Row getters and optional comparers are trusted caller
code and must never be created from untrusted executable input.

Date-math values may originate in untrusted serialized input. F0.14 accepts only validated own
numeric calendar/time fields and a nonempty timezone identifier passed to native `Intl`; it rejects
invalid ranges, overflow, gaps/overlaps under `reject`, and unsupported identifiers. It has no
natural-language/ISO parser, HTML/URL/SVG/CSS sink, callback execution, storage, network, timezone
database transport, mutable `Date` output, or current-clock read.

Virtualization geometry may originate in untrusted data. F0.15 bounds axis count, validates finite
positive estimates/measurements and non-negative offsets/viewports/overscan, rejects invalid or
duplicate keys/indexes/batches, and allocates no cell matrix. It stores numeric geometry and keys
only and has no HTML/URL/SVG/CSS sink, serialized callback execution, storage, network, files,
clipboard, or dynamic code. Estimate/key functions and the supplied observer constructor are
trusted application code and must not be constructed from untrusted executable input.

Drag payloads and target data are untrusted opaque values. F0.16 validates finite pointer/target/
scroll geometry, unique target IDs, activation/speed/time bounds, and primary pointer ownership;
it never parses, clones, renders, serializes, logs, persists, sends, or executes payload content.
It exposes no DataTransfer, HTML/URL/SVG/CSS, file/clipboard, storage, network, cross-document, or
dynamic-code sink. Acceptance/geometry/payload/frame callbacks are trusted application code and
must not be created from untrusted executable input; future file-drop owners add file validation.

External reference paths, directory entries, document bytes, and stored reference JSON are
untrusted inputs. F0.17 accepts only an exact `docs/content` root, rejects symbolic links and map
traversal, hashes bytes without executing content, performs no network access, and never imports
the corpus into a runtime package or build. A digest/path mismatch blocks analysis; it is not
silently repaired by regenerating provenance.
