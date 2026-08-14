# @casauran-internal/date-math

**Ownership:** calendar/date/range/time arithmetic and time-zone seam.

## Status

Implemented by F0.14 as a framework-neutral, dependency-free internal foundation.

## Contract

- Frozen Gregorian calendar dates for years 1 through 9999, leap-year/month validation, epoch-day
  conversion, signed day differences, and constrained or rejecting month/year arithmetic.
- Explicit first-day week boundaries and ISO week-year calculation. Locale week-start policy is
  supplied by the caller; display localization stays in `@casauran-internal/i18n`.
- Ordered inclusive calendar-date ranges with containment, clamping, intersection, length, and
  shifting.
- Frozen wall times/local date-times with signed day overflow.
- A project-owned timezone strategy backed by native `Intl`, explicit IANA timezone identifiers,
  and `compatible | earlier | later | reject` DST gap/overlap behavior.

```ts
import {
  addCalendarMonths,
  createCalendarDate,
  createIntlTimeZoneStrategy,
  createLocalDateTime,
  createWallTime,
} from '@casauran-internal/date-math';

const date = addCalendarMonths(createCalendarDate(2024, 1, 31), 1);
const newYork = createIntlTimeZoneStrategy('America/New_York');
const local = createLocalDateTime(date, createWallTime(9, 30));
const instantMilliseconds = newYork.toInstant(local, 'compatible');
```

The package has no parser: natural-language/ISO input, recurrence, business calendars, display
formatting, and locale negotiation belong to other owners. It returns no mutable `Date` and reads
no current clock or implicit system timezone.

## Runtime and integration

Imports are SSR/RSC safe and have no React/client boundary. Timezone results use the deployed
runtime's IANA data, so server and browser runtimes need compatible timezone data. A created
strategy reuses one native formatter and performs bounded offset sampling; no global/unbounded
cache exists.

See `specs/foundation/date-math.md`. Validate with `pnpm validate:date-math` and test with
`pnpm test:date-math`; production SSR/DST evidence is under `/date-math` in the visual-test host.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. No adapter is added without a
real alternate implementation. F0.15 virtualization and later-stage/public components remain
outside this package.
