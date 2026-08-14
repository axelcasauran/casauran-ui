# @casauran-internal/i18n

**Ownership:** locale canonicalization/fallback, text direction, plain-text messages, plurals,
number/date-time formatting, and collation.

## Foundation contract

F0.13 provides explicit-locale, dependency-free wrappers over the standard ECMAScript `Intl`
platform. Import the package root on the server or client; pass a locale to every operation. Reuse
formatter/collator factories when formatting repeatedly.

Message catalogs use stable flat identifiers and plain strings. Catalog fallback is explicit,
interpolation accepts only own `string | number | bigint` values, and returned messages remain
untrusted text that rendering owners must escape. There is no rich-HTML or executable template
escape hatch.

## Boundary

This implementation package may be distributed transitively but is not a supported consumer API
unless promoted by ADR. It owns no React provider/hook, global locale, catalog transport/storage,
input parser, DOM/CSS, IME behavior, public component, recurrence, or date arithmetic. F0.14
`date-math` remains a separate owner even when date-time formatting uses an explicit presentation
timezone.

See `specs/foundation/internationalization.md` and `registry/i18n/foundation.json` for the complete
fallback, security, accessibility, SSR, and future-stage boundaries.
