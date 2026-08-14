# Internationalization Foundation Specification

Status: approved for F0.13 implementation

## Scope and ownership

F0.13 defines the internal, framework-neutral internationalization contract owned by
`@casauran-internal/i18n`. It uses the ECMAScript `Intl` platform for locale canonicalization,
plural rules, number and date-time formatting, and collation. It adds no runtime dependency,
React boundary, browser-global access, or module-global current locale.

The package owns formatting and messages, not input parsing. F0.14 `date-math` owns calendar,
range, time, and timezone arithmetic; recurrence owns recurring rules; applications own request
locale negotiation, locale switching state, catalog loading, persistence, and routing; components
own localized semantics, input, focus, layout, and announcements.

## Locale resolution contract

`canonicalizeLocale` accepts one nonempty BCP 47 locale string and returns the first canonical
locale produced by `Intl.getCanonicalLocales`. Invalid or empty input throws `RangeError`.
`getLocaleFallbackChain` returns a frozen, duplicate-free chain from the requested canonical locale
through its progressively less-specific base locale, followed by an optional fallback locale and
its parents. Unicode extensions may be tried first but are never treated as a language parent.

Every operation receives a locale explicitly. This avoids cross-request leakage during SSR and
makes application locale switching an ordinary state change that creates new results. The engine
does not inspect browser preferences, headers, cookies, routes, storage, or environment defaults.

## Direction contract

`getLocaleDirection` maximizes the canonical locale through `Intl.Locale`, then maps its writing
script to `ltr` or `rtl`. Right-to-left script membership is an explicit reviewed set; text is never
reversed. `resolveDirection` returns a validated explicit application override when supplied and
otherwise derives the locale direction. Components and hosts apply the result through semantic
`dir` attributes and logical CSS; this package does not mutate DOM or styles.

## Message catalog and fallback contract

Message identifiers are stable, nonempty, flat strings. `createMessageCatalog` canonicalizes its
locale, validates own enumerable identifier/string pairs, copies them into a frozen null-prototype
record, and never retains a mutable caller object. A catalog value is plain text only.

`resolveMessage` canonicalizes all catalog locales, rejects duplicate locale catalogs, walks the
documented locale chain, and returns the source locale and whether fallback occurred. An explicit
default message may resolve a missing identifier; otherwise resolution returns `undefined`.
Catalog lookup never follows prototype properties.

`formatMessage` replaces `{identifier}` placeholders only from own properties of a caller-supplied
record whose values are `string | number | bigint`. Missing values are preserved by default or may
throw through an explicit strict option. Interpolation returns a string; it does not mark content
safe, parse HTML, interpret ICU syntax, execute functions, or format inserted values implicitly.

## Plural selection contract

`selectPluralMessage` accepts a finite number, cardinal or ordinal mode, and a message set that
must contain `other`. It delegates category choice to `Intl.PluralRules`, chooses the matching
message when present, and otherwise selects `other`. It returns the selected category and string;
callers explicitly combine selection, number formatting, and safe message interpolation.

## Number and date-time formatting contract

`createNumberFormatter` and `createDateTimeFormatter` canonicalize the supplied locale and return
frozen project-owned wrappers around native formatter instances. Wrappers expose `format`,
`formatToParts`, and `resolvedOptions` while preventing native formatter types from becoming an
adapter contract. Convenience functions create one wrapper for one formatting operation.

Number values are `number | bigint` and follow native `Intl.NumberFormat` semantics, including
localized nonfinite number labels. Date-time values are a finite epoch number or valid `Date`;
invalid values throw `RangeError`. An `Intl.DateTimeFormatOptions.timeZone` affects presentation
only and does not establish timezone arithmetic or conversion ownership.

Applications should reuse factory results for repeated formatting. No universal performance claim
or global cache is introduced: global caches risk unbounded option keys and SSR request coupling.

## Collation contract

`createCollator` returns a frozen wrapper exposing `compare` and `resolvedOptions` for one explicit
locale/options pair. `compareLocalized` is the single-comparison convenience function. The
collator compares strings only, owns no data-engine default, and performs no parsing or sorting by
itself. Data/component owners choose explicitly when localized collation is product-correct.

## Security and trust boundaries

Catalogs and resolved messages may be untrusted text. The package copies own string entries and
returns strings only; it never writes DOM, HTML, URLs, SVG, CSS, storage, network, files, or dynamic
code. Prototype-chain message values and interpolation parameters are ignored. Formatter option
objects and application catalog arrays are trusted caller configuration, but cannot introduce an
executable callback through this contract.

Rendering layers must escape returned strings as text and must not forward them to an HTML sink.
Rich-text translation requires a future explicitly reviewed typed rendering model; it is not an
escape hatch in this stage.

## Accessibility, RTL, and IME

Localized visible text, accessible names, descriptions, errors, statuses, counts, numbers, and
dates consume the same resolved strings and formatters. Plural output prevents number-dependent
announcements from assuming English grammar. Direction is a host/component attribute and logical
layout concern, not string transformation.

This engine has no input control and never handles composition events. Components must preserve
IME composition and avoid committing composed text prematurely. It owns no keyboard, pointer,
touch, focus, live-region timing, CSS, themes, density, forced colors, reduced motion, responsive
layout, or zoom behavior.

## SSR, compatibility, and integration

All modules are pure at import and safe in Server Components. Operations use only caller input and
standard ECMAScript `Intl`; they do not read `window`, `document`, navigator language, random,
time-now, timers, storage, network, React, or a client directive. Server and client must deploy
compatible locale data. The production evidence imports the compiled package root in a Server
Component and renders deterministic locale, fallback, direction, plural, number, date-time, and
collation results in Chromium, Firefox, and WebKit.

The package remains private/internal with one explicit ESM/declaration root export. No supported
consumer package API or platform parity lifecycle is advanced.

## F0.14 boundary

F0.13 adds no calendar model, date/range/time arithmetic, start/end-of-unit logic, duration math,
timezone conversion seam, recurrence engine, public localized component, React provider/hook,
locale persistence, remote catalog loader, input parser, external adapter, or later-stage runtime.
F0.14 Date Math remains `not-started` when this stage closes.
