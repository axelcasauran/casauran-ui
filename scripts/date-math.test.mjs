import assert from 'node:assert/strict';
import test from 'node:test';

import { validateDateMath } from './date-math.mjs';

const modules = {
  'packages/date-math/src/calendar.ts':
    'createCalendarDate isLeapYear getDaysInMonth compareCalendarDates calendarDateToEpochDay epochDayToCalendarDate addCalendarDays addCalendarMonths addCalendarYears differenceInCalendarDays CalendarOverflow getDayOfWeek startOfWeek endOfWeek getIsoWeek IsoWeek',
  'packages/date-math/src/range.ts':
    'createCalendarDateRange isDateInRange clampDateToRange intersectDateRanges getDateRangeLength shiftDateRange CalendarDateRange',
  'packages/date-math/src/time.ts':
    'createWallTime wallTimeToMilliseconds millisecondsToWallTime addWallTime createLocalDateTime addLocalTime WallTime WallTimeAddition LocalDateTime',
  'packages/date-math/src/timezone.ts':
    'canonicalizeTimeZone createIntlTimeZoneStrategy TimeZoneDisambiguation TimeZoneStrategy ZonedDateTime',
};
const base = {
  $schema: '../schemas/date-math.schema.json',
  schemaVersion: 1,
  package: '@casauran-internal/date-math',
  capabilities: [
    {
      id: 'calendar-dates',
      module: 'packages/date-math/src/calendar.ts',
      exports: ['createCalendarDate'],
      evidence: ['unit', 'ssr', 'browser', 'typing'],
    },
    {
      id: 'calendar-arithmetic',
      module: 'packages/date-math/src/calendar.ts',
      exports: ['addCalendarDays'],
      evidence: ['unit', 'ssr', 'browser', 'typing'],
    },
    {
      id: 'week-arithmetic',
      module: 'packages/date-math/src/calendar.ts',
      exports: ['getIsoWeek'],
      evidence: ['unit', 'ssr', 'browser', 'typing', 'i18n'],
    },
    {
      id: 'date-ranges',
      module: 'packages/date-math/src/range.ts',
      exports: ['createCalendarDateRange'],
      evidence: ['unit', 'ssr', 'browser', 'typing'],
    },
    {
      id: 'wall-time-arithmetic',
      module: 'packages/date-math/src/time.ts',
      exports: ['createWallTime'],
      evidence: ['unit', 'ssr', 'browser', 'typing'],
    },
    {
      id: 'time-zone-strategy',
      module: 'packages/date-math/src/timezone.ts',
      exports: ['createIntlTimeZoneStrategy'],
      evidence: ['unit', 'ssr', 'browser', 'security', 'typing', 'i18n'],
    },
  ],
  boundaries: {
    owned: [
      'immutable validated proleptic Gregorian calendar dates for years 1 through 9999',
      'calendar day month year week and ISO week arithmetic with explicit overflow behavior',
      'inclusive ordered calendar-date ranges with containment clamping intersection length and shifting',
      'validated wall-clock time and local date-time arithmetic with explicit day overflow',
      'provider-independent timezone strategy with native Intl IANA-zone conversion and explicit DST disambiguation',
      'framework-neutral dependency-free server-safe behavior with no global clock locale or timezone state',
    ],
    excluded: [
      'public React components hooks providers contexts renderers or component event APIs',
      'locale messages number date-time display formatting collation or text direction owned by i18n',
      'recurrence parsing generation expansion exceptions or scheduling rules',
      'natural-language ISO date duration timezone or user-input parsing',
      'business calendars holidays working hours fiscal calendars or locale week-data policy',
      'mutable Date objects global current time implicit system timezone or request locale negotiation',
      'timezone database shipping updating persistence network lookup or external runtime adapters',
      'DOM CSS rendering focus keyboard pointer touch IME or accessibility semantics',
      'HTML URLs SVG files serialized executable input storage transport or dynamic code execution',
      'reference-derived date-math parity or future public calendar planning components',
      'F0.15 virtualization runtime or any later-stage capability',
    ],
  },
};
const validate = (contract) =>
  validateDateMath(contract, {
    sourceExists: (path) => path === 'registry/schemas/date-math.schema.json' || path in modules,
    sourceTexts: modules,
  });

test('accepts the complete date-math contract', () => {
  assert.deepEqual(validate(structuredClone(base)), []);
});

test('rejects schema and package ownership drift', () => {
  const contract = structuredClone(base);
  contract.$schema = 'wrong.json';
  contract.package = '@casauran/react';
  assert.equal(validate(contract).length, 2);
});

test('rejects reordered and duplicate capability inventory', () => {
  const reordered = structuredClone(base);
  reordered.capabilities.reverse();
  assert.ok(validate(reordered).some((error) => error.includes('inventory')));
  const duplicate = structuredClone(base);
  duplicate.capabilities[1].id = 'calendar-dates';
  assert.ok(validate(duplicate).some((error) => error.includes('duplicate')));
});

test('rejects missing modules, exports, and evidence', () => {
  const contract = structuredClone(base);
  contract.capabilities[0].module = 'missing.ts';
  contract.capabilities[1].exports.push('missingExport');
  contract.capabilities[2].evidence = ['unit'];
  assert.equal(validate(contract).length, 3);
});

test('rejects incomplete ownership boundaries', () => {
  const contract = structuredClone(base);
  contract.boundaries.owned.pop();
  contract.boundaries.excluded.pop();
  assert.equal(validate(contract).length, 2);
});
