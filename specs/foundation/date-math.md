# Date Math Foundation Specification

Status: implemented by F0.14

## Scope and ownership

`@casauran-internal/date-math` owns immutable Gregorian calendar dates, calendar arithmetic,
inclusive date ranges, wall-clock arithmetic, ISO week calculation, and a provider-independent
timezone conversion strategy. It is an internal, framework-neutral package below React and future
date/planning components. It has no runtime dependency and uses native `Date`/`Intl` only behind
validated project-owned values.

The need is concrete: Calendar, DateInput, pickers, Scheduler, and Gantt require the same month-end,
range, week, wall-time, and daylight-saving rules. Those rules must not be reimplemented in each
future component. Display locale remains owned by i18n and recurrence rules remain owned by the
recurrence package.

## Calendar date contract

`CalendarDate` is a frozen `{ year, month, day }` value in the proleptic Gregorian calendar. Years
1 through 9999 are supported. Constructors reject fractional, invalid, or out-of-range fields;
there is no permissive rollover. Epoch-day conversion is timezone independent and supports stable
ordering and day differences without exposing mutable `Date` objects.

Leap years follow the Gregorian divisible-by-4, century, and divisible-by-400 rules. Day-of-week is
an integer from Sunday `0` through Saturday `6` and is independent of display locale.

## Calendar arithmetic contract

Day addition moves by calendar days. Month/year addition defaults to `constrain`, so January 31 plus
one month becomes the last valid day of February and leap day plus one year becomes February 28.
Callers may choose `reject` to make an invalid target day an error. Arithmetic never reads the host
timezone or current time and rejects results beyond the supported year range.

`differenceInCalendarDays(left, right)` is signed (`left - right`). Week boundaries require an
explicit first weekday, defaulting to Monday; locale-derived first-day policy is intentionally not
guessed here.

## ISO week contract

`getIsoWeek` implements ISO 8601 week-date rules: Monday is weekday 1, week 1 contains January 4,
and week-year may differ from calendar year near year boundaries. `startOfWeek`/`endOfWeek` accept
Sunday-through-Saturday `0..6`, enabling a future application or component to supply locale or
product policy without coupling arithmetic to display internationalization.

## Date range contract

`CalendarDateRange` is inclusive at both endpoints. Construction rejects reversed ranges. Range
operations provide inclusive containment, clamping, intersection, length in calendar days, and
whole-range day shifts. Operations validate/copy caller values and never mutate input objects.

## Wall-time contract

`WallTime` is a frozen hour/minute/second/millisecond value without a date or timezone. Addition
returns both the normalized time and a signed `dayOffset`; local date-time addition applies that
offset through calendar-day arithmetic. Leap seconds are not represented because native
ECMAScript time does not model them. Duration/natural-language parsing is outside this stage.

## Timezone strategy and DST contract

`TimeZoneStrategy` is a project-owned provider-independent seam for one explicit IANA timezone. The
native implementation canonicalizes/validates the identifier through `Intl.DateTimeFormat`, maps
integer epoch milliseconds to a frozen local date-time plus offset, and maps a validated local
date-time back to an instant.

Local-to-instant conversion makes daylight-saving behavior explicit:

- `compatible` (default) selects the earlier instant in an overlap and the later projection in a
  gap;
- `earlier` selects the earlier instant/projection;
- `later` selects the later instant/projection;
- `reject` throws for an ambiguous overlap or nonexistent gap.

Tests cover the 2026 `America/New_York` spring gap and fall overlap, a half-hour-offset zone, and
UTC. Results depend on the deployed runtime's IANA timezone data; applications must deploy
compatible server/client runtime data. This package does not ship, fetch, update, or globally cache
a timezone database.

## Parsing and trust boundaries

The foundation accepts structured numeric values and explicit timezone identifiers. It does not
parse natural-language/user input, ISO strings, serialized recurrence, HTML, URLs, SVG, CSS, or
executable callbacks. Invalid structures fail with `TypeError`/`RangeError`; no input reaches DOM,
storage, network, query, or dynamic-code sinks. A timezone string is passed only to the native
`Intl.DateTimeFormat` option after nonempty validation.

## Accessibility, i18n, RTL, and IME

This engine renders nothing and owns no accessible name, role, announcement, focus, keyboard,
pointer, touch, or IME behavior. Future components own those gates. Date display formatting,
locale direction, and messages use `@casauran-internal/i18n`; arithmetic never reverses values or
infers layout direction. Locale-specific week starts are caller policy, deliberately separated
from the ISO-week primitive.

## Performance and immutability

Calendar/range/time operations are constant-time. A created timezone strategy reuses one native
formatter and samples a bounded set of offsets per local conversion; it creates no unbounded cache
or background work. All returned records are frozen and no mutable `Date` escapes. This stage makes
no universal latency, bundle, or memory claim.

## SSR, compatibility, and integration

The package root is side-effect-free and safe during Node, SSR, hydration, and React Server
Component evaluation. It imports no React module, has no client directive, and reads no browser
global, clock, random source, locale, storage, cookie, header, or network state. Production evidence
imports the compiled package root in a Server Component across Chromium, Firefox, and WebKit.

Consumers combine calendar and wall-time operations before calling an explicit timezone strategy.
They pass the resulting instant to i18n for presentation. Recurrence, serialization, forms,
virtualization, drag/drop, and visual components remain separate owners.

## F0.15 boundary

F0.14 adds no public React component, date input/parser, calendar renderer, recurrence engine,
business-calendar policy, external timezone adapter/dependency, virtualization windowing,
measurement, anchoring, overscan, or later-stage capability. F0.15 Virtualization remains
`not-started` when this stage closes.
